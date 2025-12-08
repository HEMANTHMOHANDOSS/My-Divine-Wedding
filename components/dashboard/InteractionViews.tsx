
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Heart, Star, Clock, Calendar, Eye, UserCheck, X, Check, 
  MessageCircle, MapPin, Filter, Search, ArrowRight, UserPlus 
} from 'lucide-react';
import { Profile, ActivityLog, Visitor, MOCK_EVENTS } from '../../utils/mockData';
import { MatchCard } from './DashboardWidgets';
import PremiumButton from '../ui/PremiumButton';

// --- SHARED HEADER ---
const PageHeader: React.FC<{ title: string; subtitle: string; icon: React.ReactNode }> = ({ title, subtitle, icon }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
    <div>
      <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
        {icon} {title}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
    </div>
  </div>
);

// --- CONNECTIONS VIEW ---
export const ConnectionsView: React.FC<{ 
  requests: any[]; 
  onAccept: (id: string) => void; 
  onDecline: (id: string) => void;
  onViewProfile: (profile: Profile) => void;
}> = ({ requests, onAccept, onDecline, onViewProfile }) => {
  const [tab, setTab] = useState<'received' | 'sent'>('received');

  return (
    <div className="space-y-6">
      <PageHeader title="Connections" subtitle="Manage your connection requests." icon={<Users className="text-purple-600 dark:text-gold-400" size={32} />} />
      
      <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-fit">
        <button onClick={() => setTab('received')} className={`px-6 py-2 rounded-lg text-sm font-bold ${tab === 'received' ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow' : 'text-gray-500'}`}>Received</button>
        <button onClick={() => setTab('sent')} className={`px-6 py-2 rounded-lg text-sm font-bold ${tab === 'sent' ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow' : 'text-gray-500'}`}>Sent</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tab === 'received' && requests.length === 0 && (
           <div className="col-span-full py-20 text-center text-gray-500">No pending requests received.</div>
        )}
        {tab === 'received' && requests.map((req) => (
          <motion.div 
            key={req.id} 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex gap-4">
              <img src={req.img} alt={req.name} className="w-16 h-16 rounded-xl object-cover cursor-pointer" onClick={() => onViewProfile(req)} />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{req.name}, {req.age}</h4>
                <p className="text-xs text-gray-500">{req.profession}</p>
                <p className="text-xs text-gray-400">{req.location}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => onAccept(req.id)} className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700">Accept</button>
              <button onClick={() => onDecline(req.id)} className="flex-1 py-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-200">Decline</button>
            </div>
          </motion.div>
        ))}
        {tab === 'sent' && (
           <div className="col-span-full py-20 text-center text-gray-500 bg-white/40 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
              <UserPlus size={48} className="mx-auto mb-4 opacity-50" />
              <p>You haven't sent any requests yet.</p>
              <p className="text-xs mt-2">Start searching to find matches!</p>
           </div>
        )}
      </div>
    </div>
  );
};

// --- INTERESTS VIEW ---
export const InterestsView: React.FC<{ 
  interests: any[]; 
  onViewProfile: (profile: Profile) => void; 
}> = ({ interests, onViewProfile }) => {
  const [tab, setTab] = useState<'received' | 'sent'>('received');

  return (
    <div className="space-y-6">
      <PageHeader title="Interests" subtitle="See who's interested in you." icon={<Heart className="text-pink-500" size={32} />} />
      
      <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-fit">
        <button onClick={() => setTab('received')} className={`px-6 py-2 rounded-lg text-sm font-bold ${tab === 'received' ? 'bg-white dark:bg-gray-800 text-pink-600 dark:text-white shadow' : 'text-gray-500'}`}>Received</button>
        <button onClick={() => setTab('sent')} className={`px-6 py-2 rounded-lg text-sm font-bold ${tab === 'sent' ? 'bg-white dark:bg-gray-800 text-pink-600 dark:text-white shadow' : 'text-gray-500'}`}>Sent</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Mock Data Check */}
         {interests.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-500 bg-white/40 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
               <Heart size={48} className="mx-auto mb-4 opacity-50 text-pink-400" />
               <p>No interests {tab} yet.</p>
            </div>
         ) : (
            interests.map((profile) => (
               <motion.div 
                  key={profile.id}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => onViewProfile(profile)}
               >
                  <img src={profile.img} alt={profile.name} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                     <h4 className="font-bold text-gray-900 dark:text-white">{profile.name}</h4>
                     <p className="text-xs text-gray-500">{profile.occupation}</p>
                     <span className="text-[10px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">Interest Expressed</span>
                  </div>
               </motion.div>
            ))
         )}
      </div>
    </div>
  );
};

