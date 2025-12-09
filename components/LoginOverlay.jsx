
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, ArrowRight, ChevronLeft, Shield, Briefcase, Users, Check, AlertCircle, Unlock } from 'lucide-react';
import { validateField } from '../utils/validation';
import { AnimatedInput, AnimatedPhoneInput } from './profile/ProfileFormElements';

const LoginOverlay= ({ 
  isOpen, 
  onClose, 
  onSwitchToAdmin, 
  onSwitchToSignup,
  onLoginSuccess, 
  onRegisterSuccess,
  onStartParentRegistration,
  initialView = 'login'
}) => {
  const [view, setView] = useState(initialView);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-white/60 dark:bg-black/80 backdrop-blur-md transition-colors duration-500"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-2xl dark:shadow-purple-900/20 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors z-20 text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>

          <div className="p-8 md:p-10 flex-1 flex flex-col justify-center relative">
            <AnimatePresence mode="wait" initial={false}>
              {view === 'login' && (
                <LoginView 
                  key="login" 
                  onChangeView={setView} 
                  onClose={onClose} 
                  onSwitchToAdmin={onSwitchToAdmin} 
                  onLoginSuccess={onLoginSuccess}
                  onSwitchToSignup={onSwitchToSignup} 
                />
              )}
              {view === 'register' && (
                <RegisterView 
                  key="register" 
                  onChangeView={setView} 
                  onRegisterSuccess={onRegisterSuccess}
                  onStartParentRegistration={onStartParentRegistration} 
                />
              )}
              {view === 'forgot' && (
                <ForgotView key="forgot" onChangeView={setView} />
              )}
            </AnimatePresence>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
        </div>
      </motion.div>
    </div>
  );
};

