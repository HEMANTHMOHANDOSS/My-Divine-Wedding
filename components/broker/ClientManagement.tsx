
import React, { useState, useRef } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Upload, Search, Filter, MoreHorizontal, Layout, List, 
  Phone, Mail, MapPin, Calendar, Clock, CheckCircle, AlertCircle, 
  FileText, Shield, UserPlus, Edit3, Trash2, ChevronRight, X, Save
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { AdminTable, Column } from '../ui/AdminTable';
import { AnimatedInput, AnimatedSelect, FileUpload, AnimatedTextArea } from '../profile/ProfileFormElements';
import ProfileCreationWizard from '../profile/ProfileCreationWizard'; // Reuse existing wizard logic
import { MOCK_CLIENTS } from '../../utils/mockData'; // Correct import

// --- TYPES ---
type PipelineStage = 'New Lead' | 'In Progress' | 'Profile Ready' | 'Shortlisting' | 'Interviews' | 'Matched';

type ClientProfile = typeof MOCK_CLIENTS[0] & {
  stage: PipelineStage;
  lastAction: string;
  notes: string;
  linkedContacts: { name: string, relation: string, phone: string }[];
  permissions: { canEdit: boolean, canViewContact: boolean };
  maritalStatus: string;
}

const STAGES: PipelineStage[] = ['New Lead', 'In Progress', 'Profile Ready', 'Shortlisting', 'Interviews', 'Matched'];

// Extended Mock Data
const EXTENDED_CLIENTS: ClientProfile[] = MOCK_CLIENTS.map((c, i) => ({
  ...c,
  stage: STAGES[i % 5], // Distribute across stages
  lastAction: 'Profile updated 2 days ago',
  notes: 'Client is specific about horoscope match.',
  linkedContacts: [{ name: 'Mr. Reddy', relation: 'Father', phone: '+91 9876543210' }],
  permissions: { canEdit: true, canViewContact: true },
  maritalStatus: 'never_married'
}));

const ClientManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [clients, setClients] = useState<ClientProfile[]>(EXTENDED_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // --- HANDLERS ---
  const handleStageChange = (clientId: string, newStage: PipelineStage) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, stage: newStage, lastAction: `Moved to ${newStage}` } : c));
  };

  const handleDelete = (id: string) => {
    if(confirm('Are you sure? This action is logged.')) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleBulkAction = (action: string) => {
    alert(`${action} triggered for selected clients.`);
  };

  const handleImport = (file: File) => {
    // Mock CSV parsing
    setTimeout(() => {
        alert(`Successfully imported 12 profiles from ${file.name}`);
        setShowImport(false);
    }, 1500);
  };

  // Filter
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#121212] p-4 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
         <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                  type="text" 
                  placeholder="Search Clients..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-purple-500"
               />
            </div>
            <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
               <button onClick={() => setViewMode('kanban')} className={`p-2 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-white dark:bg-gray-800 text-purple-600 shadow' : 'text-gray-500'}`}><Layout size={18} /></button>
               <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 text-purple-600 shadow' : 'text-gray-500'}`}><List size={18} /></button>
            </div>
         </div>

         <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => setShowImport(true)} className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2">
               <Upload size={16} /> Import CSV
            </button>
            <PremiumButton onClick={() => setIsCreating(true)} icon={<Plus size={18} />} className="!py-2 !px-4 !text-sm">
               Add Client
            </PremiumButton>
         </div>
      </div>

      {/* MAIN VIEW */}
      <div className="flex-1 overflow-hidden">
         <AnimatePresence mode="wait">
            {viewMode === 'kanban' ? (
               <KanbanBoard 
                  key="kanban"
                  stages={STAGES} 
                  clients={filteredClients} 
                  onDragEnd={handleStageChange}
                  onEdit={(c) => setSelectedClient(c)}
               />
            ) : (
               <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  <AdminTable<ClientProfile> 
                     data={filteredClients}
                     columns={[
                        { key: 'name', label: 'Client', render: (_, c) => (
                           <div className="flex items-center gap-3">
                              <img src={c.img} className="w-10 h-10 rounded-full object-cover" />
                              <div>
                                 <div className="font-bold text-sm">{c.name}</div>
                                 <div className="text-xs text-gray-500">{c.id}</div>
                              </div>
                           </div>
                        )},
                        { key: 'stage', label: 'Status', render: (val) => <span className="text-xs font-bold px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded">{val as string}</span> },
                        { key: 'plan', label: 'Plan', render: (val) => <span className="text-xs font-bold uppercase">{val as string}</span> },
                        { key: 'lastAction', label: 'Last Activity', render: (val) => <span className="text-xs text-gray-500">{val as string}</span> },
                     ]}
                     actions={(c) => (
                        <div className="min-w-[100px]">
                           <button onClick={() => setSelectedClient(c)} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-white/5 rounded flex items-center gap-2">
                              <Edit3 size={14} /> Edit Profile
                           </button>
                           <button onClick={() => handleDelete(c.id)} className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded flex items-center gap-2">
                              <Trash2 size={14} /> Remove
                           </button>
                        </div>
                     )}
                  />
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* MODALS */}
      <AnimatePresence>
         {selectedClient && (
            <ClientEditorModal 
               client={selectedClient} 
               onClose={() => setSelectedClient(null)} 
               onSave={(updated) => {
                  setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
                  setSelectedClient(null);
               }}
            />
         )}
         {isCreating && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
               <div className="min-h-screen py-10 px-4">
                  <div className="max-w-4xl mx-auto bg-white dark:bg-[#121212] rounded-[2rem] overflow-hidden shadow-2xl relative">
                     <button onClick={() => setIsCreating(false)} className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full z-10"><X size={20} /></button>
                     <ProfileCreationWizard onComplete={() => setIsCreating(false)} onExit={() => setIsCreating(false)} />
                  </div>
               </div>
            </div>
         )}
         {showImport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
               <div className="bg-white dark:bg-[#121212] p-8 rounded-[2rem] max-w-md w-full text-center">
                  <h3 className="text-xl font-bold mb-4">Bulk Import Clients</h3>
                  <FileUpload label="Upload CSV / Excel" accept=".csv,.xlsx" onFileSelect={handleImport} />
                  <div className="mt-4 flex gap-3">
                     <button onClick={() => setShowImport(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl">Cancel</button>
                     <PremiumButton className="flex-1 !py-3">Process Import</PremiumButton>
                  </div>
               </div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};

// --- KANBAN BOARD SUB-COMPONENT ---
const KanbanBoard: React.FC<{ 
  stages: PipelineStage[], 
  clients: ClientProfile[], 
  onDragEnd: (id: string, stage: PipelineStage) => void,
  onEdit: (c: ClientProfile) => void
}> = ({ stages, clients, onDragEnd, onEdit }) => {
   
   return (
      <div className="flex gap-4 h-full overflow-x-auto pb-4 custom-scrollbar">
         {stages.map(stage => {
            const stageClients = clients.filter(c => c.stage === stage);
            
            return (
               <div key={stage} className="min-w-[280px] w-[280px] flex flex-col h-full bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5">
                  <div className="p-4 border-b border-gray-200 dark:border-white/5 flex justify-between items-center bg-gray-100/50 dark:bg-white/[0.02] rounded-t-2xl">
                     <h4 className="font-bold text-sm text-gray-700 dark:text-gray-200">{stage}</h4>
                     <span className="text-xs font-bold bg-white dark:bg-black/20 px-2 py-0.5 rounded text-gray-500">{stageClients.length}</span>
                  </div>
                  
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                     {stageClients.map(client => (
                        <motion.div 
                           layoutId={client.id}
                           key={client.id}
                           className="bg-white dark:bg-[#1a1a1a] p-3 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md cursor-grab active:cursor-grabbing group relative"
                        >
                           <div className="flex items-start gap-3 mb-2">
                              <img src={client.img} className="w-8 h-8 rounded-full object-cover" />
                              <div className="flex-1 min-w-0">
                                 <h5 className="font-bold text-sm truncate">{client.name}</h5>
                                 <p className="text-[10px] text-gray-500">{client.id} • {client.age}y</p>
                              </div>
                              <button onClick={() => onEdit(client)} className="text-gray-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Edit3 size={14} />
                              </button>
                           </div>
                           
                           {/* Quick Actions / Dropdown for Stage Move (since drag is tricky in raw React without dnd-kit) */}
                           <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                              <select 
                                 className="text-[10px] bg-transparent outline-none text-purple-600 font-bold cursor-pointer"
                                 value={client.stage}
                                 onChange={(e) => onDragEnd(client.id, e.target.value as PipelineStage)}
                              >
                                 {stages.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                              <span className="text-[9px] text-gray-400">{client.lastAction.split(' ').slice(0,2).join(' ')}..</span>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            )
         })}
      </div>
   )
}

// --- CLIENT EDITOR MODAL ---
const ClientEditorModal: React.FC<{ 
   client: ClientProfile; 
   onClose: () => void;
   onSave: (c: ClientProfile) => void;
}> = ({ client, onClose, onSave }) => {
   const [tab, setTab] = useState<'info' | 'family' | 'perms' | 'audit'>('info');
   const [data, setData] = useState(client);

   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
         <motion.div initial={{ scale: 0.95, y: 50 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-4xl h-[85vh] bg-white dark:bg-[#0a0a0a] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/10">
            
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-50 dark:bg-white/5 border-r border-gray-200 dark:border-white/10 p-6 flex flex-col">
               <div className="text-center mb-6">
                  <img src={data.img} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-white dark:border-white/10" />
                  <h3 className="font-bold text-lg">{data.name}</h3>
                  <p className="text-xs text-gray-500">{data.id}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full text-xs font-bold">{data.stage}</span>
               </div>
               
               <nav className="space-y-1 flex-1">
                  {[
                     { id: 'info', label: 'Basic & Career', icon: Users },
                     { id: 'family', label: 'Family & Contacts', icon: UserPlus },
                     { id: 'perms', label: 'Permissions', icon: Shield },
                     { id: 'audit', label: 'Audit Trail', icon: FileText },
                  ].map(item => (
                     <button key={item.id} onClick={() => setTab(item.id as any)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-colors ${tab === item.id ? 'bg-white dark:bg-white/10 text-purple-600 shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        <item.icon size={16} /> {item.label}
                     </button>
                  ))}
               </nav>

               <PremiumButton onClick={() => onSave(data)} width="full" icon={<Save size={16} />}>Save Changes</PremiumButton>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-white dark:bg-transparent">
               {tab === 'info' && (
                  <div className="space-y-6">
                     <h3 className="text-xl font-bold mb-4">Edit Profile Details</h3>
                     <div className="grid md:grid-cols-2 gap-6">
                        <AnimatedInput label="Full Name" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
                        <AnimatedInput label="Age" value={data.age.toString()} onChange={e => setData({...data, age: parseInt(e.target.value) || 0})} numericOnly />
                        <AnimatedSelect label="Marital Status" value={data.maritalStatus || ''} onChange={e => setData({...data, maritalStatus: e.target.value})} options={[{value:'never_married', label:'Never Married'}, {value:'divorced', label:'Divorced'}]} />
                        <AnimatedInput label="Plan" value={data.plan} disabled />
                     </div>
                     <AnimatedTextArea label="Broker Notes (Private)" value={data.notes} onChange={e => setData({...data, notes: e.target.value})} placeholder="Add internal notes..." />
                  </div>
               )}

               {tab === 'family' && (
                  <div className="space-y-6">
                     <h3 className="text-xl font-bold mb-4">Linked Contacts</h3>
                     {data.linkedContacts.map((contact, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                           <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600"><Phone size={18} /></div>
                           <div className="flex-1">
                              <h4 className="font-bold text-sm">{contact.name} <span className="text-gray-500 font-normal">({contact.relation})</span></h4>
                              <p className="text-xs text-gray-500">{contact.phone}</p>
                           </div>
                           <button className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                        </div>
                     ))}
                     <button className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl text-gray-500 font-bold text-xs flex items-center justify-center gap-2 hover:border-purple-500 hover:text-purple-600 transition-colors">
                        <Plus size={16} /> Link New Parent/Guardian
                     </button>
                  </div>
               )}

               {tab === 'perms' && (
                  <div className="space-y-6">
                     <h3 className="text-xl font-bold mb-4">Broker Permissions</h3>
                     <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-200 text-xs mb-6">
                        <AlertCircle size={16} className="inline mr-2" />
                        Permissions determine what actions you can take on behalf of the client.
                     </div>
                     
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                           <div>
                              <h4 className="font-bold text-sm">Edit Profile Data</h4>
                              <p className="text-xs text-gray-500">Allow broker to modify bio, education, etc.</p>
                           </div>
                           <input type="checkbox" checked={data.permissions.canEdit} onChange={() => setData({...data, permissions: {...data.permissions, canEdit: !data.permissions.canEdit}})} className="w-5 h-5 accent-purple-600" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                           <div>
                              <h4 className="font-bold text-sm">View Contact Info</h4>
                              <p className="text-xs text-gray-500">Allow broker to see full phone/email.</p>
                           </div>
                           <input type="checkbox" checked={data.permissions.canViewContact} onChange={() => setData({...data, permissions: {...data.permissions, canViewContact: !data.permissions.canViewContact}})} className="w-5 h-5 accent-purple-600" />
                        </div>
                     </div>
                  </div>
               )}

               {tab === 'audit' && (
                  <div className="space-y-6">
                     <h3 className="text-xl font-bold mb-4">Activity Audit Trail</h3>
                     <div className="relative border-l-2 border-gray-200 dark:border-white/10 ml-3 space-y-8 pl-6">
                        {[
                           { action: 'Moved to Shortlisting', date: '2 hours ago', user: 'Broker (You)' },
                           { action: 'Profile Updated', date: '1 day ago', user: 'Client' },
                           { action: 'Profile Created', date: '3 days ago', user: 'Broker (You)' },
                        ].map((log, i) => (
                           <div key={i} className="relative">
                              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-purple-600 border-2 border-white dark:border-black" />
                              <p className="text-sm font-bold">{log.action}</p>
                              <p className="text-xs text-gray-500">{log.date} by {log.user}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </motion.div>
      </div>
   );
};

export default ClientManagement;
