const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
        console.error("No API Key found in .env");
        return;
    }

    const client = new GoogleGenAI({ apiKey });

    try {
        console.log("Listing models...");
        const response = await client.models.list();

        const models = [];
        for await (const model of response) {
            models.push(`${model.name} [Methods: ${model.supportedGenerationMethods ? model.supportedGenerationMethods.join(',') : 'None'}]`);
        }

        fs.writeFileSync('available_models.txt', models.join('\n'));
        console.log(`Saved ${models.length} models to available_models.txt`);

    } catch (err) {
        console.error("Error listing models:", err);
    }
}

listModels();
