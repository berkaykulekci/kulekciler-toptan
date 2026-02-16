
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: ".env.local" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing via .env.local");
    process.exit(1);
}

// Access the API directly to list models if SDK doesn't expose it easily,
// but checking SDK capabilities via a simple fetch since the typed SDK might hide 'list_models'
// actually simply trying to use a known model that usually works
async function main() {
    console.log("Checking available models...");

    // We will try to fetch models using fetch directly as the Node SDK
    // focuses on inference.
    // Documentation: https://ai.google.dev/api/rest/v1beta/models/list

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach((m: any) => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models found or error structure:", data);
        }
    } catch (e) {
        console.error("Error listing models:", e);
    }
}

main();
