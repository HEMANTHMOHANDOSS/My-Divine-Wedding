
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Plus, Filter, Search, MoreHorizontal } from 'lucide-react';
import { MOCK_EVENTS } from '../../utils/adminData';
import PremiumButton from '../ui/PremiumButton';

const AdminEvents = () => {
  const [view, setView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Calendar className="text-orange-500" /> Event Management</h2>
        <div className="flex gap-2">
           <PremiumButton icon={<Plus size={16} />} className="!py-2 !px-4 !text-sm">Create Event</PremiumButton>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
         <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
            <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-sm font-bold ${view === 'list' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-500'}`}>List View</button>
            <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-lg text-sm font-bold ${view === 'calendar' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-500'}`}>Calendar</button>
         </div>
         <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
               type="text" 
               placeholder="Search events..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-sm outline-none"
            />
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_EVENTS.map(event => (
               <div key={event.id} className="group bg-white dark:bg-[#121212] rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/5 shadow-lg hover:shadow-xl transition-all">
                  <div className="h-48 relative overflow-hidden">
                     <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {event.type}
                     </div>
                     <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold text-white ${event.status === 'Upcoming' ? 'bg-green-500' : 'bg-gray-500'}`}>
                        {event.status}
                     </div>
                  </div>
                  <div className="p-6">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{event.title}</h3>
                        <button className="text-gray-400 hover:text-purple-600"><MoreHorizontal size={20} /></button>
                     </div>
                     <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                           <Calendar size={16} /> {event.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                           <MapPin size={16} /> {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                           <Users size={16} /> {event.attendees} Registered
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">Edit</button>
                        <button className="flex-1 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl text-xs font-bold hover:bg-purple-100 transition-colors">View RSVPs</button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AdminEvents;
