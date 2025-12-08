
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, CheckCircle, Shield, CreditCard, ChevronDown, Award, X 
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import PaymentModal from '../payment/PaymentModal';
import PricingCard, { PlanProps } from '../ui/PricingCard';

const PLANS: PlanProps[] = [
  {
    id: 'gold',
    name: 'Gold',
    price: '₹3,999',
    duration: '3 Months',
    monthly: '₹1,333/mo',
    features: [
       'Send Unlimited Messages', 
       'View 50 Contact Numbers', 
       'Priority Customer Support', 
       'Standout Profile Highlighter',
       'Basic Horoscope Matching'
    ],
    recommended: false
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: '₹6,999',
    duration: '6 Months',
    monthly: '₹1,166/mo',
    features: [
       'Everything in Gold Plan', 
       'View 150 Contact Numbers', 
       'Profile Booster (x5 Views)', 
       'Dedicated Relationship Manager', 
       'Detailed Horoscope Reports'
    ],
    recommended: true
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '₹10,999',
    duration: '12 Months',
    monthly: '₹916/mo',
    features: [
       'Everything in Diamond Plan', 
       'Unlimited Contact Views', 
       'Top Search Placement', 
       'Background Verification Check', 
       'Personalized Matchmaking'
    ],
    recommended: false
  }
];

const FEATURES_COMPARE = [
  { name: 'Send Messages', free: false, gold: true, diamond: true, platinum: true },
  { name: 'View Contact Numbers', free: '0', gold: '50', diamond: '150', platinum: 'Unlimited' },
  { name: 'Profile Booster', free: false, gold: false, diamond: true, platinum: true },
  { name: 'Horoscope Reports', free: false, gold: true, diamond: true, platinum: true },
  { name: 'Relationship Manager', free: false, gold: false, diamond: true, platinum: true },
  { name: 'Verified Badge', free: true, gold: true, diamond: true, platinum: true },
];

const MembershipPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanProps | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [activePlan, setActivePlan] = useState('free'); // 'free', 'gold', etc.

  const handleSelectPlan = (plan: PlanProps) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handleUpgradeSuccess = () => {
    if (selectedPlan) setActivePlan(selectedPlan.id);
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Background Particles for Ambience */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
         <motion.div animate={{ y: [0, -50, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-400 rounded-full opacity-20 blur-[1px]" />
         <motion.div animate={{ y: [0, 60, 0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute top-1/2 right-1/4 w-3 h-3 bg-purple-400 rounded-full opacity-20 blur-[1px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Crown className="text-gold-500 fill-gold-500" size={32} />
            Premium Membership
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-2 max-w-xl">
            Unlock exclusive features and accelerate your search for the perfect partner with our tailored plans.
          </p>
        </div>
        
        {/* Current Plan Badge */}
        <div className="px-6 py-4 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl flex items-center gap-4 shadow-xl">
           <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Current Plan</p>
              <p className="text-xl font-bold text-purple-600 dark:text-white capitalize tracking-tight">{activePlan} Member</p>
           </div>
           <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${activePlan === 'free' ? 'bg-gray-200 text-gray-500' : 'bg-gradient-to-r from-gold-400 to-orange-500 text-white'}`}>
              <Shield size={24} />
           </div>
        </div>
      </div>

      {/* PLANS GRID */}
      <div className="grid lg:grid-cols-3 gap-8 xl:gap-12 px-2">
         {PLANS.map((plan, idx) => (
            <PricingCard 
               key={plan.id}
               plan={plan}
               index={idx}
               onSelect={() => handleSelectPlan(plan)}
            />
         ))}
      </div>

      {/* COMPARISON TABLE */}
      <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden mt-20">
         <div className="text-center mb-10">
            <h3 className="text-3xl font-bold mb-2">Detailed Comparison</h3>
            <p className="text-gray-500">See exactly what you get with each tier.</p>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
               <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10">
                     <th className="text-left py-6 px-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Features</th>
                     <th className="py-6 px-6 text-center text-sm font-bold text-gray-500 uppercase tracking-wider">Free</th>
                     <th className="py-6 px-6 text-center text-sm font-bold text-amber-600 uppercase tracking-wider">Gold</th>
                     <th className="py-6 px-6 text-center text-sm font-bold text-cyan-600 uppercase tracking-wider">Diamond</th>
                     <th className="py-6 px-6 text-center text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Platinum</th>
                  </tr>
               </thead>
               <tbody>
                  {FEATURES_COMPARE.map((row, idx) => (
                     <tr key={idx} className="border-b border-gray-100 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors group">
                        <td className="py-5 px-6 font-medium text-gray-700 dark:text-gray-300">{row.name}</td>
                        <td className="py-5 px-6 text-center">
                           {row.free === true ? <CheckCircle size={20} className="mx-auto text-green-500" /> : row.free === false ? <X size={20} className="mx-auto text-gray-300 opacity-50" /> : <span className="text-sm font-bold text-gray-500">{row.free}</span>}
                        </td>
                        <td className="py-5 px-6 text-center bg-amber-50/30 dark:bg-amber-900/5 group-hover:bg-amber-50/50 dark:group-hover:bg-amber-900/10 transition-colors">
                           {row.gold === true ? <CheckCircle size={20} className="mx-auto text-amber-500" /> : row.gold === false ? <X size={20} className="mx-auto text-gray-300" /> : <span className="text-sm font-bold text-amber-600">{row.gold}</span>}
                        </td>
                        <td className="py-5 px-6 text-center bg-cyan-50/30 dark:bg-cyan-900/5 group-hover:bg-cyan-50/50 dark:group-hover:bg-cyan-900/10 transition-colors">
                           {row.diamond === true ? <CheckCircle size={20} className="mx-auto text-cyan-500" /> : row.diamond === false ? <X size={20} className="mx-auto text-gray-300" /> : <span className="text-sm font-bold text-cyan-600">{row.diamond}</span>}
                        </td>
                        <td className="py-5 px-6 text-center bg-gray-50/30 dark:bg-white/5 group-hover:bg-gray-100/50 dark:group-hover:bg-white/10 transition-colors">
                           {row.platinum === true ? <CheckCircle size={20} className="mx-auto text-green-500" /> : row.platinum === false ? <X size={20} className="mx-auto text-gray-300" /> : <span className="text-sm font-bold text-gray-900 dark:text-white">{row.platinum}</span>}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* PAYMENT MODAL */}
      <AnimatePresence>
         {showPayment && selectedPlan && (
            <PaymentModal 
               plan={selectedPlan} 
               onClose={() => setShowPayment(false)} 
               onSuccess={handleUpgradeSuccess} 
            />
         )}
      </AnimatePresence>

    </div>
  );
};

export default MembershipPage;
