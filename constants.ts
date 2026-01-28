
import { Question } from './types';

export const QUESTIONS: Question[] = [
  // 硬體層 (H)
  {
    id: "H1",
    category: 'H',
    text: "最近一個月，你的睡眠品質如何？",
    options: [
      { label: "很好，基本上可以睡足 7-8 小時，醒來精神不錯。 ✨", value: "A", score: 3 },
      { label: "一般，時好時壞，或總是覺得睡不夠。 🥱", value: "B", score: 2 },
      { label: "很差，常失眠/熬夜，醒來也很疲憊。 😵‍💫", value: "C", score: 1 }
    ]
  },
  {
    id: "H2",
    category: 'H',
    text: "當壓力來臨，你身體是否有明顯警報？(如頭痛、胃不適)",
    options: [
      { label: "幾乎沒有，我能較好應對。 💪", value: "A", score: 3 },
      { label: "偶爾會有（如頭痛、肩膀緊繃）。 🤕", value: "B", score: 2 },
      { label: "常有（如心悸、長期疼痛、爆痘）。 ⚠️", value: "C", score: 1 }
    ]
  },
  {
    id: "H3",
    category: 'H',
    text: "你是否有定期注意並處理自己的健康警報？",
    options: [
      { label: "是的，我很重視並且積極處理。 🥗", value: "A", score: 3 },
      { label: "注意到了，但還沒行動或不知如何處理。 🤷", value: "B", score: 2 },
      { label: "幾乎沒有關注或覺得不重要。 🙈", value: "C", score: 1 }
    ]
  },
  // 軟體層 (S)
  {
    id: "S1",
    category: 'S',
    text: "當重要關係出現分歧時，你們通常如何解決？",
    options: [
      { label: "可以冷靜討論，尋求雙方都能接受的方案。 🤝", value: "A", score: 3 },
      { label: "常常陷入爭吵或冷戰，但最終有一方妥協。 🌩️", value: "B", score: 2 },
      { label: "根本無法溝通，常常互相指責或攻擊。 🧨", value: "C", score: 1 }
    ]
  },
  {
    id: "S2",
    category: 'S',
    text: "你是否能清楚表達感受和需求，並且感覺被傾聽？",
    options: [
      { label: "通常可以，我們能理解彼此。 👂", value: "A", score: 3 },
      { label: "有時可以，但對方常常聽不懂或不在意。 ❓", value: "B", score: 2 },
      { label: "幾乎不能，感覺像在對牆說話。 🧱", value: "C", score: 1 }
    ]
  },
  {
    id: "S3",
    category: 'S',
    text: "關係中是否存在讓你持續感到被消耗或被貶低的人？",
    options: [
      { label: "幾乎沒有，我感到被尊重。 ❤️", value: "A", score: 3 },
      { label: "偶爾有，但我盡量不在意。 ☁️", value: "B", score: 2 },
      { label: "有，而且常常影響我的情緒。 🦠", value: "C", score: 1 }
    ]
  },
  {
    id: "S4",
    category: 'S',
    text: "你們是否有一些共同認可並遵守的「相處規則」？",
    options: [
      { label: "有，執行得不錯。 ✅", value: "A", score: 3 },
      { label: "有提過，但執行起來看心情。 🌀", value: "B", score: 2 },
      { label: "幾乎沒有，全憑當時情緒。 🌊", value: "C", score: 1 }
    ]
  },
  // 用戶層 (U)
  {
    id: "U1",
    category: 'U',
    text: "回顧這段關係，你仍有主動投入和成長的意願嗎？",
    options: [
      { label: "有，我願意為此努力。 🌱", value: "A", score: 3 },
      { label: "很猶豫，感到疲憊，不知道值不值得。 🥀", value: "B", score: 2 },
      { label: "幾乎沒有，只想逃離。 🏃", value: "C", score: 1 }
    ]
  },
  {
    id: "U2",
    category: 'U',
    text: "如果對方不改變，你為自己幸福負全職責任的意願？",
    options: [
      { label: "很強，我會主動調整心態和行為。 🗝️", value: "A", score: 3 },
      { label: "一般，我覺得需要雙方一起改變。 ⚖️", value: "B", score: 2 },
      { label: "很弱，我認為問題主要在對方。 👈", value: "C", score: 1 }
    ]
  },
  {
    id: "U3",
    category: 'U',
    text: "你認為一段健康的關係，最重要的核心是什麼？",
    options: [
      { label: "彼此的尊重、成長與幸福感。 🌈", value: "A", score: 3 },
      { label: "責任、承諾與習慣。 ⚓", value: "B", score: 2 },
      { label: "安全感與依賴。 🎈", value: "C", score: 1 }
    ]
  }
];

export const SYSTEM_MESSAGES = [
  "正在為你沖泡一杯熱可可... ☕",
  "正在整理溫暖的小抱抱... 🤗",
  "正在清理腦袋裡的煩惱碎片... 🧹",
  "正在計算硬體、軟體與用戶層數據... 📊",
  "正在幫你連結最溫柔的建議核心... 💓",
  "快好囉，正在準備一份專屬你的療癒報告... 📑"
];
