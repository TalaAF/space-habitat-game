import React, { useState, useRef, useEffect } from 'react';
import { enhancedAIEngine } from '../../utils/enhancedAI';
import '../../styles/aiAssistant.css';

const AIAssistant = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hello! I\'m your advanced Space Habitat AI Assistant. I can understand natural conversation and help you with:\n\n🏗️ **Habitat Design** - Modules, layouts, construction\n🔧 **Systems Engineering** - Life support, power, water\n🚀 **Mission Planning** - Lunar, Mars, ISS destinations\n📏 **NASA Standards** - Safety, zoning, requirements\n\nJust talk to me naturally - I\'ll understand! What would you like to know?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userQuestion) => {
    // Use the enhanced AI engine for intelligent responses
    return enhancedAIEngine.generateIntelligentResponse(userQuestion, messages);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use local knowledge base
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate thinking
      const response = await generateResponse(currentInput);
      
      const assistantMessage = {
        role: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try asking your question again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: '👋 Chat cleared! What would you like to know about space habitats?'
      }
    ]);
  };

  const quickQuestions = [
    'How do I protect against radiation?',
    'What makes a good crew quarter?',
    'Compare rigid vs inflatable modules'
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    textareaRef.current?.focus();
  };

  if (isMinimized) {
    return (
      <div className="ai-assistant-minimized" onClick={() => setIsMinimized(false)}>
        <span className="ai-icon">🤖</span>
        <span className="ai-label">AI Assistant</span>
      </div>
    );
  }

  return (
    <div className="ai-assistant-container">
      <div className="ai-assistant-header">
        <div className="ai-header-left">
          <span className="ai-icon">🤖</span>
          <div className="ai-header-text">
            <h3>Space Habitat AI Assistant</h3>
            <span className="ai-status">● Online</span>
          </div>
        </div>
        <div className="ai-header-actions">
          <button 
            className="ai-header-btn" 
            onClick={handleClearChat}
            title="Clear chat"
          >
            🗑️
          </button>
          <button 
            className="ai-header-btn ai-close-btn" 
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="ai-messages-container">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`ai-message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <div className="ai-message-avatar">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="ai-message-content">
              <div className="ai-message-text">
                {message.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < message.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="ai-message assistant-message">
            <div className="ai-message-avatar">🤖</div>
            <div className="ai-message-content">
              <div className="ai-typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="ai-quick-questions">
          <p className="quick-questions-label">Quick questions:</p>
          <div className="quick-questions-grid">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question-btn"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="ai-input-container">
        <textarea
          ref={textareaRef}
          className="ai-input"
          placeholder="Ask me anything about space habitats..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1}
          disabled={isLoading}
        />
        <button
          className="ai-send-btn"
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
        >
          {isLoading ? '⏳' : '🚀'}
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
