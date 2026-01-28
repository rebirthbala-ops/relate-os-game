
import React, { useState } from 'react';
import { QUESTIONS, SYSTEM_MESSAGES } from './constants';
import { DiagnosticResult, Option } from './types';
import { generateDiagnosticReport } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'quiz' | 'analyzing' | 'result'>('home');
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Option[]>([]);
  const [loadingMessage, setLoadingMessage] = useState(SYSTEM_MESSAGES[0]);
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const startQuiz = () => {
    setView('quiz');
    setCurrentStep(0);
    setSelections([]);
  };

  const handleAnswer = (option: Option) => {
    const newSelections = [...selections, option];
    setSelections(newSelections);
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateAndFetchResult(newSelections);
    }
  };

  const calculateAndFetchResult = async (finalSelections: Option[]) => {
    setView('analyzing');
    
    // 1. Calculate layered scores
    const hScore = finalSelections.filter((_, i) => QUESTIONS[i].category === 'H').reduce((sum, opt) => sum + opt.score, 0);
    const sScore = finalSelections.filter((_, i) => QUESTIONS[i].category === 'S').reduce((sum, opt) => sum + opt.score, 0);
    const uScore = finalSelections.filter((_, i) => QUESTIONS[i].category === 'U').reduce((sum, opt) => sum + opt.score, 0);

    // 2. Determine Category Logic
    let category: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' = 'YELLOW';
    
    const hAlert = hScore <= 5;
    const hSub = hScore >= 6 && hScore <= 8;
    const hHealthy = hScore === 9;
    
    const sToxic = sScore <= 7;
    const sConflict = sScore >= 8 && sScore <= 11;
    const sCompat = sScore === 12;
    
    const uAbandon = uScore <= 5;
    const uSway = uScore >= 6 && uScore <= 8;
    const uHigh = uScore === 9;

    if (hAlert && sToxic) {
      category = 'RED';
    } else if ((hSub || hAlert) && sConflict && (uSway || uAbandon)) {
      category = 'ORANGE';
    } else if (hHealthy && sCompat && uHigh) {
      category = 'GREEN';
    } else {
      category = 'YELLOW';
    }

    // AI fetching
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % SYSTEM_MESSAGES.length;
      setLoadingMessage(SYSTEM_MESSAGES[msgIdx]);
    }, 1500);

    const diagnostic = await generateDiagnosticReport({ hardware: hScore, software: sScore, user: uScore }, category);
    
    clearInterval(msgInterval);
    setResult(diagnostic);
    setView('result');
  };

  const getCategoryTheme = (cat?: string) => {
    switch(cat) {
      case 'RED': return { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', label: '🔴 系統生存危機' };
      case 'ORANGE': return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: '🟠 系統重度衝突' };
      case 'YELLOW': return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: '🟡 系統相容性調試' };
      case 'GREEN': return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: '🟢 系統運作良好' };
      default: return { color: 'text-rose-400', bg: 'bg-rose-50', border: 'border-rose-200', label: '診斷中' };
    }
  };

  const theme = getCategoryTheme(result?.category);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <div className="text-2xl font-bold tracking-tight text-rose-400 drop-shadow-sm flex items-center">
          <span className="text-3xl mr-2">🩺</span> 關係系統急救室
        </div>
        <div className="px-4 py-1 bg-white/60 backdrop-blur rounded-full text-xs text-rose-300 font-bold border border-rose-100 shadow-sm">
          {view === 'home' ? 'READY' : view === 'result' ? 'REPORT_READY' : 'SCANNING...'}
        </div>
      </header>

      <main className="w-full max-w-xl bg-white/90 border-4 border-rose-100 p-8 md:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(255,182,193,0.3)] relative overflow-hidden transition-all duration-500">
        {view === 'home' && (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="mx-auto w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-5xl shadow-inner animate-bounce">
              🩹
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">關係系統全面掃描</h1>
              <p className="text-gray-500 leading-relaxed text-lg">
                這是一份深度心靈自檢報告。<br/>
                我們將從「硬體、軟體、用戶」三個層面，<br/>
                分析你與這段關係的穩定性。
              </p>
            </div>
            <button 
              onClick={startQuiz}
              className="bouncy px-12 py-5 bg-gradient-to-r from-rose-400 to-pink-400 text-white font-bold text-xl rounded-full shadow-lg shadow-rose-100 hover:brightness-105 transition-all"
            >
              啟動全面掃描
            </button>
          </div>
        )}

        {view === 'quiz' && (
          <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
            <div className="space-y-2">
              <div className="flex justify-between items-end text-xs font-black text-rose-300 uppercase tracking-widest">
                <span>{QUESTIONS[currentStep].category === 'H' ? '硬體層檢查' : QUESTIONS[currentStep].category === 'S' ? '軟體層檢查' : '用戶層檢查'}</span>
                <span>{currentStep + 1} / {QUESTIONS.length}</span>
              </div>
              <div className="w-full h-3 bg-rose-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-300 to-rose-400 transition-all duration-700 ease-out" 
                  style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 leading-tight">
              {QUESTIONS[currentStep].text}
            </h2>

            <div className="grid gap-4">
              {QUESTIONS[currentStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className="bouncy p-5 text-left border-2 border-rose-50 hover:border-rose-200 bg-white rounded-3xl transition-all shadow-sm hover:shadow-md group flex items-start"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-50 flex-shrink-0 flex items-center justify-center mr-4 text-rose-400 font-bold group-hover:bg-rose-400 group-hover:text-white transition-colors mt-1">
                    {opt.value}
                  </div>
                  <span className="text-gray-700 text-lg leading-snug group-hover:text-gray-900">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-20 space-y-8 text-center">
            <div className="relative">
              <div className="w-32 h-32 bg-rose-50 rounded-full animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center text-6xl animate-bounce">
                🔬
              </div>
            </div>
            <div className="text-2xl font-black text-rose-400 px-4">
              {loadingMessage}
            </div>
            <p className="text-gray-400 text-sm italic font-mono">NEURAL_DATA_SYNCING...</p>
          </div>
        )}

        {view === 'result' && result && (
          <div className="space-y-8 animate-in zoom-in-95 duration-700 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="text-center space-y-3">
              <div className={`inline-block px-4 py-1 rounded-full text-xs font-black border ${theme.border} ${theme.bg} ${theme.color}`}>
                {theme.label}
              </div>
              <h2 className="text-3xl font-black text-gray-800">{result.status}</h2>
              <div className="flex justify-center items-center space-x-4">
                <div className="text-center">
                  <div className="text-xs text-gray-400 uppercase">健康總覽</div>
                  <div className={`text-4xl font-black ${result.healthScore < 40 ? 'text-rose-500' : result.healthScore < 75 ? 'text-orange-400' : 'text-emerald-500'}`}>
                    {result.healthScore}%
                  </div>
                </div>
              </div>
            </div>

            {/* Layered Scores Board */}
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-rose-100">
              <div className="text-center">
                <div className="text-[10px] text-gray-400 font-bold mb-1">硬體層</div>
                <div className="text-lg font-black text-rose-400">{result.layeredScores.hardware}<span className="text-[10px] text-gray-300">/9</span></div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-gray-400 font-bold mb-1">軟體層</div>
                <div className="text-lg font-black text-blue-400">{result.layeredScores.software}<span className="text-[10px] text-gray-300">/12</span></div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-gray-400 font-bold mb-1">用戶層</div>
                <div className="text-lg font-black text-emerald-400">{result.layeredScores.user}<span className="text-[10px] text-gray-300">/9</span></div>
              </div>
            </div>

            <div className={`${theme.bg} p-6 rounded-[2rem] border-2 border-white relative shadow-inner`}>
              <div className="text-4xl absolute -top-4 -left-2">📢</div>
              <p className="text-gray-700 leading-relaxed text-lg font-medium">
                {result.analysis}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <span className="mr-2">💡</span> 系統修復建議
              </h3>
              <div className="grid gap-3">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="p-4 bg-white rounded-2xl border border-rose-50 shadow-sm flex items-start text-gray-600">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-500 text-xs flex-shrink-0 flex items-center justify-center mr-3 font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-2">系統日誌存檔</h3>
              <div className="space-y-1">
                {result.systemLog.map((log, i) => (
                  <div key={i} className="text-[10px] font-mono text-gray-400 leading-tight">> {log}</div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setView('home')}
              className="bouncy w-full py-5 bg-gray-800 text-white font-bold text-xl rounded-full shadow-lg mt-4"
            >
              重啟掃描程序
            </button>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 w-full p-6 text-[10px] text-rose-200 font-bold flex flex-col items-center uppercase tracking-widest space-y-1">
        <div>Relational System Emergency Diagnostic Unit</div>
        <div className="opacity-50">Empowered by Gemini AI Counselor</div>
      </footer>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fee2e2; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
