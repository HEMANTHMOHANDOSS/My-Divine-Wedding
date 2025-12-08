
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Upload, AlertCircle, X, ChevronDown, Mail, Lock, RefreshCw, CheckCircle2, Globe, Plus } from 'lucide-react';
import { PATTERNS, COUNTRY_CODES, formatCurrency, validateFile } from '../../utils/validation';

// --- ANIMATED INPUT ---
interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  isValid?: boolean;
  numericOnly?: boolean;
  alphaOnly?: boolean;
  formatter?: 'currency' | 'none';
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({ 
  label, error, icon, className, placeholder, isValid, numericOnly, alphaOnly, formatter, onChange, ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value);
  const [shake, setShake] = useState(false);

  // Sync hasValue with external prop changes
  useEffect(() => {
    setHasValue(!!props.value);
  }, [props.value]);

  // Trigger shake on error
  useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow control keys
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) return;

    if (numericOnly) {
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    }
    if (alphaOnly) {
      // Allow letters and space
      if (!/[a-zA-Z\s]/.test(e.key)) e.preventDefault();
    }
    props.onKeyDown?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    if (formatter === 'currency') {
      // Strip existing non-digits to reformat
      const raw = val.replace(/[^0-9]/g, '');
      if (raw) {
         val = formatCurrency(raw);
      } else {
         val = '';
      }
      e.target.value = val;
    }

    if (numericOnly) {
      val = val.replace(/[^0-9]/g, '');
      e.target.value = val;
    }

    if (alphaOnly) {
      val = val.replace(/[^a-zA-Z\s]/g, '');
      e.target.value = val;
    }

    onChange?.(e);
  };

  return (
    <motion.div 
      className={`relative mb-6 group ${className}`}
      animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
    >
      {/* Icon Wrapper */}
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10 ${focused ? 'text-purple-600 dark:text-gold-400' : 'text-gray-400'}`}>
        {icon}
      </div>
      
      <input
        {...props}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          setHasValue(!!e.target.value);
          props.onBlur?.(e);
        }}
        placeholder={focused ? placeholder : ''}
        className={`
          w-full bg-white/60 dark:bg-black/20 
          backdrop-blur-xl
          border 
          rounded-xl 
          px-12 
          pt-6 pb-2 
          h-14 
          text-gray-900 dark:text-white 
          font-medium
          outline-none 
          transition-all duration-300
          placeholder:text-gray-400 dark:placeholder:text-gray-600 placeholder:text-sm
          ${error 
            ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] bg-red-50/10' 
            : isValid
              ? 'border-green-500/50 bg-green-50/10 dark:bg-green-900/10'
              : focused 
                ? 'border-purple-600 dark:border-gold-400 bg-white dark:bg-black/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                : 'border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/30 hover:bg-white/80 dark:hover:bg-white/5'
          }
        `}
      />
      
      {/* Success Indicator */}
      <AnimatePresence>
        {isValid && !error && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
          >
            <CheckCircle2 size={18} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Label */}
      <label 
        className={`
          absolute left-12 
          transition-all duration-300 ease-out
          pointer-events-none 
          truncate max-w-[calc(100%-4rem)]
          origin-top-left
          ${focused || hasValue 
            ? 'top-1.5 text-[10px] uppercase tracking-wider font-bold translate-y-0' 
            : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'
          }
          ${error ? 'text-red-500' : focused ? 'text-purple-600 dark:text-gold-400' : ''}
        `}
      >
        {label}
      </label>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="absolute right-0 top-full mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md border border-red-100 dark:border-red-900/30 shadow-sm z-20 pointer-events-none"
          >
            <AlertCircle size={12} /> {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- ANIMATED PHONE INPUT ---
interface AnimatedPhoneInputProps {
  label: string;
  value: string;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneChange: (phone: string) => void;
  error?: string;
  onBlur?: () => void;
}

export const AnimatedPhoneInput: React.FC<AnimatedPhoneInputProps> = ({
  label, value, countryCode, onCountryCodeChange, onPhoneChange, error, onBlur
}) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  useEffect(() => {
    if (error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [error]);

  return (
     <motion.div 
      className="relative mb-6 group"
      animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
    >
      <div className={`flex items-center w-full bg-white/60 dark:bg-black/20 backdrop-blur-xl border rounded-xl overflow-hidden transition-all duration-300
         ${error 
            ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] bg-red-50/10' 
            : focused 
              ? 'border-purple-600 dark:border-gold-400 bg-white dark:bg-black/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
              : 'border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/30 hover:bg-white/80 dark:hover:bg-white/5'
          }
      `}>
        {/* Country Select */}
        <div className="relative border-r border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            className="appearance-none bg-transparent h-14 pl-4 pr-8 outline-none text-gray-900 dark:text-white font-medium text-sm cursor-pointer w-24"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code} className="text-gray-900 bg-white dark:bg-gray-900 dark:text-white">
                {c.country} {c.code}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Number Input */}
        <div className="relative flex-1">
          <input 
            type="text" 
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              onBlur?.();
            }}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              onPhoneChange(val);
            }}
            className="w-full bg-transparent h-14 px-4 outline-none text-gray-900 dark:text-white font-medium placeholder-transparent"
            placeholder="1234567890"
          />
          <label 
            className={`
              absolute left-4
              transition-all duration-300 ease-out
              pointer-events-none 
              origin-top-left
              ${focused || hasValue 
                ? 'top-1.5 text-[10px] uppercase tracking-wider font-bold translate-y-0' 
                : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'
              }
              ${error ? 'text-red-500' : focused ? 'text-purple-600 dark:text-gold-400' : ''}
            `}
          >
            {label}
          </label>
        </div>
      </div>

       <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute right-0 top-full mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md border border-red-100 dark:border-red-900/30 shadow-sm z-20 pointer-events-none"
          >
            <AlertCircle size={12} /> {error}
          </motion.div>
        )}
      </AnimatePresence>
     </motion.div>
  );
}

// --- EMAIL OTP VERIFIER ---
interface EmailOtpVerifierProps {
  email: string;
  onEmailChange: (e: string) => void;
  onVerified: (status: boolean) => void;
  error?: string;
}

export const EmailOtpVerifier: React.FC<EmailOtpVerifierProps> = ({ email, onEmailChange, onVerified, error }) => {
  const [step, setStep] = useState<'input' | 'verify' | 'verified'>('input');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isSending, setIsSending] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any;
    if (step === 'verify' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async () => {
    if (!PATTERNS.EMAIL.test(email)) return;
    setIsSending(true);
    // Simulate API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    setStep('verify');
    setTimer(30);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // Verify automatically if full
    if (newOtp.every(d => d !== '') && index === 5) {
      // Simulate verification
      if (newOtp.join('') === '123456') { // Mock OTP
        setStep('verified');
        onVerified(true);
      } else {
        alert("Invalid OTP (Use 123456)");
        setOtp(['', '', '', '', '', '']);
        inputsRef.current[0]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {step === 'input' && (
        <div className="flex gap-2 items-start">
          <div className="flex-1">
             <AnimatedInput 
               label="Professional Email" 
               placeholder="name@company.com" 
               icon={<Mail size={18} />} 
               value={email}
               onChange={(e) => {
                 onEmailChange(e.target.value);
                 onVerified(false);
               }}
               error={error}
             />
          </div>
          <button 
            type="button"
            onClick={handleSendOtp}
            disabled={isSending || !PATTERNS.EMAIL.test(email)}
            className="mt-2 h-10 px-4 rounded-xl bg-purple-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/30"
          >
             {isSending ? <RefreshCw size={16} className="animate-spin" /> : 'Send OTP'}
          </button>
        </div>
      )}

      {step === 'verify' && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/30">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300">Verify Email Address</h4>
            <button onClick={() => setStep('input')} className="text-xs text-purple-600 hover:underline">Change Email</button>
          </div>
          <p className="text-xs text-gray-500 mb-4">Enter the 6-digit code sent to <strong>{email}</strong></p>
          
          <div className="flex justify-between gap-2 mb-4">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputsRef.current[idx] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-10 h-12 text-center text-lg font-bold rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-black/40 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              />
            ))}
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span className={timer < 10 ? 'text-red-500 font-bold' : 'text-gray-500'}>
              Expires in 00:{timer.toString().padStart(2, '0')}
            </span>
            <button 
              type="button"
              disabled={timer > 0} 
              onClick={handleSendOtp}
              className={`font-bold ${timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-purple-600 hover:underline'}`}
            >
              Resend Code
            </button>
          </div>
        </motion.div>
      )}

      {step === 'verified' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
            <Check size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Email Verified</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
          </div>
          <button onClick={() => { setStep('input'); onVerified(false); }} className="text-xs text-gray-400 hover:text-gray-600">Change</button>
        </motion.div>
      )}
    </div>
  );
};

