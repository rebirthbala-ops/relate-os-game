
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosticResult } from "../types";

export const generateDiagnosticReport = async (
  layeredScores: { hardware: number; software: number; user: number },
  category: string
): Promise<DiagnosticResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Acting as a 'Warm Healing Counselor' for the 'Relationship System Emergency Room'.
    Based on the following system scan results, generate a diagnostic report.
    
    [System Stats]
    - Hardware Score (H): ${layeredScores.hardware}/9
    - Software Score (S): ${layeredScores.software}/12
    - User Sovereignty Score (U): ${layeredScores.user}/9
    - Determined Report Category: ${category}
    
    [Category Definitions & Content Requirements]
    - RED (Survival Crisis): Hardware alert, Software toxicity. 
      * Core Instruction: Focus on Protection & Isolation. 
      * Strategy: 當病毒企圖摧毀系統時，唯一正確的指令是「強制卸載」與「物理隔離」。
    - ORANGE (Heavy Conflict): Hardware sub-health, Software conflict, User swaying. 
      * Core Instruction: Focus on Boundaries & Power regain. 
      * Philosophy: 記住，關係的維持時長由你決定。在投入更多修復資源之前，先評估損耗成本。
    - YELLOW (Compatibility Tuning): Hardware ok, Software conflict, User active. 
      * Core Instruction: Focus on Comm upgrade. Suggest "Listening exercises" or "Conflict resolution protocols".
      * Philosophy: 這屬於軟體層可修復問題，關鍵在於雙方是否願意共同下載並安裝新的溝通協議。
    - GREEN (Stable Operation): All systems optimal. 
      * Core Instruction: Focus on Maintenance & Defensive updates.
      * Philosophy: 共識需要時刻確認，保持共同成長。
    
    [Output Requirements]
    - Status: A cute and professional title for the report (e.g., "需要緊急維護的小太陽").
    - Analysis: A warm, detailed analysis. Incorporate the specific "Strategy" or "Philosophy" mentioned above naturally into the text. 
    - Recommendations: 3 specific, actionable steps.
    - SystemLog: 3-5 cute technical log entries.
    - Language: Traditional Chinese (Taiwan).
    
    IMPORTANT: Do NOT mention specific people like "奈奈" or "空空". Use the "策略：" or "哲學：" phrasing instead as defined above.
    
    Return the response strictly as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            analysis: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            systemLog: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["status", "analysis", "recommendations", "systemLog"]
        }
      }
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    
    const totalScore = layeredScores.hardware + layeredScores.software + layeredScores.user;
    const maxScore = 30; // 9 + 12 + 9
    const healthScore = Math.round((totalScore / maxScore) * 100);

    return {
      ...data,
      category: category as any,
      healthScore,
      layeredScores
    };
  } catch (error) {
    console.error("Healing Diagnostic Failed:", error);
    return {
      category: 'YELLOW' as any,
      status: "心靈探測器微調中",
      healthScore: 60,
      analysis: "系統忙碌中，但你的心聲我們都聽到了。目前建議先深呼吸，喝口水，放鬆一下。你的健康永遠是第一位的。",
      recommendations: ["暫時離開螢幕", "做個 5 分鐘冥想", "聽一首輕音樂"],
      systemLog: ["Log: Connection retrying", "Status: Buffer full of love"],
      layeredScores
    };
  }
};
