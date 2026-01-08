const express = require('express');
const router = express.Router();
const { GoogleGenAI, Type } = require('@google/genai');
const SavedPlan = require('../models/SavedPlan');
const authenticateToken = require('../middleware/authMiddleware');

// Helper to interact with Gemini
async function generateContent(prompt, responseSchema) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not configured");

    const genAI = new GoogleGenAI({ apiKey });

    const modelName = 'gemini-2.5-flash';
    console.log(`[Gemini] Generating content with model: ${modelName}`);
    const startTime = Date.now();

    try {
        const response = await genAI.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema
            }
        });

        console.log(`[Gemini] Success! Time taken: ${Date.now() - startTime}ms`);

        let jsonText;
        if (response.candidates && response.candidates.length > 0 && response.candidates[0].content.parts.length > 0) {
            jsonText = response.candidates[0].content.parts[0].text;
        } else if (typeof response.text === 'function') {
            jsonText = response.text();
        } else {
            console.error('[Gemini] Unexpected response structure:', JSON.stringify(response, null, 2));
            throw new Error('Invalid response structure from Gemini API');
        }

        return JSON.parse(jsonText.trim());
    } catch (err) {
        console.error(`[Gemini] Failed after ${Date.now() - startTime}ms. Error:`, err.message);
        throw new Error(`Gemini Error: ${err.message}`);
    }
}

// 1. POST /api/ai/generate-plan
router.post('/generate-plan', authenticateToken, async (req, res) => {
    try {
        const { location, duration, difficulty, interests, trailId } = req.body;
        const userId = req.user.id;

        // A. Generate Itinerary & Checklist (Combined for efficiency)
        const combinedPrompt = `
            Create a detailed ${duration}-day trekking itinerary for ${location} (Difficulty: ${difficulty}).
            Interests: ${interests}.
            
            1. Plan: For each day provide day number, title, route (detailed), distance_km, highlights (array), camping_suggestion, smart_suggestions (array).
            2. Checklist: A comprehensive packing checklist for this specific trip.
        `;

        const combinedSchema = {
            type: Type.OBJECT,
            properties: {
                plan: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            day: { type: Type.NUMBER },
                            title: { type: Type.STRING },
                            route: { type: Type.STRING },
                            distance_km: { type: Type.NUMBER },
                            highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                            camping_suggestion: { type: Type.STRING },
                            smart_suggestions: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        type: { type: Type.STRING, enum: ['Food', 'Sightseeing'] },
                                        description: { type: Type.STRING }
                                    }
                                }
                            }
                        },
                        required: ['day', 'title', 'route']
                    }
                },
                checklist: {
                    type: Type.ARRAY,
                    description: "List of essential packing items",
                    items: { type: Type.STRING }
                }
            }
        };

        const aiData = await generateContent(combinedPrompt, combinedSchema);

        // C. Save to Database
        const newPlan = await SavedPlan.create({
            user_id: userId,
            trail_id: trailId || null,
            location,
            duration,
            difficulty,
            interests,
            plan_data: aiData.plan,
            checklist: aiData.checklist
        });

        res.status(201).json(newPlan);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST /api/ai/refine-plan (Bonus)
router.post('/refine-plan', authenticateToken, async (req, res) => {
    try {
        const { planId, instruction } = req.body;
        const plan = await SavedPlan.findByPk(planId);

        if (!plan) return res.status(404).json({ message: "Plan not found" });
        if (plan.user_id !== req.user.id) return res.status(403).json({ message: "Not authorized" });

        const prompt = `
            Current Plan: ${JSON.stringify(plan.plan_data)}
            User Instruction: "${instruction}"
            Refine the plan based on the instruction. Return the FULL updated plan in the same JSON structure.
        `;

        // Reuse schema from above (simplified for brevity here, ideally shared)
        const itinerarySchema = {
            type: Type.OBJECT,
            properties: {
                plan: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            day: { type: Type.NUMBER },
                            title: { type: Type.STRING },
                            route: { type: Type.STRING },
                            distance_km: { type: Type.NUMBER },
                            highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                            camping_suggestion: { type: Type.STRING },
                            smart_suggestions: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        type: { type: Type.STRING }, // Simplified enum check for refinement
                                        description: { type: Type.STRING }
                                    }
                                }
                            }
                        },
                        required: ['day', 'title', 'route']
                    }
                }
            }
        };

        const updatedData = await generateContent(prompt, itinerarySchema);

        // Update DB
        plan.plan_data = updatedData.plan;
        await plan.save();

        res.json(plan);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
