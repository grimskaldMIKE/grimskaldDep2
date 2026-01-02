
import { GoogleGenAI } from "@google/genai";
import { MapData, PlacedTile } from "../types";
import { AVAILABLE_TILES } from "../constants";

export const generateMapLore = async (mapData: MapData) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const tileCount: Record<string, number> = {};
  // Fix: Explicitly cast Object.values to PlacedTile[] to avoid potential inference issues
  (Object.values(mapData) as PlacedTile[]).forEach(pt => {
    const tile = AVAILABLE_TILES.find(t => t.id === pt.tileId);
    if (tile) {
      tileCount[tile.name] = (tileCount[tile.name] || 0) + 1;
    }
  });

  const tileSummary = Object.entries(tileCount)
    .map(([name, count]) => `${count}x ${name}`)
    .join(", ");

  const prompt = `
    I am designing a Sci-Fi planetary map for a space exploration game. 
    The surveyed region contains: ${tileSummary}.
    
    Based on these geological and structural features, please generate:
    1. A unique planetary designation (e.g., Sector-7G, Ares Prime).
    2. A short scientific report (lore) about the history of this site, mentioning the impact events, 
       atmospheric conditions, or ancient tectonic activity that created this layout.
    
    Keep it under 150 words. Tone: Professional, slightly mysterious, hard sci-fi.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      },
    });
    // Return extracted text property from GenerateContentResponse
    return response.text;
  } catch (error) {
    console.error("Lore generation failed:", error);
    return "COMMUNICATION LINK SEVERED. Remote survey data corrupted. Historical archives inaccessible.";
  }
};