// --- ANIMATED SELECT ---
interface AnimatedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  icon?: React.ReactNode;
  isValid?: boolean;
}

export const AnimatedSelect: React.FC<AnimatedSelectProps> = ({ label, options, error, icon, className, isValid, ...props }) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setHasValue(!!props.value);
  }, [props.value]);

   useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <motion.div 
      className={`relative mb-6 group ${className}`}
      animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
    >
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10 ${focused ? 'text-purple-600 dark:text-gold-400' : 'text-gray-400'}`}>
        {icon}
      </div>
      
      <select
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          setHasValue(!!e.target.value);
          props.onBlur?.(e);
        }}
        className={`
          w-full bg-white/60 dark:bg-black/20 
          backdrop-blur-xl
          border 
          rounded-xl 
          pl-12 pr-10
          pt-6 pb-2 
          h-14 
          text-gray-900 dark:text-white 
          font-medium
          outline-none 
          appearance-none
          cursor-pointer
          transition-all duration-300
          ${error 
            ? 'border-red-500 shadow-sm' 
            : isValid
              ? 'border-green-500/50 bg-green-50/10 dark:bg-green-900/10'
              : focused 
                ? 'border-purple-600 dark:border-gold-400 bg-white dark:bg-black/40' 
                : 'border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/30 hover:bg-white/80 dark:hover:bg-white/5'
          }
        `}
      >
        <option value="" disabled hidden></option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="text-gray-900 bg-white dark:bg-gray-900 dark:text-white">
            {opt.label}
          </option>
        ))}
      </select>

      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      
      <label 
        className={`
          absolute left-12 
          transition-all duration-300 ease-out
          pointer-events-none 
          origin-top-left
          ${focused || hasValue 
            ? 'top-1.5 text-[10px] uppercase tracking-wider font-bold translate-y-0' 
            : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'
          }
          ${error ? 'text-red-500' : focused ? 'text-purple-600 dark:text-gold-400' : ''}
        `}
      >
        {label}
      </label>

       <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute right-0 top-full mt-1 flex items-center gap-1 text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded z-20 pointer-events-none"
          >
            <AlertCircle size={12} /> {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- ANIMATED TEXTAREA ---
export const AnimatedTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string, error?: string, isValid?: boolean }> = ({ label, error, placeholder, isValid, ...props }) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setHasValue(!!props.value);
  }, [props.value]);

  useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <motion.div 
      className="relative mb-6"
      animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
    >
      <textarea 
        {...props}
        onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
        }}
        onBlur={(e) => {
            setFocused(false);
            setHasValue(!!e.target.value);
            props.onBlur?.(e);
        }}
        placeholder={focused ? placeholder : ''}
        className={`
          w-full bg-white/60 dark:bg-black/20 
          backdrop-blur-xl
          border 
          rounded-xl 
          px-5 
          pt-7 pb-3
          min-h-[120px] 
          text-gray-900 dark:text-white 
          outline-none 
          transition-all duration-300 
          focus:bg-white dark:focus:bg-black/40
          placeholder:text-gray-400 dark:placeholder:text-gray-600 placeholder:text-sm
          ${error 
            ? 'border-red-500 shadow-sm' 
            : isValid
              ? 'border-green-500/50 bg-green-50/10'
              : focused 
                ? 'border-purple-600 dark:border-gold-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                : 'border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/30 hover:bg-white/80 dark:hover:bg-white/5'
          }
        `}
      />
      <label 
        className={`
          absolute left-5 
          transition-all duration-300 ease-out
          pointer-events-none 
          origin-top-left
          ${focused || hasValue 
            ? 'top-2 text-[10px] uppercase tracking-wider font-bold translate-y-0' 
            : 'top-6 text-sm text-gray-500 dark:text-gray-400'
          }
          ${error ? 'text-red-500' : focused ? 'text-purple-600 dark:text-gold-400' : ''}
        `}
      >
        {label}
      </label>
       <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute right-0 top-full mt-1 flex items-center gap-1 text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded z-20 pointer-events-none"
          >
            <AlertCircle size={12} /> {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// --- SELECTION CARD ---
interface SelectionCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  icon: React.ReactNode;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({ selected, onClick, title, description, icon }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`relative cursor-pointer rounded-2xl p-6 border transition-all duration-300 overflow-hidden group h-full flex flex-col items-center text-center
        ${selected 
          ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500 dark:border-gold-400 shadow-xl shadow-purple-500/20' 
          : 'bg-white/40 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/30'
        }`}
    >
      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border flex items-center justify-center transition-colors
        ${selected ? 'bg-purple-600 dark:bg-gold-400 border-transparent' : 'border-gray-300 dark:border-gray-600'}`}>
        {selected && <Check size={14} className="text-white dark:text-black" />}
      </div>

      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-500
        ${selected ? 'bg-purple-100 dark:bg-gold-400/20 text-purple-600 dark:text-gold-400' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:bg-purple-50 dark:group-hover:bg-white/20 group-hover:scale-110'}`}>
        {icon}
      </div>

      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>}

      {selected && (
        <motion.div 
          layoutId="card-glow"
          className="absolute inset-0 bg-purple-500/5 dark:bg-gold-400/5 pointer-events-none" 
        />
      )}
    </motion.div>
  );
};

