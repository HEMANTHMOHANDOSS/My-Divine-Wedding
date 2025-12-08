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

interface ProfileSetupWizardProps {
  onComplete: () => void;
  onExit: () => void;
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

const ProfileSetupWizard: React.FC<ProfileSetupWizardProps> = ({ onComplete, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Large Form State
  const [formData, setFormData] = useState<any>({
    // Basic
    firstName: '', lastName: '', dob: '', gender: '', maritalStatus: '', motherTongue: '',
    // Religion
    religion: '', caste: '', subCaste: '', gothram: '', dosham: 'no',
    // Horoscope (New)
    raasi: '', nakshatra: '',
    // Physical
    height: '', weight: '', bodyType: 'average', complexion: 'fair', physicalStatus: 'normal',
    // Career
    education: '', college: '', occupation: '', company: '', workType: 'private', income: '', currency: 'INR',
    // Family
    fatherJob: '', motherJob: '', siblings: '0', familyType: 'nuclear', familyValues: 'traditional', nativePlace: '',
    // Lifestyle
    diet: 'veg', smoking: 'no', drinking: 'no', hobbies: [], bio: '',
    // Contact
    email: '', mobile: '', mobileCode: '+91', altMobile: '', address: '', city: '', state: '', country: 'India',
    // Media
    photos: [], selfie: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [profileScore, setProfileScore] = useState(0);

  // Calculate Profile Score
  useEffect(() => {
    const fields = Object.values(formData);
    const filled = fields.filter(f => Array.isArray(f) ? f.length > 0 : !!f).length;
    const score = Math.round((filled / Object.keys(formData).length) * 100);
    setProfileScore(score);
  }, [formData]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    const error = validateField(name, value, name === 'mobile' ? formData.mobileCode : undefined);
    if (error) setErrors(prev => ({ ...prev, [name]: error }));
    else {
        setErrors(prev => {
            const newErr = { ...prev };
            delete newErr[name];
            return newErr;
        });
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name], name === 'mobile' ? formData.mobileCode : undefined);
    if (error) setErrors(prev => ({ ...prev, [name]: error }));
  };

  const isStepValid = (stepIndex: number) => {
    // simplified validation logic per step group
    const requiredFields: string[] = [];
    if (stepIndex === 0) requiredFields.push('firstName', 'lastName', 'dob', 'gender', 'maritalStatus', 'motherTongue');
    if (stepIndex === 1) requiredFields.push('religion', 'caste', 'gothram');
    if (stepIndex === 2) requiredFields.push('raasi', 'nakshatra');
    if (stepIndex === 3) requiredFields.push('height', 'weight');
    if (stepIndex === 4) requiredFields.push('education', 'occupation', 'income');
    if (stepIndex === 5) requiredFields.push('fatherJob', 'familyType', 'nativePlace');
    if (stepIndex === 6) requiredFields.push('diet', 'bio');
    if (stepIndex === 7) requiredFields.push('email', 'mobile', 'city', 'state');
    
    // Check if any required field is empty or has error
    const hasEmpty = requiredFields.some(f => !formData[f]);
    const hasErrors = requiredFields.some(f => !!errors[f]);
    return !hasEmpty && !hasErrors;
  };

  const nextStep = () => {
    if (isStepValid(currentStep)) {
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Trigger touch on all fields to show errors
        alert("Please fill all required fields correctly.");
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleGenerateBio = () => {
     // Mock AI generation
     const bio = `I am a ${formData.occupation} working at ${formData.company || 'a reputed firm'}. I value ${formData.familyValues} family values and enjoy ${formData.hobbies.join(', ') || 'traveling'}. Looking for a partner who is understanding and caring.`;
     handleChange('bio', bio);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20">
      
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
           <div>
              <h1 className="font-bold text-lg leading-tight">Complete Profile</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Step {currentStep + 1} of {steps.length}</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Profile Strength</span>
                <div className="flex items-center gap-2">
                   <div className="w-24 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${profileScore}%` }} />
                   </div>
                   <span className="text-sm font-bold text-green-500">{profileScore}%</span>
                </div>
             </div>
             <button onClick={onExit} className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-sm font-medium">
                <Save size={16} /> Save & Exit
             </button>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl mt-8 px-4">
        
        {/* STEP INDICATORS */}
        <div className="flex justify-between mb-12 relative overflow-x-auto pb-4 custom-scrollbar">
           <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-white/10 -z-10 min-w-[700px]" />
           {steps.map((s, idx) => (
              <div key={s.id} className="flex flex-col items-center gap-2 cursor-pointer min-w-[60px]" onClick={() => idx < currentStep && setCurrentStep(idx)}>
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                    ${idx === currentStep ? 'bg-purple-600 border-purple-600 text-white scale-110 shadow-lg shadow-purple-500/30' : 
                      idx < currentStep ? 'bg-green-500 border-green-500 text-white' : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400'}`}>
                    {idx < currentStep ? <CheckCircle size={18} /> : s.icon}
                 </div>
                 <span className={`hidden md:block text-xs font-bold whitespace-nowrap ${idx === currentStep ? 'text-purple-600 dark:text-gold-400' : 'text-gray-400'}`}>{s.title}</span>
              </div>
           ))}
        </div>

        {/* FORM CONTENT */}
        <AnimatePresence mode="wait">
           <motion.div
             key={currentStep}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             transition={{ duration: 0.3 }}
             className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl"
           >
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

              {currentStep === 2 && (
                 <div className="space-y-8">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Moon className="text-purple-500" /> Horoscope Details</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 -mt-4 mb-6">Select your Raasi (Zodiac) and Nakshatra (Star) to improve matchmaking.</p>
                    
                    {/* Raasi Grid */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Select Raasi (Rasi / Zodiac)</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                           {RAASI_LIST.map((r) => (
                             <motion.div
                               key={r.id}
                               onClick={() => handleChange('raasi', r.id)}
                               whileHover={{ scale: 1.05 }}
                               whileTap={{ scale: 0.95 }}
                               className={`
                                  relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden flex flex-col items-center text-center gap-1
                                  ${formData.raasi === r.id 
                                    ? 'border-purple-600 dark:border-gold-400 bg-purple-50 dark:bg-white/10 shadow-lg' 
                                    : 'border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/30 bg-white/50 dark:bg-white/5'
                                  }
                               `}
                             >
                                <div className="text-2xl mb-1">{r.script}</div>
                                <div className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-gold-400">{r.sanskrit}</div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400">{r.english} | {r.tamil}</div>
                                
                                {formData.raasi === r.id && (
                                  <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                     <CheckCircle size={10} className="text-white" />
                                  </div>
                                )}
                             </motion.div>
                           ))}
                        </div>
                        {touched.raasi && !formData.raasi && (
                           <p className="text-xs text-red-500 font-bold ml-1">Please select your Raasi</p>
                        )}
                    </div>

                    {/* Nakshatra Select */}
                    <div className="mt-8">
                       <AnimatedSelect 
                          label="Select Nakshatra (Star)" 
                          value={formData.nakshatra}
                          onChange={(e) => handleChange('nakshatra', e.target.value)}
                          icon={<Star size={18} />}
                          error={touched.nakshatra && !formData.nakshatra ? 'Please select your Nakshatra' : undefined}
                          options={NAKSHATRA_LIST.map(n => ({
                             value: n.id,
                             label: `${n.sanskrit} - ${n.script} (${n.english})`
                          }))}
                       />
                    </div>
                 </div>
              )}

              {currentStep === 3 && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Ruler className="text-purple-500" /> Physical Attributes</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                       <AnimatedInput label="Height (e.g. 5'9&quot; or 175)" value={formData.height} onChange={e => handleChange('height', e.target.value)} onBlur={() => handleBlur('height')} error={touched.height ? errors.height : undefined} />
                       <AnimatedInput label="Weight (kg)" numericOnly value={formData.weight} onChange={e => handleChange('weight', e.target.value)} onBlur={() => handleBlur('weight')} error={touched.weight ? errors.weight : undefined} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                       <AnimatedSelect label="Body Type" options={[{label:'Slim',value:'slim'}, {label:'Athletic',value:'athletic'}, {label:'Average',value:'average'}, {label:'Heavy',value:'heavy'}]} value={formData.bodyType} onChange={e => handleChange('bodyType', e.target.value)} />
                       <AnimatedSelect label="Complexion" options={[{label:'Fair',value:'fair'}, {label:'Wheatish',value:'wheatish'}, {label:'Dark',value:'dark'}]} value={formData.complexion} onChange={e => handleChange('complexion', e.target.value)} />
                    </div>
                    <RadioGroup label="Physical Status" options={[{label:'Normal', value:'normal'}, {label:'Physically Challenged', value:'challenged'}]} value={formData.physicalStatus} onChange={v => handleChange('physicalStatus', v)} />
                 </div>
              )}

              {currentStep === 4 && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BookOpen className="text-purple-500" /> Education & Career</h2>
                    <AnimatedInput label="Highest Education" value={formData.education} onChange={e => handleChange('education', e.target.value)} error={touched.education ? errors.education : undefined} />
                    <AnimatedInput label="College / University" value={formData.college} onChange={e => handleChange('college', e.target.value)} />
                    <div className="grid md:grid-cols-2 gap-6">
                       <AnimatedInput label="Occupation" value={formData.occupation} onChange={e => handleChange('occupation', e.target.value)} error={touched.occupation ? errors.occupation : undefined} />
                       <AnimatedSelect label="Work Type" options={[{label:'Private',value:'private'}, {label:'Government',value:'govt'}, {label:'Business',value:'business'}]} value={formData.workType} onChange={e => handleChange('workType', e.target.value)} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <AnimatedInput label="Company Name" value={formData.company} onChange={e => handleChange('company', e.target.value)} />
                        <AnimatedInput label="Annual Income" numericOnly formatter="currency" value={formData.income} onChange={e => handleChange('income', e.target.value)} error={touched.income ? errors.income : undefined} />
                    </div>
                 </div>
              )}

              {currentStep === 5 && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Home className="text-purple-500" /> Family Background</h2>
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

              {currentStep === 6 && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Coffee className="text-purple-500" /> Lifestyle & Bio</h2>
                    <RadioGroup label="Diet" options={[{label:'Vegetarian', value:'veg'}, {label:'Non-Vegetarian', value:'non_veg'}, {label:'Eggetarian', value:'egg'}, {label:'Vegan', value:'vegan'}]} value={formData.diet} onChange={v => handleChange('diet', v)} />
                    <div className="grid md:grid-cols-2 gap-6">
                        <RadioGroup label="Smoking" options={[{label:'No', value:'no'}, {label:'Yes', value:'yes'}, {label:'Occasionally', value:'occasionally'}]} value={formData.smoking} onChange={v => handleChange('smoking', v)} />
                        <RadioGroup label="Drinking" options={[{label:'No', value:'no'}, {label:'Yes', value:'yes'}, {label:'Occasionally', value:'occasionally'}]} value={formData.drinking} onChange={v => handleChange('drinking', v)} />
                    </div>
                    
                    <TagSelector 
                        label="Hobbies & Interests" 
                        options={['Traveling', 'Music', 'Reading', 'Cooking', 'Fitness', 'Photography', 'Movies', 'Sports', 'Art']} 
                        selected={formData.hobbies} 
                        onChange={tags => handleChange('hobbies', tags)} 
                    />

                    <div className="relative">
                        <AnimatedTextArea label="About Me" value={formData.bio} onChange={e => handleChange('bio', e.target.value)} onBlur={() => handleBlur('bio')} error={touched.bio ? errors.bio : undefined} />
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
              
              {currentStep === 7 && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Phone className="text-purple-500" /> Contact Details</h2>
                    <AnimatedInput label="Email" value={formData.email} onChange={e => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} error={touched.email ? errors.email : undefined} />
                    <div className="grid md:grid-cols-2 gap-6">
                        <AnimatedPhoneInput label="Mobile" value={formData.mobile} countryCode={formData.mobileCode} onCountryCodeChange={c => handleChange('mobileCode', c)} onPhoneChange={p => handleChange('mobile', p)} onBlur={() => handleBlur('mobile')} error={touched.mobile ? errors.mobile : undefined} />
                        <AnimatedInput label="Alt Mobile (Optional)" value={formData.altMobile} onChange={e => handleChange('altMobile', e.target.value)} />
                    </div>
                    <AnimatedInput label="Address" value={formData.address} onChange={e => handleChange('address', e.target.value)} />
                    <div className="grid md:grid-cols-3 gap-6">
                        <AnimatedInput label="City" value={formData.city} onChange={e => handleChange('city', e.target.value)} />
                        <AnimatedInput label="State" value={formData.state} onChange={e => handleChange('state', e.target.value)} />
                        <AnimatedInput label="Country" value={formData.country} onChange={e => handleChange('country', e.target.value)} />
                    </div>
                 </div>
              )}

              {currentStep === 8 && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Camera className="text-purple-500" /> Media Uploads</h2>
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
        
        {/* FOOTER ACTIONS */}
        <div className="flex justify-between mt-8 pb-12">
            <button 
                onClick={prevStep} 
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ArrowLeft size={18} /> Back
            </button>
            
            <PremiumButton 
                onClick={currentStep === 9 ? onComplete : nextStep}
                icon={currentStep === 9 ? <CheckCircle size={18} /> : <ArrowRight size={18} />}
                variant={currentStep === 9 ? 'gradient' : 'primary'}
            >
                {currentStep === 9 ? 'Submit Profile' : 'Next Step'}
            </PremiumButton>
        </div>

      </div>
    </div>
  );
};

export default ProfileSetupWizard;