const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
    console.error("Skipping debug: No API Key");
    process.exit(1);
}

const client = new GoogleGenAI({ apiKey });

async function run() {
    console.log("Testing Gemini SDK response structure...");
    try {
        const response = await client.models.generateContent({
            // Use gemini-2.0-flash as it is available
            model: 'gemini-2.0-flash',
            contents: 'Return a simple JSON object: {"greeting": "hello"}',
            config: {
                responseMimeType: 'application/json'
            }
        });

        console.log('--- RESPONSE INSPECTION ---');
        console.log('Type of response:', typeof response);
        console.log('Keys:', Object.keys(response));
        console.log('Has .text()?', typeof response.text);
        console.log('JSON Stringify:', JSON.stringify(response, null, 2));
    } catch (e) {
        console.error("Error during debug call:", e);
    }
}
run();
