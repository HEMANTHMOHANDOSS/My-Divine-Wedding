
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Lock, ChevronRight, Heart, Users, Globe, 
  CheckCircle, Smartphone, Mail, Briefcase, X, Award, 
  Sparkles, Fingerprint, Loader2, ArrowRight, Eye, RefreshCw
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import PremiumButton from '../ui/PremiumButton';
import BrokerRegistration from './BrokerRegistration';

interface BrokerLoginProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

const IMAGES = [
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop", // Couple
  "https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=2000&auto=format&fit=crop", // Wedding Hands
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop", // Traditional
];

const BrokerLogin: React.FC<BrokerLoginProps> = ({ onBack, onLoginSuccess }) => {
  const [step, setStep] = useState<'login' | 'otp' | 'verify_license' | 'success' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState({ email: '', password: '', otp: '', licenseId: '' });
  
  // Gemini Verification State
  const [verificationResult, setVerificationResult] = useState<{valid: boolean; message: string} | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Background Image Rotator
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate Network Call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep('otp');
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp.length < 6) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep('success');
    setTimeout(onLoginSuccess, 2000);
  };

  const handleGeminiVerification = async () => {
    if (!formData.licenseId) return;
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        // Fallback Simulation
        await new Promise(resolve => setTimeout(resolve, 2000));
        const isValid = formData.licenseId.startsWith('DIV');
        setVerificationResult({
          valid: isValid,
          message: isValid ? "License Verified: Active Platinum Agent" : "Invalid License Format. Use DIV-XXXX."
        });
      } else {
        const ai = new GoogleGenAI({ apiKey });
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent({
          contents: [{ 
            role: 'user', 
            parts: [{ text: `Act as a verification system. Validate this Agent License ID: "${formData.licenseId}". 
            Rules: Must start with "DIV" or "MAT", followed by 4-6 numbers. 
            Return a JSON object: { "valid": boolean, "message": "string reason", "trustScore": number (0-100) }. 
            Do not use markdown formatting.` }] 
          }]
        });
        
        const text = result.response.text();
        const json = JSON.parse(text.replace(/```json|```/g, '').trim());
        setVerificationResult(json);
      }
    } catch (error) {
      setVerificationResult({ valid: false, message: "Verification service unavailable." });
    } finally {
      setIsVerifying(false);
    }
  };

  // If in registration mode, render the full registration wizard full-screen
  if (step === 'register') {
    return (
      <div className="fixed inset-0 z-50 bg-[#0f0518] text-white font-sans overflow-y-auto custom-scrollbar">
         <div className="min-h-screen py-10 px-4">
            <BrokerRegistration onComplete={onLoginSuccess} onBack={() => setStep('login')} />
         </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0518] text-white font-sans overflow-hidden flex">
      
      {/* LEFT PANEL: VISUALS (Desktop Only) */}
      <div className="hidden lg:flex w-7/12 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentImage}
            src={IMAGES[currentImage]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0518] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-[#0f0518]/50 to-transparent z-10" />

        <div className="relative z-20 p-16 flex flex-col justify-end h-full max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold text-gold-300 mb-6">
              <Award size={16} /> Premium Partner Network
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight mb-6">
              Unite Hearts with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Divine Precision</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Join the world's most trusted matrimonial brokerage network. Access exclusive profiles, AI-powered matchmaking tools, and verified family databases.
            </p>
          </motion.div>

          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold text-white">12k+</p>
              <p className="text-sm text-gray-400">Active Brokers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">₹45Cr</p>
              <p className="text-sm text-gray-400">Commission Paid</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm text-gray-400">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: LOGIN */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center items-center p-6 md:p-12 relative z-20 bg-[#0f0518] lg:bg-transparent">
         {/* Mobile Background Elements */}
         <div className="lg:hidden absolute inset-0 -z-10">
            <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-purple-900/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-pink-900/20 rounded-full blur-[100px]" />
         </div>

         <div className="w-full max-w-md">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
               <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10"><X size={16} /></div>
               <span className="text-sm font-bold">Back to Home</span>
            </button>

            <div className="mb-10 text-center lg:text-left">
               <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-purple-500/20 mb-6 mx-auto lg:mx-0">
                  <Briefcase size={32} />
               </div>
               <h2 className="text-3xl font-bold text-white mb-2">Partner Login</h2>
               <p className="text-gray-400">Welcome back. Please enter your details.</p>
            </div>

            <AnimatePresence mode="wait">
               
               {/* STEP 1: CREDENTIALS */}
               {step === 'login' && (
                  <motion.form 
                     key="login"
                     initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                     onSubmit={handleLogin}
                     className="space-y-5"
                  >
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Email or Agent ID</label>
                        <div className="relative group">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                           <input 
                              type="text" 
                              required
                              value={formData.email}
                              onChange={e => setFormData({...formData, email: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                              placeholder="broker@divine.com"
                           />
                        </div>
                     </div>

                     <div className="space-y-1">
                        <div className="flex justify-between ml-1">
                           <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                           <a href="#" className="text-xs font-bold text-purple-400 hover:text-purple-300">Forgot?</a>
                        </div>
                        <div className="relative group">
                           <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                           <input 
                              type="password" 
                              required
                              value={formData.password}
                              onChange={e => setFormData({...formData, password: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                              placeholder="••••••••"
                           />
                        </div>
                     </div>

                     <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                     </button>

                     <div className="pt-6 text-center">
                        <button type="button" onClick={() => setStep('verify_license')} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 w-full">
                           <Shield size={14} /> New Broker? Verify License
                        </button>
                     </div>
                  </motion.form>
               )}

               {/* STEP 2: OTP */}
               {step === 'otp' && (
                  <motion.div 
                     key="otp"
                     initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                     className="text-center"
                  >
                     <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <Smartphone size={32} className="text-purple-400" />
                     </div>
                     <h3 className="text-xl font-bold mb-2">Two-Step Verification</h3>
                     <p className="text-sm text-gray-400 mb-8">Enter the 6-digit code sent to your registered mobile ending in <span className="text-white">**88</span>.</p>

                     <form onSubmit={handleOtpVerify}>
                        <input 
                           type="text" 
                           maxLength={6}
                           value={formData.otp}
                           onChange={e => setFormData({...formData, otp: e.target.value.replace(/[^0-9]/g, '')})}
                           className="w-full bg-white/5 border border-white/10 rounded-xl py-4 text-center text-3xl font-mono tracking-[0.5em] text-white outline-none focus:border-purple-500 focus:bg-white/10 transition-all mb-6"
                           placeholder="000000"
                           autoFocus
                        />
                        <button 
                           type="submit"
                           disabled={loading || formData.otp.length < 6}
                           className="w-full py-4 bg-white text-purple-900 font-bold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                           {loading ? 'Verifying...' : 'Confirm Access'}
                        </button>
                     </form>
                     <button onClick={() => setStep('login')} className="mt-6 text-sm text-gray-500 hover:text-white">Cancel Login</button>
                  </motion.div>
               )}

               {/* STEP 3: LICENSE VERIFICATION (GEMINI) */}
               {step === 'verify_license' && (
                  <motion.div 
                     key="verify"
                     initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  >
                     <button onClick={() => setStep('login')} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white mb-6">
                        <ChevronRight size={14} className="rotate-180" /> Back to Login
                     </button>

                     <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Sparkles size={20} className="text-gold-400" /> AI License Check
                     </h3>

                     <div className="space-y-4">
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                           <p className="text-sm text-purple-200">Our AI assistant will validate your brokerage credentials instantly. Please enter your government issued license ID.</p>
                        </div>

                        <div className="space-y-1">
                           <label className="text-xs font-bold text-gray-500 ml-1 uppercase">License ID</label>
                           <div className="flex gap-2">
                              <input 
                                 type="text" 
                                 value={formData.licenseId}
                                 onChange={e => setFormData({...formData, licenseId: e.target.value})}
                                 className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-purple-500"
                                 placeholder="DIV-XXXX-YYYY"
                              />
                              <button 
                                 onClick={handleGeminiVerification}
                                 disabled={isVerifying || !formData.licenseId}
                                 className="px-4 bg-purple-600 rounded-xl text-white hover:bg-purple-500 disabled:opacity-50 transition-colors flex items-center justify-center"
                              >
                                 {isVerifying ? <RefreshCw className="animate-spin" /> : "Verify"}
                              </button>
                           </div>
                        </div>

                        {/* Verification Result */}
                        <AnimatePresence>
                           {verificationResult && (
                              <motion.div 
                                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                 className={`p-4 rounded-xl border ${verificationResult.valid ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}
                              >
                                 <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-1.5 rounded-full ${verificationResult.valid ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                                       {verificationResult.valid ? <CheckCircle size={16} /> : <X size={16} />}
                                    </div>
                                    <span className={`font-bold ${verificationResult.valid ? 'text-green-400' : 'text-red-400'}`}>
                                       {verificationResult.valid ? 'Verified Agent' : 'Verification Failed'}
                                    </span>
                                 </div>
                                 <p className="text-sm text-gray-300">{verificationResult.message}</p>
                                 
                                 {verificationResult.valid && (
                                    <button 
                                       className="mt-4 w-full py-2 bg-green-500 text-black font-bold rounded-lg text-sm hover:bg-green-400 transition-colors"
                                       onClick={() => setStep('register')}
                                    >
                                       Proceed to Registration
                                    </button>
                                 )}
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  </motion.div>
               )}

               {/* SUCCESS */}
               {step === 'success' && (
                  <motion.div 
                     key="success"
                     initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                     className="text-center py-10"
                  >
                     <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/40 animate-bounce">
                        <Fingerprint size={48} className="text-black" />
                     </div>
                     <h2 className="text-3xl font-bold text-white mb-2">Access Granted</h2>
                     <p className="text-gray-400">Loading Broker Dashboard...</p>
                  </motion.div>
               )}

            </AnimatePresence>
         </div>

         {/* Footer Links */}
         <div className="absolute bottom-6 w-full text-center">
            <div className="flex justify-center gap-6 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
               <a href="#" className="hover:text-white transition-colors">Terms</a>
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
               <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
         </div>
      </div>

    </div>
  );
};

export default BrokerLogin;
