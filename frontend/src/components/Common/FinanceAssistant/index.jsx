import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
import { motion, AnimatePresence } from "framer-motion";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { knowledgeBase } from "./knowledgeBase";

const FinanceAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Coinpulse Assistant. How can I help you today?", isUser: false }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
        setInput("");
        setIsTyping(true);

        try {
            const query = userMessage.toLowerCase();
            let foundInKB = false;

            // First check local knowledge base for quick response
            for (const [key, value] of Object.entries(knowledgeBase)) {
                if (query.includes(key)) {
                    setMessages((prev) => [...prev, { text: value, isUser: false }]);
                    foundInKB = true;
                    setIsTyping(false);
                    break;
                }
            }

            if (!foundInKB) {
                const isSentimentQuery = query.includes("sentiment") || query.includes("mood");
                const endpoint = isSentimentQuery ? "/api/assistant/sentiment" : "/api/assistant/chat";
                const body = isSentimentQuery
                    ? { asset: query.replace(/sentiment|mood|for|of|the|what|is|how|show|me/gi, "").trim() }
                    : { message: userMessage };

                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}${endpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });

                const data = await res.json();
                if (res.ok) {
                    if (isSentimentQuery) {
                        setMessages((prev) => [...prev, {
                            isSentiment: true,
                            sentimentData: data,
                            isUser: false
                        }]);
                    } else {
                        setMessages((prev) => [...prev, { text: data.text, isUser: false }]);
                    }
                } else {
                    setMessages((prev) => [...prev, {
                        text: data.message || "I'm having trouble connecting to my brain. Please try again later.",
                        isUser: false
                    }]);
                }
            }
        } catch (error) {
            setMessages((prev) => [...prev, { text: "Error connecting to server.", isUser: false }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="assistant-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="assistant-window"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="assistant-header">
                            <h3>Assistant</h3>
                            <CloseIcon onClick={() => setIsOpen(false)} style={{ cursor: "pointer" }} />
                        </div>
                        <div className="assistant-messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.isUser ? "user-message" : "bot-message"} ${msg.isSentiment ? "sentiment-card" : ""}`}>
                                    {msg.isSentiment ? (
                                        <div className="sentiment-content">
                                            <div className="sentiment-header-row">
                                                <span className={`sentiment-label ${msg.sentimentData.label.toLowerCase()}`}>
                                                    {msg.sentimentData.label}
                                                </span>
                                                <span className="sentiment-score">{msg.sentimentData.score}%</span>
                                            </div>
                                            <div className="sentiment-bar-bg">
                                                <div
                                                    className={`sentiment-bar-fill ${msg.sentimentData.label.toLowerCase()}`}
                                                    style={{ width: `${msg.sentimentData.score}%` }}
                                                />
                                            </div>
                                            <p className="sentiment-reasoning">{msg.sentimentData.reasoning}</p>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="message bot-message thinking">
                                    Assistant is thinking...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="assistant-input-area">
                            <input
                                type="text"
                                placeholder="Ask about crypto/stocks..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <div className="send-btn" onClick={handleSend}>
                                <SendIcon style={{ fontSize: 20 }} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="assistant-fab"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Finance Assistant"
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </motion.div>
        </div>
    );
};

export default FinanceAssistant;
