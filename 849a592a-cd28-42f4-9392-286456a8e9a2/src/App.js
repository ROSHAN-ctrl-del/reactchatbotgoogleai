import React, { useState } from "react";
import axios from "axios";
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots } from "react-icons/fa";
import "./styles.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to the chat
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Call the Gemini API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC9NvEd-C5Bk7IuY8Eh7b4cyqBBhbb07ME`,
        {
          contents: [
            {
              parts: [{ text: input }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Add bot's response to the chat
      const botMessage = {
        text: response.data.candidates[0].content.parts[0].text,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, something went wrong!", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        <FaCommentDots />
      </button>

      {/* Chatbot Container */}
      <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          <FaRobot className="chatbot-icon" />
          <h2>Chatbot</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="message bot">
              <div className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          )}
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            disabled={loading}
          />
          <button onClick={handleSendMessage} disabled={loading}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </>
  );
};

export default function App() {
  return (
    <div className="app">
      <Chatbot />
    </div>
  );
}
