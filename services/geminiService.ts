import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const enhancePostText = async (text: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return text; // Fallback if no key

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      قم بتحسين نص المنشور التالي لوسائل التواصل الاجتماعي ليكون أكثر جاذبية واحترافية، مع الحفاظ على المعنى الأصلي. 
      الرد يجب أن يكون النص المحسن فقط بدون مقدمات أو شرح.
      
      النص الأصلي: "${text}"
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error enhancing text with Gemini:", error);
    return text; // Return original text on error
  }
};