
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Save, Layout, Image, Edit3, Globe } from 'lucide-react';
import { MOCK_CMS } from '../../utils/adminData';
import PremiumButton from '../ui/PremiumButton';

const AdminCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [content, setContent] = useState(MOCK_CMS);

  const filteredContent = content.filter(c => c.section === activeTab);

  const handleUpdate = (id: string, val: string) => {
     setContent(prev => prev.map(c => c.id === id ? { ...c, value: val } : c));
  };

  return (
    <div className="h-full flex flex-col gap-6">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Layout className="text-purple-600" /> CMS Manager</h2>
          <PremiumButton icon={<Save size={16} />} className="!py-2 !px-6 !text-sm">Publish Changes</PremiumButton>
       </div>

       <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] shadow-sm flex flex-col flex-1 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-white/5 px-6 pt-4 gap-6">
             {['Home', 'Banners', 'SEO'].map(tab => (
                <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`pb-4 font-bold text-sm border-b-2 transition-colors ${activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}
                >
                   {tab}
                </button>
             ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/50 dark:bg-black/20">
             <div className="space-y-6 max-w-4xl mx-auto">
                {filteredContent.map((item) => (
                   <div key={item.id} className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                         <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            {item.type === 'text' ? <Edit3 size={16} /> : item.type === 'image' ? <Image size={16} /> : <Globe size={16} />}
                            {item.key}
                         </h4>
                         <span className="text-[10px] text-gray-400">Last updated: {item.lastUpdated}</span>
                      </div>
                      
                      {item.type === 'text' && (
                         <textarea 
                            value={item.value}
                            onChange={e => handleUpdate(item.id, e.target.value)}
                            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm outline-none focus:border-purple-500 min-h-[100px]"
                         />
                      )}

                      {item.type === 'image' && (
                         <div className="flex gap-6 items-start">
                            <img src={item.value} className="w-32 h-20 object-cover rounded-lg bg-gray-100" />
                            <input 
                               type="text" 
                               value={item.value}
                               onChange={e => handleUpdate(item.id, e.target.value)}
                               className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none focus:border-purple-500"
                            />
                         </div>
                      )}
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

export default AdminCMS;
