
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, CheckCircle, Mail, Phone, ArrowRight, UserPlus, 
  Shield, Loader2, Copy, User, MapPin, Heart, Briefcase, Lock, ArrowLeft
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput, AnimatedPhoneInput, AnimatedSelect, RadioGroup } from '../profile/ProfileFormElements';
import { verifyChildAccount } from '../../utils/mockAI';
import { validateField } from '../../utils/validation';

interface ParentRegistrationWizardProps {
  onComplete: () => void;
}

const steps = [
  { id: 0, title: 'Parent Details', icon: <Users size={18} /> },
  { id: 1, title: 'Child Info', icon: <User size={18} /> },
  { id: 2, title: 'Profile Setup', icon: <Briefcase size={18} /> },
  { id: 3, title: 'Security', icon: <Shield size={18} /> },
];

const ParentRegistrationWizard: React.FC<ParentRegistrationWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isChildExisting, setIsChildExisting] = useState<boolean | null>(null);
  const [foundChildData, setFoundChildData] = useState<any>(null);

  // Form Data State
  const [formData, setFormData] = useState({
    // Parent Details
    parentName: '',
    parentEmail: '',
    parentMobile: '',
    parentMobileCode: '+91',
    relation: 'father', // father, mother, guardian
    parentLocation: '',
    
    // Child Identification
    childName: '',
    childEmail: '',
    childMobile: '',
    childMobileCode: '+91',

    // New Child Details (If not found)
    childGender: '',
    childDob: '',
    childReligion: '',
    childCaste: '',
    childEducation: '',
    childJob: '',
    
    // Account
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation Logic
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Step 0: Parent Details
    if (step === 0) {
      if (!formData.parentName) newErrors.parentName = 'Parent Name is required';
      const emailErr = validateField('email', formData.parentEmail);
      if (emailErr) newErrors.parentEmail = emailErr;
      const phoneErr = validateField('mobile', formData.parentMobile, formData.parentMobileCode);
      if (phoneErr) newErrors.parentMobile = phoneErr;
      if (!formData.parentLocation) newErrors.parentLocation = 'City is required';
    }

    // Step 1: Child Identification
    if (step === 1) {
      if (!formData.childName) newErrors.childName = "Child's Name is required";
      // Allow either email or phone for lookup, but validate format if present
      if (formData.childEmail) {
         const ceErr = validateField('email', formData.childEmail);
         if (ceErr) newErrors.childEmail = ceErr;
      }
      if (formData.childMobile) {
         const cpErr = validateField('mobile', formData.childMobile, formData.childMobileCode);
         if (cpErr) newErrors.childMobile = cpErr;
      }
      if (!formData.childEmail && !formData.childMobile) {
         newErrors.childEmail = "Provide at least Email or Mobile";
      }
    }

    // Step 2: Child Profile (Only if child is NEW)
    if (step === 2 && isChildExisting === false) {
       if (!formData.childGender) newErrors.childGender = 'Required';
       if (!formData.childDob) newErrors.childDob = 'Required';
       if (!formData.childReligion) newErrors.childReligion = 'Required';
       if (!formData.childCaste) newErrors.childCaste = 'Required';
       if (!formData.childEducation) newErrors.childEducation = 'Required';
    }

    // Step 3: Security
    if (step === 3) {
       const passErr = validateField('password', formData.password);
       if (passErr) newErrors.password = passErr;
       if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    setTouched(prev => {
        const touchedState: any = {};
        Object.keys(newErrors).forEach(k => touchedState[k] = true);
        return { ...prev, ...touchedState };
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErr = { ...prev };
        delete newErr[field];
        return newErr;
      });
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === 1) {
        // Perform Verification
        setLoading(true);
        const result = await verifyChildAccount(formData.childEmail, formData.childMobile);
        setLoading(false);
        
        if (result.found) {
            setIsChildExisting(true);
            setFoundChildData(result.child);
        } else {
            setIsChildExisting(false);
        }
        setCurrentStep(2);
        return;
    }

    if (currentStep === 3) {
        // Submit
        setLoading(true);
        
        // Save Parent User to LocalStorage
        const newParent = {
          id: `PAR-${Date.now()}`,
          name: formData.parentName,
          email: formData.parentEmail,
          mobile: `${formData.parentMobileCode} ${formData.parentMobile}`,
          role: 'parent',
          status: 'active',
          plan: 'free',
          joinedDate: new Date().toISOString().split('T')[0],
          lastActive: 'Just now',
          verified: false,
          reports: 0,
          safetyScore: 90,
          avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
          location: formData.parentLocation,
          password: formData.password,
          // Parent specific
          relation: formData.relation,
          childName: formData.childName,
          childDetails: isChildExisting ? foundChildData : {
             dob: formData.childDob,
             gender: formData.childGender,
             religion: formData.childReligion,
             caste: formData.childCaste
          }
        };

        const existingUsers = JSON.parse(localStorage.getItem('mdm_users') || '[]');
        localStorage.setItem('mdm_users', JSON.stringify([newParent, ...existingUsers]));
        
        // Auto login
        localStorage.setItem('mdm_email', formData.parentEmail);

        setTimeout(() => {
            setLoading(false);
            onComplete();
        }, 2000);
        return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 container mx-auto max-w-3xl">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">Parent Registration</h2>
        <p className="text-gray-500 dark:text-gray-400">Create your account and manage your child's profile.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative px-4 md:px-12">
         <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-white/10 -z-10" />
         {steps.map((s, idx) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-white dark:bg-[#0a0a0a]
                  ${idx <= currentStep ? 'border-purple-600 text-purple-600' : 'border-gray-200 dark:border-white/10 text-gray-400'}`}>
                  {idx < currentStep ? <CheckCircle size={18} /> : s.icon}
               </div>
               <span className={`text-xs font-bold ${idx <= currentStep ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>{s.title}</span>
            </div>
         ))}
      </div>

      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden min-h-[400px]">
         <AnimatePresence mode="wait">
            
            {/* STEP 0: Parent Info */}
            {currentStep === 0 && (
               <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center mb-6">
                     <h3 className="text-xl font-bold">Your Details</h3>
                     <p className="text-sm text-gray-500">How are you related to the profile?</p>
                  </div>
                  
                  <div className="flex justify-center mb-6">
                     <div className="flex p-1 bg-gray-100 dark:bg-black/20 rounded-xl">
                        {['father', 'mother', 'guardian'].map(r => (
                           <button 
                              key={r} 
                              onClick={() => handleChange('relation', r)}
                              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${formData.relation === r ? 'bg-white dark:bg-gray-800 text-purple-600 shadow' : 'text-gray-500'}`}
                           >
                              {r}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <AnimatedInput label="Parent's Name" value={formData.parentName} onChange={e => handleChange('parentName', e.target.value)} error={errors.parentName} icon={<User size={18} />} />
                     <AnimatedInput label="Email Address" value={formData.parentEmail} onChange={e => handleChange('parentEmail', e.target.value)} error={errors.parentEmail} icon={<Mail size={18} />} />
                     <AnimatedPhoneInput 
                        label="Mobile Number" 
                        value={formData.parentMobile} 
                        countryCode={formData.parentMobileCode}
                        onCountryCodeChange={c => handleChange('parentMobileCode', c)}
                        onPhoneChange={p => handleChange('parentMobile', p)}
                        error={errors.parentMobile}
                     />
                     <AnimatedInput label="Current City" value={formData.parentLocation} onChange={e => handleChange('parentLocation', e.target.value)} error={errors.parentLocation} icon={<MapPin size={18} />} />
                  </div>
               </motion.div>
            )}

            {/* STEP 1: Child Info */}
            {currentStep === 1 && (
               <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center mb-6">
                     <h3 className="text-xl font-bold">Child's Information</h3>
                     <p className="text-sm text-gray-500">We'll check if they already have an account.</p>
                  </div>

                  <div className="max-w-md mx-auto space-y-4">
                     <AnimatedInput label="Child's Name" value={formData.childName} onChange={e => handleChange('childName', e.target.value)} error={errors.childName} icon={<User size={18} />} />
                     <AnimatedInput label="Child's Email (Optional)" value={formData.childEmail} onChange={e => handleChange('childEmail', e.target.value)} error={errors.childEmail} icon={<Mail size={18} />} />
                     <AnimatedPhoneInput 
                        label="Child's Mobile (Optional)" 
                        value={formData.childMobile} 
                        countryCode={formData.childMobileCode}
                        onCountryCodeChange={c => handleChange('childMobileCode', c)}
                        onPhoneChange={p => handleChange('childMobile', p)}
                        error={errors.childMobile}
                     />
                     <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                        <Search size={16} className="mt-0.5 shrink-0" />
                        <p>We will search for existing accounts using email or mobile. If found, you can request to link accounts.</p>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* STEP 2: Child Profile (If New) */}
            {currentStep === 2 && (
               <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  {isChildExisting ? (
                     <div className="text-center py-10">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                           <UserPlus size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Account Found!</h3>
                        <p className="text-gray-500 mb-6">We found a profile for <strong>{foundChildData?.name}</strong>.</p>
                        <div className="flex items-center justify-center gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl max-w-sm mx-auto border border-gray-200 dark:border-white/10">
                           <img src={foundChildData?.img} className="w-12 h-12 rounded-full object-cover" />
                           <div className="text-left">
                              <p className="font-bold text-sm">{foundChildData?.name}</p>
                              <p className="text-xs text-gray-500">{foundChildData?.id}</p>
                           </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-6">Proceed to send a link request to your child.</p>
                     </div>
                  ) : (
                     <div className="space-y-6">
                        <div className="text-center mb-6">
                           <h3 className="text-xl font-bold">Create Child's Profile</h3>
                           <p className="text-sm text-gray-500">No existing account found. Let's set up the basics.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Gender</label>
                              <div className="flex gap-4">
                                 {['Male', 'Female'].map(g => (
                                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                                       <input type="radio" name="gender" className="accent-purple-600" checked={formData.childGender === g.toLowerCase()} onChange={() => handleChange('childGender', g.toLowerCase())} />
                                       <span>{g}</span>
                                    </label>
                                 ))}
                              </div>
                              {errors.childGender && <p className="text-xs text-red-500 font-bold">{errors.childGender}</p>}
                           </div>
                           <AnimatedInput label="Date of Birth" type="date" value={formData.childDob} onChange={e => handleChange('childDob', e.target.value)} error={errors.childDob} />
                           <AnimatedInput label="Religion" value={formData.childReligion} onChange={e => handleChange('childReligion', e.target.value)} error={errors.childReligion} />
                           <AnimatedInput label="Caste" value={formData.childCaste} onChange={e => handleChange('childCaste', e.target.value)} error={errors.childCaste} />
                           <AnimatedInput label="Education" value={formData.childEducation} onChange={e => handleChange('childEducation', e.target.value)} error={errors.childEducation} />
                           <AnimatedInput label="Job / Occupation" value={formData.childJob} onChange={e => handleChange('childJob', e.target.value)} />
                        </div>
                     </div>
                  )}
               </motion.div>
            )}

            {/* STEP 3: Security */}
            {currentStep === 3 && (
               <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center">
                  <div className="text-center mb-8">
                     <h3 className="text-xl font-bold">Secure Your Account</h3>
                     <p className="text-sm text-gray-500">Set a password for your parent dashboard.</p>
                  </div>
                  <div className="max-w-sm mx-auto space-y-4">
                     <AnimatedInput label="Password" type="password" value={formData.password} onChange={e => handleChange('password', e.target.value)} error={errors.password} icon={<Lock size={18} />} />
                     <AnimatedInput label="Confirm Password" type="password" value={formData.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} error={errors.confirmPassword} icon={<Lock size={18} />} />
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30 max-w-md mx-auto text-left flex gap-3">
                     <Shield className="text-purple-600 shrink-0" size={20} />
                     <p className="text-xs text-gray-600 dark:text-gray-300">
                        By creating this account, you agree to our Terms. As a parent, you will have oversight access but cannot modify your child's private chats without consent.
                     </p>
                  </div>
               </motion.div>
            )}

         </AnimatePresence>
      </div>

      <div className="flex justify-between mt-8">
         <button 
            onClick={handleBack}
            disabled={currentStep === 0 || loading}
            className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
         >
            Back
         </button>
         <PremiumButton 
            onClick={handleNext}
            disabled={loading}
            variant="gradient"
            className="!px-8"
            icon={loading ? <Loader2 className="animate-spin" /> : <ArrowRight size={18} />}
         >
            {loading ? 'Processing...' : currentStep === 3 ? 'Create Account' : 'Next Step'}
         </PremiumButton>
      </div>
    </div>
  );
};

export default ParentRegistrationWizard;
