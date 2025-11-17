

import { GoogleGenAI, Type } from '@google/genai';
import type { ItineraryPlan } from './types';

export const generateTrekkingPlan = async (
  location: string,
  duration: number,
  difficulty: string,
  interests: string
): Promise<ItineraryPlan | null> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is not set in environment variables.");
    // FIX: Removed alert per API key guidelines. The application must not ask the user for the key.
    return null;
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are an expert trekking and travel planner for "TrailsExplorer".
    Your task is to create a detailed, day-by-day itinerary for a trekking trip in Vietnam.

    The user wants a trip with the following specifications:
    - Location: ${location}
    - Duration: ${duration} days
    - Difficulty: ${difficulty}
    - Interests: ${interests}

    Generate a detailed itinerary based on these preferences.
    For each day, also provide 2-3 "smart suggestions" for nearby points of interest, such as local food stalls, restaurants, or cultural sightseeing spots.
    The plan should be realistic, engaging, and tailored to the user's input.
    Provide creative and appealing titles for each day.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plan: {
              type: Type.ARRAY,
              description: 'An array of daily itinerary objects.',
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER, description: 'The day number.' },
                  title: { type: Type.STRING, description: 'A catchy title for the day\'s trek.' },
                  route: { type: Type.STRING, description: 'A detailed description of the trekking route for the day.' },
                  distance_km: { type: Type.NUMBER, description: 'Estimated trekking distance in kilometers.' },
                  highlights: {
                    type: Type.ARRAY,
                    description: 'Key highlights and points of interest for the day.',
                    items: { type: Type.STRING }
                  },
                  camping_suggestion: { type: Type.STRING, description: 'A suggestion for where to camp or stay overnight.' },
                  smart_suggestions: {
                    type: Type.ARRAY,
                    description: 'Suggestions for nearby food or sightseeing.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['Food', 'Sightseeing'] },
                            description: { type: Type.STRING }
                        },
                        required: ['name', 'type', 'description']
                    }
                  }
                },
                required: ['day', 'title', 'route', 'distance_km', 'highlights', 'camping_suggestion', 'smart_suggestions']
              }
            }
          },
          required: ['plan']
        }
      }
    });
    
    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    if (parsedJson && Array.isArray(parsedJson.plan)) {
      return parsedJson as ItineraryPlan;
    } else {
      console.error("Invalid JSON structure received from API:", parsedJson);
      throw new Error("Received an invalid plan structure from the AI.");
    }

  } catch (error) {
    console.error("Error generating trekking plan:", error);
    throw error;
  }
};


export const generateChecklist = async (
  location: string,
  duration: number,
  difficulty: string
): Promise<string[] | null> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is not set in environment variables.");
    // FIX: Removed alert per API key guidelines. The application must not ask the user for the key.
    return null;
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate a comprehensive packing checklist for a ${duration}-day trekking trip to ${location} in Vietnam, with a ${difficulty} difficulty level. Focus on essential gear, clothing, first-aid, and personal items. Do not include quantities.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            checklist: {
              type: Type.ARRAY,
              description: 'An array of checklist item strings.',
              items: { type: Type.STRING }
            }
          },
          required: ['checklist']
        }
      }
    });
    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    if (parsedJson && Array.isArray(parsedJson.checklist)) {
        return parsedJson.checklist;
    } else {
        console.error("Invalid JSON structure for checklist:", parsedJson);
        return null;
    }

  } catch (error) {
    console.error("Error generating checklist:", error);
    throw error;
  }
};