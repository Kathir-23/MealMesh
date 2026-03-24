import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi there! I am the Meal-Meash AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'error', text: data.message || 'Sorry, something went wrong!' }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'error', text: 'Network error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg text-white transform hover:scale-105 transition-all z-50 ${theme === 'dark' ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-emerald-600 hover:bg-emerald-500'}`}
        style={{ zIndex: 9999 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-24 right-6 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
            style={{ height: '450px', zIndex: 9999 }}
          >
            {/* Header */}
            <div className={`p-4 flex justify-between items-center bg-gradient-to-r ${theme === 'dark' ? 'from-emerald-900 to-teal-900' : 'from-emerald-600 to-teal-500'} text-white`}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  🤖
                </div>
                <h3 className="font-semibold text-lg">Meal-Meash AI</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={toggleTheme} className="text-white/80 hover:text-white transition-colors" title="Toggle Theme">
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <button onClick={toggleChat} className="text-white/80 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 p-4 overflow-y-auto space-y-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-slate-50'}`}>
              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? (theme === 'dark' ? 'bg-emerald-700 text-white rounded-br-none' : 'bg-emerald-600 text-white rounded-br-none')
                        : msg.role === 'error'
                        ? 'bg-red-500 text-white rounded-bl-none'
                        : (theme === 'dark' ? 'bg-gray-700 text-gray-100 rounded-bl-none' : 'bg-white text-gray-800 shadow-md border border-gray-100 rounded-bl-none')
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className={`flex space-x-2 p-3 rounded-2xl rounded-bl-none ${theme === 'dark' ? 'bg-gray-700' : 'bg-white shadow-md border border-gray-100'}`}>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={`p-4 border-t ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
              <form onSubmit={handleSend} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className={`flex-1 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700 border border-gray-700' : 'bg-slate-100 text-gray-800 border-transparent hover:bg-slate-200'}`}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={`p-2 rounded-full transition-all flex items-center justify-center ${
                    !input.trim() || isLoading
                      ? (theme === 'dark' ? 'bg-gray-700 text-gray-500' : 'bg-slate-200 text-slate-400')
                      : 'bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-md'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </form>
            </div>
            
            {/* "Powered by Gemini" watermark */}
            <div className={`text-center py-1 text-xs ${theme === 'dark' ? 'bg-gray-900 text-gray-500' : 'bg-white text-gray-400'}`}>
              Powered by Google Gemini AI
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
