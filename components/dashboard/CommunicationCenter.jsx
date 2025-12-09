
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Phone, Video, Search, MoreVertical, Send, Mic, Image, Smile, 
  Check, CheckCheck, Clock, ArrowLeft, X, User, Heart, UserPlus, PhoneOff, MicOff, VideoOff,
  Shield, CheckCircle, XCircle
} from 'lucide-react';
import { MOCK_CHATS, MOCK_CALL_LOGS, MOCK_REQUESTS } from '../../utils/mockData';
import AudioProfile from './AudioProfile';

const CommunicationCenter= ({ mode = 'user' }) => {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Call State
  const [activeCall, setActiveCall] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startCall = (type, user) => {
    setActiveCall({ type, user, status: 'ringing' });
    setTimeout(() => {
        setActiveCall(prev => prev ? { ...prev, status: 'connected' } : null);
    }, 3000); // Simulate connection after 3s
  };

  const endCall = () => {
    setActiveCall(null);
  };

  const tabs = [
    { id: 'chats', icon: MessageCircle, label: 'Chats' },
    { id: 'calls', icon: Phone, label: 'Calls' },
    { id: 'requests', icon: UserPlus, label: 'Requests' }
  ];

  if (mode === 'parent') {
    tabs.push({ id: 'approvals', icon: Shield, label: 'Approvals' });
  }

  return (
    <div className="h-[calc(100vh-140px)] min-h-[600px] bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex relative">
      
      {/* SIDEBAR LIST */}
      <div className={`
        w-full md:w-80 flex flex-col border-r border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/20
        ${selectedChatId && isMobileView ? 'hidden' : 'block'}
      `}>
        {/* Header Tabs */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
           {mode === 'parent' && (
              <div className="mb-2 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded flex items-center gap-1">
                 <Shield size={12} /> Parent Oversight Mode
              </div>
           )}
           <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl mb-4 overflow-x-auto">
              {tabs.map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex-1 min-w-[70px] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                      activeTab === tab.id 
                      ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                   }`}
                 >
                    <tab.icon size={14} /> {tab.label}
                 </button>
              ))}
           </div>
           
           <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-purple-500/50 transition-colors"
              />
           </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {activeTab === 'chats' && (
              <ChatList 
                 chats={MOCK_CHATS} 
                 searchTerm={searchTerm} 
                 selectedId={selectedChatId} 
                 onSelect={(id) => setSelectedChatId(id)} 
              />
           )}
           {activeTab === 'calls' && <CallLogList logs={MOCK_CALL_LOGS} />}
           {activeTab === 'requests' && <RequestList requests={MOCK_REQUESTS} />}
           {activeTab === 'approvals' && <ApprovalList />}
        </div>
      </div>

      {/* ACTIVE VIEW */}
      <div className={`
         flex-1 flex flex-col bg-white/30 dark:bg-transparent
         ${!selectedChatId && isMobileView ? 'hidden' : 'block'}
      `}>
         {selectedChatId ? (
            <ChatInterface 
               chatId={selectedChatId} 
               onBack={() => setSelectedChatId(null)}
               onCall={(type) => startCall(type, MOCK_CHATS.find(c => c.id === selectedChatId)?.user)}
               mode={mode}
            />
         ) : activeTab === 'requests' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
               <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 mb-4">
                  <UserPlus size={40} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">Connection Requests</h3>
               <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">Manage incoming interests here. Accept to start a conversation.</p>
            </div>
         ) : activeTab === 'approvals' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
               <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center text-amber-600 mb-4">
                  <Shield size={40} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pending Approvals</h3>
               <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">Review message requests before your child can see or reply to them.</p>
            </div>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
               <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <MessageCircle size={40} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select a conversation</h3>
               <p className="text-gray-500 dark:text-gray-400 mt-2">Choose a chat from the list or start a new one.</p>
            </div>
         )}
      </div>

      {/* CALL OVERLAY */}
      <AnimatePresence>
         {activeCall && (
            <CallOverlay 
               type={activeCall.type} 
               user={activeCall.user} 
               status={activeCall.status} 
               onEnd={endCall} 
               isParent={mode === 'parent'}
            />
         )}
      </AnimatePresence>

    </div>
  );
};

// --- SUB-COMPONENTS ---

const ApprovalList = () => {
   const pending = [
      { id: 1, name: "Ravi Kumar", msg: "Hi, I'm interested in connecting.", time: "10m ago" },
      { id: 2, name: "Suresh P", msg: "Can we discuss further?", time: "1h ago" },
   ];

   return (
      <div className="p-2 space-y-3">
         {pending.map(p => (
            <div key={p.id} className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/20">
               <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{p.name}</h4>
                  <span className="text-[10px] text-gray-500">{p.time}</span>
               </div>
               <p className="text-xs text-gray-600 dark:text-gray-300 italic mb-3">"{p.msg}"</p>
               <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 flex items-center justify-center gap-1">
                     <CheckCircle size={12} /> Approve
                  </button>
                  <button className="flex-1 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 flex items-center justify-center gap-1">
                     <XCircle size={12} /> Block
                  </button>
               </div>
            </div>
         ))}
         {pending.length === 0 && <p className="text-center text-gray-500 text-xs py-4">No pending approvals.</p>}
      </div>
   )
}

const ChatList = ({ chats, searchTerm, selectedId, onSelect }) => (
   <div className="p-2 space-y-1">
      {chats.filter(c => c.user.name.toLowerCase().includes(searchTerm.toLowerCase())).map(chat => (
         <div 
            key={chat.id} 
            onClick={() => onSelect(chat.id)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors group ${selectedId === chat.id ? 'bg-purple-50 dark:bg-purple-900/20' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
         >
            <div className="relative shrink-0">
               <img src={chat.user.img} alt={chat.user.name} className="w-12 h-12 rounded-full object-cover" />
               {chat.user.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-black rounded-full" />}
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className={`font-bold text-sm truncate ${selectedId === chat.id ? 'text-purple-900 dark:text-purple-300' : 'text-gray-900 dark:text-white'}`}>{chat.user.name}</h4>
                  <span className="text-[10px] text-gray-400">{chat.lastTime}</span>
               </div>
               <p className="text-xs text-gray-500 dark:text-gray-400 truncate pr-4">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
               <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  {chat.unread}
               </div>
            )}
         </div>
      ))}
   </div>
);

const CallLogList = ({ logs }) => (
   <div className="p-2 space-y-2">
      {logs.map(log => (
         <div key={log.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-full ${log.missed ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'} dark:bg-white/10`}>
                  {log.type === 'audio' ? <Phone size={16} /> : <Video size={16} />}
               </div>
               <div>
                  <h4 className={`font-bold text-sm ${log.missed ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{log.name}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                     {log.direction === 'outgoing' ? 'Outgoing' : 'Incoming'} • {log.time}
                  </p>
               </div>
            </div>
            <span className="text-xs font-mono text-gray-400">{log.duration}</span>
         </div>
      ))}
   </div>
);

const RequestList = ({ requests }) => (
   <div className="p-2 space-y-3">
      {requests.map(req => (
         <div key={req.id} className="bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
               <img src={req.img} alt={req.name} className="w-10 h-10 rounded-full object-cover" />
               <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{req.name}</h4>
                  <p className="text-xs text-gray-500">{req.profession}, {req.location}</p>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="flex-1 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700">Accept</button>
               <button className="flex-1 py-1.5 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-200">Decline</button>
            </div>
         </div>
      ))}
   </div>
);

const ChatInterface = ({ chatId, onBack, onCall, mode }) => {
   const chat = MOCK_CHATS.find(c => c.id === chatId);
   const [message, setMessage] = useState('');
   const messagesEndRef = useRef(null);

   if (!chat) return null;

   return (
      <div className="flex flex-col h-full">
         {/* Chat Header */}
         <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md">
            <div className="flex items-center gap-3">
               <button onClick={onBack} className="md:hidden p-2 -ml-2 text-gray-500 hover:text-purple-600"><ArrowLeft size={20} /></button>
               <div className="relative">
                  <img src={chat.user.img} alt={chat.user.name} className="w-10 h-10 rounded-full object-cover" />
                  {chat.user.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-black rounded-full" />}
               </div>
               <div>
                  <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{chat.user.name}</h3>
                  <p className="text-xs text-green-500 font-medium">{chat.user.online ? 'Online' : 'Offline'}</p>
               </div>
            </div>
            <div className="flex gap-2">
               <button onClick={() => onCall('audio')} className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                  <Phone size={18} />
               </button>
               <button onClick={() => onCall('video')} className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                  <Video size={18} />
               </button>
               <button className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                  <MoreVertical size={18} />
               </button>
            </div>
         </div>

         {/* Audio Intro Section (Top) */}
         <div className="px-4 py-2 bg-gray-50/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Audio Intro</span>
               <div className="h-px bg-gray-200 dark:bg-white/10 flex-1" />
            </div>
            <div className="mt-2 scale-90 origin-left">
               <AudioProfile />
            </div>
         </div>

         {/* Messages */}
         <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/30 dark:bg-black/10">
            {chat.messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                     msg.sender === 'me' 
                     ? 'bg-purple-600 text-white rounded-tr-none' 
                     : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5'
                  }`}>
                     <p className="text-sm leading-relaxed">{msg.text}</p>
                     <div className={`flex items-center gap-1 justify-end mt-1 text-[10px] ${msg.sender === 'me' ? 'text-purple-200' : 'text-gray-400'}`}>
                        <span>{msg.time}</span>
                        {msg.sender === 'me' && (
                           msg.status === 'read' ? <CheckCheck size={12} /> : <Check size={12} />
                        )}
                     </div>
                  </div>
               </div>
            ))}
            <div ref={messagesEndRef} />
         </div>

         {/* Input Area */}
         <div className="p-4 pr-24 bg-white dark:bg-black/20 border-t border-gray-200 dark:border-white/10">
            {mode === 'parent' && (
               <div className="text-xs text-center text-amber-600 mb-2 font-bold bg-amber-50 dark:bg-amber-900/10 py-1 rounded">
                  Parent Mode: Messages monitored
               </div>
            )}
            <div className="flex items-end gap-2 bg-gray-100 dark:bg-white/5 p-2 rounded-2xl">
               <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors"><Smile size={20} /></button>
               <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none outline-none text-sm resize-none py-2 max-h-24 text-gray-900 dark:text-white placeholder-gray-400"
                  rows={1}
               />
               <div className="flex gap-1">
                  <button className="p-2 text-gray-400 hover:text-purple-600"><Image size={20} /></button>
                  <button className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all active:scale-95">
                     {message.trim() ? <Send size={18} /> : <Mic size={18} />}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

