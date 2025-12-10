
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Phone, Video, Search, MoreVertical, Send, Mic, Image, Smile, 
  Check, CheckCheck, Clock, ArrowLeft, X, User, Heart, UserPlus, PhoneOff, MicOff, VideoOff,
  Shield, CheckCircle, XCircle, Calendar, Plus, Sparkles, FileText, Lock, Users,
  PenTool, ChevronRight, AlertTriangle
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput, AnimatedTextArea } from '../profile/ProfileFormElements';

// --- MOCK DATA FOR BROKER CONTEXT ---
const BROKER_THREADS = [
  { 
    id: 't1', 
    user: { name: 'Mr. Venkat (Parent)', role: 'Parent', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop', id: 'P-102' },
    lastMessage: 'We are available this Sunday for the video call.',
    time: '10:30 AM',
    unread: 2,
    isUrgent: true,
    status: 'scheduled', // scheduled call
    messages: [
        { id: 'm1', text: 'Namaste, I have reviewed the profile of Karthik.', sender: 'them', time: 'Yesterday', type: 'text' },
        { id: 'm2', text: 'Excellent. Does the horoscope match your expectations?', sender: 'me', time: 'Yesterday', type: 'text' },
        { id: 'm3', text: 'Yes, looking good. We want to speak to his parents.', sender: 'them', time: '10:30 AM', type: 'text' },
        { id: 'm4', text: 'We are available this Sunday for the video call.', sender: 'them', time: '10:31 AM', type: 'text' }
    ]
  },
  { 
    id: 't2', 
    user: { name: 'Priya Sharma', role: 'Prospect', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop', id: 'C-882' },
    lastMessage: 'Could you please send more details about his job?',
    time: 'Yesterday',
    unread: 0,
    isUrgent: false,
    status: 'active',
    messages: [
        { id: 'm1', text: 'Hi Priya, I sent you a new match.', sender: 'me', time: 'Mon', type: 'text' },
        { id: 'm2', text: 'Could you please send more details about his job?', sender: 'them', time: 'Yesterday', type: 'text' }
    ]
  },
  { 
    id: 't3', 
    user: { name: 'Mrs. Lakshmi', role: 'Parent', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop', id: 'P-331' },
    lastMessage: 'Call ended • 14 mins',
    time: '2d ago',
    unread: 0,
    isUrgent: false,
    status: 'active',
    messages: [
        { id: 'm1', text: 'Call started', sender: 'sys', time: '2d ago', type: 'call_log' },
        { id: 'm2', text: 'Call ended • 14 mins', sender: 'sys', time: '2d ago', type: 'call_log' }
    ]
  }
];

const BrokerCommunication: React.FC = () => {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  const [showScheduler, setShowScheduler] = useState(false);
  const [activeCall, setActiveCall] = useState<{ isActive: boolean, type: 'audio' | 'video', elapsed: number } | null>(null);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  
  // Gemini
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  // Computed
  const activeThread = BROKER_THREADS.find(t => t.id === activeThreadId);
  const filteredThreads = BROKER_THREADS.filter(t => {
      if (filter === 'unread') return t.unread > 0;
      if (filter === 'urgent') return t.isUrgent;
      return true;
  });

  const handleSendMessage = () => {
      if (!messageInput.trim()) return;
      // In a real app, push to message array
      setMessageInput('');
      setAiSuggestion(null);
  };

  const generateAiReply = async () => {
      if (!activeThread) return;
      setAiLoading(true);
      try {
          const apiKey = process.env.API_KEY;
          if (apiKey) {
              const ai = new GoogleGenAI({ apiKey });
              const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
              const lastMsg = activeThread.messages[activeThread.messages.length - 1].text;
              const prompt = `Act as a professional matrimony broker. Draft a polite, encouraging, and concise reply to this message from a ${activeThread.user.role}: "${lastMsg}". Keep it under 30 words.`;
              
              const result = await model.generateContent(prompt);
              setMessageInput(result.response.text());
          } else {
              setMessageInput("Thank you for the update. I will coordinate with the other family and confirm the time shortly.");
          }
      } catch (e) {
          console.error(e);
      } finally {
          setAiLoading(false);
      }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] shadow-xl overflow-hidden relative">
      
      {/* LEFT: Thread List */}
      <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 ${activeThreadId ? 'hidden md:flex' : 'flex'}`}>
         
         {/* Header */}
         <div className="p-4 border-b border-gray-200 dark:border-white/5 space-y-4">
            <div className="flex justify-between items-center">
               <h3 className="font-bold text-lg">Inbox</h3>
               <button className="p-2 bg-white dark:bg-white/5 rounded-full shadow-sm hover:text-purple-600 transition-colors">
                  <Plus size={18} />
               </button>
            </div>
            
            <div className="relative">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input type="text" placeholder="Search clients..." className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-purple-500" />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
               {['all', 'unread', 'urgent'].map(f => (
                  <button 
                     key={f}
                     onClick={() => setFilter(f as any)}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${filter === f ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400'}`}
                  >
                     {f}
                  </button>
               ))}
            </div>
         </div>

         {/* List */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {filteredThreads.map(thread => (
               <div 
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all hover:bg-white dark:hover:bg-white/5 border border-transparent ${activeThreadId === thread.id ? 'bg-white dark:bg-white/5 shadow-sm border-gray-200 dark:border-white/5' : ''}`}
               >
                  <div className="flex justify-between items-start mb-1">
                     <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${thread.unread ? 'bg-purple-500' : 'bg-transparent'}`} />
                        <h4 className={`text-sm font-bold ${thread.unread ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{thread.user.name}</h4>
                        {thread.isUrgent && <AlertTriangle size={12} className="text-red-500" />}
                     </div>
                     <span className="text-[10px] text-gray-400">{thread.time}</span>
                  </div>
                  <div className="flex items-start gap-3 pl-4">
                     <img src={thread.user.img} className="w-10 h-10 rounded-full object-cover shrink-0" />
                     <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500 truncate">{thread.lastMessage}</p>
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-white/10 rounded text-gray-600 dark:text-gray-400 mt-1 inline-block">
                           {thread.user.role}
                        </span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* CENTER: Chat Interface */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-[#0a0a0a] ${!activeThreadId ? 'hidden md:flex' : 'flex'}`}>
         {activeThread ? (
            <>
               {/* Header */}
               <div className="h-16 border-b border-gray-200 dark:border-white/5 flex justify-between items-center px-6 shrink-0">
                  <div className="flex items-center gap-3">
                     <button onClick={() => setActiveThreadId(null)} className="md:hidden"><ArrowLeft size={20} /></button>
                     <img src={activeThread.user.img} className="w-10 h-10 rounded-full object-cover" />
                     <div>
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                           {activeThread.user.name}
                           <Shield size={12} className="text-green-500" />
                        </h3>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                           <Lock size={10} /> Number Masked
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button onClick={() => setActiveCall({ isActive: true, type: 'audio', elapsed: 0 })} className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                        <Phone size={18} />
                     </button>
                     <button onClick={() => setActiveCall({ isActive: true, type: 'video', elapsed: 0 })} className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                        <Video size={18} />
                     </button>
                     <button onClick={() => setRightPanelOpen(!rightPanelOpen)} className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full hidden lg:block transition-colors">
                        <MoreVertical size={18} />
                     </button>
                  </div>
               </div>

               {/* Messages */}
               <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-black/20 custom-scrollbar">
                  {/* System Notice */}
                  <div className="flex justify-center">
                     <span className="text-[10px] bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-900/20 flex items-center gap-1">
                        <Shield size={10} /> This conversation is monitored for quality assurance.
                     </span>
                  </div>

                  {activeThread.messages.map((msg) => (
                     msg.type === 'call_log' ? (
                        <div key={msg.id} className="flex justify-center my-4">
                           <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 dark:bg-white/5 px-4 py-1.5 rounded-full">
                              <Phone size={12} /> {msg.text}
                           </div>
                        </div>
                     ) : (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed ${
                              msg.sender === 'me' 
                              ? 'bg-purple-600 text-white rounded-tr-none' 
                              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none'
                           }`}>
                              {msg.text}
                              <div className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-purple-200' : 'text-gray-400'}`}>{msg.time}</div>
                           </div>
                        </div>
                     )
                  ))}
               </div>

               {/* Input Area */}
               <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
                  
                  {/* AI & Quick Actions */}
                  <div className="flex gap-2 mb-3 overflow-x-auto hide-scrollbar">
                     <button 
                        onClick={generateAiReply}
                        disabled={aiLoading}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold whitespace-nowrap hover:shadow-sm transition-all"
                     >
                        <Sparkles size={12} className={aiLoading ? 'animate-spin' : ''} />
                        {aiLoading ? 'Drafting...' : 'Magic Reply'}
                     </button>
                     <button onClick={() => setShowScheduler(true)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-gray-200">
                        <Calendar size={12} /> Schedule Call
                     </button>
                     <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-gray-200">
                        <Users size={12} /> Host Parent Call
                     </button>
                  </div>

                  <div className="flex items-end gap-2 bg-gray-50 dark:bg-white/5 p-2 rounded-2xl border border-gray-200 dark:border-white/5 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all">
                     <button className="p-2 text-gray-400 hover:text-purple-600"><Plus size={20} /></button>
                     <textarea 
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent border-none outline-none text-sm resize-none max-h-32 py-2 text-gray-900 dark:text-white"
                        rows={1}
                     />
                     <button onClick={handleSendMessage} className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-500/30">
                        <Send size={18} />
                     </button>
                  </div>
               </div>
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
               <MessageSquare size={48} className="mb-4 opacity-20" />
               <p>Select a conversation to start messaging</p>
            </div>
         )}
      </div>

      {/* RIGHT: Context Panel */}
      <AnimatePresence>
         {activeThread && rightPanelOpen && (
            <motion.div 
               initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
               className="hidden lg:flex flex-col border-l border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 overflow-hidden"
            >
               <div className="p-6 border-b border-gray-200 dark:border-white/5 text-center">
                  <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden mb-4 shadow-lg">
                     <img src={activeThread.user.img} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-lg">{activeThread.user.name}</h3>
                  <p className="text-xs text-gray-500">{activeThread.user.id} • {activeThread.user.role}</p>
                  <div className="flex justify-center gap-2 mt-4">
                     <button className="p-2 bg-white dark:bg-white/5 rounded-lg text-purple-600 hover:scale-110 transition-transform"><User size={18} /></button>
                     <button className="p-2 bg-white dark:bg-white/5 rounded-lg text-purple-600 hover:scale-110 transition-transform"><FileText size={18} /></button>
                     <button className="p-2 bg-white dark:bg-white/5 rounded-lg text-purple-600 hover:scale-110 transition-transform"><Calendar size={18} /></button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Notes */}
                  <div>
                     <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-1"><PenTool size={12} /> Broker Notes</h4>
                     <textarea 
                        className="w-full h-24 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl p-3 text-xs text-gray-700 dark:text-gray-300 resize-none outline-none focus:border-yellow-400"
                        placeholder="Add private notes about this client..."
                     />
                  </div>

                  {/* Upcoming */}
                  <div>
                     <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-1"><Clock size={12} /> Next Interaction</h4>
                     <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-200 dark:border-white/5 flex items-center gap-3">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 font-bold text-center min-w-[40px]">
                           <span className="block text-[10px] uppercase">Sun</span>
                           <span className="block text-sm">15</span>
                        </div>
                        <div>
                           <p className="text-xs font-bold">Video Call</p>
                           <p className="text-[10px] text-gray-500">10:30 AM with Parents</p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* OVERLAY: ACTIVE CALL */}
      <AnimatePresence>
         {activeCall && (
            <motion.div 
               initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
               className="absolute bottom-6 right-6 w-80 bg-gray-900 text-white rounded-3xl shadow-2xl overflow-hidden z-50 border border-white/10"
            >
               <div className="h-40 bg-gradient-to-b from-purple-900 to-black relative flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/10 mb-2 relative">
                     <img src={activeThread?.user.img} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-purple-500/20 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-lg">{activeThread?.user.name}</h4>
                  <p className="text-xs text-purple-300 animate-pulse">00:45 • Secure Line</p>
               </div>
               
               <div className="p-6">
                  {/* Quick Note during call */}
                  <textarea 
                     className="w-full bg-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 outline-none mb-6 resize-none h-20" 
                     placeholder="Take call notes here..."
                  />
                  
                  <div className="flex justify-between items-center px-4">
                     <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><MicOff size={20} /></button>
                     <button onClick={() => setActiveCall(null)} className="p-4 bg-red-500 rounded-full shadow-lg hover:scale-110 transition-transform"><PhoneOff size={24} fill="white" /></button>
                     <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><VideoOff size={20} /></button>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* MODAL: SCHEDULER */}
      <AnimatePresence>
         {showScheduler && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <motion.div 
                  initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                  className="bg-white dark:bg-[#1a1a1a] p-6 rounded-3xl shadow-2xl w-full max-w-md"
               >
                  <h3 className="font-bold text-xl mb-4">Schedule Appointment</h3>
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 rounded-xl border-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-bold text-sm flex flex-col items-center gap-2">
                           <Video size={24} /> Video Call
                        </button>
                        <button className="p-4 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 font-bold text-sm flex flex-col items-center gap-2 hover:bg-gray-50">
                           <Phone size={24} /> Voice Call
                        </button>
                     </div>
                     <AnimatedInput label="Date" type="date" />
                     <AnimatedInput label="Time" type="time" />
                     <AnimatedTextArea label="Topic / Agenda" placeholder="Discussing updated profile..." />
                     
                     <div className="flex gap-3 pt-2">
                        <button onClick={() => setShowScheduler(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
                        <PremiumButton onClick={() => setShowScheduler(false)} className="flex-1">Confirm Schedule</PremiumButton>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};

export default BrokerCommunication;
