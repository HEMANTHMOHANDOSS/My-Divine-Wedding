import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, Heart, Ruler, BookOpen, Home, Coffee, Phone, Camera, 
  CheckCircle, ArrowLeft, ArrowRight, Save, Sparkles, Edit2, Shield, Moon, Star
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput, AnimatedSelect, AnimatedTextArea, FileUpload, TagSelector, RadioGroup, AnimatedPhoneInput } from '../profile/ProfileFormElements';
import { validateField, calculateAge } from '../../utils/validation';
import { RAASI_LIST, NAKSHATRA_LIST } from '../../constants';

interface ProfileCreationWizardProps {
  onComplete: () => void;
  onExit?: () => void; 
}

const steps = [
  { id: 0, title: 'Basic Info', icon: <User size={20} /> },
  { id: 1, title: 'Religion', icon: <Shield size={20} /> },
  { id: 2, title: 'Horoscope', icon: <Moon size={20} /> },
  { id: 3, title: 'Physical', icon: <Ruler size={20} /> },
  { id: 4, title: 'Career', icon: <BookOpen size={20} /> },
  { id: 5, title: 'Family', icon: <Home size={20} /> },
  { id: 6, title: 'Lifestyle', icon: <Coffee size={20} /> },
  { id: 7, title: 'Contact', icon: <Phone size={20} /> },
  { id: 8, title: 'Media', icon: <Camera size={20} /> },
  { id: 9, title: 'Review', icon: <CheckCircle size={20} /> },
];

