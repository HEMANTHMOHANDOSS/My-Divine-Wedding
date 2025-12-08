
import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Check, Crown, Star, Award, Sparkles, Zap, Shield } from 'lucide-react';
import PremiumButton from './PremiumButton';

export interface PlanProps {
  id: string;
  name: string;
  price: string;
  duration: string;
  monthly: string;
  features: string[];
  recommended?: boolean;
}

interface PricingCardProps {
  plan: PlanProps;
  onSelect: () => void;
  index?: number;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelect, index = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  // Mouse tracking for spotlight/prism effects
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    x.set(xPos);
    y.set(yPos);
  };

  // Tier-specific configurations
  const getTierStyles = (id: string) => {
    switch (id) {
      case 'gold':
        return {
          icon: <Star size={32} className="text-yellow-900 dark:text-yellow-200" />,
          borderGradient: "from-yellow-400 via-orange-300 to-yellow-600",
          bgGradient: "from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/10",
          textAccent: "text-yellow-700 dark:text-yellow-400",
          buttonVariant: "gradient" as const, // We'll customize this via className
          glow: "shadow-yellow-500/20",
          badge: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
          particleColor: "bg-yellow-400"
        };
      case 'diamond':
        return {
          icon: <Crown size={32} className="text-cyan-900 dark:text-cyan-200" />,
          borderGradient: "from-cyan-400 via-blue-400 to-purple-500",
          bgGradient: "from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/10",
          textAccent: "text-cyan-600 dark:text-cyan-400",
          buttonVariant: "gradient" as const,
          glow: "shadow-cyan-500/20",
          badge: "bg-gradient-to-r from-cyan-400 to-blue-600 text-white",
          particleColor: "bg-cyan-400"
        };
      case 'platinum':
        return {
          icon: <Award size={32} className="text-slate-900 dark:text-slate-200" />,
          borderGradient: "from-slate-300 via-white to-slate-400",
          bgGradient: "from-gray-50 to-slate-100 dark:from-slate-900/50 dark:to-black",
          textAccent: "text-slate-600 dark:text-slate-300",
          buttonVariant: "primary" as const,
          glow: "shadow-slate-500/20",
          badge: "bg-gradient-to-r from-slate-700 to-black text-white",
          particleColor: "bg-white"
        };
      default:
        return {
          icon: <Star />,
          borderGradient: "from-gray-200 to-gray-400",
          bgGradient: "from-white to-gray-50",
          textAccent: "text-gray-600",
          buttonVariant: "secondary" as const,
          glow: "shadow-gray-500/10",
          badge: "bg-gray-500 text-white",
          particleColor: "bg-gray-400"
        };
    }
  };

  const style = getTierStyles(plan.id);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={{ y: -15, scale: 1.02 }}
      className={`relative group rounded-[2.5rem] p-1 h-full flex flex-col transition-all duration-500 ${style.glow} hover:shadow-2xl`}
    >
      {/* Animated Border Gradient */}
      <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${style.borderGradient} opacity-30 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Liquid Shimmer Border Effect */}
      {hover && (
        <motion.div 
          className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr ${style.borderGradient} opacity-60 blur-md`}
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          style={{ backgroundSize: "200% 200%" }}
        />
      )}

      {/* Card Content Container */}
      <div className={`relative h-full w-full bg-gradient-to-b ${style.bgGradient} backdrop-blur-2xl rounded-[2.3rem] p-8 md:p-10 flex flex-col overflow-hidden border border-white/40 dark:border-white/5`}>
        
        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(255,255,255,0.15),
                transparent 80%
              )
            `,
          }}
        />

        {/* Floating Sparkles (Particles) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {[...Array(5)].map((_, i) => (
              <motion.div
                 key={i}
                 className={`absolute w-1 h-1 rounded-full ${style.particleColor} opacity-40`}
                 animate={{
                    y: [0, -100],
                    x: [0, Math.random() * 50 - 25],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1.5, 0]
                 }}
                 transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "linear"
                 }}
                 style={{
                    left: `${Math.random() * 100}%`,
                    bottom: '-10%'
                 }}
              />
           ))}
        </div>

        {/* Recommended Badge */}
        {plan.recommended && (
          <div className={`absolute top-0 inset-x-0 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] ${style.badge} shadow-lg z-20`}>
            Most Popular
          </div>
        )}

        {/* Header Icon & Title */}
        <div className="relative z-10 text-center mb-8 mt-4">
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 mx-auto rounded-3xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 flex items-center justify-center shadow-xl mb-6 backdrop-blur-md"
          >
            {style.icon}
          </motion.div>
          <h3 className={`text-3xl font-display font-bold ${style.textAccent} mb-2`}>{plan.name}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{plan.duration} Membership</p>
        </div>

        {/* Pricing */}
        <div className="text-center mb-8 relative z-10">
          <div className="flex items-start justify-center gap-1">
             <span className="text-2xl font-bold text-gray-400 mt-2">₹</span>
             <span className="text-6xl font-display font-bold text-gray-900 dark:text-white tracking-tighter">
                {plan.price.replace(/[^0-9]/g, '')}
             </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">billed as {plan.price}</p>
          <p className="text-xs font-bold text-green-500 mt-2 bg-green-500/10 inline-block px-3 py-1 rounded-full">
             {plan.monthly}
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/20 to-transparent mb-8" />

        {/* Features */}
        <ul className="space-y-4 mb-10 flex-1 relative z-10">
          {plan.features.map((feature, i) => (
            <motion.li 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 group/item"
            >
              <div className={`mt-0.5 p-0.5 rounded-full ${plan.id === 'gold' ? 'bg-yellow-100 text-yellow-600' : plan.id === 'diamond' ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-200 text-slate-700'} dark:bg-white/10 dark:text-white transition-colors group-hover/item:scale-110`}>
                 <Check size={12} strokeWidth={3} />
              </div>
              <span className="group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="relative z-20 mt-auto">
           <PremiumButton 
              onClick={onSelect} 
              width="full" 
              className={`
                 !py-4 text-base shadow-xl hover:shadow-2xl transition-all duration-300
                 ${plan.id === 'gold' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black' : ''}
                 ${plan.id === 'diamond' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white' : ''}
                 ${plan.id === 'platinum' ? 'bg-gradient-to-r from-slate-700 to-black hover:from-slate-600 hover:to-gray-900 text-white border border-slate-500' : ''}
              `}
           >
              {plan.id === 'platinum' ? 'Apply for Platinum' : `Choose ${plan.name}`}
           </PremiumButton>
           
           {plan.id === 'diamond' && (
              <p className="text-[10px] text-center text-gray-400 mt-3 flex items-center justify-center gap-1">
                 <Sparkles size={10} className="text-cyan-500" /> Includes Priority Matching
              </p>
           )}
        </div>

      </div>
    </motion.div>
  );
};

export default PricingCard;
