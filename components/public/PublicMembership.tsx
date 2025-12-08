
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, CheckCircle, Shield, Award, Star } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import PricingCard, { PlanProps } from '../ui/PricingCard';

const PLANS: PlanProps[] = [
  {
    id: 'gold',
    name: 'Gold',
    price: '₹3,999',
    duration: '3 Months',
    monthly: '₹1,333/mo',
    features: ['Send Unlimited Messages', 'View 50 Contact Numbers', 'Priority Support', 'Standout Profile Highlighter', 'Basic Horoscope Matching'],
    recommended: false
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: '₹6,999',
    duration: '6 Months',
    monthly: '₹1,166/mo',
    features: ['Everything in Gold', 'View 150 Contact Numbers', 'Profile Booster (x5 Views)', 'Dedicated Relationship Manager', 'Detailed Horoscope Reports'],
    recommended: true
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '₹10,999',
    duration: '12 Months',
    monthly: '₹916/mo',
    features: ['Everything in Diamond', 'Unlimited Contact Views', 'Top Search Placement', 'Background Verification Check', 'Personalized Matchmaking'],
    recommended: false
  }
];

interface PublicMembershipProps {
  onLogin: () => void;
}

const PublicMembership: React.FC<PublicMembershipProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-6 mb-20 relative">
        {/* Background Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-300 text-sm font-bold uppercase tracking-wider shadow-sm border border-gold-200 dark:border-gold-800"
        >
          <Crown size={16} /> Premium Access
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-7xl font-display font-bold text-gray-900 dark:text-white tracking-tight"
        >
          Choose the plan that <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-gradient-x">fits your journey</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          Unlock exclusive features, verified contact numbers, and advanced AI matching tools to find your perfect partner faster.
        </motion.p>
      </div>

      {/* Plans Grid */}
      <div className="grid lg:grid-cols-3 gap-8 xl:gap-12 px-2">
         {PLANS.map((plan, idx) => (
            <PricingCard
               key={plan.id}
               plan={plan}
               index={idx}
               onSelect={onLogin}
            />
         ))}
      </div>

      {/* Trust Badges */}
      <div className="mt-28 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-gray-200 dark:border-white/10 pt-16">
         {[
            { label: '100% Verified Profiles', icon: <Shield size={28} /> },
            { label: 'Secure Payments', icon: <CheckCircle size={28} /> },
            { label: 'Privacy Control', icon: <Award size={28} /> },
            { label: '24/7 Priority Support', icon: <Star size={28} /> }
         ].map((item, idx) => (
            <motion.div
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.5 + idx * 0.1 }}
               className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400 group"
            >
               <div className="p-5 bg-white dark:bg-white/5 rounded-[20px] text-purple-600 dark:text-gold-400 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-gray-100 dark:border-white/10">
                  {item.icon}
               </div>
               <span className="font-bold text-sm md:text-base">{item.label}</span>
            </motion.div>
         ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 text-center pb-10">
         <p className="text-gray-500 dark:text-gray-400 mb-6">Not sure yet? Start with a free account.</p>
         <PremiumButton onClick={onLogin} variant="outline" className="!px-10">
            Create Free Profile
         </PremiumButton>
      </div>

    </div>
  );
};

export default PublicMembership;