// --- SHORTLIST VIEW ---
export const ShortlistView: React.FC<{ 
  shortlisted: Profile[]; 
  onConnect: (p: Profile) => void;
  onRemove: (id: string) => void;
  onViewProfile: (p: Profile) => void;
}> = ({ shortlisted, onConnect, onRemove, onViewProfile }) => {
  return (
    <div className="space-y-6">
      <PageHeader title="Shortlisted Profiles" subtitle="Profiles you have saved for later." icon={<Star className="text-amber-500" size={32} />} />
      
      {shortlisted.length === 0 ? (
         <div className="py-20 text-center text-gray-500 bg-white/40 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
            <Star size={48} className="mx-auto mb-4 opacity-50 text-amber-400" />
            <p>Your shortlist is empty.</p>
            <p className="text-xs mt-2">Tap the star icon on profiles to save them here.</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
            {shortlisted.map((profile, idx) => (
               <MatchCard 
                  key={profile.id} 
                  match={{...profile, job: profile.occupation, image: profile.img}} 
                  delay={idx * 0.05}
                  // We would ideally pass specific handlers here like "Remove from Shortlist"
                  // For now reusing MatchCard structure
               />
            ))}
         </div>
      )}
    </div>
  );
};

// --- ACTIVITY VIEW ---
export const ActivityView: React.FC<{ activityLog: ActivityLog[] }> = ({ activityLog }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader title="Activity Timeline" subtitle="Your recent interactions and history." icon={<Clock className="text-blue-500" size={32} />} />
      
      <div className="bg-white/60 dark:bg-white/5 rounded-[2.5rem] p-8 border border-white/20 dark:border-white/10 shadow-xl relative">
         <div className="absolute top-8 left-8 bottom-8 w-0.5 bg-gray-200 dark:bg-white/10" />
         
         <div className="space-y-8">
            {activityLog.length === 0 && <p className="text-center text-gray-500 pl-8">No activity recorded yet.</p>}
            {activityLog.map((log) => (
               <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="relative pl-10 group"
               >
                  <div className={`absolute left-[-5px] top-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                     log.type === 'connect' ? 'bg-purple-600' : 
                     log.type === 'interest' ? 'bg-pink-500' :
                     log.type === 'shortlist' ? 'bg-amber-500' : 'bg-gray-400'
                  }`} />
                  
                  <div className="bg-white dark:bg-black/20 p-4 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-purple-200 transition-colors">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                           {log.profileImage && <img src={log.profileImage} className="w-10 h-10 rounded-full object-cover" />}
                           <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                 {log.description} 
                                 {log.profileName && <span className="text-purple-600 dark:text-gold-400"> • {log.profileName}</span>}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{log.type}</p>
                           </div>
                        </div>
                        <span className="text-xs font-mono text-gray-400">{log.timestamp}</span>
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
};

// --- EVENTS VIEW ---
export const EventsView: React.FC = () => {
   return (
      <div className="space-y-8">
         <PageHeader title="Community Events" subtitle="Meetups, webinars, and gatherings." icon={<Calendar className="text-orange-500" size={32} />} />
         
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_EVENTS.map((event, idx) => (
               <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-[#121212] rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 dark:border-white/5 group hover:shadow-2xl transition-all duration-500"
               >
                  <div className="h-48 overflow-hidden relative">
                     <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {event.type}
                     </div>
                     <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold text-white ${event.status === 'Upcoming' ? 'bg-green-500' : 'bg-gray-500'}`}>
                        {event.status}
                     </div>
                  </div>
                  <div className="p-6">
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                     <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                           <Calendar size={16} /> {event.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                           <MapPin size={16} /> {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                           <Users size={16} /> {event.attendees} Attending
                        </div>
                     </div>
                     <PremiumButton width="full" variant={event.status === 'Upcoming' ? 'gradient' : 'secondary'}>
                        {event.status === 'Upcoming' ? 'Register Now' : 'View Highlights'}
                     </PremiumButton>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>
   );
};

// --- VISITORS VIEW ---
export const VisitorsView: React.FC<{ visitors: Visitor[] }> = ({ visitors }) => {
   return (
      <div className="space-y-6">
         <PageHeader title="Recent Visitors" subtitle="See who viewed your profile." icon={<Eye className="text-blue-500" size={32} />} />
         
         <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-6 shadow-xl">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-gray-200 dark:border-white/10 text-left text-xs font-bold uppercase text-gray-500">
                        <th className="pb-4 pl-4">Profile</th>
                        <th className="pb-4">Details</th>
                        <th className="pb-4">Visit Time</th>
                        <th className="pb-4">Count</th>
                        <th className="pb-4">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {visitors.map((v) => (
                        <tr key={v.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors group">
                           <td className="py-4 pl-4">
                              <div className="flex items-center gap-3">
                                 <img src={v.profile.img} className="w-12 h-12 rounded-full object-cover" />
                                 <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{v.profile.name}</p>
                                    <p className="text-xs text-gray-500">{v.profile.id}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                              {v.profile.age} Yrs, {v.profile.occupation}
                           </td>
                           <td className="py-4 text-sm text-gray-500 font-mono">
                              {v.visitTime}
                           </td>
                           <td className="py-4 text-sm font-bold text-purple-600 dark:text-gold-400">
                              {v.visitCount}x
                           </td>
                           <td className="py-4">
                              <button className="text-xs font-bold text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 border border-purple-200 dark:border-purple-800 px-3 py-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                 View Profile
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};
