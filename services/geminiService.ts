import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set in the environment.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getComfortingMessage = async (badMood: string): Promise<string> => {
  const ai = getClient();
  
  // Fallback if no API key is present (Chinese)
  if (!ai) {
    const fallbacks = [
      "深呼吸，一切都会好起来的。",
      "烦恼已经飞走啦，你是最棒的！",
      "今天的不开心就留给昨天吧，明天是新的开始。",
      "抱抱你，没关系的，慢慢来。",
      "像小猫晒太阳一样，放松一下吧。"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `用户写下了这个坏心情：“${badMood}”。他们刚刚通过交互动画销毁了这张便签。
      请写一句简短、温暖、治愈的中文（30字以内），用温柔、可爱或略带哲理的语气安抚他们。
      不要说教，只要陪伴和鼓励。例如：“烦恼变成星星碎片啦，今晚会做一个好梦。”`,
    });

    return response.text.trim() || "坏情绪已经被打包送走啦，心情会变晴朗的！";
  } catch (error) {
    console.error("Error fetching comfort message:", error);
    return "你很勇敢，深呼吸，世界依然爱你。";
  }
};