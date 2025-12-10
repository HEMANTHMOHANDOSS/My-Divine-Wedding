import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, User, MapPin, FileText, Upload, CheckCircle, AlertTriangle, 
  ArrowRight, ArrowLeft, Shield, Star, Briefcase, Award, Loader2, Mail, Globe
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput, AnimatedPhoneInput, AnimatedTextArea, FileUpload, TagSelector, AnimatedSelect, EmailOtpVerifier } from '../profile/ProfileFormElements';
import { validateField } from '../../utils/validation';
import { GoogleGenAI } from "@google/genai";

interface BrokerRegistrationProps {
  onComplete: () => void;
  onBack: () => void;
}

const STEPS = [
  { id: 0, title: 'Agency Info', icon: <Building2 size={18} /> },
  { id: 1, title: 'Identity', icon: <User size={18} /> },
  { id: 2, title: 'Services', icon: <Briefcase size={18} /> },
  { id: 3, title: 'Portfolio', icon: <Star size={18} /> },
  { id: 4, title: 'Review', icon: <Shield size={18} /> },
];

const COMMUNITIES = ['Iyer', 'Iyengar', 'Mudaliar', 'Nadar', 'Vanniyar', 'Chettiar', 'Gounder', 'Christian', 'Muslim', 'Jain'];

