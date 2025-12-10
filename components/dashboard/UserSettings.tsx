
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Lock, Bell, Shield, Sliders, LogOut, Trash2, Save, 
  Mail, Phone, Globe, Eye, EyeOff, CheckCircle, Smartphone
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput } from '../profile/ProfileFormElements';
import GradientRangeSlider from '../ui/GradientRangeSlider';

const UserSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications' | 'preferences'>('account');
  
  // Mock State
  const [profile, setProfile] = useState({
    name: 'Sribalamanigandan G',
    email: 'user@divine.com',
    phone: '+91 98765 43210',
    location: 'Chennai, India'
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'all', // all, premium, hidden
    photoVisibility: 'blur', // visible, blur, request
    phoneVisibility: 'request', // visible, premium, request
    readReceipts: true
  });

  const [notifications, setNotifications] = useState({
    emailMatch: true,
    emailMsg: false,
    smsMatch: true,
    pushViews: true,
    pushInterests: true
  });

  const [preferences, setPreferences] = useState({
    ageRange: [21, 28] as [number, number],
    heightRange: [150, 170] as [number, number],
    location: 'Chennai',
    religion: 'Hindu'
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full pb-20">
       {/* Sidebar */}
       <div className="w-full md:w-64 bg-white dark:bg-[#121212] rounded-[2rem] border border-gray-200 dark:border-white/5 p-4 h-fit shrink-0 shadow-sm">
          <h3 className="font-bold text-lg px-4 mb-4 mt-2">Settings</h3>
          <nav className="space-y-1">
             {[
               { id: 'account', label: 'Account', icon: User },
               { id: 'privacy', label: 'Privacy & Security', icon: Lock },
               { id: 'notifications', label: 'Notifications', icon: Bell },
               { id: 'preferences', label: 'Partner Prefs', icon: Sliders },
             ].map(item => (
                <button
                   key={item.id}
                   onClick={() => setActiveTab(item.id as any)}
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === item.id 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                   }`}
                >
                   <item.icon size={18} /> {item.label}
                </button>
             ))}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 px-4">
             <button className="flex items-center gap-2 text-red-500 hover:text-red-600 text-xs font-bold transition-colors">
                <LogOut size={16} /> Sign Out All Devices
             </button>
          </div>
       </div>

       {/* Content Area */}
       <div className="flex-1 bg-white/60 dark:bg-[#121212]/60 backdrop-blur-xl rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-8 shadow-xl overflow-hidden min-h-[600px]">
          
          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-2xl">
                <div>
                   <h3 className="text-2xl font-bold mb-1">Account Information</h3>
                   <p className="text-gray-500 text-sm">Update your personal identification details.</p>
                </div>

                <div className="flex items-center gap-6">
                   <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/10 relative overflow-hidden group cursor-pointer border-4 border-white dark:border-white/5 shadow-lg">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-xs text-white font-bold">Edit</span>
                      </div>
                   </div>
                   <div>
                      <h4 className="font-bold text-lg">{profile.name}</h4>
                      <p className="text-sm text-gray-500">Member since Oct 2023</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full text-xs font-bold">Premium Plan</span>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   <AnimatedInput label="Full Name" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} icon={<User size={18} />} />
                   <AnimatedInput label="Location" value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} icon={<Globe size={18} />} />
                   <AnimatedInput label="Email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} icon={<Mail size={18} />} />
                   <AnimatedInput label="Phone" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} icon={<Phone size={18} />} />
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-white/5">
                   <h4 className="font-bold mb-4">Change Password</h4>
                   <div className="grid md:grid-cols-2 gap-6">
                      <AnimatedInput label="New Password" type="password" placeholder="••••••••" icon={<Lock size={18} />} />
                      <AnimatedInput label="Confirm Password" type="password" placeholder="••••••••" icon={<Lock size={18} />} />
                   </div>
                </div>

                <div className="flex justify-end pt-4">
                   <PremiumButton icon={<Save size={16} />}>Save Changes</PremiumButton>
                </div>
             </motion.div>
          )}

          {/* PRIVACY TAB */}
          {activeTab === 'privacy' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-3xl">
                <div>
                   <h3 className="text-2xl font-bold mb-1">Privacy Settings</h3>
                   <p className="text-gray-500 text-sm">Control who can see your profile and contact you.</p>
                </div>

                <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden">
                   {/* Profile Visibility */}
                   <div className="p-6 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                         <h4 className="font-bold text-sm flex items-center gap-2"><Eye size={16} className="text-purple-500" /> Profile Visibility</h4>
                         <p className="text-xs text-gray-500 mt-1">Determine who can find and view your full profile.</p>
                      </div>
                      <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-lg">
                         {['all', 'premium', 'hidden'].map(opt => (
                            <button
                               key={opt}
                               onClick={() => setPrivacy(p => ({...p, profileVisibility: opt}))}
                               className={`px-4 py-2 rounded-md text-xs font-bold capitalize transition-all ${privacy.profileVisibility === opt ? 'bg-white dark:bg-gray-800 text-purple-600 shadow' : 'text-gray-500'}`}
                            >
                               {opt === 'all' ? 'Everyone' : opt === 'premium' ? 'Premium Only' : 'Hidden'}
                            </button>
                         ))}
                      </div>
                   </div>

                   {/* Photo Privacy */}
                   <div className="p-6 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                         <h4 className="font-bold text-sm flex items-center gap-2"><Lock size={16} className="text-purple-500" /> Photo Privacy</h4>
                         <p className="text-xs text-gray-500 mt-1">Control how your photos appear to others.</p>
                      </div>
                      <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-lg">
                         {['visible', 'blur', 'request'].map(opt => (
                            <button
                               key={opt}
                               onClick={() => setPrivacy(p => ({...p, photoVisibility: opt}))}
                               className={`px-4 py-2 rounded-md text-xs font-bold capitalize transition-all ${privacy.photoVisibility === opt ? 'bg-white dark:bg-gray-800 text-purple-600 shadow' : 'text-gray-500'}`}
                            >
                               {opt === 'visible' ? 'Visible' : opt === 'blur' ? 'Blur (Until Connect)' : 'On Request'}
                            </button>
                         ))}
                      </div>
                   </div>

                   {/* Contact Privacy */}
                   <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                         <h4 className="font-bold text-sm flex items-center gap-2"><Phone size={16} className="text-purple-500" /> Phone Number</h4>
                         <p className="text-xs text-gray-500 mt-1">Who can view your contact number?</p>
                      </div>
                      <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-lg">
                         {['premium', 'request'].map(opt => (
                            <button
                               key={opt}
                               onClick={() => setPrivacy(p => ({...p, phoneVisibility: opt}))}
                               className={`px-4 py-2 rounded-md text-xs font-bold capitalize transition-all ${privacy.phoneVisibility === opt ? 'bg-white dark:bg-gray-800 text-purple-600 shadow' : 'text-gray-500'}`}
                            >
                               {opt === 'premium' ? 'Premium Members' : 'Only on Request'}
                            </button>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Blocked Users */}
                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 flex justify-between items-center">
                   <div>
                      <h4 className="font-bold text-sm">Blocked Profiles</h4>
                      <p className="text-xs text-gray-500">Manage users you have blocked.</p>
                   </div>
                   <button className="text-xs font-bold text-red-500 border border-red-200 dark:border-red-900/30 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10">
                      View Block List (0)
                   </button>
                </div>

                <div className="flex justify-end pt-4">
                   <PremiumButton icon={<Shield size={16} />}>Update Privacy</PremiumButton>
                </div>
             </motion.div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-2xl">
                <div>
                   <h3 className="text-2xl font-bold mb-1">Notifications</h3>
                   <p className="text-gray-500 text-sm">Choose how you want to be notified.</p>
                </div>

                <div className="space-y-4">
                   {[
                      { id: 'emailMatch', label: 'New Matches via Email', desc: 'Receive daily summary of new matches.', icon: Mail },
                      { id: 'emailMsg', label: 'Message Alerts via Email', desc: 'Get notified when you receive a new message.', icon: Mail },
                      { id: 'smsMatch', label: 'SMS Notifications', desc: 'Receive important alerts via SMS.', icon: Smartphone },
                      { id: 'pushViews', label: 'Profile View Alerts', desc: 'Push notification when someone views your profile.', icon: Eye },
                      { id: 'pushInterests', label: 'Interest Requests', desc: 'Instant alert for new connection requests.', icon: Bell },
                   ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl">
                         <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                               <item.icon size={20} />
                            </div>
                            <div>
                               <h4 className="font-bold text-sm">{item.label}</h4>
                               <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                               type="checkbox" 
                               checked={notifications[item.id as keyof typeof notifications]} 
                               onChange={() => toggleNotification(item.id as keyof typeof notifications)} 
                               className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                         </label>
                      </div>
                   ))}
                </div>
             </motion.div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'preferences' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-2xl">
                <div>
                   <h3 className="text-2xl font-bold mb-1">Partner Preferences</h3>
                   <p className="text-gray-500 text-sm">These settings help our AI find the best matches for you.</p>
                </div>

                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between items-center mb-2">
                         <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Age Range</label>
                         <span className="text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-1 rounded">
                            {preferences.ageRange[0]} - {preferences.ageRange[1]} Yrs
                         </span>
                      </div>
                      <GradientRangeSlider 
                         min={18} max={60} 
                         value={preferences.ageRange} 
                         onChange={(val) => setPreferences({...preferences, ageRange: val})} 
                      />
                   </div>

                   <div>
                      <div className="flex justify-between items-center mb-2">
                         <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Height Range (cm)</label>
                         <span className="text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-1 rounded">
                            {preferences.heightRange[0]} - {preferences.heightRange[1]} cm
                         </span>
                      </div>
                      <GradientRangeSlider 
                         min={140} max={220} 
                         value={preferences.heightRange} 
                         onChange={(val) => setPreferences({...preferences, heightRange: val})} 
                      />
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                      <AnimatedInput 
                         label="Preferred Location" 
                         value={preferences.location} 
                         onChange={(e) => setPreferences({...preferences, location: e.target.value})} 
                      />
                      <AnimatedInput 
                         label="Preferred Religion" 
                         value={preferences.religion} 
                         onChange={(e) => setPreferences({...preferences, religion: e.target.value})} 
                      />
                   </div>
                </div>

                <div className="flex justify-end pt-4">
                   <PremiumButton icon={<CheckCircle size={16} />}>Update Preferences</PremiumButton>
                </div>
             </motion.div>
          )}

       </div>
    </div>
  );
};

export default UserSettings;
