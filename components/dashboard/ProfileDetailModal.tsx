
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Briefcase, BookOpen, Heart, Star, MessageCircle, Shield, CheckCircle, Ruler, Home, Coffee, Moon, Sun, Lock, ChevronRight, ChevronLeft, Sparkles, Loader2, UserPlus } from 'lucide-react';
import { Profile } from '../../utils/mockData';
import PremiumButton from '../ui/PremiumButton';

interface ProfileDetailModalProps {
  profile: Profile;
  onClose: () => void;
  onConnect?: (profile: Profile) => void;
  onInterest?: (profile: Profile) => void;
  onShortlist?: (profile: Profile) => void;
  status?: 'none' | 'connected' | 'sent' | 'shortlisted';
}

const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ profile, onClose, onConnect, onInterest, onShortlist, status = 'none' }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'career' | 'family' | 'horoscope'>('personal');
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [connecting, setConnecting] = useState(false);

  const nextPhoto = () => setCurrentPhoto((prev) => (prev + 1) % profile.images.length);
  const prevPhoto = () => setCurrentPhoto((prev) => (prev - 1 + profile.images.length) % profile.images.length);

  const handleConnect = () => {
    if (status === 'sent' || status === 'connected') return;
    setConnecting(true);
    setTimeout(() => {
        if(onConnect) onConnect(profile);
        setConnecting(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 50 }}
        className="relative w-full h-full md:h-auto md:max-w-6xl md:max-h-[90vh] bg-white dark:bg-[#0a0a0a] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/10"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <X size={20} />
        </button>

        {/* LEFT SIDE: Photos & Quick Info */}
        <div className="w-full md:w-2/5 h-[40vh] md:h-auto relative bg-black group shrink-0">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentPhoto}
              src={profile.images[currentPhoto]} 
              alt={profile.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover opacity-90"
            />
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
          
          {/* Photo Navigation */}
          <button onClick={prevPhoto} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextPhoto} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={24} />
          </button>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
             <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl md:text-3xl font-display font-bold">{profile.name}</h2>
                {profile.isVerified && <CheckCircle size={20} className="text-green-500 fill-green-500/20" />}
                {profile.isPremium && <span className="px-2 py-0.5 bg-gradient-to-r from-gold-400 to-orange-500 text-black text-[10px] font-bold uppercase rounded-full tracking-wider">Premium</span>}
             </div>
             <p className="text-gray-300 text-base md:text-lg flex items-center gap-2">
               {profile.age} yrs • {profile.height} • {profile.location}
             </p>
             
             <div className="flex gap-3 mt-4 md:mt-6">
                <button 
                   onClick={handleConnect}
                   disabled={status === 'sent' || status === 'connected' || connecting}
                   className={`flex-1 py-3 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm
                      ${status === 'sent' ? 'bg-green-500 text-white' : status === 'connected' ? 'bg-purple-600 text-white' : 'bg-white text-black hover:bg-gray-100'}
                   `}
                >
                   {connecting ? <Loader2 size={18} className="animate-spin" /> : 
                    status === 'sent' ? <>Request Sent <CheckCircle size={18} /></> : 
                    status === 'connected' ? <>Connected <MessageCircle size={18} /></> : 
                    <>Connect Now <UserPlus size={18} /></>}
                </button>
                <button 
                   onClick={() => onInterest && onInterest(profile)}
                   className="p-3 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition-colors"
                >
                   <Heart size={20} />
                </button>
             </div>
          </div>
        </div>

        {/* RIGHT SIDE: Details & Tabs */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0a0a0a] overflow-hidden">
           
           {/* Scrollable Content */}
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              
              {/* Match Score Banner */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-4 md:p-6 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                 <div>
                    <h3 className="font-bold text-purple-900 dark:text-purple-300">Compatibility Match</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Based on horoscope & preferences</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">{profile.matchScore}%</div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-purple-200 dark:border-purple-800 flex items-center justify-center">
                       <Sparkles size={18} className="text-purple-500" />
                    </div>
                 </div>
              </div>

              {/* Tabs Header */}
              <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-4 md:px-6 pt-4">
                 <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 hide-scrollbar">
                    {(['personal', 'career', 'family', 'horoscope'] as const).map((tab) => (
                       <button
                         key={tab}
                         onClick={() => setActiveTab(tab)}
                         className={`relative pb-2 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap
                            ${activeTab === tab ? 'text-purple-600 dark:text-gold-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}
                         `}
                       >
                          {tab} Details
                          {activeTab === tab && (
                             <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-gold-400" />
                          )}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Tab Content */}
              <div className="p-4 md:p-8 space-y-8 pb-20 md:pb-8">
                 <AnimatePresence mode="wait">
                    {activeTab === 'personal' && (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                          <div className="space-y-4">
                             <h4 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white"><BookOpen size={18} className="text-purple-500" /> About {profile.name}</h4>
                             <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                {profile.about}
                             </p>
                          </div>
                          
                          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                             <DetailItem icon={<UserIcon />} label="Marital Status" value={profile.maritalStatus} />
                             <DetailItem icon={<GlobeIcon />} label="Mother Tongue" value={profile.motherTongue} />
                             <DetailItem icon={<Ruler size={16} />} label="Height" value={`${profile.height} / ${profile.heightCm}cm`} />
                             <DetailItem icon={<Coffee size={16} />} label="Diet" value={profile.diet} />
                             <DetailItem icon={<WineIcon />} label="Drinking" value={profile.drinking} />
                             <DetailItem icon={<CigaretteIcon />} label="Smoking" value={profile.smoking} />
                          </div>

                          <div>
                             <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Hobbies & Interests</h4>
                             <div className="flex flex-wrap gap-2">
                                {profile.hobbies.map(hobby => (
                                   <span key={hobby} className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                                      {hobby}
                                   </span>
                                ))}
                             </div>
                          </div>
                       </motion.div>
                    )}

                    {activeTab === 'career' && (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 xs:grid-cols-2 gap-6">
                          <DetailItem icon={<BookOpen size={16} />} label="Education" value={profile.education} />
                          <DetailItem icon={<Briefcase size={16} />} label="Occupation" value={profile.occupation} />
                          <DetailItem icon={<MoneyIcon />} label="Annual Income" value={profile.income} />
                          <DetailItem icon={<MapPin size={16} />} label="Work Location" value={profile.location} />
                       </motion.div>
                    )}

                    {activeTab === 'family' && (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 xs:grid-cols-2 gap-6">
                          <DetailItem icon={<Home size={16} />} label="Family Type" value={profile.familyType} />
                          <DetailItem icon={<Briefcase size={16} />} label="Father's Job" value={profile.fatherJob} />
                          <DetailItem icon={<Shield size={16} />} label="Religion" value={profile.religion} />
                          <DetailItem icon={<Shield size={16} />} label="Caste" value={profile.caste} />
                          <DetailItem icon={<Shield size={16} />} label="Gothram" value={profile.gothram} />
                       </motion.div>
                    )}
                    
                    {activeTab === 'horoscope' && (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl flex items-start gap-4">
                             <Moon size={24} className="text-purple-600 mt-1 shrink-0" />
                             <div>
                                <h4 className="font-bold text-purple-900 dark:text-purple-300">Astrological Match</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                   Raasi and Nakshatra are compatible. Guna Milan score is 28/36.
                                </p>
                             </div>
                          </div>
                          <div className="grid grid-cols-1 xs:grid-cols-2 gap-6">
                             <DetailItem icon={<Star size={16} />} label="Raasi" value={profile.raasi} />
                             <DetailItem icon={<Star size={16} />} label="Nakshatra" value={profile.nakshatra} />
                             <DetailItem icon={<Sun size={16} />} label="Dosham" value="No" />
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>

           {/* Sticky Action Footer */}
           <div className="p-4 md:p-6 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] flex justify-between items-center gap-4 shrink-0">
               <div className="text-xs text-gray-400 hidden xs:block">
                  Last active: {profile.lastActive}
               </div>
               <div className="flex gap-2 md:gap-3 w-full xs:w-auto">
                  <PremiumButton 
                     onClick={() => onShortlist && onShortlist(profile)}
                     variant="outline" 
                     className="flex-1 xs:flex-none !py-2 !px-4 !text-sm whitespace-nowrap"
                  >
                     Shortlist
                  </PremiumButton>
                  <PremiumButton 
                     onClick={() => onInterest && onInterest(profile)}
                     variant="gradient" 
                     className="flex-1 xs:flex-none !py-2 !px-6 !text-sm whitespace-nowrap"
                  >
                     Send Interest
                  </PremiumButton>
               </div>
           </div>

        </div>
      </motion.div>
    </div>
  );
};

const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
     <div className="text-gray-400 mt-0.5">{icon}</div>
     <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{value}</p>
     </div>
  </div>
);

// Icon Helpers
const UserIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const GlobeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const WineIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 22h8"></path><path d="M7 10h10"></path><path d="M12 15v7"></path><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"></path></svg>;
const CigaretteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8c0-2.5-2-2.5-2-5"></path><path d="M22 13c0-2.5-2-2.5-2-5"></path><path d="M2 21h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H2v8Z"></path><path d="M18 13v8"></path></svg>;
const MoneyIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="12" y1="1" x2="12" y2="23" /></svg>;

export default ProfileDetailModal;
