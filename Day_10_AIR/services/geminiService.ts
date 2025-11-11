import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

/**
 * Sends a message to the Gemini model and returns the response.
 * @param prompt The user's prompt.
 * @returns The AI's response text.
 */
export async function sendToGemini(systemInstruction: string, prompt: string): Promise<string> {
  // CRITICAL: Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using gemini-2.5-flash as a fast, general-purpose model
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topK: 64,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    return response.text;
  } catch (error) {
    console.error('Gemini API request failed:', error);
    // Handle API key errors specifically, as requested for Veo but good practice for any Gemini API call.
    if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
      console.error("Gemini API key might be invalid or not selected. Please select a valid API key.");
      // In a real app, you might re-prompt the user to select an API key.
      // For this app, we'll provide a user-friendly error message.
      return "There was an issue with the AI service. Please ensure your API key is correctly configured and try again. (Error: API Key Invalid/Not Found)";
    }
    return 'Failed to get a response from the AI. Please try again later.';
  }
}
