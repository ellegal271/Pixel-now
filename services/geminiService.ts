import { GoogleGenAI, Type } from "@google/genai";
import { Pin } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const fetchPinFeed = async (query: string, lang: string = 'en'): Promise<Pin[]> => {
  try {
    const model = 'gemini-2.5-flash';
    const languageName = lang === 'es' ? 'Spanish' : 'English';
    
    // Updated prompt to include language instruction
    const prompt = `Generate a list of 12 creative "Pixel Now" visual concepts based on the topic: "${query}". 
    Output strictly in ${languageName}.
    If the topic is empty, generate a diverse mix of categories (Pixel Art, Glitch Art, Neon Cities, Retro Gaming, Abstract Geometry).
    For each item, provide:
    - title (in ${languageName})
    - description (in ${languageName})
    - author (fictional)
    - seed (single word for image generation, keep in English for better results)
    - color (hex code)
    - heightRatio: MUST BE EXACTLY 1.0 (Square)
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              author: { type: Type.STRING },
              seed: { type: Type.STRING },
              heightRatio: { type: Type.NUMBER }, 
              color: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "description", "author", "seed", "heightRatio", "color"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    
    // Transform to Pin interface
    return data.map((item: any) => ({
      ...item,
      id: generateId(),
      isGenerated: false
    }));

  } catch (error) {
    console.error("Error fetching feed:", error);
    return [];
  }
};

export const generateCreativeImage = async (prompt: string): Promise<{ base64: string, mimeType: string } | null> => {
  try {
    const model = 'gemini-2.5-flash-image';
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    if (response.candidates?.[0]?.content?.parts) {
       for (const part of response.candidates[0].content.parts) {
         if (part.inlineData) {
            return {
              base64: part.inlineData.data,
              mimeType: part.inlineData.mimeType || 'image/png'
            };
         }
       }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

export const suggestRelatedSearch = async (currentQuery: string, lang: string = 'en'): Promise<string[]> => {
  try {
     const languageName = lang === 'es' ? 'Spanish' : 'English';
     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: `List 5 short, trending search terms related to "${currentQuery}" in ${languageName}. Return only a JSON array of strings.`,
       config: {
         responseMimeType: "application/json",
       }
     });
     return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
}