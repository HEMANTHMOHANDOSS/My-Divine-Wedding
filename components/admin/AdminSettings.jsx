
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, UserCog, Lock, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';

const AdminSettings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Settings className="text-gray-500" /> System Settings</h2>
          <PremiumButton icon={<Save size={16} />} className="!py-2 !px-6 !text-sm">Save All Changes</PremiumButton>
       </div>

       <div className="space-y-6">
          {/* General Config */}
          <div className="bg-white dark:bg-[#121212] p-8 rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-sm">
             <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Shield className="text-purple-600" /> General Configuration</h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div>
                      <p className="font-bold text-sm">Maintenance Mode</p>
                      <p className="text-xs text-gray-500">Disable user access for updates</p>
                   </div>
                   <ToggleLeft size={40} className="text-gray-300 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between">
                   <div>
                      <p className="font-bold text-sm">User Registration</p>
                      <p className="text-xs text-gray-500">Allow new users to sign up</p>
                   </div>
                   <ToggleRight size={40} className="text-green-500 cursor-pointer" />
                </div>
             </div>
          </div>

          {/* Admin Roles */}
          <div className="bg-white dark:bg-[#121212] p-8 rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-sm">
             <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><UserCog className="text-blue-600" /> Admin Roles</h3>
             <div className="space-y-4">
                {['Super Admin', 'Moderator', 'Support Agent'].map(role => (
                   <div key={role} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                      <span className="font-bold text-sm">{role}</span>
                      <button className="text-xs font-bold text-purple-600 hover:underline">Manage Permissions</button>
                   </div>
                ))}
             </div>
          </div>

          {/* API Keys */}
          <div className="bg-white dark:bg-[#121212] p-8 rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-sm">
             <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Lock className="text-red-600" /> API Credentials</h3>
             <div className="space-y-4">
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase">Gemini API Key</label>
                   <input type="password" value="************************" readOnly className="w-full mt-2 bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-gray-200 dark:border-white/10 font-mono text-sm" />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase">Razorpay Secret</label>
                   <input type="password" value="************************" readOnly className="w-full mt-2 bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-gray-200 dark:border-white/10 font-mono text-sm" />
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default AdminSettings;