const LoginView = ({ onChangeView, onClose, onSwitchToAdmin, onSwitchToSignup, onLoginSuccess }) => {
    const [role, setRole] = useState('self');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const savedEmail = localStorage.getItem('mdm_email');
      const savedPass = localStorage.getItem('mdm_password');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
      if (savedPass) {
        setPassword(savedPass);
      }
    }, []);
  
    const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
  
      await new Promise(resolve => setTimeout(resolve, 1500));
  
      const validDemoEmails = ['demo@user.com', 'demo@broker.com', 'demo@parent.com'];
      const isUnrestrictedDemo = validDemoEmails.includes(email) && password === 'demo@123';
      const isStandardDemo = email === 'user@divine.com' && password === 'password';

      if (isStandardDemo || isUnrestrictedDemo) {
        if (rememberMe) {
          localStorage.setItem('mdm_email', email);
          localStorage.setItem('mdm_password', password);
        } else {
          localStorage.setItem('mdm_email', email); 
          localStorage.removeItem('mdm_password');
        }
        
        setIsLoading(false);
        onClose();
        // Determine role based on email or selected role
        const loggedInRole = email === 'demo@parent.com' ? 'parent' : role;
        onLoginSuccess(loggedInRole);
      } else {
        setError('Invalid credentials');
        setIsLoading(false);
      }
    };

    return (
        <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2 mb-6">
          <motion.h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Welcome Back</motion.h2>
          <motion.p className="text-gray-500 dark:text-gray-400 text-sm">Secure login for your peace of mind</motion.p>
        </div>
  
        <div className="flex p-1 bg-gray-100 dark:bg-black/40 rounded-xl relative">
          <div className="absolute inset-0 rounded-xl border border-black/5 dark:border-white/5 pointer-events-none" />
          {(['self', 'parent', 'broker'] ).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 relative z-10 ${role === r ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
            >
               {r === 'self' && <User size={14} />}
               {r === 'parent' && <Users size={14} />}
               {r === 'broker' && <Briefcase size={14} />}
               <span className="capitalize">{r}</span>
               {role === r && (
                 <motion.div layoutId="tab-bg" className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg -z-10 shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
               )}
            </button>
          ))}
        </div>
  
        <form className="space-y-4 pt-2" onSubmit={handleLogin}>
          <AnimatedInput 
            icon={<Mail size={20} />} 
            type="email" 
            label="Email Address"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AnimatedInput 
            icon={<Lock size={20} />} 
            type="password" 
            label="Password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-gray-500 dark:text-gray-400 select-none group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-300 ${rememberMe ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-gray-600 bg-transparent group-hover:border-purple-400'}`}>
                 {rememberMe && <Check size={12} className="text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
              <span className={`text-xs transition-colors ${rememberMe ? 'text-purple-600 dark:text-purple-400 font-medium' : 'group-hover:text-gray-700 dark:group-hover:text-gray-200'}`}>Remember me</span>
            </label>
            <span className="text-red-500 text-xs h-4 px-2">{error}</span>
            <button type="button" onClick={() => onChangeView('forgot')} className="font-medium text-purple-600 dark:text-blue-400 hover:text-purple-800 dark:hover:text-blue-300 transition-colors">Forgot Password?</button>
          </div>
  
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? 'Signing In...' : <>Sign In <ArrowRight size={18} /></>}
            </span>
          </motion.button>
        </form>
        
        <div className="flex justify-center gap-2">
            <button onClick={() => { setEmail('user@divine.com'); setPassword('password'); }} className="text-[10px] px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
              User Demo
            </button>
            <button onClick={() => { setEmail('demo@parent.com'); setPassword('demo@123'); }} className="text-[10px] px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
              Parent Demo
            </button>
            <button onClick={() => { setEmail('demo@user.com'); setPassword('demo@123'); }} className="flex items-center gap-1 text-[10px] px-3 py-1 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 rounded-full hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors border border-green-200 dark:border-green-900/30">
              <Unlock size={10} /> Full Access
            </button>
        </div>

        <div className="text-center mt-6 space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 pt-4">
            Don't have an account?{' '}
            <button onClick={() => onSwitchToSignup ? onSwitchToSignup() : onChangeView('register')} className="font-bold text-purple-600 dark:text-blue-400 hover:underline">Create Account</button>
            </p>
            {onSwitchToAdmin && (
            <div className="pt-2 border-t border-gray-100 dark:border-white/5">
                <button onClick={onSwitchToAdmin} className="text-xs flex items-center justify-center gap-1 mx-auto text-gray-400 hover:text-purple-600 dark:hover:text-gold-400 transition-colors">
                <Shield size={10} /> Login as Admin
                </button>
            </div>
            )}
        </div>
      </motion.div>
    );
}

