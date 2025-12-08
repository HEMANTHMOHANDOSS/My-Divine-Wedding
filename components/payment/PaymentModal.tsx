
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, CheckCircle, Shield, AlertTriangle, ChevronRight, Lock } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput } from '../profile/ProfileFormElements';

interface PaymentModalProps {
  plan: {
    id: string;
    name: string;
    price: string;
    duration: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose, onSuccess }) => {
  const [step, setStep] = useState<'select' | 'details' | 'processing' | 'success' | 'fail'>('select');
  const [method, setMethod] = useState<'card' | 'upi' | 'netbanking' | 'paypal'>('card');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  
  // Handlers
  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
        setStep('success');
        setTimeout(() => {
            onSuccess();
            onClose();
        }, 3000);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 50 }}
        className="relative w-full max-w-md bg-white dark:bg-[#121212] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
      >
        <div className="p-6 md:p-8">
           
           {/* Header */}
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white">
                 {step === 'success' ? 'Payment Successful' : 'Secure Checkout'}
              </h3>
              {step !== 'success' && step !== 'processing' && (
                 <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                    <X size={18} />
                 </button>
              )}
           </div>

           <AnimatePresence mode="wait">
              {/* STEP 1: SELECT METHOD */}
              {step === 'select' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-white/5 flex justify-between items-center">
                       <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Plan Selected</p>
                          <h4 className="text-lg font-bold text-purple-700 dark:text-purple-300">{plan.name}</h4>
                          <p className="text-xs text-gray-500">{plan.duration}</p>
                       </div>
                       <div className="text-xl font-bold text-gray-900 dark:text-white">{plan.price}</div>
                    </div>

                    <div>
                       <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">Select Payment Method</label>
                       <div className="space-y-3">
                          {[
                             { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                             { id: 'upi', label: 'UPI (GPay, PhonePe)', icon: ZapIcon },
                             { id: 'paypal', label: 'PayPal', icon: Shield },
                          ].map((opt) => (
                             <button
                                key={opt.id}
                                onClick={() => setMethod(opt.id as any)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                                   method === opt.id 
                                   ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-white shadow-sm' 
                                   : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
                                }`}
                             >
                                <div className="flex items-center gap-3">
                                   <opt.icon size={20} />
                                   <span className="font-bold text-sm">{opt.label}</span>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === opt.id ? 'border-purple-600' : 'border-gray-300 dark:border-gray-600'}`}>
                                   {method === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                                </div>
                             </button>
                          ))}
                       </div>
                    </div>

                    <PremiumButton onClick={() => setStep('details')} width="full">
                       Continue
                    </PremiumButton>
                 </motion.div>
              )}

              {/* STEP 2: DETAILS */}
              {step === 'details' && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <button onClick={() => setStep('select')} className="text-xs text-gray-500 hover:text-purple-600 flex items-center gap-1">
                       <ChevronRight size={12} className="rotate-180" /> Change Method
                    </button>

                    {method === 'card' && (
                       <div className="space-y-4">
                          <AnimatedInput label="Card Number" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} numericOnly icon={<CreditCard size={18} />} />
                          <div className="grid grid-cols-2 gap-4">
                             <AnimatedInput label="Expiry Date" placeholder="MM/YY" />
                             <AnimatedInput label="CVV" placeholder="123" numericOnly type="password" />
                          </div>
                          <AnimatedInput label="Card Holder Name" placeholder="John Doe" alphaOnly />
                       </div>
                    )}

                    {method === 'upi' && (
                       <div className="space-y-4">
                          <AnimatedInput label="UPI ID" placeholder="name@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} icon={<ZapIcon size={18} />} />
                          <p className="text-xs text-gray-500 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                             A collect request will be sent to your UPI app. Approve it to complete payment.
                          </p>
                       </div>
                    )}

                    <div className="pt-2">
                       <div className="flex justify-between text-sm font-bold mb-4 px-2">
                          <span>Total to Pay</span>
                          <span className="text-xl text-purple-600 dark:text-purple-400">{plan.price}</span>
                       </div>
                       <PremiumButton onClick={handlePay} width="full" variant="gradient" icon={<Lock size={16} />}>
                          Pay Securely
                       </PremiumButton>
                       <p className="text-[10px] text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                          <Shield size={10} /> 256-bit SSL Encrypted Transaction
                       </p>
                    </div>
                 </motion.div>
              )}

              {/* STEP 3: PROCESSING */}
              {step === 'processing' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="relative w-24 h-24 mb-6">
                       <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-white/10" />
                       <motion.div 
                          className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                       />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Lock size={32} className="text-purple-600 dark:text-white" />
                       </div>
                    </div>
                    <h4 className="text-lg font-bold">Processing Payment</h4>
                    <p className="text-sm text-gray-500 mt-2">Please do not close this window...</p>
                 </motion.div>
              )}

              {/* STEP 4: SUCCESS */}
              {step === 'success' && (
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6 shadow-xl shadow-green-500/20">
                       <CheckCircle size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upgrade Successful!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                       Welcome to the <strong>{plan.name}</strong> club. All premium features have been unlocked.
                    </p>
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 w-full text-left mb-6">
                       <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Transaction ID</span>
                          <span>#TXN-8839201</span>
                       </div>
                       <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-white">
                          <span>Amount Paid</span>
                          <span>{plan.price}</span>
                       </div>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
};

const ZapIcon = ({ size }: { size: number }) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

export default PaymentModal;