const BrokerRegistration: React.FC<BrokerRegistrationProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ status: 'idle' | 'analyzing' | 'valid' | 'invalid', message: string }>({ status: 'idle', message: '' });
  const [emailVerified, setEmailVerified] = useState(false);

  const [formData, setFormData] = useState({
    // Agency
    agencyName: '',
    gstNumber: '',
    officeAddress: '',
    licenseFile: null as File | null,
    
    // Identity
    fullName: '',
    email: '',
    mobile: '',
    mobileCode: '+91',
    emergencyContact: '',
    
    // Services
    yearsExperience: '',
    matchesCount: '',
    communities: [] as string[],
    pricingModel: '', // Commission, Fixed, Hybrid
    serviceFee: '',
    
    // Portfolio
    portfolioImages: [] as File[],
    testimonials: '',
    
    // Consent
    agreedToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- HANDLERS ---

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error
    if (errors[field]) {
      setErrors(prev => {
        const newErr = { ...prev };
        delete newErr[field];
        return newErr;
      });
    }
  };

  // AI Document Analysis Mock
  const analyzeDocument = async (file: File) => {
    setFormData(prev => ({ ...prev, licenseFile: file }));
    setAiAnalysis({ status: 'analyzing', message: 'Gemini AI is verifying document authenticity...' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock Success
      setAiAnalysis({ 
        status: 'valid', 
        message: 'Verified: "Alpha Matrimony Services" (Reg: 2023)' 
      });
      
      // Auto-fill agency name if empty (Mock behavior)
      if (!formData.agencyName) {
         handleChange('agencyName', 'Alpha Matrimony Services');
      }
    } catch (error) {
      setAiAnalysis({ status: 'invalid', message: 'Could not verify document clarity. Please upload a clearer copy.' });
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 0) {
      if (!formData.agencyName) newErrors.agencyName = "Agency Name is required";
      if (!formData.officeAddress) newErrors.officeAddress = "Office Address is required";
      if (!formData.licenseFile) newErrors.licenseFile = "Business License/GST is required";
    }

    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = "Full Name is required";
      if (!emailVerified) newErrors.email = "Please verify your official email";
      if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    }

    if (currentStep === 2) {
      if (!formData.yearsExperience) newErrors.yearsExperience = "Experience is required";
      if (!formData.communities.length) newErrors.communities = "Select at least one community";
      if (!formData.pricingModel) newErrors.pricingModel = "Pricing Model is required";
    }

    if (currentStep === 4) {
      if (!formData.agreedToTerms) newErrors.terms = "You must agree to the Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step === 4) {
        handleSubmit();
      } else {
        setStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(5); // Success View
    }, 2000);
  };

  // --- RENDERERS ---

  const renderSuccess = () => (
    <div className="text-center py-10">
      <motion.div 
        initial={{ scale: 0 }} animate={{ scale: 1 }} 
        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30"
      >
        <CheckCircle size={48} className="text-white" />
      </motion.div>
      <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">Registration Successful!</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
        Welcome to the Divine Partner Network. Your profile is currently <b>Pending Approval</b>.
      </p>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
        {/* Badge Request */}
        <div className="bg-white dark:bg-white/5 border border-purple-200 dark:border-white/10 p-6 rounded-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-16 bg-purple-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150" />
           <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                 <Award size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2">Get Verified Badge</h4>
              <p className="text-xs text-gray-500 mb-4">Build trust with families by verifying your agency identity.</p>
              <button className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:gap-2 transition-all">
                 Request Verification <ArrowRight size={12} />
              </button>
           </div>
        </div>

        {/* Premium Kit */}
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/30 p-6 rounded-3xl relative overflow-hidden group">
           <div className="relative z-10">
              <div className="w-12 h-12 bg-white/50 dark:bg-black/20 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                 <Star size={24} className="fill-amber-600" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-amber-900 dark:text-amber-100">Pro Broker Kit</h4>
              <p className="text-xs text-amber-800/70 dark:text-amber-200/70 mb-4">Get 50 free leads, featured listing, and CRM tools.</p>
              <button className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 hover:gap-2 transition-all">
                 View Upgrade Options <ArrowRight size={12} />
              </button>
           </div>
        </div>
      </div>

      <div className="mt-12">
         <PremiumButton onClick={onComplete} variant="primary" className="!px-10">
            Go to Dashboard
         </PremiumButton>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      {step < 5 && (
        <div className="mb-8">
           <div className="flex justify-between items-center mb-6">
              <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors text-sm font-bold">
                 <ArrowLeft size={16} /> Cancel
              </button>
              <div className="text-right">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Partner Registration</h2>
                 <p className="text-xs text-gray-500">Step {step + 1} of 5</p>
              </div>
           </div>
           
           {/* Progress Bar */}
           <div className="relative h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${((step + 1) / 5) * 100}%` }}
                 className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-500"
              />
           </div>
           
           <div className="flex justify-between mt-4 px-2">
              {STEPS.map((s, idx) => (
                 <div key={s.id} className={`flex flex-col items-center gap-2 transition-colors ${step >= idx ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                    <div className={`p-2 rounded-full border-2 ${step >= idx ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-white/10'}`}>
                       {s.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase hidden md:block">{s.title}</span>
                 </div>
              ))}
           </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden min-h-[500px]">
         <AnimatePresence mode="wait">
            
            {/* STEP 0: AGENCY DETAILS */}
            {step === 0 && (
               <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center mb-8">
                     <h3 className="text-xl font-bold">Agency Information</h3>
                     <p className="text-sm text-gray-500">Tell us about your matchmaking business.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <AnimatedInput 
                           label="Agency / Company Name" 
                           value={formData.agencyName} 
                           onChange={e => handleChange('agencyName', e.target.value)}
                           error={errors.agencyName}
                           icon={<Building2 size={18} />}
                        />
                        <AnimatedTextArea 
                           label="Office Address" 
                           value={formData.officeAddress} 
                           onChange={e => handleChange('officeAddress', e.target.value)}
                           error={errors.officeAddress}
                           placeholder="Full registered address..."
                        />
                     </div>

                     <div className="space-y-4">
                        <div className={`p-6 rounded-2xl border-2 border-dashed transition-all ${
                           aiAnalysis.status === 'valid' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 
                           aiAnalysis.status === 'invalid' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' :
                           'border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5'
                        }`}>
                           <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                              <Upload size={16} /> Upload License / GST
                           </h4>
                           <FileUpload 
                              label="" 
                              accept="image/*,application/pdf"
                              onFileSelect={analyzeDocument}
                              error={errors.licenseFile}
                           />
                           
                           {/* AI Feedback */}
                           <AnimatePresence>
                              {aiAnalysis.status !== 'idle' && (
                                 <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className={`mt-4 text-xs p-3 rounded-xl flex items-start gap-2 ${
                                       aiAnalysis.status === 'analyzing' ? 'bg-blue-50 text-blue-600' :
                                       aiAnalysis.status === 'valid' ? 'bg-green-100 text-green-700' :
                                       'bg-red-100 text-red-700'
                                    }`}
                                 >
                                    {aiAnalysis.status === 'analyzing' ? <Loader2 size={14} className="animate-spin mt-0.5" /> : 
                                     aiAnalysis.status === 'valid' ? <CheckCircle size={14} className="mt-0.5" /> : 
                                     <AlertTriangle size={14} className="mt-0.5" />}
                                    <span className="font-medium">{aiAnalysis.message}</span>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* STEP 1: IDENTITY */}
            {step === 1 && (
               <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center mb-8">
                     <h3 className="text-xl font-bold">Broker Identity</h3>
                     <p className="text-sm text-gray-500">Contact details for official communication.</p>
                  </div>

                  <div className="max-w-md mx-auto space-y-6">
                     <AnimatedInput 
                        label="Full Name" 
                        value={formData.fullName} 
                        onChange={e => handleChange('fullName', e.target.value)}
                        error={errors.fullName}
                        icon={<User size={18} />}
                     />
                     
                     <EmailOtpVerifier 
                        email={formData.email}
                        onEmailChange={(val) => handleChange('email', val)}
                        onVerified={(status) => setEmailVerified(status)}
                        error={errors.email}
                     />

                     <div className="grid grid-cols-2 gap-4">
                        <AnimatedPhoneInput 
                           label="Business Phone"
                           value={formData.mobile}
                           countryCode={formData.mobileCode}
                           onCountryCodeChange={c => handleChange('mobileCode', c)}
                           onPhoneChange={p => handleChange('mobile', p)}
                           error={errors.mobile}
                        />
                        <AnimatedInput 
                           label="Emergency Contact (Optional)" 
                           value={formData.emergencyContact} 
                           onChange={e => handleChange('emergencyContact', e.target.value)}
                        />
                     </div>
                  </div>
               </motion.div>
            )}

            {/* STEP 2: SERVICES */}
            {step === 2 && (
               <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center mb-8">
                     <h3 className="text-xl font-bold">Expertise & Services</h3>
                     <p className="text-sm text-gray-500">Define your market and pricing.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div className="flex gap-4">
                           <AnimatedInput 
                              label="Years Experience" 
                              value={formData.yearsExperience} 
                              onChange={e => handleChange('yearsExperience', e.target.value)}
                              numericOnly
                              error={errors.yearsExperience}
                           />
                           <AnimatedInput 
                              label="Successful Matches" 
                              value={formData.matchesCount} 
                              onChange={e => handleChange('matchesCount', e.target.value)}
                              numericOnly
                           />
                        </div>
                        
                        <TagSelector 
                           label="Primary Communities Served" 
                           options={COMMUNITIES} 
                           selected={formData.communities} 
                           onChange={tags => handleChange('communities', tags)}
                        />
                        {errors.communities && <p className="text-xs text-red-500 font-bold -mt-4">{errors.communities}</p>}
                     </div>

                     <div className="space-y-6">
                        <AnimatedSelect 
                           label="Pricing Model" 
                           value={formData.pricingModel} 
                           onChange={e => handleChange('pricingModel', e.target.value)}
                           options={[
                              { label: 'Commission Based (Post-Marriage)', value: 'commission' },
                              { label: 'Fixed Registration Fee', value: 'fixed' },
                              { label: 'Hybrid (Reg + Commission)', value: 'hybrid' }
                           ]}
                           error={errors.pricingModel}
                        />
                        <AnimatedInput 
                           label="Base Service Fee (₹)" 
                           value={formData.serviceFee} 
                           onChange={e => handleChange('serviceFee', e.target.value)}
                           numericOnly
                           placeholder="e.g. 5000"
                        />
                     </div>
                  </div>
               </motion.div>
            )}

            {/* STEP 3: PORTFOLIO */}
            {step === 3 && (
               <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center mb-8">
                     <h3 className="text-xl font-bold">Portfolio & Proof</h3>
                     <p className="text-sm text-gray-500">Showcase your success to attract clients.</p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-8">
                     <FileUpload 
                        label="Office / Event Photos (Optional)" 
                        multiple 
                        accept="image/*" 
                        onFileSelect={(f) => setFormData(prev => ({...prev, portfolioImages: [...prev.portfolioImages, f]}))} 
                     />
                     <div className="flex gap-2 flex-wrap">
                        {formData.portfolioImages.map((img, i) => (
                           <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                              <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" />
                           </div>
                        ))}
                     </div>

                     <AnimatedTextArea 
                        label="Client Testimonials / Success Stories" 
                        value={formData.testimonials} 
                        onChange={e => handleChange('testimonials', e.target.value)}
                        placeholder="Share a brief story of a successful match..."
                     />
                  </div>
               </motion.div>
            )}

            {/* STEP 4: REVIEW */}
            {step === 4 && (
               <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center mb-8">
                     <h3 className="text-xl font-bold">Review Application</h3>
                     <p className="text-sm text-gray-500">Please confirm your details before submitting.</p>
                  </div>

                  <div className="max-w-3xl mx-auto bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10 space-y-4 text-sm">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <span className="block text-gray-500 text-xs uppercase font-bold">Agency Name</span>
                           <span className="font-bold text-gray-900 dark:text-white">{formData.agencyName}</span>
                        </div>
                        <div>
                           <span className="block text-gray-500 text-xs uppercase font-bold">Broker Name</span>
                           <span className="font-bold text-gray-900 dark:text-white">{formData.fullName}</span>
                        </div>
                        <div>
                           <span className="block text-gray-500 text-xs uppercase font-bold">Contact Email</span>
                           <span className="font-bold text-gray-900 dark:text-white">{formData.email}</span>
                        </div>
                        <div>
                           <span className="block text-gray-500 text-xs uppercase font-bold">Communities</span>
                           <span className="font-bold text-gray-900 dark:text-white">{formData.communities.join(', ')}</span>
                        </div>
                     </div>
                     
                     <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                        <label className="flex items-start gap-3 cursor-pointer group">
                           <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.agreedToTerms ? 'bg-purple-600 border-purple-600' : 'border-gray-400 group-hover:border-purple-500'}`}>
                              {formData.agreedToTerms && <CheckCircle size={14} className="text-white" />}
                           </div>
                           <input type="checkbox" className="hidden" checked={formData.agreedToTerms} onChange={() => handleChange('agreedToTerms', !formData.agreedToTerms)} />
                           <span className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                              I confirm that the details provided are accurate. I agree to the <a href="#" className="text-purple-600 font-bold hover:underline">Platform Terms & Conditions</a> and <a href="#" className="text-purple-600 font-bold hover:underline">Ethical Guidelines</a> for brokers. I understand that false information may lead to account suspension.
                           </span>
                        </label>
                        {errors.terms && <p className="text-xs text-red-500 font-bold mt-2 ml-8">{errors.terms}</p>}
                     </div>
                  </div>
               </motion.div>
            )}

            {/* STEP 5: SUCCESS */}
            {step === 5 && renderSuccess()}

         </AnimatePresence>
      </div>

      {step < 5 && (
         <div className="mt-8 flex justify-end">
            <PremiumButton 
               onClick={handleNext} 
               disabled={loading}
               variant="gradient" 
               className="!px-10"
               icon={loading ? <Loader2 className="animate-spin" /> : step === 4 ? <CheckCircle size={18} /> : <ArrowRight size={18} />}
            >
               {loading ? 'Submitting...' : step === 4 ? 'Submit Application' : 'Next Step'}
            </PremiumButton>
         </div>
      )}
    </div>
  );
};

export default BrokerRegistration;