const CallOverlay = ({ type, user, status, onEnd, isParent }) => {
   return (
      <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
         className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center text-white"
      >
         <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 mb-6 relative z-10">
               <img src={user.img} alt={user.name} className="w-full h-full object-cover" />
            </div>
            {status === 'ringing' && (
               <>
                  <motion.div animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 rounded-full bg-purple-500/50 -z-10" />
                  <motion.div animate={{ scale: [1, 2], opacity: [0.3, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }} className="absolute inset-0 rounded-full bg-purple-500/30 -z-10" />
               </>
            )}
         </div>

         {isParent && (
            <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-4 animate-pulse">
               Parent-to-Parent Call
            </div>
         )}

         <h2 className="text-3xl font-display font-bold mb-2">{user.name}</h2>
         <p className="text-purple-300 animate-pulse mb-12 capitalize">{status}...</p>

         <div className="flex items-center gap-6">
            <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"><MicOff size={24} /></button>
            <button 
               onClick={onEnd}
               className="p-6 rounded-full bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/30 transform hover:scale-110 transition-all"
            >
               <PhoneOff size={32} fill="currentColor" />
            </button>
            <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
               {type === 'video' ? <VideoOff size={24} /> : <User size={24} />}
            </button>
         </div>
         
         <div className="absolute bottom-8 text-xs text-white/30 flex items-center gap-2">
            <Shield size={12} /> Secure Line • End-to-end encrypted
         </div>
      </motion.div>
   )
}

export default CommunicationCenter;
