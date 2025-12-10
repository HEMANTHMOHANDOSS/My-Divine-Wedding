
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Shield, Bell, CreditCard, Lock, Smartphone, Monitor, 
  FileText, LogOut, CheckCircle, Upload, Globe, Trash2
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput, AnimatedTextArea, FileUpload } from '../profile/ProfileFormElements';

const BrokerSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'financial' | 'docs'>('profile');

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
       {/* Sidebar */}
       <div className="w-full md:w-64 bg-white dark:bg-[#121212] rounded-3xl border border-gray-200 dark:border-white/5 p-4 h-fit">
          <h3 className="font-bold text-lg px-4 mb-4">Settings</h3>
          <nav className="space-y-1">
             {[
               { id: 'profile', label: 'Agency Profile', icon: User },
               { id: 'security', label: 'Security & Login', icon: Lock },
               { id: 'financial', label: 'Payouts & Billing', icon: CreditCard },
               { id: 'docs', label: 'Document Vault', icon: FileText },
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
       </div>

       {/* Content */}
       <div className="flex-1 bg-white dark:bg-[#121212] rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-8 shadow-xl overflow-hidden">
          {activeTab === 'profile' && (
             <div className="space-y-6 max-w-2xl">
                <h3 className="text-xl font-bold mb-6">Agency Details</h3>
                <div className="flex items-center gap-6 mb-8">
                   <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/10 relative overflow-hidden group cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-xs text-white font-bold">Change</span>
                      </div>
                   </div>
                   <div>
                      <h4 className="font-bold text-lg">Divine Connections Agency</h4>
                      <p className="text-sm text-gray-500">ID: DIV-8821</p>
                   </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                   <AnimatedInput label="Agency Name" value="Divine Connections Agency" />
                   <AnimatedInput label="Contact Person" value="Karthik Ramaswamy" />
                   <AnimatedInput label="Official Email" value="admin@divine.com" />
                   <AnimatedInput label="Support Phone" value="+91 98765 43210" />
                </div>
                <AnimatedTextArea label="Office Address" value="12, Cathedral Road, Chennai - 600086" />
                <div className="flex justify-end">
                   <PremiumButton>Save Changes</PremiumButton>
                </div>
             </div>
          )}

          {activeTab === 'security' && (
             <div className="space-y-8 max-w-2xl">
                <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-white/10 flex justify-between items-center">
                   <div>
                      <h4 className="font-bold text-purple-900 dark:text-white flex items-center gap-2">
                         <Shield size={18} /> Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-purple-700 dark:text-gray-400 mt-1">Protect your account with OTP login.</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                   </label>
                </div>

                <div>
                   <h4 className="font-bold mb-4">Active Sessions</h4>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                         <div className="flex items-center gap-3">
                            <Monitor size={20} className="text-gray-500" />
                            <div>
                               <p className="text-sm font-bold">MacBook Pro - Chrome</p>
                               <p className="text-xs text-gray-500">Chennai, India • Active Now</p>
                            </div>
                         </div>
                         <span className="text-xs text-green-500 font-bold">Current</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                         <div className="flex items-center gap-3">
                            <Smartphone size={20} className="text-gray-500" />
                            <div>
                               <p className="text-sm font-bold">iPhone 14 - App</p>
                               <p className="text-xs text-gray-500">Bangalore, India • 2h ago</p>
                            </div>
                         </div>
                         <button className="text-xs text-red-500 hover:underline">Revoke</button>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'financial' && (
             <div className="space-y-8 max-w-2xl">
                <h3 className="text-xl font-bold">Payout Settings</h3>
                <div className="p-6 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold flex items-center gap-2"><CreditCard size={18} /> Linked Accounts</h4>
                      <button className="text-xs font-bold text-purple-600 hover:underline">+ Add Account</button>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-6 bg-blue-800 rounded flex items-center justify-center text-white text-[8px] font-bold tracking-widest">HDFC</div>
                            <div>
                               <p className="text-sm font-bold">HDFC Bank ****8821</p>
                               <p className="text-xs text-gray-500">Primary Payout</p>
                            </div>
                         </div>
                         <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">Verified</span>
                      </div>
                   </div>
                </div>
                <div className="space-y-4">
                   <h4 className="font-bold">GST Details</h4>
                   <AnimatedInput label="GST Number" value="33ABCDE1234F1Z5" />
                   <AnimatedInput label="Legal Entity Name" value="Divine Connections Pvt Ltd" />
                </div>
             </div>
          )}

          {activeTab === 'docs' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-xl font-bold">Secure Document Vault</h3>
                   <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <Shield size={12} /> Encrypted Storage
                   </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center text-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer group">
                      <Upload size={32} className="text-gray-400 group-hover:text-purple-600 mb-2" />
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Upload New Document</span>
                      <span className="text-xs text-gray-400">License, ID Proof, Awards</span>
                   </div>
                   
                   {/* Existing Docs */}
                   <div className="relative p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 group">
                      <div className="flex items-start gap-4">
                         <div className="p-3 bg-red-100 text-red-600 rounded-xl"><FileText size={24} /></div>
                         <div>
                            <h4 className="font-bold text-sm">Broker_License_2024.pdf</h4>
                            <p className="text-xs text-gray-500">Added on 12 Jan 2024 • 1.2MB</p>
                            <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                               <CheckCircle size={10} /> Verified by Admin
                            </span>
                         </div>
                      </div>
                      <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Trash2 size={16} />
                      </button>
                   </div>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};

export default BrokerSettings;