// --- FILE UPLOAD ---
interface FileUploadProps {
  label: string;
  accept?: string;
  onFileSelect: (file: File) => void;
  error?: string;
  multiple?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, accept, onFileSelect, error, multiple = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (error) setValidationError(error);
  }, [error]);

  const validateAndSet = (selectedFile: File) => {
    const err = validateFile(selectedFile);
    if (err) {
      setValidationError(err);
    } else {
      setValidationError(null);
      setFiles(prev => multiple ? [...prev, selectedFile] : [selectedFile]);
      onFileSelect(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSet(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSet(e.target.files[0]);
    }
  };

  const removeFile = (index: number) => {
      setFiles(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="mb-6 relative">
      <label className={`block text-sm font-bold mb-2 ml-1 ${validationError ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>{label}</label>
      
      <div 
          onDragEnter={handleDrag} 
          onDragLeave={handleDrag} 
          onDragOver={handleDrag} 
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 group cursor-pointer mb-4
            ${dragActive 
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-[1.02]' 
              : validationError
                 ? 'border-red-500 bg-red-50/10'
                 : 'border-gray-300 dark:border-white/20 hover:border-purple-400 dark:hover:border-white/40 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
        >
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            accept={accept}
            onChange={handleChange}
            multiple={multiple}
          />
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${dragActive ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:text-purple-500 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20'}`}>
              <Upload size={20} />
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              <span className="text-purple-600 dark:text-gold-400 font-bold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">Supported: JPG, PNG, PDF (max 10MB)</p>
          </div>
        </div>

      <div className="space-y-2">
        {files.map((file, idx) => (
            <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-purple-50 dark:bg-white/10 border border-purple-200 dark:border-white/20 rounded-xl p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-white">
                <Check size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={() => removeFile(idx)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </div>
      
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute right-0 -bottom-6 mt-1 flex items-center gap-1 text-xs text-red-500 font-bold"
          >
            <AlertCircle size={12} /> {validationError}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- TAG SELECTOR (For Hobbies/Interests) ---
interface TagSelectorProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ label, options, selected, onChange }) => {
    const toggleTag = (tag: string) => {
        if (selected.includes(tag)) {
            onChange(selected.filter(t => t !== tag));
        } else {
            onChange([...selected, tag]);
        }
    };

    const [customTag, setCustomTag] = useState('');

    const addCustomTag = () => {
        if(customTag.trim() && !selected.includes(customTag.trim())) {
            onChange([...selected, customTag.trim()]);
            setCustomTag('');
        }
    }

    return (
        <div className="mb-6">
            <label className="block text-sm font-bold mb-3 ml-1 text-gray-700 dark:text-gray-300">{label}</label>
            <div className="flex flex-wrap gap-2 mb-3">
                {options.map(opt => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => toggleTag(opt)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border
                            ${selected.includes(opt) 
                                ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/30' 
                                : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-purple-400'
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            
            {/* Custom Input */}
            <div className="flex gap-2">
                 <input 
                    type="text" 
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="Add other..."
                    className="flex-1 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500"
                 />
                 <button 
                    type="button" 
                    onClick={addCustomTag}
                    className="p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/40"
                 >
                    <Plus size={18} />
                 </button>
            </div>
        </div>
    );
};

// --- RADIO GROUP ---
interface RadioGroupProps {
    label: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (val: string) => void;
    error?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, options, value, onChange, error }) => {
    return (
        <div className="mb-6">
            <label className="block text-sm font-bold mb-3 ml-1 text-gray-700 dark:text-gray-300">{label}</label>
            <div className="flex flex-wrap gap-4">
                {options.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                            ${value === opt.value ? 'border-purple-600 dark:border-gold-400' : 'border-gray-300 dark:border-gray-600 group-hover:border-purple-400'}`}>
                            {value === opt.value && (
                                <div className="w-2.5 h-2.5 rounded-full bg-purple-600 dark:bg-gold-400" />
                            )}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${value === opt.value ? 'text-purple-700 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                            {opt.label}
                        </span>
                        <input type="radio" className="hidden" value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} />
                    </label>
                ))}
            </div>
             {error && (
                <p className="text-xs text-red-500 font-bold mt-2 flex items-center gap-1">
                    <AlertCircle size={12} /> {error}
                </p>
            )}
        </div>
    )
}
