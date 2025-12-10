
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, Video, Phone, Users, MapPin, 
  Plus, ChevronLeft, ChevronRight, MoreVertical, X, CheckCircle, 
  Shield, FileText, Sparkles, AlertCircle, Mic, VideoOff, MicOff, PhoneOff
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput, AnimatedTextArea, AnimatedSelect } from '../profile/ProfileFormElements';
import { MOCK_CLIENTS } from '../../utils/mockData';

// Mock Appointments Data
const INITIAL_APPOINTMENTS = [
  { id: 'apt1', title: 'Video Call: Arjun & Priya', type: 'video', start: '10:00', duration: 60, day: 1, status: 'confirmed', participants: ['Arjun', 'Priya'] },
  { id: 'apt2', title: 'Parent Meeting: Mr. Rao', type: 'in-person', start: '14:00', duration: 90, day: 2, status: 'pending', participants: ['Mr. Rao'] },
  { id: 'apt3', title: 'Intro Call: Sneha', type: 'audio', start: '11:00', duration: 30, day: 3, status: 'confirmed', participants: ['Sneha'] },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const BrokerAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [showModal, setShowModal] = useState(false);
  const [activeCall, setActiveCall] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<{day: number, time: string} | null>(null);
  const [aiAgenda, setAiAgenda] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: 'video',
    client: '',
    prospect: '',
    date: '',
    time: '',
    notes: ''
  });

  const handleSlotClick = (dayIdx: number, time: string) => {
    setSelectedSlot({ day: dayIdx, time });
    setFormData(prev => ({ ...prev, time, date: `2024-10-${20 + dayIdx}` })); // Mock date logic
    setShowModal(true);
  };

  const generateAgenda = async () => {
    setIsGenerating(true);
    try {
        // Mock Gemini Call
        setTimeout(() => {
            setAiAgenda("1. Introduction & Family Background\n2. Discuss Career Aspirations\n3. Horoscope Compatibility Review\n4. Next Steps");
            setIsGenerating(false);
        }, 1500);
    } catch (e) { setIsGenerating(false); }
  };

  const handleSchedule = () => {
    const newApt = {
        id: `apt-${Date.now()}`,
        title: `${formData.type === 'video' ? 'Video' : 'Call'}: ${formData.client}`,
        type: formData.type,
        start: formData.time,
        duration: 60,
        day: selectedSlot?.day || 0,
        status: 'pending',
        participants: [formData.client]
    };
    setAppointments([...appointments, newApt as any]);
    setShowModal(false);
  };

  const getTypeStyles = (type: string) => {
      switch(type) {
          case 'video': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
          case 'audio': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
          case 'in-person': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="text-purple-600" /> Appointments
          </h2>
          <p className="text-gray-500 text-sm">Manage meetings and schedule calls.</p>
        </div>
        <div className="flex gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 mr-4">
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Video</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Voice</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div> In-Person</span>
            </div>
            <PremiumButton onClick={() => setShowModal(true)} icon={<Plus size={18} />}>New Meeting</PremiumButton>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 bg-white dark:bg-[#121212] rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col shadow-xl">
         {/* Days Header */}
         <div className="grid grid-cols-8 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
            <div className="p-4 border-r border-gray-200 dark:border-white/5 text-center font-bold text-gray-400 text-xs uppercase tracking-wider">Time</div>
            {DAYS.map((day, i) => (
                <div key={day} className={`p-4 text-center font-bold text-sm ${i === 1 ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/10' : 'text-gray-600 dark:text-gray-300'}`}>
                    {day} <span className="block text-xs font-normal text-gray-400">Oct {20+i}</span>
                </div>
            ))}
         </div>

         {/* Time Slots */}
         <div className="flex-1 overflow-y-auto custom-scrollbar">
            {TIMES.map((time) => (
                <div key={time} className="grid grid-cols-8 min-h-[100px] border-b border-gray-100 dark:border-white/5">
                    <div className="p-4 border-r border-gray-100 dark:border-white/5 text-xs text-gray-400 font-mono text-center pt-2">
                        {time}
                    </div>
                    {DAYS.map((_, dayIdx) => {
                        const apt = appointments.find(a => a.day === dayIdx && a.start === time);
                        return (
                            <div 
                                key={`${dayIdx}-${time}`} 
                                onClick={() => !apt && handleSlotClick(dayIdx, time)}
                                className={`relative p-1 border-r border-gray-100 dark:border-white/5 transition-colors ${!apt ? 'hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer' : ''}`}
                            >
                                {apt && (
                                    <motion.div 
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={`h-full rounded-xl p-2 text-xs border ${getTypeStyles(apt.type)} cursor-pointer shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
                                        onClick={(e) => { e.stopPropagation(); if(apt.type !== 'in-person') setActiveCall(apt); }}
                                    >
                                        <div className="font-bold truncate">{apt.title}</div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="flex items-center gap-1 opacity-80">
                                                {apt.type === 'video' ? <Video size={10} /> : apt.type === 'audio' ? <Phone size={10} /> : <Users size={10} />}
                                                {apt.type}
                                            </span>
                                            {apt.status === 'confirmed' && <CheckCircle size={12} />}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
         </div>
      </div>

      {/* SCHEDULE MODAL */}
      <AnimatePresence>
         {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
               <motion.div initial={{ scale: 0.95, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 50 }} className="relative w-full max-w-lg bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl p-8 border border-white/10">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold">Schedule Meeting</h3>
                     <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"><X size={20} /></button>
                  </div>

                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <AnimatedSelect 
                           label="Meeting Type" 
                           value={formData.type} 
                           onChange={e => setFormData({...formData, type: e.target.value})}
                           options={[{value:'video', label:'Video Call'}, {value:'audio', label:'Voice Call'}, {value:'in-person', label:'In-Person'}]} 
                        />
                        <AnimatedSelect 
                           label="Select Client" 
                           value={formData.client} 
                           onChange={e => setFormData({...formData, client: e.target.value})}
                           options={MOCK_CLIENTS.map(c => ({value: c.name, label: c.name}))} 
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <AnimatedInput label="Date" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                        <AnimatedInput label="Time" type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                     </div>
                     
                     <div className="relative">
                        <AnimatedTextArea label="Agenda / Notes" value={aiAgenda || formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                        <button 
                           onClick={generateAgenda}
                           disabled={isGenerating}
                           className="absolute top-2 right-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 px-2 py-1 rounded flex items-center gap-1 hover:bg-purple-200 transition-colors"
                        >
                           <Sparkles size={12} /> {isGenerating ? 'Generating...' : 'AI Agenda'}
                        </button>
                     </div>

                     <PremiumButton onClick={handleSchedule} width="full" variant="gradient">Confirm Schedule</PremiumButton>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* CALL LAUNCH SCREEN */}
      <AnimatePresence>
         {activeCall && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center text-white">
               <div className="absolute top-8 left-8 flex items-center gap-2">
                  <Shield className="text-green-500" />
                  <span className="text-sm font-bold text-green-500">Secure Line • Masked Identity</span>
               </div>
               
               <div className="relative mb-8">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 relative z-10">
                     <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
               </div>
               
               <h2 className="text-3xl font-bold mb-2">{activeCall.participants[0]}</h2>
               <p className="text-gray-400 mb-12">Connecting via secure bridge...</p>

               <div className="flex items-center gap-6">
                  <button className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><MicOff size={24} /></button>
                  <button onClick={() => setActiveCall(null)} className="p-6 bg-red-600 rounded-full hover:bg-red-700 transition-colors shadow-xl shadow-red-600/30 transform hover:scale-110">
                     <PhoneOff size={32} />
                  </button>
                  <button className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><VideoOff size={24} /></button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default BrokerAppointments;
