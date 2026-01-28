
export interface Question {
  id: string;
  category: 'H' | 'S' | 'U';
  text: string;
  options: Option[];
}

export interface Option {
  label: string;
  value: string;
  score: number;
}

export interface DiagnosticResult {
  category: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
  status: string;
  healthScore: number;
  analysis: string;
  recommendations: string[];
  systemLog: string[];
  layeredScores: {
    hardware: number;
    software: number;
    user: number;
  };
}
