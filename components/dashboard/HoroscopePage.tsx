
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, Upload, FileText, Sparkles, CheckCircle, AlertTriangle, 
  ChevronRight, RefreshCw, Star, Sun, Shield, Lock, Download 
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { FileUpload, AnimatedInput, AnimatedSelect } from '../profile/ProfileFormElements';
import { RAASI_LIST, NAKSHATRA_LIST } from '../../constants';
import { extractHoroscopeData, compareHoroscopes, HoroscopeData, MatchReport } from '../../utils/mockAI';

const HoroscopePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'create' | 'match'>('upload');
  
  return (
    <div className="bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-white/20 dark:border-white/10 shadow-2xl min-h-[600px]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Moon className="text-purple-600 dark:text-gold-400" />
            Horoscope & Jathagam
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your astrological profile and compatibility.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-full md:w-auto">
           {(['upload', 'create', 'match'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${
                   activeTab === tab 
                   ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' 
                   : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                }`}
              >
                 {tab === 'upload' ? 'Upload PDF' : tab === 'create' ? 'Chart Creator' : 'AI Matching'}
              </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
         {activeTab === 'upload' && <UploadView key="upload" />}
         {activeTab === 'create' && <CreatorView key="create" />}
         {activeTab === 'match' && <MatchView key="match" />}
      </AnimatePresence>

    </div>
  );
};

// --- UPLOAD VIEW ---
const UploadView: React.FC = () => {
   const [file, setFile] = useState<File | null>(null);
   const [isScanning, setIsScanning] = useState(false);
   const [data, setData] = useState<HoroscopeData | null>(null);

   const handleUpload = async (f: File) => {
      setFile(f);
      setIsScanning(true);
      const res = await extractHoroscopeData(f);
      setData(res);
      setIsScanning(false);
   };

   return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
         <div className="text-center mb-8">
            <h3 className="text-xl font-bold mb-2">Upload Existing Jathagam</h3>
            <p className="text-sm text-gray-500">Supported formats: PDF, JPG (Max 5MB)</p>
         </div>

         {!data ? (
            <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-8 border border-dashed border-gray-300 dark:border-white/20">
               {isScanning ? (
                  <div className="flex flex-col items-center py-10">
                     <RefreshCw size={40} className="text-purple-600 animate-spin mb-4" />
                     <p className="font-bold">Analyzing Horoscope...</p>
                     <p className="text-xs text-gray-500 mt-2">Extracting Raasi, Nakshatra, and Dosham details</p>
                  </div>
               ) : (
                  <FileUpload label="Select Horoscope File" accept=".pdf,.jpg,.jpeg,.png" onFileSelect={handleUpload} />
               )}
            </div>
         ) : (
            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-8 border border-purple-100 dark:border-white/10">
               <div className="flex items-center gap-3 mb-6 text-green-600 font-bold">
                  <CheckCircle size={24} /> Successfully Extracted
               </div>
               
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white dark:bg-black/20 p-4 rounded-xl">
                     <p className="text-xs text-gray-500 uppercase font-bold">Raasi</p>
                     <p className="text-lg font-bold capitalize">{data.raasi}</p>
                  </div>
                  <div className="bg-white dark:bg-black/20 p-4 rounded-xl">
                     <p className="text-xs text-gray-500 uppercase font-bold">Nakshatra</p>
                     <p className="text-lg font-bold capitalize">{data.nakshatra}</p>
                  </div>
                  <div className="bg-white dark:bg-black/20 p-4 rounded-xl">
                     <p className="text-xs text-gray-500 uppercase font-bold">Lagnam</p>
                     <p className="text-lg font-bold capitalize">{data.lagnam}</p>
                  </div>
                  <div className="bg-white dark:bg-black/20 p-4 rounded-xl">
                     <p className="text-xs text-gray-500 uppercase font-bold">Dosham</p>
                     <p className="text-lg font-bold capitalize text-amber-600">{data.dosham.length > 0 ? data.dosham.join(', ') : 'None'}</p>
                  </div>
               </div>

               <div className="flex gap-4">
                  <PremiumButton onClick={() => { setData(null); setFile(null); }} variant="outline" className="flex-1">Re-upload</PremiumButton>
                  <PremiumButton className="flex-1">Save to Profile</PremiumButton>
               </div>
            </div>
         )}
      </motion.div>
   );
};

// --- CREATOR VIEW (Interactive Chart) ---
const CreatorView: React.FC = () => {
   const [raasi, setRaasi] = useState('');
   const [lagnam, setLagnam] = useState('');
   const [generated, setGenerated] = useState(false);

   // South Indian Chart Grid Mapping
   // 12 Boxes: 1=Meena, 2=Mesha... 12=Simha... 
   // Visual Grid is 4x4. Center 2x2 is empty.
   // Row 1: 1, 2, 3, 4
   // Row 2: 5, -, -, 8
   // Row 3: 9, -, -, 12 -> Wait, standard is clockwise? 
   // Let's use the provided standard mapping from thought process:
   // Meena(1) | Mesha(2) | Rishaba(3) | Mithuna(4)
   // Kumbha(12) |        |          | Kataka(5)
   // Makara(11) |        |          | Simha(6)
   // Dhanusu(10)| Vrichika(9)| Thula(8) | Kanni(7)
   // NOTE: RAASI_LIST index 0 is Mesha. So Mesha is index 0.
   
   // Mapping RAASI_LIST keys to Grid Position (1-12 clockwise from Aries/Mesha?)
   // No, South Indian chart is fixed.
   // Box 2 is ALWAYS Mesha (Aries). Box 3 is Rishaba.
   // Let's define the fixed zodiacs for the visual boxes.
   const gridLayout = [
      { id: 'meena', label: 'Pisces' }, { id: 'mesha', label: 'Aries' }, { id: 'vrishabha', label: 'Taurus' }, { id: 'mithuna', label: 'Gemini' },
      { id: 'kumbha', label: 'Aquarius' }, { id: 'center', label: '' }, { id: 'center', label: '' }, { id: 'karka', label: 'Cancer' },
      { id: 'makara', label: 'Capricorn' }, { id: 'center', label: '' }, { id: 'center', label: '' }, { id: 'simha', label: 'Leo' },
      { id: 'dhanu', label: 'Sagittarius' }, { id: 'vrishchika', label: 'Scorpio' }, { id: 'tula', label: 'Libra' }, { id: 'kanya', label: 'Virgo' },
   ];

   return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col lg:flex-row gap-8">
         <div className="flex-1 space-y-6">
            <h3 className="text-xl font-bold">Generate Digital Jathagam</h3>
            <div className="grid grid-cols-2 gap-4">
                <AnimatedSelect 
                   label="Raasi (Moon Sign)" 
                   value={raasi} onChange={(e) => setRaasi(e.target.value)} 
                   options={RAASI_LIST.map(r => ({value: r.id, label: r.english}))} 
                />
                <AnimatedSelect 
                   label="Lagnam (Ascendant)" 
                   value={lagnam} onChange={(e) => setLagnam(e.target.value)} 
                   options={RAASI_LIST.map(r => ({value: r.id, label: r.english}))} 
                />
            </div>
            {/* Additional fields would go here */}
            <PremiumButton onClick={() => setGenerated(true)} width="full" variant="gradient" disabled={!raasi || !lagnam}>
               Generate Chart
            </PremiumButton>
         </div>

         {/* CHART VISUALIZER */}
         <div className="flex-1 flex justify-center items-center bg-orange-50 dark:bg-orange-900/10 rounded-3xl p-6 border border-orange-100 dark:border-white/5">
            <div className="w-full max-w-[400px] aspect-square grid grid-cols-4 grid-rows-4 border-2 border-orange-800 dark:border-orange-400 bg-white dark:bg-black shadow-xl">
               {gridLayout.map((box, i) => {
                  if (box.id === 'center') return <div key={i} className="bg-orange-50 dark:bg-white/5 border-none" />;
                  
                  const isRaasi = raasi === box.id;
                  const isLagnam = lagnam === box.id;

                  return (
                     <div key={i} className="border border-orange-800/30 dark:border-orange-400/30 p-1 relative flex flex-col justify-between">
                        <span className="text-[8px] uppercase font-bold text-gray-400 absolute top-1 left-1">{box.label.substring(0,3)}</span>
                        
                        <div className="flex flex-col items-center justify-center h-full gap-1">
                           {isRaasi && <span className="text-xs font-bold text-purple-600 bg-purple-100 px-1 rounded">Raasi</span>}
                           {isLagnam && <span className="text-xs font-bold text-red-600 bg-red-100 px-1 rounded">Lag</span>}
                        </div>
                     </div>
                  )
               })}
               
               {/* Center Info */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[45%] h-[45%] flex flex-col items-center justify-center text-center">
                     <span className="text-orange-800 dark:text-orange-400 font-display font-bold text-xl opacity-20">Rasi</span>
                     {generated && <span className="text-xs text-green-600 font-bold bg-white/80 px-2 py-1 rounded mt-2 shadow-sm">Generated</span>}
                  </div>
               </div>
            </div>
         </div>
      </motion.div>
   );
};

// --- MATCH VIEW ---
const MatchView: React.FC = () => {
   const [isMatching, setIsMatching] = useState(false);
   const [report, setReport] = useState<MatchReport | null>(null);

   const handleMatch = async () => {
      setIsMatching(true);
      setReport(null);
      const res = await compareHoroscopes({}, {});
      setIsMatching(false);
      setReport(res);
   };

   return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
         {!report ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-6">
               <div className="flex items-center gap-8">
                  <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center border-4 border-dashed border-gray-300 dark:border-white/20">
                     <span className="text-xs font-bold text-gray-500">You</span>
                  </div>
                  <div className="text-purple-500 font-bold text-xl">VS</div>
                  <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center border-4 border-dashed border-gray-300 dark:border-white/20 cursor-pointer hover:bg-gray-200 transition-colors">
                     <span className="text-xs font-bold text-gray-500">+ Profile</span>
                  </div>
               </div>
               
               <PremiumButton onClick={handleMatch} variant="gradient" disabled={isMatching}>
                  {isMatching ? 'Calculating Poruthams...' : 'Check Compatibility'}
               </PremiumButton>
            </div>
         ) : (
            <div className="bg-white/60 dark:bg-white/5 rounded-3xl p-8 border border-white/20 shadow-xl">
               <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                     <svg className="w-full h-full rotate-[-90deg]">
                       <circle cx="64" cy="64" r="56" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="8" fill="none" />
                       <motion.circle 
                         cx="64" cy="64" r="56" stroke="#a855f7" strokeWidth="8" fill="none" 
                         strokeDasharray="351.8" 
                         initial={{ strokeDashoffset: 351.8 }}
                         animate={{ strokeDashoffset: 351.8 - (351.8 * report.totalScore) / 10 }}
                         transition={{ duration: 1.5 }}
                         strokeLinecap="round" 
                       />
                     </svg>
                     <div className="absolute text-center">
                        <span className="text-3xl font-bold">{report.totalScore}/10</span>
                        <span className="block text-[10px] uppercase font-bold text-gray-500">Poruthams</span>
                     </div>
                  </div>
                  
                  <div className="flex-1">
                     <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        {report.verdict === 'excellent' ? 'Excellent Match' : 'Good Match'}
                        {report.verdict === 'excellent' && <Sparkles className="text-gold-400" />}
                     </h3>
                     <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                        {report.doshamStatus}
                     </p>
                     <PremiumButton onClick={() => setReport(null)} variant="outline" className="!py-2 !text-xs">New Check</PremiumButton>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(report.poruthams).map(([key, val]) => (
                     <div key={key} className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2
                        ${val ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30'}
                     `}>
                        {val ? <CheckCircle size={18} className="text-green-600" /> : <AlertTriangle size={18} className="text-red-500" />}
                        <span className="text-xs font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </motion.div>
   );
};

export default HoroscopePage;
