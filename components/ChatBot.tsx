
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, AlertCircle, Heart, ChevronRight, Sparkles, Mic, MicOff, Volume2, VolumeX, Phone, MapPin, UserPlus, CheckCircle } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";
import { getAiMatchRecommendations } from '../utils/mockAI';
import { Profile } from '../utils/mockData';
import { validateField } from '../utils/validation';

// --- WEBSITE KNOWLEDGE BASE ---
const SYSTEM_INSTRUCTION = `
You are the "Divine Assistant", an intelligent, multilingual AI Concierge & Matchmaker for 'My Divine Wedding'.
Your goal is to help users find partners, answer queries, and provide contact details warmly and professionally.

**CRITICAL CONTACT INFORMATION (Provide this EXACTLY when asked for support/contact/address):**
- **Phone Numbers:** 9087549000, 9025159000
- **Address:** 
  Yogiar Illam,
  Flat No. T3, Third Floor,
  Rajaji Street,
  Saligramam,
  Chennai - 93.

**Capabilities & Rules:**
1. **Multilingual:** You MUST detect the language the user is speaking/typing (English, Tamil, Hindi, Telugu, Malayalam, etc.) and reply in the SAME language and script.
2. **Conversational Speech:** Write responses that sound natural when spoken aloud.
3. **Matchmaking:** If a user asks for matches, ask for preferences. Once you have enough info, reply with specific profile suggestions.
   - *IMPORTANT:* When recommending profiles, end your response with "[SHOW_MATCHES]" to trigger the visual card display.
4. **Tone:** Warm, empathetic, respectful, and culturally aware.
`;

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  isError?: boolean;
  type?: 'text' | 'match_card';
  matches?: Profile[];
}

