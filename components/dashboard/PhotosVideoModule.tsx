
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Upload, Lock, Eye, Sparkles, Trash2, RefreshCw, 
  CheckCircle, AlertTriangle, Shield, Play, X, Crop, AlertCircle
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { analyzePhotoQuality, simulateEnhancement, verifySelfieMatch } from '../../utils/mockAI';

// Types
interface PhotoItem {
  id: string;
  url: string;
  privacy: 'public' | 'matches' | 'private';
  score: number;
  isEnhanced: boolean;
  isPrimary: boolean;
}

const PhotosVideoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'photos' | 'selfie' | 'video'>('photos');
  const [isUploading, setIsUploading] = useState(false);
  
  // --- MOCK DATA ---
  const [photos, setPhotos] = useState<PhotoItem[]>([
    { id: '1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop', privacy: 'public', score: 88, isEnhanced: false, isPrimary: true },
    { id: '2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop', privacy: 'matches', score: 72, isEnhanced: false, isPrimary: false },
  ]);

  const [selfieStatus, setSelfieStatus] = useState<'pending' | 'verifying' | 'verified' | 'failed'>('pending');
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  
  const [video, setVideo] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      
      // Simulate Processing
      const score = await analyzePhotoQuality(file);
      const url = URL.createObjectURL(file);
      
      const newPhoto: PhotoItem = {
        id: Date.now().toString(),
        url,
        privacy: 'public',
        score,
        isEnhanced: false,
        isPrimary: photos.length === 0
      };

      setPhotos(prev => [...prev, newPhoto]);
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleEnhancePhoto = async (id: string) => {
    // Simulate AI work
    const photo = photos.find(p => p.id === id);
    if (!photo) return;
    
    // Optimistic UI update showing loading state could go here
    await simulateEnhancement();
    
    setPhotos(prev => prev.map(p => 
      p.id === id ? { ...p, isEnhanced: true, score: Math.min(p.score + 10, 99) } : p
    ));
  };

  const togglePrivacy = (id: string) => {
    setPhotos(prev => prev.map(p => {
      if (p.id !== id) return p;
      const nextState = {
        'public': 'matches',
        'matches': 'private',
        'private': 'public'
      } as const;
      return { ...p, privacy: nextState[p.privacy] as any };
    }));
  };

  const handleSelfieUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setSelfieImage(url);
      setSelfieStatus('verifying');
      
      // Mock AI function returns 'matched' or 'failed'
      // We map this to our local status types
      const result = await verifySelfieMatch();
      setSelfieStatus(result === 'matched' ? 'verified' : 'failed');
    }
  };

  // Helper to check video duration
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };
        video.onerror = () => reject("Error loading video file");
        video.src = URL.createObjectURL(file);
    });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 1. Format Validation
      const validTypes = ['video/mp4', 'video/webm'];
      if (!validTypes.includes(file.type)) {
          setVideoError("Invalid format. Please upload MP4 or WebM files.");
          return;
      }

      // 2. Size Validation (50MB)
      if (file.size > 50 * 1024 * 1024) {
        setVideoError("Video file is too large. Maximum allowed size is 50MB.");
        return;
      }

      // 3. Duration Validation (30s - 60s)
      try {
          const duration = await getVideoDuration(file);
          // Allow a small buffer (e.g., 29.5s to 60.5s)
          if (duration < 30 || duration > 60) {
              setVideoError(`Video length must be between 30 and 60 seconds. (Current: ${Math.round(duration)}s)`);
              return;
          }
      } catch (err) {
          setVideoError("Unable to analyze video file. The file might be corrupted.");
          return;
      }

      const url = URL.createObjectURL(file);
      setVideo(url);
    }
  };

  // --- RENDER HELPERS ---
  
  const getPrivacyIcon = (type: string) => {
    switch (type) {
      case 'public': return <Eye size={14} className="text-green-500" />;
      case 'matches': return <Shield size={14} className="text-blue-500" />;
      case 'private': return <Lock size={14} className="text-red-500" />;
      default: return <Eye size={14} />;
    }
  };

  const getPrivacyLabel = (type: string) => {
    switch (type) {
      case 'public': return 'Visible to All';
      case 'matches': return 'Matches Only';
      case 'private': return 'Private (Locked)';
      default: return '';
    }
  };

  return (
    <div className="bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-white/20 dark:border-white/10 shadow-2xl min-h-[600px]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Camera className="text-purple-600 dark:text-gold-400" />
            Media Gallery
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your photos, verification, and intro video.</p>
        </div>
        
        {/* Overall Score */}
        <div className="flex items-center gap-3 bg-white dark:bg-white/5 px-4 py-2 rounded-xl border border-gray-100 dark:border-white/10">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-gray-400">Media Score</div>
            <div className="text-lg font-bold text-green-500">
               {Math.round(photos.reduce((acc, curr) => acc + curr.score, 0) / (photos.length || 1))}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-4 border-green-500 border-t-transparent animate-spin-slow" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-black/40 rounded-xl mb-8 w-full md:w-fit">
        {(['photos', 'selfie', 'video'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all relative ${
              activeTab === tab 
              ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' 
              : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            {tab} {tab === 'selfie' && selfieStatus === 'verified' && <CheckCircle size={12} className="inline text-green-500 ml-1" />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative min-h-[400px]">
        
        {/* PHOTOS TAB */}
        {activeTab === 'photos' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* Upload Area */}
            <div 
              onClick={() => photoInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
            >
              <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 group-hover:scale-110 transition-transform mb-4">
                {isUploading ? <RefreshCw className="animate-spin" /> : <Upload size={24} />}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Upload Photos</h3>
              <p className="text-sm text-gray-500">Drag & Drop or Click to Browse (Max 5MB)</p>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {photos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/5"
                  >
                    {/* Image */}
                    <div className="aspect-[4/5] relative overflow-hidden bg-gray-100 dark:bg-black/50">
                       <img 
                         src={photo.url} 
                         alt="Profile" 
                         className={`w-full h-full object-cover transition-all duration-700 ${photo.isEnhanced ? 'contrast-110 brightness-105' : ''} ${photo.privacy === 'private' ? 'blur-md group-hover:blur-none transition-all duration-300' : ''}`} 
                       />
                       
                       {/* Overlay Actions */}
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                          <div className="flex justify-between items-start">
                             <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white ${photo.isPrimary ? 'bg-purple-600' : 'bg-black/50'}`}>
                                {photo.isPrimary ? 'Primary' : 'Photo'}
                             </span>
                             <button onClick={() => handleDeletePhoto(photo.id)} className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors">
                                <Trash2 size={14} />
                             </button>
                          </div>
                          
                          <div className="flex gap-2">
                             <button 
                               onClick={() => handleEnhancePhoto(photo.id)}
                               className="flex-1 flex items-center justify-center gap-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold py-2 rounded-lg hover:bg-white/30 transition-colors"
                             >
                                <Sparkles size={12} /> {photo.isEnhanced ? 'Enhanced' : 'AI Fix'}
                             </button>
                             <button className="p-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30">
                                <Crop size={14} />
                             </button>
                          </div>
                       </div>
                    </div>

                    {/* Meta Controls */}
                    <div className="p-4 space-y-3">
                       {/* Privacy Toggle */}
                       <div 
                         onClick={() => togglePrivacy(photo.id)}
                         className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-white/5 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                       >
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                             {getPrivacyIcon(photo.privacy)}
                             {getPrivacyLabel(photo.privacy)}
                          </div>
                       </div>

                       {/* Quality Bar */}
                       <div>
                          <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 mb-1">
                             <span>Quality</span>
                             <span className={photo.score > 80 ? 'text-green-500' : 'text-amber-500'}>{photo.score}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${photo.score}%` }}
                               className={`h-full ${photo.score > 80 ? 'bg-green-500' : 'bg-amber-500'}`}
                             />
                          </div>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* SELFIE TAB */}
        {activeTab === 'selfie' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-10">
            <div className="w-full max-w-md space-y-8 text-center">
              
              <div className="relative mx-auto w-48 h-48 rounded-full border-4 border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-black/20">
                {selfieImage ? (
                  <>
                     <img src={selfieImage} alt="Selfie" className="w-full h-full object-cover" />
                     {selfieStatus === 'verifying' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                           <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                     )}
                     {selfieStatus === 'verified' && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                           <CheckCircle size={48} className="text-green-500 drop-shadow-lg" />
                        </div>
                     )}
                     {selfieStatus === 'failed' && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                           <AlertTriangle size={48} className="text-red-500 drop-shadow-lg" />
                        </div>
                     )}
                  </>
                ) : (
                  <div className="text-gray-400">
                     <Camera size={48} className="mx-auto mb-2 opacity-50" />
                     <p className="text-xs">No Selfie</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Identity</h3>
                 <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {selfieStatus === 'pending' && "Upload a clear selfie to get the 'Verified' badge. This photo will not be visible to others."}
                    {selfieStatus === 'verifying' && "Analyzing your facial features against your profile photos..."}
                    {selfieStatus === 'verified' && "Identity Verified Successfully! You now have a blue tick."}
                    {selfieStatus === 'failed' && "Verification Failed. Face did not match profile photos. Please try again."}
                 </p>
              </div>

              {selfieStatus !== 'verified' && (
                <div className="flex justify-center gap-4">
                   <input type="file" ref={selfieInputRef} accept="image/*" capture="user" className="hidden" onChange={handleSelfieUpload} />
                   <PremiumButton onClick={() => selfieInputRef.current?.click()}>
                      {selfieImage ? 'Retake Selfie' : 'Take Selfie'}
                   </PremiumButton>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* VIDEO TAB */}
        {activeTab === 'video' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            <AnimatePresence>
               {videoError && (
                  <motion.div 
                     initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                     className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3"
                  >
                     <AlertCircle size={20} />
                     <p className="text-sm font-bold">{videoError}</p>
                  </motion.div>
               )}
            </AnimatePresence>

            {!video ? (
               <div 
                 onClick={() => videoInputRef.current?.click()}
                 className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${videoError ? 'border-red-300 dark:border-red-900/50' : 'border-gray-300 dark:border-white/20'}`}
               >
                  <input type="file" ref={videoInputRef} className="hidden" accept="video/mp4,video/webm" onChange={handleVideoUpload} />
                  <div className="w-16 h-16 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center text-pink-500 mb-4">
                     <Play size={24} className="ml-1" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Upload Intro Video</h3>
                  <p className="text-sm text-gray-500">Max 60 seconds • MP4/WebM • Up to 50MB</p>
               </div>
            ) : (
               <div className="relative rounded-2xl overflow-hidden bg-black aspect-video group shadow-lg">
                  <video src={video} controls className="w-full h-full" />
                  <button 
                    onClick={() => { setVideo(null); setVideoError(null); }}
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                     <X size={20} />
                  </button>
               </div>
            )}
            
            <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-xl border border-purple-100 dark:border-white/5 flex gap-4">
               <div className="shrink-0 text-purple-600 dark:text-gold-400">
                  <Sparkles size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Video Tips</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                     Keep it short (30-60s). Introduce yourself, your hobbies, and what you're looking for. Good lighting and clear audio make a huge difference!
                  </p>
               </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default PhotosVideoModule;