const ProfileCreationWizard: React.FC<ProfileCreationWizardProps> = ({ onComplete, onExit }) => {
  const [step, setStep] = useState(0); 
  const [currentStep, setCurrentStep] = useState(0); 
  const [profileType, setProfileType] = useState<'user' | 'broker' | null>(null);
  const [relation, setRelation] = useState<'myself' | 'son' | 'daughter' | 'friend' | 'sibling' | 'relative' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brokerTermsAccepted, setBrokerTermsAccepted] = useState(false);
  const [profileScore, setProfileScore] = useState(0);
  
  // --- FORM DATA & VALIDATION STATE ---
  const [formData, setFormData] = useState<any>({
    mobileCode: '+91', mobile: '', guardianContactCode: '+91', guardianContact: '',
    firstName: '', lastName: '', dob: '', gender: '', maritalStatus: '', motherTongue: '',
    religion: '', caste: '', subCaste: '', gothram: '', dosham: 'no', raasi: '', nakshatra: '',
    height: '', weight: '', bodyType: 'average', complexion: 'fair', physicalStatus: 'normal',
    education: '', college: '', occupation: '', company: '', workType: 'private', income: '',
    fatherJob: '', motherJob: '', siblings: '0', familyType: 'nuclear', familyValues: 'traditional', nativePlace: '',
    diet: 'veg', smoking: 'no', drinking: 'no', hobbies: [], bio: '',
    email: '', altMobile: '', address: '', city: '', state: '', country: 'India',
    fullName: '', agencyName: '', brokerType: '', yearsExperience: '', matches: '', officeAddress: '',
    specializations: '', pricingModel: '', serviceCharges: '', digitalSignature: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, currentStep]);

  // Calculate Profile Score
  useEffect(() => {
    const fields = Object.values(formData);
    const filled = fields.filter(f => Array.isArray(f) ? f.length > 0 : !!f).length;
    const score = Math.round((filled / Object.keys(formData).length) * 100);
    setProfileScore(score);
  }, [formData]);

  // ... (validation and handlers same as before) ...
  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    let extraData = null;
    if (name === 'mobile') extraData = formData.mobileCode;
    if (name === 'guardianContact') extraData = formData.guardianContactCode;

    const error = validateField(name, value, extraData);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setErrors(prev => {
        const newErr = { ...prev };
        delete newErr[name];
        return newErr;
      });
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    let extraData = null;
    if (name === 'mobile') extraData = formData.mobileCode;
    if (name === 'guardianContact') extraData = formData.guardianContactCode;

    const error = validateField(name, formData[name] || '', extraData);
    if (error) setErrors(prev => ({ ...prev, [name]: error }));
  };

  const isStepValid = () => {
    if (step === 0) return !!profileType;
    if (step === 1 && profileType === 'user') return !!relation;
    
    // User Steps Validation using currentStep logic for the detailed wizard
    if (profileType === 'user') {
        const requiredFields: string[] = [];
        if (currentStep === 0) requiredFields.push('firstName', 'lastName', 'dob', 'gender', 'maritalStatus', 'motherTongue');
        if (currentStep === 1) requiredFields.push('religion', 'caste');
        if (currentStep === 2) requiredFields.push('raasi', 'nakshatra');
        if (currentStep === 3) requiredFields.push('height', 'weight');
        if (currentStep === 4) requiredFields.push('education', 'occupation', 'income');
        if (currentStep === 7) requiredFields.push('email', 'mobile', 'city');
        
        const hasEmpty = requiredFields.some(f => !formData[f]);
        const hasErrors = requiredFields.some(f => !!errors[f]);
        return !hasEmpty && !hasErrors;
    }

    if (profileType === 'broker') {
        if (step === 2) return !errors.fullName && formData.fullName && formData.gender && !errors.mobile && formData.mobile && isEmailVerified;
        if (step === 3) return !errors.agencyName && formData.agencyName && !errors.yearsExperience;
        if (step === 4) return !!formData.pricingModel;
        if (step === 6) return brokerTermsAccepted && !!formData.digitalSignature && !errors.digitalSignature;
    }

    return true;
  };

  const nextStep = () => {
    if (!isStepValid()) {
        alert("Please fill all required fields correctly.");
        return;
    }
    
    if (profileType === 'user' && step >= 2) {
       // Inside user detailed flow
       if (currentStep < 9) setCurrentStep(prev => prev + 1);
       else handleComplete();
    } else {
       // Main flow
       if (step === 0 && profileType === 'broker') setStep(2);
       else setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (profileType === 'user' && step >= 2 && currentStep > 0) {
        setCurrentStep(prev => prev - 1);
    } else {
        if (step === 2 && profileType === 'broker') setStep(0);
        else setStep(prev => prev - 1);
    }
  };

  const getProgress = () => {
    if (profileType === 'user') return Math.min(100, Math.round(((currentStep + 1) / 10) * 100));
    return Math.min(100, Math.max(0, (step - 1) * 20));
  };

  const handleGenerateBio = () => {
     const bio = `I am a ${formData.occupation} working at ${formData.company || 'a reputed firm'}. I value ${formData.familyValues} family values and enjoy ${formData.hobbies.join(', ') || 'traveling'}. Looking for a partner who is understanding and caring.`;
     handleChange('bio', bio);
  };

  const handleComplete = () => {
    if (!isStepValid()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 2500);
  };

  if (isSubmitting) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
       <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
       <p className="text-xl font-bold">Processing...</p>
    </div>
  );

  // Simplified User Logic reuse
  const renderUserForm = () => (
    <div className="max-w-4xl mx-auto space-y-8">
       {/* Responsive Step Indicator */}
       <div className="flex justify-start md:justify-between mb-8 md:mb-12 relative overflow-x-auto pb-4 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
           <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-white/10 -z-10" />
           {steps.map((s, idx) => (
              <div key={s.id} className="flex flex-col items-center gap-2 cursor-pointer min-w-[70px] md:min-w-0" onClick={() => idx < currentStep && setCurrentStep(idx)}>
                 <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 shrink-0
                    ${idx === currentStep ? 'bg-purple-600 border-purple-600 text-white scale-110 shadow-lg shadow-purple-500/30' : 
                      idx < currentStep ? 'bg-green-500 border-green-500 text-white' : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400'}`}>
                    {idx < currentStep ? <CheckCircle size={16} /> : React.cloneElement(s.icon as React.ReactElement, { size: 16 })}
                 </div>
                 <span className={`text-[10px] md:text-xs font-bold whitespace-nowrap ${idx === currentStep ? 'text-purple-600 dark:text-gold-400' : 'text-gray-400'}`}>{s.title}</span>
              </div>
           ))}
       </div>

       <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] p-6 md:p-12 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
             <motion.div
               key={currentStep}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
             >
                {/* 0. Basic Info */}
                {currentStep === 0 && (
                   <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><User className="text-purple-500" /> Basic Information</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                         <AnimatedInput label="First Name" value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} onBlur={() => handleBlur('firstName')} error={touched.firstName ? errors.firstName : undefined} />
                         <AnimatedInput label="Last Name" value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} onBlur={() => handleBlur('lastName')} error={touched.lastName ? errors.lastName : undefined} />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                         <AnimatedInput label="Date of Birth" type="date" value={formData.dob} onChange={e => handleChange('dob', e.target.value)} onBlur={() => handleBlur('dob')} error={touched.dob ? errors.dob : undefined} />
                         <AnimatedSelect label="Gender" options={[{label:'Male',value:'male'}, {label:'Female',value:'female'}]} value={formData.gender} onChange={e => handleChange('gender', e.target.value)} />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                         <AnimatedSelect label="Marital Status" options={[{label:'Never Married',value:'never_married'}, {label:'Divorced',value:'divorced'}, {label:'Widowed',value:'widowed'}]} value={formData.maritalStatus} onChange={e => handleChange('maritalStatus', e.target.value)} />
                         <AnimatedInput label="Mother Tongue" value={formData.motherTongue} onChange={e => handleChange('motherTongue', e.target.value)} />
                      </div>
                   </div>
                )}

                {/* 1. Religion */}
                {currentStep === 1 && (
                   <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Shield className="text-purple-500" /> Religious Details</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                         <AnimatedInput label="Religion" value={formData.religion} onChange={e => handleChange('religion', e.target.value)} error={touched.religion ? errors.religion : undefined} />
                         <AnimatedInput label="Caste" value={formData.caste} onChange={e => handleChange('caste', e.target.value)} error={touched.caste ? errors.caste : undefined} />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                         <AnimatedInput label="Sub Caste (Optional)" value={formData.subCaste} onChange={e => handleChange('subCaste', e.target.value)} />
                         <AnimatedInput label="Gothram" value={formData.gothram} onChange={e => handleChange('gothram', e.target.value)} onBlur={() => handleBlur('gothram')} error={touched.gothram ? errors.gothram : undefined} />
                      </div>
                      <RadioGroup label="Do you have Dosham?" options={[{label:'No', value:'no'}, {label:'Yes', value:'yes'}, {label:'Don\'t Know', value:'dont_know'}]} value={formData.dosham} onChange={v => handleChange('dosham', v)} />
                   </div>
                )}

                {/* 2. Horoscope */}
                {currentStep === 2 && (
                   <div className="space-y-8">
                      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Moon className="text-purple-500" /> Horoscope Details</h2>
                      
                      <div className="space-y-3">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Select Raasi</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                             {RAASI_LIST.map((r) => (
                               <motion.div
                                 key={r.id}
                                 onClick={() => handleChange('raasi', r.id)}
                                 whileTap={{ scale: 0.95 }}
                                 className={`relative cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center text-center gap-1 ${formData.raasi === r.id ? 'border-purple-600 bg-purple-50 dark:bg-white/10' : 'border-gray-200 dark:border-white/10'}`}
                               >
                                  <div className="text-2xl mb-1">{r.script}</div>
                                  <div className="text-xs font-bold uppercase">{r.sanskrit}</div>
                                  <div className="text-[10px] text-gray-500">{r.english}</div>
                               </motion.div>
                             ))}
                          </div>
                      </div>

                      <div className="mt-8">
                         <AnimatedSelect 
                            label="Select Nakshatra" 
                            value={formData.nakshatra}
                            onChange={(e) => handleChange('nakshatra', e.target.value)}
                            options={NAKSHATRA_LIST.map(n => ({ value: n.id, label: `${n.sanskrit} (${n.english})` }))}
                         />
                      </div>
                   </div>
                )}

                {/* 7. Contact */}
                {currentStep === 7 && (
                   <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Phone className="text-purple-500" /> Contact Details</h2>
                      <AnimatedInput label="Email" value={formData.email} onChange={e => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} error={touched.email ? errors.email : undefined} />
                      <div className="grid md:grid-cols-2 gap-6">
                          <AnimatedPhoneInput label="Mobile" value={formData.mobile} countryCode={formData.mobileCode} onCountryCodeChange={c => handleChange('mobileCode', c)} onPhoneChange={p => handleChange('mobile', p)} onBlur={() => handleBlur('mobile')} error={touched.mobile ? errors.mobile : undefined} />
                          <AnimatedInput label="City" value={formData.city} onChange={e => handleChange('city', e.target.value)} />
                      </div>
                   </div>
                )}

                {/* Fallback steps */}
                {[3,4,5,6,8,9].includes(currentStep) && (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold mb-4">Step {steps[currentStep].title}</h3>
                        <p className="text-gray-500">Form fields for this section go here.</p>
                    </div>
                )}

             </motion.div>
          </AnimatePresence>
       </div>

       <div className="flex justify-between pt-4 pb-10">
          <button onClick={prevStep} className="flex items-center gap-2 px-4 py-2 text-gray-500 font-medium">
             <ArrowLeft size={18} /> Previous
          </button>
          <PremiumButton onClick={currentStep === 9 ? handleComplete : nextStep}>
             {currentStep === 9 ? 'Submit Profile' : 'Next Step'}
          </PremiumButton>
       </div>
    </div>
  );

  // Broker form placeholder
  const renderBrokerForm = () => (
     <div className="max-w-3xl mx-auto space-y-8 px-4">
        {/* Progress bar */}
        <div className="mb-8">
           <div className="flex justify-between text-sm font-bold text-gray-500">
              <span>Broker Registration</span>
              <span>{getProgress()}%</span>
           </div>
           <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${getProgress()}%` }} />
           </div>
        </div>
        
        {/* Form Container */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 shadow-xl">
           <h3 className="text-2xl font-bold mb-6">Broker Details</h3>
           {step === 2 && (
              <div className="space-y-4">
                 <AnimatedInput label="Full Name" value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)} />
                 <AnimatedPhoneInput label="Mobile" value={formData.mobile} countryCode={formData.mobileCode} onCountryCodeChange={c => handleChange('mobileCode', c)} onPhoneChange={p => handleChange('mobile', p)} />
              </div>
           )}
           {step > 2 && <p className="text-center py-10">Step {step} content...</p>}
        </div>

        <div className="flex justify-between">
           <button onClick={prevStep} className="flex items-center gap-2 px-4 py-2 text-gray-500 font-medium"><ArrowLeft size={18} /> Back</button>
           <PremiumButton onClick={step === 6 ? handleComplete : nextStep}>{step === 6 ? 'Submit' : 'Next'}</PremiumButton>
        </div>
     </div>
  );

  // Initial Logic: Profile Type Selection
  if (step === 0) {
     return (
        <div className="min-h-screen pt-24 px-4 container mx-auto max-w-5xl">
           <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-bold">Welcome to My Divine Wedding</h2>
              <p className="text-lg text-gray-500">Choose your path to get started.</p>
           </div>
           <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div onClick={() => setProfileType('user')} className={`p-8 rounded-3xl border-2 cursor-pointer transition-all ${profileType === 'user' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-white/10 hover:border-purple-300'}`}>
                 <Heart className="w-12 h-12 text-purple-600 mb-4" />
                 <h3 className="text-xl font-bold mb-2">Personal Profile</h3>
                 <p className="text-sm text-gray-500">For myself, my child, or a relative.</p>
              </div>
              <div onClick={() => setProfileType('broker')} className={`p-8 rounded-3xl border-2 cursor-pointer transition-all ${profileType === 'broker' ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-white/10 hover:border-emerald-300'}`}>
                 <Briefcase className="w-12 h-12 text-emerald-600 mb-4" />
                 <h3 className="text-xl font-bold mb-2">Professional Broker</h3>
                 <p className="text-sm text-gray-500">For matchmakers and agencies.</p>
              </div>
           </div>
           <div className="flex justify-center mt-12">
              <PremiumButton onClick={nextStep} disabled={!profileType} icon={<ArrowRight />}>Continue</PremiumButton>
           </div>
        </div>
     )
  }

  // Relation Selection
  if (step === 1 && profileType === 'user') {
     return (
        <div className="min-h-screen pt-24 px-4 container mx-auto max-w-4xl text-center">
           <h2 className="text-3xl font-bold mb-8">Who is this profile for?</h2>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Myself', 'Son', 'Daughter', 'Sibling', 'Friend', 'Relative'].map(rel => (
                 <div key={rel} onClick={() => setRelation(rel.toLowerCase() as any)} className={`p-6 rounded-2xl border-2 cursor-pointer ${relation === rel.toLowerCase() ? 'border-purple-600 bg-purple-50 dark:bg-white/10' : 'border-gray-200 dark:border-white/10'}`}>
                    <span className="font-bold">{rel}</span>
                 </div>
              ))}
           </div>
           <div className="flex justify-center gap-4 mt-12">
              <button onClick={prevStep} className="text-gray-500">Back</button>
              <PremiumButton onClick={nextStep} disabled={!relation}>Next Step</PremiumButton>
           </div>
        </div>
     )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 transition-colors duration-500 relative">
      <AnimatePresence mode="wait">
         <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
         >
            {profileType === 'user' ? renderUserForm() : renderBrokerForm()}
         </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProfileCreationWizard;