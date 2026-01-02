import { GoogleGenAI } from "@google/genai";

export async function generateTileTexture(prompt: string, category: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Refine the prompt to ensure it's a top-down, tileable-ready battlefield asset
  const refinedPrompt = `A high-quality, gritty, top-down tactical map tile for a tabletop wargame. 
    Subject: ${prompt} (${category} terrain). 
    Style: Grimdark, realistic, detailed textures, mud, dirt, atmospheric lighting. 
    Perspective: Orthographic top-down, perfectly centered. 
    Resolution: High detail, no text, no UI elements.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: refinedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from forge");
  } catch (error) {
    console.error("Forge Error:", error);
    throw error;
  }
}