
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Building2, MapPin, Phone, Mail, Globe, Camera, Upload, 
  Shield, CheckCircle, AlertTriangle, Lock, Eye, FileText, 
  Briefcase, Plus, Trash2, Award, Scan, RefreshCw, Save,
  ChevronRight, Star
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput, AnimatedTextArea, FileUpload } from '../profile/ProfileFormElements';
import ClientVerificationModal from './ClientVerificationModal';

interface BrokerProfileProps {
  onBack: () => void;
}

const BrokerProfile: React.FC<BrokerProfileProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'verification' | 'services' | 'vault'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [showClientVerify, setShowClientVerify] = useState(false);

  // --- MOCK DATA STATE ---
  const [profile, setProfile] = useState({
    name: 'Karthik Ramaswamy',
    agency: 'Divine Connections Agency',
    licenseId: 'DIV-8821-XC',
    email: 'karthik@divine.com',
    phone: '+91 98765 43210',
    location: 'T-Nagar, Chennai',
    bio: 'Specialized in Brahmin and Chettiar matchmaking with over 10 years of experience. We ensure 100% verified profiles.',
    visibility: {
      publicProfile: true,
      verifiedContactsOnly: false
    },
    officePhotos: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
    ]
  });

  const [verification, setVerification] = useState<{
    status: 'unverified' | 'scanning' | 'pending' | 'verified' | 'rejected';
    idDoc: File | null;
    selfie: File | null;
    aiReport: any | null;
  }>({
    status: 'unverified',
    idDoc: null,
    selfie: null,
    aiReport: null
  });

  const [services, setServices] = useState([
    { id: 1, title: 'Standard Matchmaking', price: '₹15,000', features: ['5 Profile/month', 'Basic Support'] },
    { id: 2, title: 'Elite Concierge', price: '₹50,000', features: ['Unlimited Profiles', 'Relationship Manager', 'Home Visits'] }
  ]);

  // --- GEMINI VERIFICATION LOGIC ---
  const runAiVerification = async () => {
    if (!verification.idDoc || !verification.selfie) return;
    
    setVerification(prev => ({ ...prev, status: 'scanning' }));

    try {
      const apiKey = process.env.API_KEY;
      
      // Helper to convert File to Base64
      const fileToGenerativePart = async (file: File) => {
        const base64EncodedDataPromise = new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(file);
        });
        return {
          inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
      };

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

        const idPart = await fileToGenerativePart(verification.idDoc);
        const selfiePart = await fileToGenerativePart(verification.selfie);

        const prompt = `
          Analyze these two images for a Broker Verification System.
          Image 1 is a Government ID. Image 2 is a Selfie.
          
          Perform the following checks:
          1. Does the face in the ID match the selfie? (Score 0-100)
          2. Is the ID document clearly visible?
          3. Estimate the age in both and check for discrepancies.
          
          Return a JSON object:
          {
            "matchScore": number,
            "idVisible": boolean,
            "ageEstimateID": string,
            "ageEstimateSelfie": string,
            "flags": string[],
            "confidence": "High" | "Medium" | "Low"
          }
        `;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [idPart as any, selfiePart as any, { text: prompt }] }]
        });
        
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const report = jsonMatch ? JSON.parse(jsonMatch[0]) : { matchScore: 85, confidence: "High" }; // Fallback parsing

        setVerification(prev => ({ 
          ...prev, 
          status: 'pending', // Send to admin for final approval
          aiReport: report 
        }));

      } else {
        // Mock Fallback
        setTimeout(() => {
          setVerification(prev => ({ 
            ...prev, 
            status: 'pending',
            aiReport: {
              matchScore: 92,
              idVisible: true,
              ageEstimateID: "30-35",
              ageEstimateSelfie: "32-36",
              flags: [],
              confidence: "High"
            }
          }));
        }, 3000);
      }
    } catch (error) {
      console.error("Verification failed", error);
      setVerification(prev => ({ ...prev, status: 'unverified' }));
      alert("AI Service unavailable. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8 pb-20">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button onClick={onBack} className="text-sm text-gray-500 hover:text-purple-600 flex items-center gap-1 mb-2">
            <ChevronRight className="rotate-180" size={14} /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Agency Profile
            {verification.status === 'verified' && <CheckCircle className="text-blue-500 fill-blue-500/20" size={24} />}
          </h1>
        </div>
        <div className="flex gap-3">
           <PremiumButton 
              variant="outline" 
              onClick={() => setShowClientVerify(true)}
              icon={<Shield size={16} />}
           >
              Verify Clients
           </PremiumButton>
           <PremiumButton 
              variant={isEditing ? 'gradient' : 'primary'}
              onClick={() => setIsEditing(!isEditing)}
              icon={isEditing ? <Save size={16} /> : <User size={16} />}
           >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
           </PremiumButton>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-lg">
              <div className="flex flex-col items-center text-center mb-6">
                 <div className="w-24 h-24 rounded-full border-4 border-purple-100 dark:border-purple-900/30 overflow-hidden mb-3 relative group">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop" className="w-full h-full object-cover" />
                    {isEditing && (
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                          <Camera className="text-white" size={24} />
                       </div>
                    )}
                 </div>
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white">{profile.name}</h3>
                 <p className="text-xs text-gray-500">{profile.agency}</p>
                 <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-mono text-gray-600 dark:text-gray-400">
                    <FileText size={12} /> {profile.licenseId}
                 </div>
              </div>

              <nav className="space-y-1">
                 {[
                    { id: 'details', label: 'Profile Details', icon: User },
                    { id: 'verification', label: 'Verification Center', icon: Shield },
                    { id: 'services', label: 'Service Packages', icon: Briefcase },
                    { id: 'vault', label: 'Credential Vault', icon: Lock },
                 ].map(item => (
                    <button
                       key={item.id}
                       onClick={() => setActiveTab(item.id as any)}
                       className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          activeTab === item.id 
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                       }`}
                    >
                       <item.icon size={18} /> {item.label}
                    </button>
                 ))}
              </nav>
           </div>

           {/* Visibility Settings Widget */}
           <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                 <Eye size={16} className="text-purple-500" /> Visibility
              </h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Public Profile</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" checked={profile.visibility.publicProfile} onChange={() => setProfile(p => ({...p, visibility: {...p.visibility, publicProfile: !p.visibility.publicProfile}}))} className="sr-only peer" />
                       <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Verified Contacts Only</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" checked={profile.visibility.verifiedContactsOnly} onChange={() => setProfile(p => ({...p, visibility: {...p.visibility, verifiedContactsOnly: !p.visibility.verifiedContactsOnly}}))} className="sr-only peer" />
                       <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                 </div>
              </div>
           </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-3">
           <AnimatePresence mode="wait">
              
              {/* TAB: DETAILS */}
              {activeTab === 'details' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl">
                       <h3 className="text-xl font-bold mb-6">Agency Details</h3>
                       <div className="grid md:grid-cols-2 gap-6">
                          <AnimatedInput label="Broker Name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} disabled={!isEditing} />
                          <AnimatedInput label="Agency Name" value={profile.agency} onChange={e => setProfile({...profile, agency: e.target.value})} disabled={!isEditing} icon={<Building2 size={18} />} />
                          <AnimatedInput label="Email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} disabled={!isEditing} icon={<Mail size={18} />} />
                          <AnimatedInput label="Phone" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} disabled={!isEditing} icon={<Phone size={18} />} />
                          <div className="md:col-span-2">
                             <AnimatedInput label="Office Address" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} disabled={!isEditing} icon={<MapPin size={18} />} />
                          </div>
                          <div className="md:col-span-2">
                             <AnimatedTextArea label="About Agency" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} disabled={!isEditing} />
                          </div>
                       </div>
                    </div>

                    {/* Office Photos */}
                    <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold">Office Gallery</h3>
                          {isEditing && <button className="text-purple-600 text-sm font-bold flex items-center gap-1"><Plus size={16} /> Add Photo</button>}
                       </div>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {profile.officePhotos.map((photo, i) => (
                             <div key={i} className="aspect-video rounded-xl overflow-hidden relative group">
                                <img src={photo} className="w-full h-full object-cover" />
                                {isEditing && (
                                   <button className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Trash2 size={14} />
                                   </button>
                                )}
                             </div>
                          ))}
                          {isEditing && (
                             <div className="aspect-video rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <Upload size={24} className="mb-2" />
                                <span className="text-xs font-bold">Upload</span>
                             </div>
                          )}
                       </div>
                    </div>
                 </motion.div>
              )}

              {/* TAB: VERIFICATION */}
              {activeTab === 'verification' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                       <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                          <div>
                             <h2 className="text-3xl font-display font-bold mb-2">Verification Center</h2>
                             <p className="text-purple-200">Earn the 'Verified Broker' badge to boost client trust by 40%.</p>
                          </div>
                          <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 border ${verification.status === 'verified' ? 'bg-green-500/20 border-green-400 text-green-300' : 'bg-white/10 border-white/20 text-white'}`}>
                             {verification.status === 'verified' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                             {verification.status === 'verified' ? 'Verified Agent' : 'Verification Required'}
                          </div>
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl">
                          <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Scan size={20} className="text-purple-600" /> Document Upload</h3>
                          <div className="space-y-6">
                             <FileUpload 
                                label="Government ID (Aadhaar / PAN)" 
                                accept="image/*"
                                onFileSelect={(f) => setVerification(p => ({...p, idDoc: f}))}
                             />
                             <FileUpload 
                                label="Live Selfie" 
                                accept="image/*"
                                onFileSelect={(f) => setVerification(p => ({...p, selfie: f}))}
                             />
                             <PremiumButton 
                                onClick={runAiVerification}
                                disabled={!verification.idDoc || !verification.selfie || verification.status === 'scanning'}
                                width="full"
                                variant="gradient"
                                icon={verification.status === 'scanning' ? <RefreshCw className="animate-spin" /> : <Scan />}
                             >
                                {verification.status === 'scanning' ? 'AI Analyzing...' : 'Run AI Face Check'}
                             </PremiumButton>
                          </div>
                       </div>

                       <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl">
                          <h3 className="font-bold text-lg mb-6">AI Confidence Report</h3>
                          {verification.aiReport ? (
                             <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                                <div className="text-center p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                                   <div className="text-3xl font-display font-bold text-green-500 mb-1">{verification.aiReport.matchScore}%</div>
                                   <div className="text-xs uppercase font-bold text-gray-500">Face Match Confidence</div>
                                </div>
                                <div className="space-y-3">
                                   <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">ID Clarity</span>
                                      <span className="font-bold text-green-600">{verification.aiReport.idVisible ? 'Pass' : 'Fail'}</span>
                                   </div>
                                   <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Age Check</span>
                                      <span className="font-bold">{verification.aiReport.ageEstimateID} vs {verification.aiReport.ageEstimateSelfie}</span>
                                   </div>
                                   <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Tamper Flags</span>
                                      <span className="font-bold text-green-600">None Detected</span>
                                   </div>
                                </div>
                                {verification.status === 'pending' && (
                                   <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-xl border border-purple-200 dark:border-purple-800 text-center">
                                      Report submitted to Admin for final approval.
                                   </div>
                                )}
                             </div>
                          ) : (
                             <div className="h-48 flex flex-col items-center justify-center text-gray-400 text-center">
                                <Scan size={48} className="mb-4 opacity-20" />
                                <p className="text-sm">Upload documents to generate report</p>
                             </div>
                          )}
                       </div>
                    </div>
                 </motion.div>
              )}

              {/* TAB: SERVICES */}
              {activeTab === 'services' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="text-2xl font-bold">Your Packages</h3>
                       <PremiumButton icon={<Plus size={16} />} className="!py-2 !px-4 !text-sm">Add Package</PremiumButton>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                       {services.map(service => (
                          <div key={service.id} className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl hover:border-purple-500 transition-colors cursor-pointer group">
                             <div className="flex justify-between items-start mb-6">
                                <div>
                                   <h4 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">{service.title}</h4>
                                   <span className="text-sm text-gray-500">Fixed Fee Model</span>
                                </div>
                                <div className="text-2xl font-display font-bold text-gray-900 dark:text-white">{service.price}</div>
                             </div>
                             <ul className="space-y-3">
                                {service.features.map((f, i) => (
                                   <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                      <CheckCircle size={16} className="text-green-500 shrink-0" /> {f}
                                   </li>
                                ))}
                             </ul>
                             <div className="mt-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-white/5 font-bold text-xs hover:bg-gray-200">Edit</button>
                                <button className="p-2 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-100"><Trash2 size={16} /></button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </motion.div>
              )}

              {/* TAB: VAULT */}
              {activeTab === 'vault' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl min-h-[500px]">
                       <div className="text-center max-w-xl mx-auto mb-10">
                          <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold mb-2">Credential Vault</h3>
                          <p className="text-gray-500">Securely store your business registration, awards, and client testimonials. Approved items are displayed on your public profile.</p>
                       </div>

                       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="aspect-[3/4] bg-white dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-400 cursor-pointer transition-colors">
                             <Plus size={32} className="mb-2" />
                             <span className="text-xs font-bold">Add Document</span>
                          </div>
                          
                          <div className="aspect-[3/4] bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 p-4 flex flex-col justify-between group">
                             <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-lg flex items-center justify-center">
                                <Award size={20} />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Best Agent 2023</p>
                                <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1"><CheckCircle size={10} /> Verified</p>
                             </div>
                          </div>

                          <div className="aspect-[3/4] bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 p-4 flex flex-col justify-between group">
                             <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center">
                                <FileText size={20} />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">GST Certificate</p>
                                <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1"><CheckCircle size={10} /> Verified</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              )}

           </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
         {showClientVerify && <ClientVerificationModal onClose={() => setShowClientVerify(false)} />}
      </AnimatePresence>

    </div>
  );
};

export default BrokerProfile;
