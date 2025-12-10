
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, CheckCircle, Shield, User } from 'lucide-react';
import { MOCK_CLIENTS } from '../../utils/mockData'; // Correct import
import PremiumButton from '../ui/PremiumButton';

interface ClientVerificationModalProps {
  onClose: () => void;
}

const ClientVerificationModal: React.FC<ClientVerificationModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [verifying, setVerifying] = useState<string | null>(null);
  
  // Local state for client verification status
  const [clients, setClients] = useState(MOCK_CLIENTS.map(c => ({...c, isVerifiedByBroker: false})));

  const handleVerify = (id: string) => {
    setVerifying(id);
    // Simulate API call
    setTimeout(() => {
        setClients(prev => prev.map(c => c.id === id ? { ...c, isVerifiedByBroker: true } : c));
        setVerifying(null);
    }, 1500);
  };

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 50 }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
           <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <Shield className="text-purple-600" /> Client Verification
              </h3>
              <p className="text-sm text-gray-500">Attach your agency's verified badge to clients.</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
           </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
           <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                 type="text" 
                 placeholder="Search your clients..." 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-xl pl-12 pr-4 py-3 text-sm outline-none"
              />
           </div>
        </div>

        {/* Client List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
           {filteredClients.map(client => (
              <div key={client.id} className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl hover:border-purple-200 dark:hover:border-purple-500/30 transition-colors group">
                 <img src={client.img} alt={client.name} className="w-12 h-12 rounded-full object-cover" />
                 <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                       {client.name}
                       {client.isVerifiedByBroker && <CheckCircle size={14} className="text-green-500" />}
                    </h4>
                    <p className="text-xs text-gray-500">{client.id} • {client.plan}</p>
                 </div>
                 
                 {client.isVerifiedByBroker ? (
                    <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-xl flex items-center gap-2">
                       <Shield size={14} /> Verified by You
                    </div>
                 ) : (
                    <button 
                       onClick={() => handleVerify(client.id)}
                       disabled={verifying === client.id}
                       className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-lg shadow-purple-500/20"
                    >
                       {verifying === client.id ? 'Verifying...' : 'Verify Client'}
                    </button>
                 )}
              </div>
           ))}
           {filteredClients.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                 No clients found matching "{searchTerm}"
              </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 text-xs text-gray-500 text-center">
           By verifying a client, you confirm that you have personally checked their details.
        </div>
      </motion.div>
    </div>
  );
};

export default ClientVerificationModal;
