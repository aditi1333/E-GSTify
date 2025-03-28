// TaxGenie Chatbot Implementation using IBM Granite model
// For E-GSTify application

import React, { useState, useEffect, useRef } from 'react';

// TaxGenie component that can be integrated into web applications
const TaxGenie = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Automatically scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to query IBM Granite model
  const queryGraniteModel = async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://your-backend-api/granite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          context: 'GST and Tax compliance in India', // Provide context to the model
          // You may include more parameters based on Granite API requirements
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from the server');
      }

      const data = await response.json();
      setIsLoading(false);
      return data.response;
    } catch (error) {
      console.error('Error querying Granite model:', error);
      setIsLoading(false);
      return 'I apologize, but I encountered an error while processing your query. Please try again later.';
    }
  };

  // Handle user input submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = {
      text: input,
      sender: 'user',
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    // Get response from Granite model
    const botResponse = await queryGraniteModel(input);

    const botMessage = {
      text: botResponse,
      sender: 'bot',
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  return (
    <div className="taxgenie-container">
      <div className="taxgenie-header">
        <h2>TaxGenie</h2>
        <p>Your GST & Tax Compliance Assistant</p>
      </div>

      <div className="taxgenie-chat-window">
        {messages.length === 0 ? (
          <div className="taxgenie-welcome">
            <h3>Welcome to TaxGenie!</h3>
            <p>Ask me anything about GST, tax laws, or compliance matters.</p>
            <div className="taxgenie-suggestions">
              <button onClick={() => setInput("What are the latest changes in GST rates?")}>
                Latest GST rate changes
              </button>
              <button onClick={() => setInput("What is the GST rate for electronic goods?")}>
                GST rate for electronics
              </button>
              <button onClick={() => setInput("How to file GST returns?")}>
                GST return filing
              </button>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`taxgenie-message ${message.sender === 'user' ? 'taxgenie-user-message' : 'taxgenie-bot-message'}`}
            >
              <div className="taxgenie-message-content">{message.text}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="taxgenie-loading">
            <div className="taxgenie-loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="taxgenie-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about GST, tax laws, or compliance..."
          className="taxgenie-input"
          disabled={isLoading}
        />
        <button type="submit" className="taxgenie-send-button" disabled={isLoading}>
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default TaxGenie;