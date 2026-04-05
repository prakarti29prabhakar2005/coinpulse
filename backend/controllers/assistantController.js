const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

exports.askAssistant = async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                message: "Gemini API Key is missing in the backend. Please add it to the .env file."
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: "You are Coinpulse Assistant, a specialized financial expert. You help users with questions about stocks, cryptocurrency, and general finance. Keep your answers concise, professional, and easy to understand. If someone asks a non-financial question, politely redirect them to finance-related topics."
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ text });
    } catch (error) {
        console.error("Assistant Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.analyzeSentiment = async (req, res) => {
    try {
        const { asset } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                message: "Gemini API Key is missing in the backend."
            });
        }

        if (!asset) {
            return res.status(400).json({ message: "Asset name is required" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: "You are a professional financial sentiment analyst. Based on your knowledge of recent market trends, news, and social media buzz, provide a sentiment analysis for the requested asset. Your response MUST be a valid JSON object with the following fields: 'score' (0-100, where 0 is extremely bearish and 100 is extremely bullish), 'label' (either 'Bullish', 'Bearish', or 'Neutral'), and 'reasoning' (a short, 1-2 sentence explanation). Do not include any markdown or extra text, just the JSON."
        });

        const prompt = `Analyze the current market sentiment for ${asset}.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up JSON if AI includes markdown code blocks
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const sentimentData = JSON.parse(text);
        res.status(200).json(sentimentData);
    } catch (error) {
        console.error("Sentiment Error:", error);
        res.status(500).json({ error: error.message });
    }
};
