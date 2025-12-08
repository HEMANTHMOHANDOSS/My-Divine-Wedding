
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, CheckCircle, AlertTriangle, Upload, Camera, FileText, 
  Lock, Scan, Smartphone, ChevronRight, RefreshCw, Eye, Clock, FileCheck
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { FileUpload, AnimatedInput } from '../profile/ProfileFormElements';
import { validateField } from '../../utils/validation';
import { performOcrScan, verifyFaceMatch, OCRResult } from '../../utils/mockAI';

type IdType = 'aadhaar' | 'pan' | 'passport';
type VerificationStatus = 'idle' | 'pending' | 'under_review' | 'verified' | 'rejected' | 'scanning';

interface IdVerificationProps {
  currentStatus?: VerificationStatus;
  onStatusChange?: (status: VerificationStatus) => void;
}

const IdVerification: React.FC<IdVerificationProps> = ({ currentStatus = 'idle', onStatusChange }) => {
  const [activeId, setActiveId] = useState<IdType>('aadhaar');
  const [isScanning, setIsScanning] = useState(false);
  const [trustScore, setTrustScore] = useState(30);
  
  // Local Status override if prop not provided
  const [localStatus, setLocalStatus] = useState<VerificationStatus>('idle');
  const status = currentStatus !== 'idle' ? currentStatus : localStatus;
  
  // Form Data
  const [idNumber, setIdNumber] = useState('');
  const [scannedData, setScannedData] = useState<OCRResult | null>(null);
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [faceMatchScore, setFaceMatchScore] = useState(0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateStatus = (newStatus: VerificationStatus) => {
    setLocalStatus(newStatus);
    if (onStatusChange) onStatusChange(newStatus);
  };

  // Reset when changing ID Type
  const handleTypeChange = (type: IdType) => {
    setActiveId(type);
    setIdNumber('');
    setScannedData(null);
    setIdFront(null);
    setIdBack(null);
    setErrors({});
  };

  // Simulate OCR
  const handleIdUpload = async (file: File, side: 'front' | 'back') => {
    if (side === 'front') setIdFront(file);
    else setIdBack(file);

    // Only scan if front is uploaded
    if (side === 'front') {
      setIsScanning(true);
      try {
        const result = await performOcrScan(file, activeId);
        setScannedData(result);
        setIdNumber(result.idNumber);
        // Boost trust score for valid scan
        setTrustScore(prev => Math.min(prev + 20, 100));
      } catch (e) {
        console.error(e);
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleSelfieUpload = async (file: File) => {
    setSelfie(file);
    // Auto trigger face match if ID is present
    if (idFront) {
      setIsScanning(true);
      const result = await verifyFaceMatch(idFront, file);
      setFaceMatchScore(result.score);
      setIsScanning(false);
      // Boost trust score for face match
      if(result.match) setTrustScore(prev => Math.min(prev + 30, 100));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    const idErr = validateField(activeId, idNumber);
    if (idErr) errs.idNumber = idErr;
    if (!idFront) errs.idFront = "Front side is required";
    if (activeId === 'aadhaar' && !idBack) errs.idBack = "Back side is required";
    if (!selfie) errs.selfie = "Selfie is required";
    if (faceMatchScore < 50 && selfie) errs.faceMatch = "Face verification failed. Try again.";
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    updateStatus('pending');
    
    // Simulate Admin Pipeline Flow
    // 1. Pending (User Submitted) -> 2. Under Review (Admin Picked Up) -> 3. Verified
    setTimeout(() => {
       updateStatus('under_review');
       setTimeout(() => {
          updateStatus('verified');
          setTrustScore(100);
       }, 3000); // 3s Admin Review simulation
    }, 2000); // 2s Queue simulation
  };

  // --- RENDER STATUS TIMELINE ---
  const renderTimeline = () => {
     const stages = [
        { id: 'pending', label: 'Submitted', icon: Upload, activeStates: ['pending', 'under_review', 'verified'] },
        { id: 'under_review', label: 'Admin Review', icon: FileCheck, activeStates: ['under_review', 'verified'] },
        { id: 'verified', label: 'Verified', icon: CheckCircle, activeStates: ['verified'] }
     ];

     return (
        <div className="w-full max-w-2xl mx-auto mb-12">
           <div className="flex justify-between relative">
              {/* Line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-white/10 -z-10 rounded-full" />
              <div 
                 className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 rounded-full transition-all duration-1000" 
                 style={{ 
                    width: status === 'verified' ? '100%' : status === 'under_review' ? '50%' : status === 'pending' ? '10%' : '0%' 
                 }} 
              />

              {stages.map((stage) => {
                 const isActive = stage.activeStates.includes(status);
                 const isCurrent = status === stage.id;
                 const Icon = stage.icon;

                 return (
                    <div key={stage.id} className="flex flex-col items-center gap-2 bg-white dark:bg-black p-2 rounded-xl">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500
                          ${isActive 
                             ? 'bg-green-500 border-green-200 dark:border-green-900 text-white shadow-lg shadow-green-500/30' 
                             : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400'
                          }
                          ${isCurrent ? 'scale-110' : ''}
                       `}>
                          <Icon size={20} />
                       </div>
                       <span className={`text-xs font-bold ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                          {stage.label}
                       </span>
                    </div>
                 )
              })}
           </div>
           
           {/* Context Message */}
           <div className="text-center mt-6">
              {status === 'pending' && <p className="text-sm text-gray-500 animate-pulse">Your documents are queued for AI pre-screening...</p>}
              {status === 'under_review' && <p className="text-sm text-amber-500 font-bold animate-pulse">Manual verification by Admin in progress...</p>}
           </div>
        </div>
     );
  }

  // --- VIEW: SUCCESS / VERIFIED ---
  if (status === 'verified') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-[2.5rem] border border-white/20 dark:border-white/10"
      >
        {renderTimeline()}
        
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6 shadow-xl shadow-green-500/20">
          <Shield size={48} />
        </div>
        <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Identity Verified</h2>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg mb-8">
          Thank you for verifying your identity. You now have full access to all premium features and a "Verified" badge on your profile.
        </p>
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/20 flex flex-col items-center">
            <span className="text-green-600 font-bold text-lg">100%</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Trust Score</span>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/20 flex flex-col items-center">
            <span className="text-green-600 font-bold text-lg uppercase">{activeId}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Verified ID</span>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/20 flex flex-col items-center">
            <span className="text-green-600 font-bold text-lg">High</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Face Match</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- VIEW: PENDING / REVIEW ---
  if (status === 'pending' || status === 'under_review') {
     return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
           {renderTimeline()}
           <div className="p-8 bg-white/60 dark:bg-white/5 rounded-3xl border border-white/20 text-center max-w-md">
              <RefreshCw size={40} className="mx-auto text-purple-600 mb-4 animate-spin" />
              <h3 className="text-2xl font-bold mb-2">Verification in Progress</h3>
              <p className="text-gray-500 dark:text-gray-400">
                 Our team is currently reviewing your {activeId.toUpperCase()} and selfie match. This usually takes 2-5 minutes.
              </p>
           </div>
        </div>
     )
  }

  // --- VIEW: FORM ---
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
             <Shield className="text-purple-600 dark:text-gold-400" />
             ID Verification
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Verify your government ID to unlock premium features and build trust.
          </p>
        </div>

        {/* Trust Score Card */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-lg">
           <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full rotate-[-90deg]">
                 <circle cx="32" cy="32" r="28" stroke="rgba(100,100,100,0.1)" strokeWidth="4" fill="none" />
                 <motion.circle 
                   cx="32" cy="32" r="28" stroke={trustScore > 70 ? "#22c55e" : "#a855f7"} strokeWidth="4" fill="none" 
                   strokeDasharray="175.9" 
                   initial={{ strokeDashoffset: 175.9 }}
                   animate={{ strokeDashoffset: 175.9 - (175.9 * trustScore) / 100 }}
                   transition={{ duration: 1.5 }}
                   strokeLinecap="round" 
                 />
              </svg>
              <span className="absolute text-sm font-bold">{trustScore}%</span>
           </div>
           <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Trust Score</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Profile Strength</div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COL: Document Upload */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
              
              {/* ID Tabs */}
              <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl mb-8">
                 {(['aadhaar', 'pan', 'passport'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => handleTypeChange(type)}
                      className={`flex-1 py-3 rounded-lg text-sm font-bold capitalize transition-all ${
                         activeId === type 
                         ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' 
                         : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                      }`}
                    >
                       {type}
                    </button>
                 ))}
              </div>

              <div className="space-y-6 relative">
                 {/* Scanning Overlay */}
                 <AnimatePresence>
                    {isScanning && (
                       <motion.div 
                         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                         className="absolute inset-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center"
                       >
                          <div className="relative w-20 h-20 mb-4">
                             <Scan size={80} className="text-purple-600 dark:text-gold-400 absolute inset-0 opacity-50" />
                             <motion.div 
                               animate={{ y: [0, 80, 0] }} 
                               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                               className="w-full h-1 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,1)]"
                             />
                          </div>
                          <h3 className="text-lg font-bold">Scanning Document...</h3>
                          <p className="text-sm text-gray-500">Extracting details securely via OCR</p>
                       </motion.div>
                    )}
                 </AnimatePresence>

                 {/* Uploads */}
                 <div className="grid md:grid-cols-2 gap-6">
                    <div>
                       <FileUpload 
                          label={`${activeId.toUpperCase()} Front Side`} 
                          accept="image/*" 
                          onFileSelect={(f) => handleIdUpload(f, 'front')} 
                          error={errors.idFront}
                       />
                       {idFront && (
                          <div className="mt-2 text-xs text-green-600 flex items-center gap-1 font-bold">
                             <CheckCircle size={12} /> Scan Successful
                          </div>
                       )}
                    </div>
                    {activeId === 'aadhaar' && (
                       <FileUpload 
                          label={`${activeId.toUpperCase()} Back Side`} 
                          accept="image/*" 
                          onFileSelect={(f) => handleIdUpload(f, 'back')} 
                          error={errors.idBack}
                       />
                    )}
                 </div>

                 {/* Auto-filled Info */}
                 <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                    <h4 className="font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                       <FileText size={18} className="text-purple-500" /> Extracted Details
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                       <AnimatedInput 
                          label={`${activeId.toUpperCase()} Number`} 
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                          placeholder={activeId === 'aadhaar' ? '0000 0000 0000' : 'ABCDE1234F'}
                          error={errors.idNumber}
                          icon={<Shield size={18} />}
                       />
                       <div className="relative opacity-70 pointer-events-none">
                          <AnimatedInput 
                             label="Name on ID" 
                             value={scannedData?.name || ''} 
                             readOnly
                             icon={<Eye size={18} />}
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Security Notice */}
           <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl flex gap-4 border border-purple-100 dark:border-purple-900/30">
              <div className="shrink-0 p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600">
                 <Lock size={20} />
              </div>
              <div>
                 <h4 className="font-bold text-sm text-purple-900 dark:text-purple-300">256-bit AES Encryption</h4>
                 <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Your ID documents are encrypted and stored securely. They are only used for verification purposes and are never shared with other users.
                 </p>
              </div>
           </div>
        </div>

        {/* RIGHT COL: Selfie & Match */}
        <div className="space-y-8">
           <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Camera className="text-purple-500" /> Face Verification
              </h3>

              <div className="text-center space-y-6">
                 {/* Selfie Preview / Camera */}
                 <div className="relative mx-auto w-48 h-48 bg-gray-100 dark:bg-white/5 rounded-full border-4 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center overflow-hidden group">
                    {selfie ? (
                       <img src={URL.createObjectURL(selfie)} alt="Selfie" className="w-full h-full object-cover" />
                    ) : (
                       <div className="text-gray-400">
                          <Smartphone size={40} className="mx-auto mb-2 opacity-50" />
                          <span className="text-xs">Take a Selfie</span>
                       </div>
                    )}
                    
                    {/* Hover Upload */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                       <FileUpload 
                          label="" 
                          accept="image/*" 
                          onFileSelect={handleSelfieUpload} 
                          error={errors.selfie}
                       />
                       <span className="text-white text-xs font-bold absolute pointer-events-none">Tap to Capture</span>
                    </div>
                 </div>

                 {/* Match Score Indicator */}
                 <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                       <span>AI Face Match</span>
                       <span className={faceMatchScore > 75 ? 'text-green-500' : 'text-amber-500'}>{faceMatchScore}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${faceMatchScore}%` }}
                          className={`h-full ${faceMatchScore > 75 ? 'bg-green-500' : 'bg-amber-500'}`}
                       />
                    </div>
                    {errors.faceMatch && (
                       <p className="text-xs text-red-500 font-bold mt-2 flex items-center gap-1 justify-center">
                          <AlertTriangle size={12} /> {errors.faceMatch}
                       </p>
                    )}
                 </div>

                 <p className="text-xs text-gray-500 leading-relaxed">
                    Ensure your face is clearly visible and matches the photo on your ID document. No glasses or masks.
                 </p>
              </div>
           </div>

           {/* Submit Action */}
           <PremiumButton 
              onClick={handleSubmit} 
              width="full" 
              variant="gradient"
              disabled={status === 'pending' || isScanning}
              icon={status === 'pending' ? <RefreshCw className="animate-spin" /> : <CheckCircle />}
           >
              {status === 'pending' ? 'Verifying...' : 'Submit for Verification'}
           </PremiumButton>
        </div>

      </div>
    </div>
  );
};

export default IdVerification;
