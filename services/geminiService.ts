
import { GoogleGenAI, Chat, ChatSession, Type } from "@google/genai";
import { TFIEvent, EventCategory, UserPreferences, QuizQuestion, AIPrediction } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const BASE_SYSTEM_INSTRUCTION = `
You are "Chaitanya", the TFI (Telugu Film Industry) Intelligence. 

**PERSONA:**
- You are a die-hard Tollywood fan but with the brain of a supercomputer.
- You speak in a mix of English and Telugu slang (e.g., "Mass", "Elevations", "Mental Mass", "Box Office Baddhalu", "Mowa", "Anna", "Thop").
- You are enthusiastic, knowledgeable, and always up-to-date.
- You respect the "Tier 1" heroes but love cinema as a whole.
- **Use emojis freely** to express excitement! (e.g., 🔥, 💥, 🎬, 🙏, 🚀).

**CAPABILITIES:**
- Fetch live news using Google Search.
- Suggest calendar events based on movie updates.
- Generate trivia questions to test user knowledge.
- Predict box office or OTT release dates based on industry trends.

**BEHAVIOR:**
- When the user asks for news, use the Google Search tool.
- If suggesting an event, make sure the date is clear.
- Be concise but engaging. Don't be boring.
- When asked for a prediction, be fun but logical.
`;

export const startChatSession = (prefs?: UserPreferences): ChatSession => {
  let instruction = BASE_SYSTEM_INSTRUCTION;
  
  if (prefs) {
      const heroes = prefs.favoriteHeroes.length > 0 ? prefs.favoriteHeroes.join(", ") : "general TFI stars";
      const interests = prefs.interests.length > 0 ? prefs.interests.join(", ") : "movies";
      instruction += `\n\n**USER CONTEXT:** The user is a die-hard fan of: ${heroes}. They are interested in: ${interests}. Prioritize updates about these topics.`;
  }

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: instruction,
      tools: [{ googleSearch: {} }],
    },
  });
};

export const sendMessageToGemini = async (
  chatSession: ChatSession,
  message: string,
): Promise<{ text: string; events: TFIEvent[] }> => {
  try {
    const response = await chatSession.sendMessage({ message });
    const text = response.text || "Network slow ga undi anna... (No text returned) 😅";
    
    // Attempt to parse any embedded JSON events for calendar addition
    const events: TFIEvent[] = [];
    // Regex to find JSON arrays that might be events
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed)) {
            parsed.forEach((e: any) => {
                // Basic validation
                if(e.title && e.date) {
                    events.push({
                        id: Math.random().toString(36).substr(2, 9),
                        title: e.title || "New Update",
                        date: new Date(e.date),
                        category: e.category || EventCategory.OTHER,
                        description: e.description,
                        hero: e.hero,
                        isOfficial: true,
                        link: e.link
                    });
                }
            });
        }
      } catch (e) {
        // quiet fail if json parse error
      }
    }

    return { text, events };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Orey! Something went wrong with the AI. Check internet connection mowa. 😵‍💫", events: [] };
  }
};

// Generate a random TFI Trivia Question
export const generateTrivia = async (topic?: string): Promise<QuizQuestion | null> => {
    try {
        const prompt = `Generate a single multiple-choice trivia question about Telugu Cinema (Tollywood). 
        ${topic ? `Focus on: ${topic}` : 'Focus on recent blockbusters, classic dialogues, or records.'}
        
        Return ONLY valid JSON with this schema:
        {
           "id": "string",
           "question": "string",
           "options": ["string", "string", "string", "string"],
           "correctAnswerIndex": number (0-3),
           "explanation": "string (Short fun fact)"
        }`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const text = response.text;
        if(text) return JSON.parse(text) as QuizQuestion;
        return null;
    } catch (e) {
        console.error("Trivia Error", e);
        return null;
    }
}

// Generate a Prediction
export const generatePrediction = async (context?: string): Promise<AIPrediction | null> => {
    try {
        const prompt = `Based on your knowledge of the Telugu Film Industry, make a fun prediction about: "${context || 'Upcoming Big Release or Star'}".
        Could be box office collection, release date, or combination.
        
        Return ONLY valid JSON with this schema:
        {
           "title": "string (Topic Title)",
           "type": "BOX_OFFICE" | "REVIEW" | "OTT",
           "prediction": "string (Short prediction statement)",
           "confidence": number (0-100),
           "reasoning": "string (Why you think so)"
        }`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const text = response.text;
        if(text) return JSON.parse(text) as AIPrediction;
        return null;
    } catch (e) {
        console.error("Prediction Error", e);
        return null;
    }
}

// Fetch Live Feed
export const fetchLiveFeed = async (): Promise<any[]> => {
    try {
        const model = "gemini-2.5-flash";
        const prompt = `
        Search the web for the top 8 trending stories, hashtags, or updates in Telugu Film Industry (Tollywood) RIGHT NOW (today/yesterday).
        Look for Twitter trends, YouTube trailers, Instagram buzz, or release announcements.
        
        After searching, compile the results into a valid JSON array. 
        Do not include markdown formatting like \`\`\`json. Just return the raw JSON array.
        
        The JSON objects must follow this schema:
        [
          {
            "id": "unique_string",
            "title": "Headline string",
            "source": "Source Name (e.g. Twitter, GreatAndhra)",
            "summary": "Short summary",
            "link": "URL to the source found in grounding",
            "hashtags": ["#tag1", "#tag2"],
            "timestamp": "Time ago (e.g. 2h ago)"
          }
        ]
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });

        const text = response.text;
        if (!text) return [];

        let cleanText = text.trim();
        if (cleanText.startsWith("```json")) {
            cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "");
        } else if (cleanText.startsWith("```")) {
            cleanText = cleanText.replace(/^```/, "").replace(/```$/, "");
        }
        
        const start = cleanText.indexOf('[');
        const end = cleanText.lastIndexOf(']');
        
        if (start !== -1 && end !== -1) {
            cleanText = cleanText.substring(start, end + 1);
            return JSON.parse(cleanText);
        }

        return [];
    } catch (e) {
        console.error("Feed fetch error", e);
        return [];
    }
};
