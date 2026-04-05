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