const RegisterView = ({ onChangeView, onRegisterSuccess, onStartParentRegistration }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('self');
  const [formData, setFormData] = useState({ name: '', email: '', mobileCode: '+91', mobile: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = () => {
    const newErrors = {};
    if (validateField('fullName', formData.name)) newErrors.name = validateField('fullName', formData.name);
    if (validateField('email', formData.email)) newErrors.email = validateField('email', formData.email);
    if (validateField('mobile', formData.mobile, formData.mobileCode)) newErrors.mobile = validateField('mobile', formData.mobile, formData.mobileCode);
    if (validateField('password', formData.password)) newErrors.password = validateField('password', formData.password);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const fieldName = name === 'name' ? 'fullName' : name; 
    const error = validateField(fieldName, value);
    if (error) setErrors(prev => ({ ...prev, [name]: error }));
    else {
        setErrors(prev => {
            const newE = {...prev};
            delete newE[name];
            return newE;
        })
    }
  };

  const handleBlur = (e) => {
     const { name } = e.target;
     setTouched(prev => ({ ...prev, [name]: true }));
     const fieldName = name === 'name' ? 'fullName' : name;
     const error = validateField(fieldName, formData[name]);
     if (error) setErrors(prev => ({ ...prev, [name]: error }));
  }

  const handleRegister = (e) => {
    e.preventDefault();
    if (activeTab === 'parent' && onStartParentRegistration) {
      onStartParentRegistration();
      return;
    }
    
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
       <div className="text-center space-y-2 mb-4">
        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Create Account</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Begin your journey to finding love</p>
      </div>

      <div className="flex p-1 bg-gray-100 dark:bg-black/40 rounded-xl">
         <button onClick={() => setActiveTab('self')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'self' ? 'bg-white dark:bg-gray-800 text-purple-600 shadow' : 'text-gray-500'}`}>Self</button>
         <button onClick={() => setActiveTab('parent')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'parent' ? 'bg-white dark:bg-gray-800 text-purple-600 shadow' : 'text-gray-500'}`}>Parent</button>
      </div>

      {activeTab === 'parent' ? (
         <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto text-purple-600">
               <Users size={32} />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
               Registering as a parent allows you to manage your child's profile, verify their account, and communicate with other families.
            </p>
            <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleRegister}
               className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg mt-4"
            >
               Continue as Parent <ArrowRight size={16} className="inline ml-2" />
            </motion.button>
         </div>
      ) : (
         <form className="space-y-3" onSubmit={handleRegister}>
            <AnimatedInput 
               icon={<User size={20} />} 
               type="text" 
               name="name"
               label="Full Name" 
               alphaOnly
               placeholder="John Doe" 
               value={formData.name}
               onChange={handleChange}
               onBlur={handleBlur}
               error={touched.name ? errors.name : undefined}
               isValid={!errors.name && !!formData.name}
            />
            <AnimatedInput 
               icon={<Mail size={20} />} 
               type="email" 
               name="email"
               label="Email Address" 
               placeholder="john@example.com" 
               value={formData.email}
               onChange={handleChange}
               onBlur={handleBlur}
               error={touched.email ? errors.email : undefined}
               isValid={!errors.email && !!formData.email}
            />
            
            <AnimatedPhoneInput 
               label="Mobile Number"
               countryCode={formData.mobileCode}
               onCountryCodeChange={(c) => setFormData(prev => ({...prev, mobileCode: c}))}
               value={formData.mobile}
               onPhoneChange={(p) => setFormData(prev => ({...prev, mobile: p}))}
               error={touched.mobile ? errors.mobile : undefined}
               onBlur={() => {
                  setTouched(prev => ({...prev, mobile: true}));
                  const err = validateField('mobile', formData.mobile, formData.mobileCode);
                  if(err) setErrors(prev => ({...prev, mobile: err}));
                  else setErrors(prev => { const n = {...prev}; delete n.mobile; return n; })
               }}
            />

            <AnimatedInput 
               icon={<Lock size={20} />} 
               type="password" 
               name="password"
               label="Password" 
               placeholder="Min 8 chars" 
               value={formData.password}
               onChange={handleChange}
               onBlur={handleBlur}
               error={touched.password ? errors.password : undefined}
               isValid={!errors.password && !!formData.password}
            />
            
            <motion.button
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.5 }}
               type="submit"
               disabled={isLoading}
               className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-gold-400 via-orange-500 to-red-500 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group disabled:opacity-70 disabled:cursor-wait"
            >
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
               <span className="relative">{isLoading ? 'Processing...' : 'Register Now'}</span>
            </motion.button>
         </form>
      )}

      <div className="text-center pt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <button 
            type="button"
            onClick={() => onChangeView('login')}
            className="font-bold text-purple-600 dark:text-blue-400 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </motion.div>
  );
}

const ForgotView = ({ onChangeView }) => (
    <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.95, opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-6 text-center"
  >
    <div className="w-16 h-16 bg-purple-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-blue-400">
      <Lock size={32} />
    </div>
    
    <div className="space-y-2 mb-8">
      <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
        Enter your email address and we'll send you a link to reset your password.
      </p>
    </div>

    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <AnimatedInput icon={<Mail size={20} />} type="email" label="Email Address" placeholder="john@example.com" />

      <button className="w-full py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-opacity">
        Send Reset Link
      </button>
    </form>

    <button 
      onClick={() => onChangeView('login')}
      className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      <ChevronLeft size={16} /> Back to Login
    </button>
  </motion.div>
);

export default LoginOverlay;
