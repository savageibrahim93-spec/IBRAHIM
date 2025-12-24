
import { GoogleGenAI, Type } from "@google/genai";
import { Asteroid } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const scanNewAsteroid = async (scannerLevel: number): Promise<Asteroid> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a new asteroid for a space mining game. Scanner Level: ${scannerLevel}. Focus on high-tech or cosmic sounding names and compositions. Output as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            composition: { type: Type.STRING },
            density: { type: Type.NUMBER },
            totalResources: { type: Type.NUMBER },
            rarity: { 
              type: Type.STRING, 
              enum: ['Common', 'Uncommon', 'Rare', 'Legendary'] 
            },
            description: { type: Type.STRING }
          },
          required: ["name", "composition", "density", "totalResources", "rarity", "description"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      remainingResources: data.totalResources
    };
  } catch (error) {
    console.error("Failed to scan asteroid:", error);
    // Fallback asteroid
    return {
      id: 'fallback',
      name: 'Vesta-7 Fragment',
      composition: 'Iron and Nickel',
      density: 0.8,
      totalResources: 1000,
      remainingResources: 1000,
      rarity: 'Common',
      description: 'A standard stray fragment from the inner belt.'
    };
  }
};

export const getMarketAdvice = async (credits: number, resources: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are NOVA, a sarcastic but helpful ship AI. The user has ${credits} credits and has mined these resources: ${JSON.stringify(resources)}. Give a short (2 sentence) piece of advice or market commentary on what to do next.`,
    });
    return response.text;
  } catch (error) {
    return "Connection to central hub lost. Keep mining, cadet.";
  }
};
