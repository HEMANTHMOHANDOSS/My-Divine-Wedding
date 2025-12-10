
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
import BrokerRegistration from '../broker/BrokerRegistration';
import Logo from '../ui/Logo';
import useLocalStorage from '../../hooks/useLocalStorage';
import useTranslation from '../../hooks/useTranslation';

interface ProfileCreationWizardProps {
  onComplete: () => void;
  onExit?: () => void; 
}

const ProfileCreationWizard: React.FC<ProfileCreationWizardProps> = ({ onComplete, onExit }) => {
  const { t } = useTranslation();
  
  const steps = [
    { id: 0, title: t('prof.step.basic'), icon: <User size={20} /> },
    { id: 1, title: t('prof.step.religion'), icon: <Shield size={20} /> },
    { id: 2, title: t('prof.step.horoscope'), icon: <Moon size={20} /> },
    { id: 3, title: t('prof.step.physical'), icon: <Ruler size={20} /> },
    { id: 4, title: t('prof.step.career'), icon: <BookOpen size={20} /> },
    { id: 5, title: t('prof.step.family'), icon: <Home size={20} /> },
    { id: 6, title: t('prof.step.lifestyle'), icon: <Coffee size={20} /> },
    { id: 7, title: t('prof.step.contact'), icon: <Phone size={20} /> },
    { id: 8, title: t('prof.step.media'), icon: <Camera size={20} /> },
    { id: 9, title: t('prof.step.review'), icon: <CheckCircle size={20} /> },
  ];

  // Persist Wizard State
  const [step, setStep] = useLocalStorage<number>('mdm_wizard_step', 0);
  const [currentStep, setCurrentStep] = useLocalStorage<number>('mdm_wizard_currentSubStep', 0);
  const [profileType, setProfileType] = useLocalStorage<'user' | 'broker' | null>('mdm_wizard_profileType', null);
  const [relation, setRelation] = useLocalStorage<'myself' | 'son' | 'daughter' | 'friend' | 'sibling' | 'relative' | null>('mdm_wizard_relation', null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileScore, setProfileScore] = useState(0);
  
  // --- FORM DATA & VALIDATION STATE ---
  const [formData, setFormData] = useLocalStorage<any>('mdm_wizard_formData', {
    mobileCode: '+91', mobile: '', guardianContactCode: '+91', guardianContact: '',
    firstName: '', lastName: '', dob: '', gender: '', maritalStatus: '', motherTongue: '',
    religion: '', caste: '', subCaste: '', gothram: '', dosham: 'no', raasi: '', nakshatra: '',
    height: '', weight: '', bodyType: 'average', complexion: 'fair', physicalStatus: 'normal',
    education: '', college: '', occupation: '', company: '', workType: 'private', income: '',
    fatherJob: '', motherJob: '', siblings: '0', familyType: 'nuclear', familyValues: 'traditional', nativePlace: '',
    diet: 'veg', smoking: 'no', drinking: 'no', hobbies: [], bio: '',
    email: '', altMobile: '', address: '', city: '', state: '', country: 'India',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

    return true;
  };

  const nextStep = () => {
    if (!isStepValid()) {
        alert("Please fill all required fields correctly.");
        return;
    }
    
    if (profileType === 'user' && step >= 2) {
       if (currentStep < 9) setCurrentStep(prev => prev + 1);
       else handleComplete();
    } else {
       if (step === 0 && profileType === 'broker') {
          setStep(2); 
       }
       else setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (profileType === 'user' && step >= 2 && currentStep > 0) {
        setCurrentStep(prev => prev - 1);
    } else {
        setStep(prev => prev - 1);
    }
  };

  const handleGenerateBio = () => {
     const bio = `I am a ${formData.occupation} working at ${formData.company || 'a reputed firm'}. I value ${formData.familyValues} family values and enjoy ${formData.hobbies.join(', ') || 'traveling'}. Looking for a partner who is understanding and caring.`;
     handleChange('bio', bio);
  };

  const handleComplete = () => {
    if (!isStepValid()) return;
    setIsSubmitting(true);

    const newUser = {
      id: `USR-${Date.now()}`,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      mobile: `${formData.mobileCode} ${formData.mobile}`,
      role: 'user',
      status: 'active',
      plan: 'free',
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      verified: false,
      reports: 0,
      safetyScore: 80,
      religion: formData.religion,
      caste: formData.caste,
      age: calculateAge(formData.dob),
      gender: formData.gender,
      location: `${formData.city}, ${formData.country}`,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      profileScore: profileScore,
      about: formData.bio,
      familyType: formData.familyType,
      education: formData.education,
      occupation: formData.occupation,
      income: formData.income,
      ...formData
    };

    const existingUsers = JSON.parse(localStorage.getItem('mdm_users') || '[]');
    const updatedUsers = existingUsers.filter((u: any) => u.email !== newUser.email);
    localStorage.setItem('mdm_users', JSON.stringify([newUser, ...updatedUsers]));
    localStorage.setItem('mdm_email', formData.email);

    setTimeout(() => {
      setIsSubmitting(false);
      window.localStorage.removeItem('mdm_wizard_step');
      window.localStorage.removeItem('mdm_wizard_currentSubStep');
      window.localStorage.removeItem('mdm_wizard_profileType');
      window.localStorage.removeItem('mdm_wizard_relation');
      window.localStorage.removeItem('mdm_wizard_formData');
      onComplete();
    }, 2500);
  };

  if (isSubmitting) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
       <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
       <p className="text-xl font-bold">{t('common.loading')}</p>
    </div>
  );

  return (
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
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><User className="text-purple-500" /> {t('prof.step.basic')}</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                         <AnimatedInput label={t('prof.label.fname')} value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} onBlur={() => handleBlur('firstName')} error={touched.firstName ? errors.firstName : undefined} />
                         <AnimatedInput label={t('prof.label.lname')} value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} onBlur={() => handleBlur('lastName')} error={touched.lastName ? errors.lastName : undefined} />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                         <AnimatedInput label={t('prof.label.dob')} type="date" value={formData.dob} onChange={e => handleChange('dob', e.target.value)} onBlur={() => handleBlur('dob')} error={touched.dob ? errors.dob : undefined} />
                         <AnimatedSelect label={t('prof.label.gender')} options={[{label:'Male',value:'male'}, {label:'Female',value:'female'}]} value={formData.gender} onChange={e => handleChange('gender', e.target.value)} />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                         <AnimatedSelect label={t('prof.label.marital')} options={[{label:'Never Married',value:'never_married'}, {label:'Divorced',value:'divorced'}, {label:'Widowed',value:'widowed'}]} value={formData.maritalStatus} onChange={e => handleChange('maritalStatus', e.target.value)} />
                         <AnimatedInput label={t('prof.label.tongue')} value={formData.motherTongue} onChange={e => handleChange('motherTongue', e.target.value)} />
                      </div>
                   </div>
                )}

                {/* 1. Religion */}
                {currentStep === 1 && (
                   <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Shield className="text-purple-500" /> {t('prof.step.religion')}</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                         <AnimatedInput label={t('prof.label.religion')} value={formData.religion} onChange={e => handleChange('religion', e.target.value)} error={touched.religion ? errors.religion : undefined} />
                         <AnimatedInput label={t('prof.label.caste')} value={formData.caste} onChange={e => handleChange('caste', e.target.value)} error={touched.caste ? errors.caste : undefined} />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                         <AnimatedInput label="Sub Caste (Optional)" value={formData.subCaste} onChange={e => handleChange('subCaste', e.target.value)} />
                         <AnimatedInput label={t('prof.label.gothram')} value={formData.gothram} onChange={e => handleChange('gothram', e.target.value)} onBlur={() => handleBlur('gothram')} error={touched.gothram ? errors.gothram : undefined} />
                      </div>
                      <RadioGroup label={t('prof.label.dosham')} options={[{label:'No', value:'no'}, {label:'Yes', value:'yes'}, {label:'Don\'t Know', value:'dont_know'}]} value={formData.dosham} onChange={v => handleChange('dosham', v)} />
                   </div>
                )}

                {/* 2. Horoscope */}
                {currentStep === 2 && (
                   <div className="space-y-8">
                      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Moon className="text-purple-500" /> {t('prof.step.horoscope')}</h2>
                      
                      <div className="space-y-3">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t('prof.label.raasi')}</label>
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
                            label={t('prof.label.nakshatra')}
                            value={formData.nakshatra}
                            onChange={(e) => handleChange('nakshatra', e.target.value)}
                            options={NAKSHATRA_LIST.map(n => ({ value: n.id, label: `${n.sanskrit} (${n.english})` }))}
                         />
                      </div>
                   </div>
                )}

                {/* 3. Physical */}
                {currentStep === 3 && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Ruler className="text-purple-500" /> {t('prof.step.physical')}</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                       <AnimatedInput label={t('prof.label.height')} value={formData.height} onChange={e => handleChange('height', e.target.value)} onBlur={() => handleBlur('height')} error={touched.height ? errors.height : undefined} />
                       <AnimatedInput label={t('prof.label.weight')} numericOnly value={formData.weight} onChange={e => handleChange('weight', e.target.value)} onBlur={() => handleBlur('weight')} error={touched.weight ? errors.weight : undefined} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                       <AnimatedSelect label="Body Type" options={[{label:'Slim',value:'slim'}, {label:'Athletic',value:'athletic'}, {label:'Average',value:'average'}, {label:'Heavy',value:'heavy'}]} value={formData.bodyType} onChange={e => handleChange('bodyType', e.target.value)} />
                       <AnimatedSelect label="Complexion" options={[{label:'Fair',value:'fair'}, {label:'Wheatish',value:'wheatish'}, {label:'Dark',value:'dark'}]} value={formData.complexion} onChange={e => handleChange('complexion', e.target.value)} />
                    </div>
                    <RadioGroup label="Physical Status" options={[{label:'Normal', value:'normal'}, {label:'Physically Challenged', value:'challenged'}]} value={formData.physicalStatus} onChange={v => handleChange('physicalStatus', v)} />
                 </div>
                )}

                {/* 4. Career */}
                {currentStep === 4 && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BookOpen className="text-purple-500" /> {t('prof.step.career')}</h2>
                    <AnimatedInput label={t('prof.label.edu')} value={formData.education} onChange={e => handleChange('education', e.target.value)} error={touched.education ? errors.education : undefined} />
                    <AnimatedInput label="College / University" value={formData.college} onChange={e => handleChange('college', e.target.value)} />
                    <div className="grid md:grid-cols-2 gap-6">
                       <AnimatedInput label={t('prof.label.job')} value={formData.occupation} onChange={e => handleChange('occupation', e.target.value)} error={touched.occupation ? errors.occupation : undefined} />
                       <AnimatedSelect label="Work Type" options={[{label:'Private',value:'private'}, {label:'Government',value:'govt'}, {label:'Business',value:'business'}]} value={formData.workType} onChange={e => handleChange('workType', e.target.value)} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <AnimatedInput label="Company Name" value={formData.company} onChange={e => handleChange('company', e.target.value)} />
                        <AnimatedInput label={t('prof.label.income')} numericOnly formatter="currency" value={formData.income} onChange={e => handleChange('income', e.target.value)} error={touched.income ? errors.income : undefined} />
                    </div>
                 </div>
                )}

                {/* 5. Family */}
                {currentStep === 5 && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Home className="text-purple-500" /> {t('prof.step.family')}</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                       <AnimatedInput label="Father's Occupation" value={formData.fatherJob} onChange={e => handleChange('fatherJob', e.target.value)} error={touched.fatherJob ? errors.fatherJob : undefined} />
                       <AnimatedInput label="Mother's Occupation" value={formData.motherJob} onChange={e => handleChange('motherJob', e.target.value)} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                       <AnimatedSelect label="Number of Siblings" options={[{label:'None',value:'0'}, {label:'1',value:'1'}, {label:'2',value:'2'}, {label:'3+',value:'3'}]} value={formData.siblings} onChange={e => handleChange('siblings', e.target.value)} />
                       <AnimatedInput label="Native Place" value={formData.nativePlace} onChange={e => handleChange('nativePlace', e.target.value)} />
                    </div>
                    <RadioGroup label="Family Type" options={[{label:'Nuclear', value:'nuclear'}, {label:'Joint', value:'joint'}]} value={formData.familyType} onChange={v => handleChange('familyType', v)} />
                    <RadioGroup label="Family Values" options={[{label:'Traditional', value:'traditional'}, {label:'Moderate', value:'moderate'}, {label:'Liberal', value:'liberal'}]} value={formData.familyValues} onChange={v => handleChange('familyValues', v)} />
                 </div>
                )}

                {/* 6. Lifestyle */}
                {currentStep === 6 && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Coffee className="text-purple-500" /> {t('prof.step.lifestyle')}</h2>
                    <RadioGroup label={t('prof.label.diet')} options={[{label:'Vegetarian', value:'veg'}, {label:'Non-Vegetarian', value:'non_veg'}, {label:'Eggetarian', value:'egg'}, {label:'Vegan', value:'vegan'}]} value={formData.diet} onChange={v => handleChange('diet', v)} />
                    <div className="grid md:grid-cols-2 gap-6">
                        <RadioGroup label={t('prof.label.smoke')} options={[{label:'No', value:'no'}, {label:'Yes', value:'yes'}, {label:'Occasionally', value:'occasionally'}]} value={formData.smoking} onChange={v => handleChange('smoking', v)} />
                        <RadioGroup label={t('prof.label.drink')} options={[{label:'No', value:'no'}, {label:'Yes', value:'yes'}, {label:'Occasionally', value:'occasionally'}]} value={formData.drinking} onChange={v => handleChange('drinking', v)} />
                    </div>
                    
                    <TagSelector 
                        label="Hobbies & Interests" 
                        options={['Traveling', 'Music', 'Reading', 'Cooking', 'Fitness', 'Photography', 'Movies', 'Sports', 'Art']} 
                        selected={formData.hobbies} 
                        onChange={tags => handleChange('hobbies', tags)} 
                    />

                    <div className="relative">
                        <AnimatedTextArea label={t('prof.label.bio')} value={formData.bio} onChange={e => handleChange('bio', e.target.value)} onBlur={() => handleBlur('bio')} error={touched.bio ? errors.bio : undefined} />
                        <button 
                            type="button" 
                            onClick={handleGenerateBio}
                            className="absolute top-2 right-2 flex items-center gap-1 text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-600 px-2 py-1 rounded-md hover:bg-purple-200 transition-colors"
                        >
                            <Sparkles size={12} /> AI Generate
                        </button>
                    </div>
                 </div>
                )}

                {/* 7. Contact */}
                {currentStep === 7 && (
                   <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Phone className="text-purple-500" /> {t('prof.step.contact')}</h2>
                      <AnimatedInput label="Email" value={formData.email} onChange={e => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} error={touched.email ? errors.email : undefined} />
                      <div className="grid md:grid-cols-2 gap-6">
                          <AnimatedPhoneInput label="Mobile" value={formData.mobile} countryCode={formData.mobileCode} onCountryCodeChange={c => handleChange('mobileCode', c)} onPhoneChange={p => handleChange('mobile', p)} onBlur={() => handleBlur('mobile')} error={touched.mobile ? errors.mobile : undefined} />
                          <AnimatedInput label="City" value={formData.city} onChange={e => handleChange('city', e.target.value)} />
                      </div>
                   </div>
                )}

                {/* 8. Media */}
                {currentStep === 8 && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Camera className="text-purple-500" /> {t('prof.step.media')}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <FileUpload label="Profile Photos (Max 5)" multiple accept="image/*" onFileSelect={() => {}} />
                        <FileUpload label="Intro Video (Optional)" accept="video/mp4" onFileSelect={() => {}} />
                    </div>
                    <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-white/10">
                        <h4 className="font-bold flex items-center gap-2 mb-2"><Sparkles size={16} /> AI Enhancement</h4>
                        <p className="text-sm text-gray-500 mb-4">Our AI can automatically enhance lighting and check photo quality.</p>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 accent-purple-600" defaultChecked />
                            <span className="text-sm">Enable AI Enhancement</span>
                        </label>
                    </div>
                 </div>
                )}
                
                {/* 9. Review */}
                {currentStep === 9 && (
                 <div className="space-y-8">
                     <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Review Your Profile</h2>
                        <p className="text-gray-500">Please verify all details before submitting.</p>
                     </div>

                     <div className="grid md:grid-cols-2 gap-6">
                         {Object.entries({
                             "Basic Details": ['firstName', 'lastName', 'gender', 'dob', 'maritalStatus'],
                             "Religion": ['religion', 'caste', 'gothram'],
                             "Horoscope": ['raasi', 'nakshatra'],
                             "Physical": ['height', 'weight', 'bodyType'],
                             "Career": ['occupation', 'company', 'income'],
                             "Family": ['familyType', 'nativePlace'],
                             "Lifestyle": ['diet', 'smoking', 'drinking'],
                         }).map(([section, fields]) => (
                             <div key={section} className="bg-white/40 dark:bg-black/40 rounded-xl p-5 border border-gray-100 dark:border-white/5 relative group">
                                 <h4 className="font-bold text-lg mb-3 border-b border-gray-200 dark:border-white/10 pb-2">{section}</h4>
                                 <button 
                                     onClick={() => setCurrentStep(steps.findIndex(s => s.title.includes(section.split(' ')[0])))}
                                     className="absolute top-4 right-4 p-2 bg-white dark:bg-white/10 rounded-full text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                 >
                                     <Edit2 size={14} />
                                 </button>
                                 <div className="space-y-2">
                                     {fields.map(f => (
                                         <div key={f} className="flex justify-between text-sm">
                                             <span className="text-gray-500 capitalize">{f.replace(/([A-Z])/g, ' $1')}:</span>
                                             <span className="font-medium truncate max-w-[50%] text-right">{formData[f] || '-'}</span>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
                )}

             </motion.div>
          </AnimatePresence>
       </div>

       <div className="flex justify-between pt-4 pb-10">
          <button onClick={prevStep} className="flex items-center gap-2 px-4 py-2 text-gray-500 font-medium">
             <ArrowLeft size={18} /> {t('common.back')}
          </button>
          <PremiumButton onClick={currentStep === 9 ? handleComplete : nextStep}>
             {currentStep === 9 ? t('common.submit') : t('common.next')}
          </PremiumButton>
       </div>
    </div>
  );
};

export default ProfileCreationWizard;
