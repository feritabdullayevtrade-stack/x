
import { GoogleGenAI, Type } from "@google/genai";
import { AppCategory, FlashCard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMoreCards = async (category: AppCategory): Promise<FlashCard[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Almanca öğrenen bir Türk için ${category} kategorisinde 100 adet farklı cümle ve bunların Almanca çevirisini üret. 
    Cümleler günlük konuşma diline uygun, doğal ve faydalı olsun. 
    Lütfen her cümle için 'easy', 'medium' veya 'hard' zorluk seviyesi ata.
    Cümleler birbirinden farklı ve özgün olsun.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            turkish: { type: Type.STRING, description: "Türkçe cümle" },
            german: { type: Type.STRING, description: "Almanca karşılığı" },
            difficulty: { type: Type.STRING, enum: ['easy', 'medium', 'hard'] }
          },
          required: ["turkish", "german", "difficulty"]
        }
      }
    }
  });

  const rawJson = JSON.parse(response.text || "[]");
  return rawJson.map((item: any, index: number) => ({
    ...item,
    id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
    category
  }));
};