// Extend Window interface for Web Speech API support in TS
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// --- REGISTRATION QUESTIONS ---
const REG_STEPS = [
  { key: 'firstName', question: "Let's build your profile! First, what is your **First Name**?" },
  { key: 'lastName', question: "And your **Last Name**?" },
  { key: 'gender', question: "What is your **Gender**? (Male/Female)" },
  { key: 'dob', question: "What is your **Date of Birth**? (Format: YYYY-MM-DD)" },
  { key: 'maritalStatus', question: "Your **Marital Status**? (Never Married, Divorced, Widowed)" },
  { key: 'religion', question: "What is your **Religion**? (e.g., Hindu, Christian, Muslim)" },
  { key: 'caste', question: "What is your **Caste**? (e.g., Iyer, Nadar, etc.)" },
  { key: 'gothram', question: "Your **Gothram**? (Type 'None' if not applicable)" },
  { key: 'raasi', question: "Your **Raasi** (Zodiac)? (e.g., Mesham, Rishabam)" },
  { key: 'nakshatra', question: "Your **Nakshatra** (Star)? (e.g., Ashwini, Bharani)" },
  { key: 'height', question: "Your **Height**? (e.g., 5'9\" or 175)" },
  { key: 'education', question: "Highest **Education** qualification?" },
  { key: 'occupation', question: "What is your **Occupation** / Job Title?" },
  { key: 'income', question: "Annual **Income**? (e.g., 500000 or 5 Lakhs)" },
  { key: 'familyType', question: "Family Type? (Nuclear/Joint)" },
  { key: 'diet', question: "Diet preference? (Veg/Non-Veg/Vegan)" },
  { key: 'city', question: "Current **City**?" },
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Speech States
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Chat Session State
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Vanakkam! 🙏 I am your Divine Assistant. To assist you better and personalize your experience, may I please have your **Email Address**?", 
      sender: 'bot' 
    }
  ]);

  // --- CONVERSATION FLOW STATE ---
  type FlowState = 'CAPTURE_EMAIL' | 'CAPTURE_PHONE' | 'GENERAL' | 'REGISTRATION';
  const [flowState, setFlowState] = useState<FlowState>('CAPTURE_EMAIL');
  const [regStepIndex, setRegStepIndex] = useState(0);
  const [userData, setUserData] = useState<any>({});

  // Initialize Gemini Chat Session
  useEffect(() => {
    const initAI = async () => {
      try {
        const apiKey = process.env.API_KEY;
        if (apiKey) {
          const ai = new GoogleGenAI({ apiKey });
          const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
            }
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
  }, [messages, isTyping, isOpen, errorMsg]);

  // --- TEXT TO SPEECH (TTS) ---
  const speakText = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\[.*?\]/g, '').replace(/[\u{1F600}-\u{1F64F}]/gu, "").replace(/\*/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (/[அ-ஹ]/.test(text)) utterance.lang = 'ta-IN';
    else if (/[अ-ह]/.test(text)) utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // --- SPEECH TO TEXT (STT) ---
  const toggleListening = () => {
    setErrorMsg(null);
    if (isListening) {
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg("Voice input not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleSend(transcript);
    };
    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setErrorMsg("Microphone access denied. Please allow permission in browser settings.");
      } else if (event.error !== 'no-speech') {
        setErrorMsg("Voice input failed. Please type.");
      }
      setTimeout(() => setErrorMsg(null), 4000);
    };
    recognition.onend = () => setIsListening(false);
    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start recognition", e);
      setIsListening(false);
    }
  };

  // --- DATA SAVING HELPER ---
  const saveProfileToAdmin = (data: any) => {
    const newUser = {
      id: `CHAT-${Date.now()}`,
      name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Chat User',
      email: data.email,
      mobile: data.mobile,
      role: 'user',
      status: 'pending', // Pending verification
      plan: 'free',
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      verified: false,
      reports: 0,
      safetyScore: 50, // Default low score until verified
      profileScore: 40,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      location: data.city,
      ...data
    };

    // Simulate saving to DB by using LocalStorage (Admin uses this)
    const existingUsers = JSON.parse(localStorage.getItem('mdm_users') || '[]');
    localStorage.setItem('mdm_users', JSON.stringify([newUser, ...existingUsers]));
    
    // Auto-login locally for demo
    localStorage.setItem('mdm_email', data.email);
  };

  const addBotMessage = (text: string, type: 'text' | 'match_card' = 'text', matches?: Profile[]) => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender: 'bot', type, matches }]);
    speakText(text);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsgId = Date.now();
    setMessages(prev => [...prev, { id: userMsgId, text, sender: 'user' }]);
    setInputValue("");
    setIsTyping(true);
    
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    // --- FLOW CONTROL ---

    // FLOW: CAPTURE EMAIL
    if (flowState === 'CAPTURE_EMAIL') {
      setTimeout(() => {
        if (text.includes('@') && text.includes('.')) {
          setUserData((prev: any) => ({ ...prev, email: text }));
          setFlowState('CAPTURE_PHONE');
          addBotMessage("Thank you! Now, could you please share your **Mobile Number**?");
        } else {
          addBotMessage("That doesn't look like a valid email. Please try again.");
        }
        setIsTyping(false);
      }, 600);
      return;
    }

    // FLOW: CAPTURE PHONE
    if (flowState === 'CAPTURE_PHONE') {
      setTimeout(() => {
        const phone = text.replace(/[^0-9]/g, '');
        if (phone.length >= 10) {
          setUserData((prev: any) => ({ ...prev, mobile: text }));
          setFlowState('GENERAL'); // Move to general, but offer registration
          addBotMessage("Perfect! Your contact details are saved.\n\nI can answer your questions, or if you like, I can create your **Matrimony Profile** right now step-by-step. \n\nType **'Create Profile'** to start registration, or ask me anything else!");
          
          // Save preliminary lead
          saveProfileToAdmin({ ...userData, mobile: text });
        } else {
          addBotMessage("Please enter a valid phone number (at least 10 digits).");
        }
        setIsTyping(false);
      }, 600);
      return;
    }

    // FLOW: REGISTRATION WIZARD
    if (flowState === 'REGISTRATION') {
      setTimeout(() => {
        // Validate Answer
        const currentField = REG_STEPS[regStepIndex].key;
        const validationError = validateField(currentField, text);

        if (validationError) {
           addBotMessage(`⚠️ ${validationError}. Please provide a valid answer.`);
           setIsTyping(false);
           return;
        }

        // Save previous answer
        const updatedData = { ...userData, [currentField]: text };
        setUserData(updatedData);

        // Move to next
        const nextIndex = regStepIndex + 1;
        if (nextIndex < REG_STEPS.length) {
          setRegStepIndex(nextIndex);
          addBotMessage(REG_STEPS[nextIndex].question);
        } else {
          // Finished
          setFlowState('GENERAL');
          saveProfileToAdmin(updatedData);
          addBotMessage("🎉 Fantastic! I have created your profile successfully.\n\nYour data has been sent to our Admin team for verification. You can now ask me to 'Find Matches'!");
        }
        setIsTyping(false);
      }, 800);
      return;
    }

    // FLOW: GENERAL CHAT (Gemini)
    try {
      // Trigger Registration from General
      const lowerText = text.toLowerCase();
      if (lowerText.includes("register") || lowerText.includes("create profile") || lowerText.includes("sign up")) {
        setFlowState('REGISTRATION');
        setRegStepIndex(0);
        setTimeout(() => {
          addBotMessage(REG_STEPS[0].question);
          setIsTyping(false);
        }, 500);
        return;
      }

      let responseText = "";
      let showMatches = false;

      // Check for match keywords
      if (lowerText.includes("match") || lowerText.includes("find") || lowerText.includes("looking for")) {
         showMatches = true;
      }

      if (chatSession && !showMatches) {
        const result = await chatSession.sendMessage({ message: text });
        responseText = result.text;
        
        if (responseText.includes("[SHOW_MATCHES]")) {
           showMatches = true;
           responseText = responseText.replace("[SHOW_MATCHES]", "");
        }
      } else {
        // Fallback Logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (lowerText.includes("contact") || lowerText.includes("address") || lowerText.includes("phone")) {
            responseText = "You can reach us at:\nPhone: 9087549000, 9025159000\nAddress: Yogiar Illam, Flat No. T3, Third Floor, Rajaji Street, Saligramam, Chennai - 93.";
        } else if (showMatches) {
           responseText = "I've analyzed your preferences and found these profiles that might be a great fit!";
        } else {
           responseText = "I can definitely help with that. Could you tell me more about what you are looking for?";
        }
      }

      addBotMessage(responseText);

      // Inject Match Cards if triggered
      if (showMatches) {
         setIsTyping(true); 
         const matches = await getAiMatchRecommendations(text); 
         setIsTyping(false);
         setMessages(prev => [...prev, { 
            id: Date.now() + 2, 
            text: "", 
            sender: 'bot', 
            type: 'match_card',
            matches: matches
         }]);
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 2, 
        text: "I apologize, but I'm having trouble connecting right now. Please try again or call our support at 9087549000.", 
        sender: 'bot',
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const MatchCarousel: React.FC<{ matches: Profile[] }> = ({ matches }) => (
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
            className="fixed bottom-28 right-6 z-[59] w-[90vw] md:w-[400px] h-[600px] max-h-[75vh] bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between text-white relative overflow-hidden shrink-0">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
               
               <div className="flex items-center gap-3 relative z-10">
                 <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                   <Bot size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-base leading-tight">Divine AI</h3>
                   <p className="text-[10px] text-purple-100 flex items-center gap-1">
                     <Sparkles size={8} className="text-yellow-300" /> 
                     {flowState === 'GENERAL' ? 'Multilingual Support' : 'Registration Mode'}
                   </p>
                 </div>
               </div>

               {/* Audio Toggle */}
               <button 
                  onClick={() => {
                     const nextState = !speechEnabled;
                     setSpeechEnabled(nextState);
                     if(!nextState) window.speechSynthesis.cancel();
                  }}
                  className="relative z-10 p-2 hover:bg-white/20 rounded-full transition-colors"
                  title={speechEnabled ? "Mute Voice" : "Enable Voice"}
               >
                  {speechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
               </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/20 custom-scrollbar relative">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'match_card' && msg.matches ? (
                     <div className="max-w-[95%]">
                        <MatchCarousel matches={msg.matches} />
                     </div>
                  ) : (
                     <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
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
              
              {/* Bot Activity Indicator */}
              {(isTyping || isSpeaking) && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none p-3 border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-2">
                    {isSpeaking ? (
                       <>
                         <Volume2 size={14} className="text-purple-500 animate-pulse" />
                         <span className="text-xs text-gray-500">Speaking...</span>
                       </>
                    ) : (
                       <div className="flex gap-1.5">
                         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                       </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Message Toast inside Chat Window */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute bottom-4 left-4 right-4 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-200 text-xs p-3 rounded-xl border border-red-200 dark:border-red-800 shadow-lg z-20 text-center font-bold"
                  >
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (Only in General Mode) */}
            {flowState === 'GENERAL' && messages.length < 6 && !isTyping && (
              <div className="px-4 pb-2 bg-gray-50 dark:bg-black/20 overflow-x-auto flex gap-2 shrink-0 custom-scrollbar">
                <button 
                  onClick={() => handleSend("Contact Details")}
                  className="whitespace-nowrap text-xs font-bold bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm flex items-center gap-1"
                >
                  <Phone size={12} /> Contact Us
                </button>
                 <button 
                  onClick={() => handleSend("Address")}
                  className="whitespace-nowrap text-xs font-bold bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm flex items-center gap-1"
                >
                  <MapPin size={12} /> Office Location
                </button>
                <button 
                  onClick={() => handleSend("Create Profile")}
                  className="whitespace-nowrap text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-2 rounded-full border border-purple-200 dark:border-purple-800 hover:bg-purple-200 transition-colors shadow-sm flex items-center gap-1"
                >
                  <UserPlus size={12} /> Create Profile
                </button>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-white/5 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
                className="relative flex items-center gap-2"
              >
                 <button 
                  type="button"
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                     isListening 
                     ? 'bg-red-500 text-white shadow-lg animate-pulse' 
                     : 'bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-purple-600'
                  }`}
                  title={isListening ? "Stop Listening" : "Voice Input"}
                 >
                   {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                 </button>

                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    isListening ? "Listening..." : 
                    flowState === 'CAPTURE_EMAIL' ? "Enter your Email..." :
                    flowState === 'CAPTURE_PHONE' ? "Enter your Phone..." :
                    "Type or speak..."
                  }
                  className="flex-1 bg-gray-100 dark:bg-black/40 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none text-gray-900 dark:text-white transition-all"
                />
                
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                >
                  <Send size={20} />
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
