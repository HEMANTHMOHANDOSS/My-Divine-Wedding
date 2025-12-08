
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
         <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-200 dark:bg-white/10 -z-10 -translate-y-1/2" />
         {steps.map((s, idx) => (
            <div key={s.id} className={`flex flex-col items-center gap-2 bg-white dark:bg-[#0a0a0a] px-2 transition-colors`}>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${currentStep === idx 
                     ? 'bg-purple-600 border-purple-600 text-white scale-110 shadow-lg shadow-purple-500/30' 
                     : currentStep > idx 
                     ? 'bg-green-500 border-green-500 text-white'
                     : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400'
                  }
               `}>
                  {currentStep > idx ? <CheckCircle size={18} /> : s.icon}
               </div>
               <span className={`text-[10px] font-bold uppercase tracking-wider ${currentStep === idx ? 'text-purple-600' : 'text-gray-400'}`}>
                  {s.title}
               </span>
            </div>
         ))}
      </div>

      {/* Form Card */}
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[500px]">
         <AnimatePresence mode="wait">
            
            {/* STEP 0: PARENT DETAILS */}
            {currentStep === 0 && (
               <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2"><Users className="text-purple-500" /> Parent Profile</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                     <AnimatedInput 
                        label="Parent's Full Name" 
                        value={formData.parentName} 
                        onChange={e => handleChange('parentName', e.target.value)}
                        error={errors.parentName}
                     />
                     <AnimatedSelect 
                        label="Relationship to Child"
                        value={formData.relation}
                        onChange={e => handleChange('relation', e.target.value)}
                        options={[
                           { label: 'Father', value: 'father' },
                           { label: 'Mother', value: 'mother' },
                           { label: 'Guardian', value: 'guardian' },
                           { label: 'Sibling', value: 'sibling' },
                        ]}
                     />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <AnimatedInput 
                        label="Email Address" 
                        value={formData.parentEmail} 
                        onChange={e => handleChange('parentEmail', e.target.value)}
                        error={errors.parentEmail}
                     />
                     <AnimatedPhoneInput 
                        label="Mobile Number"
                        value={formData.parentMobile}
                        countryCode={formData.parentMobileCode}
                        onCountryCodeChange={c => handleChange('parentMobileCode', c)}
                        onPhoneChange={p => handleChange('parentMobile', p)}
                        error={errors.parentMobile}
                     />
                  </div>

                  <AnimatedInput 
                     label="Current City / Location" 
                     value={formData.parentLocation} 
                     onChange={e => handleChange('parentLocation', e.target.value)}
                     error={errors.parentLocation}
                     icon={<MapPin size={18} />}
                  />
               </motion.div>
            )}

            {/* STEP 1: CHILD IDENTIFICATION */}
            {currentStep === 1 && (
               <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center mb-8">
                     <h3 className="text-2xl font-bold mb-2">Link Child's Profile</h3>
                     <p className="text-gray-500 text-sm">
                        Enter your child's details to check if they are already registered. 
                        If not, we will help you create a profile for them.
                     </p>
                  </div>

                  <div className="max-w-md mx-auto space-y-6">
                     <AnimatedInput 
                        label="Child's Full Name" 
                        value={formData.childName} 
                        onChange={e => handleChange('childName', e.target.value)}
                        error={errors.childName}
                     />
                     
                     <div className="relative flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
                        <span className="text-xs font-bold text-gray-400 uppercase">Search By</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
                     </div>

                     <AnimatedInput 
                        label="Child's Email ID" 
                        value={formData.childEmail} 
                        onChange={e => handleChange('childEmail', e.target.value)}
                        error={errors.childEmail}
                        icon={<Mail size={18} />}
                     />
                     
                     <p className="text-center text-xs font-bold text-gray-400 uppercase">OR</p>

                     <AnimatedPhoneInput 
                        label="Child's Mobile Number"
                        value={formData.childMobile}
                        countryCode={formData.childMobileCode}
                        onCountryCodeChange={c => handleChange('childMobileCode', c)}
                        onPhoneChange={p => handleChange('childMobile', p)}
                        error={errors.childMobile}
                     />
                  </div>
               </motion.div>
            )}

            {/* STEP 2: PROFILE SETUP (BRANCHING) */}
            {currentStep === 2 && (
               <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  
                  {/* SCENARIO A: CHILD FOUND */}
                  {isChildExisting ? (
                     <div className="text-center space-y-6 py-4">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600">
                           <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-bold">Profile Found!</h3>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-white dark:from-white/5 dark:to-white/10 p-6 rounded-2xl border border-purple-100 dark:border-white/10 flex items-center gap-4 max-w-md mx-auto">
                           <img src={foundChildData?.img} alt={foundChildData?.name} className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-white/10 shadow-md" />
                           <div className="text-left">
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{foundChildData?.name}</h4>
                              <p className="text-sm text-gray-500">ID: {foundChildData?.id}</p>
                              <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Verified User</span>
                           </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-white/5 text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                           <p>By proceeding, you will send a request to link your account as a Parent. Your child will need to approve this request.</p>
                        </div>
                     </div>
                  ) : (
                     /* SCENARIO B: CHILD NOT FOUND (CREATE NEW) */
                     <div className="space-y-6">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-white/5 flex items-center gap-3 mb-6">
                           <UserPlus className="text-amber-600 shrink-0" size={20} />
                           <div>
                              <h4 className="font-bold text-sm text-amber-800 dark:text-amber-200">No existing profile found.</h4>
                              <p className="text-xs text-amber-700 dark:text-amber-300">Please provide some basic details to create a profile for your child.</p>
                           </div>
                        </div>

                        <h3 className="text-xl font-bold flex items-center gap-2"><Briefcase className="text-purple-500" /> Create Child Profile</h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                           <AnimatedSelect 
                              label="Gender" 
                              value={formData.childGender}
                              onChange={e => handleChange('childGender', e.target.value)}
                              options={[{label:'Male', value:'male'}, {label:'Female', value:'female'}]}
                              error={errors.childGender}
                           />
                           <AnimatedInput 
                              label="Date of Birth" type="date"
                              value={formData.childDob}
                              onChange={e => handleChange('childDob', e.target.value)}
                              error={errors.childDob}
                           />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                           <AnimatedInput 
                              label="Religion" 
                              value={formData.childReligion}
                              onChange={e => handleChange('childReligion', e.target.value)}
                              error={errors.childReligion}
                           />
                           <AnimatedInput 
                              label="Caste / Community" 
                              value={formData.childCaste}
                              onChange={e => handleChange('childCaste', e.target.value)}
                              error={errors.childCaste}
                           />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                           <AnimatedInput 
                              label="Education" 
                              value={formData.childEducation}
                              onChange={e => handleChange('childEducation', e.target.value)}
                              error={errors.childEducation}
                           />
                           <AnimatedInput 
                              label="Job Title (Optional)" 
                              value={formData.childJob}
                              onChange={e => handleChange('childJob', e.target.value)}
                           />
                        </div>
                     </div>
                  )}
               </motion.div>
            )}

            {/* STEP 3: SECURITY */}
            {currentStep === 3 && (
               <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 max-w-md mx-auto text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                     <Shield size={32} />
                  </div>
                  <h3 className="text-2xl font-bold">Secure Your Account</h3>
                  <p className="text-gray-500 mb-6">Set a strong password for your parent login.</p>

                  <AnimatedInput 
                     label="Create Password" type="password"
                     value={formData.password}
                     onChange={e => handleChange('password', e.target.value)}
                     error={errors.password}
                     icon={<Lock size={18} />}
                  />
                  <AnimatedInput 
                     label="Confirm Password" type="password"
                     value={formData.confirmPassword}
                     onChange={e => handleChange('confirmPassword', e.target.value)}
                     error={errors.confirmPassword}
                     icon={<Lock size={18} />}
                  />

                  <div className="text-xs text-left bg-gray-50 dark:bg-white/5 p-4 rounded-xl text-gray-500 mt-4">
                     <p>By creating this account, you verify that you are the parent/guardian of <strong>{formData.childName}</strong>.</p>
                  </div>
               </motion.div>
            )}

         </AnimatePresence>

         {/* FOOTER ACTIONS */}
         <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100 dark:border-white/5">
            <button 
               onClick={handleBack}
               disabled={currentStep === 0 || loading}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
            >
               <ArrowLeft size={18} /> Back
            </button>

            <PremiumButton 
               onClick={handleNext}
               disabled={loading}
               variant="gradient"
               icon={loading ? <Loader2 className="animate-spin" /> : currentStep === 3 ? <CheckCircle size={18} /> : <ArrowRight size={18} />}
            >
               {loading ? 'Processing...' : currentStep === 3 ? 'Create Account' : 'Next Step'}
            </PremiumButton>
         </div>
      </div>
    </div>
  );
};

export default ParentRegistrationWizard;
