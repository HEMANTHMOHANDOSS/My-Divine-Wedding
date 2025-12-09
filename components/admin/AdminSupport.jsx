
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Search, MessageSquare, Send, Sparkles, User, Clock, AlertCircle } from 'lucide-react';
import { MOCK_TICKETS } from '../../utils/adminData';
import { GoogleGenAI } from "@google/genai";

const AdminSupport = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiReply = async () => {
    if (!selectedTicket) return;
    setAiLoading(true);
    
    try {
       const apiKey = process.env.API_KEY;
       if (apiKey) {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: `Generate a polite, professional customer support reply for a matrimony site user. 
             User Name: ${selectedTicket.user}
             Issue Category: ${selectedTicket.category}
             Subject: ${selectedTicket.subject}
             User Message: ${selectedTicket.messages[0].text}
             Keep it concise and empathetic.`
          });
          setReply(response.text || "Could not generate reply.");
       } else {
          // Fallback
          setReply(`Hello ${selectedTicket.user},\n\nThank you for reaching out regarding your ${selectedTicket.category.toLowerCase()} issue. We apologize for the inconvenience. Our team is looking into this with priority and will resolve it shortly.\n\nBest Regards,\nSupport Team`);
       }
    } catch (e) {
       console.error(e);
    } finally {
       setAiLoading(false);
    }
  };

  return (
    <div className="flex h-full gap-6">
       {/* Ticket List */}
       <div className="w-1/3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-white/5">
             <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                   type="text" placeholder="Search tickets..." 
                   className="w-full bg-gray-50 dark:bg-white/5 rounded-xl pl-9 pr-4 py-2 text-sm outline-none"
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
             {MOCK_TICKETS.map(ticket => (
                <div 
                   key={ticket.id} 
                   onClick={() => setSelectedTicket(ticket)}
                   className={`p-4 rounded-xl cursor-pointer transition-colors border ${selectedTicket?.id === ticket.id ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                   <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{ticket.user}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ticket.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{ticket.priority}</span>
                   </div>
                   <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{ticket.subject}</p>
                   <p className="text-xs text-gray-500 truncate">{ticket.messages[0].text}</p>
                </div>
             ))}
          </div>
       </div>

       {/* Conversation Area */}
       <div className="flex-1 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] shadow-sm flex flex-col overflow-hidden">
          {selectedTicket ? (
             <>
                <div className="p-6 border-b border-gray-200 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
                   <div>
                      <h3 className="font-bold text-lg">{selectedTicket.subject}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                         <span className="flex items-center gap-1"><User size={12} /> {selectedTicket.user}</span>
                         <span className="flex items-center gap-1"><Clock size={12} /> Last updated: {selectedTicket.lastUpdated}</span>
                         <span className="bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded">{selectedTicket.category}</span>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button className="px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold hover:bg-white dark:hover:bg-white/5">Close Ticket</button>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/30 dark:bg-black/20">
                   {selectedTicket.messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                         <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5' : 'bg-purple-600 text-white'}`}>
                            {msg.text}
                         </div>
                      </div>
                   ))}
                </div>

                <div className="p-4 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-white/5">
                   <div className="relative">
                      <textarea 
                         value={reply}
                         onChange={(e) => setReply(e.target.value)}
                         placeholder="Type your reply..."
                         className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 pr-12 text-sm outline-none min-h-[100px]"
                      />
                      <div className="absolute bottom-3 right-3 flex gap-2">
                         <button 
                            onClick={handleAiReply}
                            disabled={aiLoading}
                            className="p-2 text-purple-600 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                            title="Generate AI Reply"
                         >
                            <Sparkles size={18} className={aiLoading ? 'animate-pulse' : ''} />
                         </button>
                         <button className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg">
                            <Send size={18} />
                         </button>
                      </div>
                   </div>
                </div>
             </>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <HelpCircle size={48} className="mb-4 opacity-20" />
                <p>Select a ticket to view details</p>
             </div>
          )}
       </div>
    </div>
  );
};

export default AdminSupport;
