import { GoogleGenAI } from "@google/genai";

export async function generateBattlefieldReport(stats: [string, number][], dimensions: { width: number, height: number }) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const compositionStr = stats.map(([name, count]) => `${count}x ${name}`).join(', ');
  
  const prompt = `
    ACT AS: An orbital tactical AI from the "Grimfields" universe.
    TASK: Generate a classified tactical reconnaissance report for a battlefield with the following composition: ${compositionStr}.
    GRID SIZE: ${dimensions.width}x${dimensions.height} units.
    
    CONTEXT: Grimfields is a perpetual, rain-soaked warzone of mud, trenches, and ruined technology.
    
    REQUIREMENTS:
    1. Keep it professional, gritty, and brief (under 200 words).
    2. Mention specific terrain features provided in the composition.
    3. Include a "Strategic Outlook" section.
    4. Use military jargon (e.g., "Sector 7G", "Echo-Zulu conditions", "High-Value Asset").
    5. Do not use generic AI greetings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "ERROR: ORBITAL UPLINK INTERRUPTED. UNABLE TO RETRIEVE RECON DATA. REASON: " + (error instanceof Error ? error.message : "UNKNOWN SIGNAL INTERFERENCE");
  }
}