import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, AlertCircle, Heart, ChevronRight, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { getAiMatchRecommendations } from '../utils/mockAI';

// --- WEBSITE KNOWLEDGE BASE ---
const SYSTEM_INSTRUCTION = `
You are the AI Concierge & Matchmaker for 'My Divine Wedding'.
Your role is to assist users politely, professionally, and warmly.

**Capabilities:**
1. **Support:** Answer questions about membership, communities, and technical issues.
2. **Matchmaking:** You can recommend profiles. If a user asks for matches (e.g., "Find me a doctor", "Show matches"), you MUST reply with a JSON structure hidden in a specific format or just say "Here are some matches I found for you based on..." and I will handle the UI rendering in the frontend. 
   *IMPORTANT:* When the user expresses interest in finding a partner, end your response with "[SHOW_MATCHES]" to trigger the UI card display.

**Website Information:**
- **Name:** My Divine Wedding
- **Tagline:** "Divine Connections start here."
- **Key Features:** 100% Verified, AI Matchmaking, Privacy.

**Tone:** Warm, empathetic, professional. Use "Namaste" or "Vanakkam".
`;

// Use a counter for unique IDs
let messageIdCounter = 1;
const getUniqueMessageId = () => messageIdCounter++;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  
  // Chat Session State
  const [chatSession, setChatSession] = useState(null);
  const [messages, setMessages] = useState([
    { 
      id: getUniqueMessageId(), 
      text: "Vanakkam! 🙏 I am your AI Matchmaker for My Divine Wedding. How can I help you today?", 
      sender: 'bot' 
    }
  ]);

  // Initialize Gemini Chat Session
  useEffect(() => {
    const initAI = async () => {
      try {
        const apiKey = import.meta.env.VITE_API_KEY;
        if (apiKey) {
          const ai = new GoogleGenAI(apiKey);
          const chat = ai.getGenerativeModel({ model: 'gemini-pro' }).startChat({
            generationConfig: {
              maxOutputTokens: 500,
            },
            systemInstruction: SYSTEM_INSTRUCTION,
          });
          setChatSession(chat);
        } else {
          console.warn("API_KEY not found. Chatbot will run in demo mode.");
        }
      } catch (error) {
        console.error("Failed to initialize AI:", error);
      }
    };

    initAI();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    // 1. Add User Message
    setMessages(prev => [...prev, { id: getUniqueMessageId(), text, sender: 'user' }]);
    setInputValue("");
    setIsTyping(true);

    try {
      let responseText = "";
      let showMatches = false;

      // DEMO OVERRIDE: Check for match keywords locally to ensure UI demo works even without API key
      const lowerText = text.toLowerCase();
      if (lowerText.includes("match") || lowerText.includes("find") || lowerText.includes("looking for")) {
         showMatches = true;
      }

      if (chatSession && !showMatches) {
        // 2. Call Gemini API
        const result = await chatSession.sendMessage(text);
        responseText = await result.response.text();
        if (responseText.includes("[SHOW_MATCHES]")) {
           showMatches = true;
           responseText = responseText.replace("[SHOW_MATCHES]", "");
        }
      } else {
        // Fallback or Force Match
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (showMatches) {
           responseText = "I've analyzed your preferences and found these profiles that might be a great fit!";
        } else {
           responseText = "I can definitely help with that. Could you tell me more about what you are looking for?";
        }
      }

      // 3. Add Bot Response
      setMessages(prev => [...prev, { id: getUniqueMessageId(), text: responseText, sender: 'bot' }]);

      // 4. Inject Match Cards if triggered
      if (showMatches) {
         setIsTyping(true); // Keep typing indicator
         const matches = await getAiMatchRecommendations(text); // Fetch mock matches
         setIsTyping(false);
         setMessages(prev => [...prev, { 
            id: getUniqueMessageId(), 
            text: "", 
            sender: 'bot', 
            type: 'match_card',
            matches: matches
         }]);
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        id: getUniqueMessageId(), 
        text: "I apologize, but I'm having trouble connecting right now.", 
        sender: 'bot',
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const MatchCarousel = ({ matches }) => (
     <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 custom-scrollbar">
        {matches.map(profile => (
           <div key={profile.id} className="min-w-[200px] w-[200px] bg-white dark:bg-[#1a1a1a] rounded-xl border border-purple-100 dark:border-white/10 shadow-lg overflow-hidden flex-shrink-0">
              <div className="h-32 relative">
                 <img src={profile.img} className="w-full h-full object-cover" alt={profile.name} />
                 <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <h4 className="text-white font-bold text-sm truncate">{profile.name}, {profile.age}</h4>
                 </div>
              </div>
              <div className="p-3">
                 <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{profile.occupation}</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{profile.location}</p>
                 <div className="flex items-center gap-1 mt-2 mb-2">
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">{profile.matchScore}% Match</span>
                 </div>
                 <button className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors">
                    View Profile
                 </button>
              </div>
           </div>
        ))}
     </div>
  );

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-[60] w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/40 flex items-center justify-center border-4 border-white dark:border-gray-800"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <MessageSquare size={28} fill="currentColor" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
            className="fixed bottom-28 right-6 z-[59] w-[90vw] md:w-[400px] h-[600px] max-h-[70vh] bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center gap-4 text-white relative overflow-hidden shrink-0">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
               
               <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                 <Bot size={24} />
               </div>
               <div className="relative z-10">
                 <h3 className="font-bold text-lg">Divine Matchmaker</h3>
                 <p className="text-xs text-purple-100 flex items-center gap-1">
                   <Sparkles size={10} className="text-yellow-300" /> AI Powered
                 </p>
               </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/20 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'match_card' && msg.matches ? (
                     <div className="max-w-[95%]">
                        <MatchCarousel matches={msg.matches} />
                     </div>
                  ) : (
                     <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                        msg.sender === 'user' 
                           ? 'bg-purple-600 text-white rounded-tr-none' 
                           : msg.isError 
                           ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-100 dark:border-red-900/30'
                           : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5'
                     }`}>
                        {msg.isError && <AlertCircle size={16} className="mb-1 inline-block mr-2" />}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                     </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none p-4 border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length < 4 && !isTyping && (
              <div className="px-4 pb-2 bg-gray-50 dark:bg-black/20 overflow-x-auto flex gap-2 shrink-0 custom-scrollbar">
                <button 
                  onClick={() => handleSend("Find me a suitable match")}
                  className="whitespace-nowrap text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-2 rounded-full border border-purple-200 dark:border-purple-800 hover:bg-purple-200 transition-colors shadow-sm flex items-center gap-1"
                >
                  <Heart size={12} /> Find Matches
                </button>
                {["Membership Plans", "Contact Support"].map((q, i) => (
                   <button 
                     key={i}
                     onClick={() => handleSend(q)}
                     className="whitespace-nowrap text-xs font-bold bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm"
                   >
                     {q}
                   </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-white/5 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
                className="relative flex items-center gap-2"
              >
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type 'Find matches' or ask anything..."
                  className="w-full bg-gray-100 dark:bg-black/40 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none text-gray-900 dark:text-white transition-all"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;