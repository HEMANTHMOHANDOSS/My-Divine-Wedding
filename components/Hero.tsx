
import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Search, ArrowRight, Star } from 'lucide-react';
import PremiumButton from './ui/PremiumButton';
import GradientRangeSlider from './ui/GradientRangeSlider';

interface HeroProps {
  onAction: () => void;
}

const Hero: React.FC<HeroProps> = ({ onAction }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  
  // Local state for the widget
  const [ageRange, setAgeRange] = useState<[number, number]>([22, 28]);
  
  // Parallax effects
  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const yCards = useTransform(scrollY, [0, 500], [0, -50]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 400], [1, 0.95]);

  return (
    <section ref={ref} id="home" className="relative min-h-[100dvh] lg:min-h-[110vh] flex items-center justify-center pt-24 lg:pt-20 px-4 overflow-hidden perspective-1000">
      
      {/* Background Parallax Elements */}
      <motion.div style={{ y: yText }} className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
         <div className="w-[150vw] h-[150vw] md:w-[800px] md:h-[800px] rounded-full border border-purple-200/20 dark:border-white/5 animate-[spin_60s_linear_infinite] absolute" />
         <div className="w-[100vw] h-[100vw] md:w-[600px] md:h-[600px] rounded-full border border-gold-200/20 dark:border-gold-500/10 animate-[spin_40s_linear_infinite_reverse] absolute" />
      </motion.div>

      <div className="container mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Content Side */}
        <motion.div 
          style={{ y: yText, opacity: opacityHero, scale: scaleHero }}
          className="text-center lg:text-left space-y-6 lg:space-y-8"
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 lg:gap-3 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full bg-white/30 dark:bg-white/5 border border-purple-200/50 dark:border-white/10 backdrop-blur-md shadow-lg mx-auto lg:mx-0"
          >
            <Star className="w-3 h-3 lg:w-4 lg:h-4 text-gold-500 fill-gold-500 animate-pulse" />
            <span className="text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase text-purple-900 dark:text-gold-100">
              India's Most Trusted
            </span>
          </motion.div>

          {/* Fluid Typography using Clamp */}
          <h1 className="text-[clamp(3rem,8vw,6rem)] lg:text-[clamp(4rem,6vw,8rem)] font-display font-bold leading-[0.9] text-gray-900 dark:text-white tracking-tight">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="block"
            >
              Divine
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-gold-500 animate-gradient-x bg-[length:200%_auto]"
            >
              Connections
            </motion.span>
            <motion.span 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4, duration: 0.8 }}
               className="block text-[clamp(1.5rem,4vw,3rem)] lg:text-[clamp(2.5rem,3vw,4rem)] font-serif italic font-normal text-gray-500 dark:text-gray-400 mt-2 lg:mt-4"
            >
              start here.
            </motion.span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light px-4 lg:px-0">
            Experience the future of matchmaking. Where ancient tradition meets modern technology to find your perfect soulmate.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start pt-4 px-8 lg:px-0">
            <PremiumButton onClick={onAction} icon={<ArrowRight size={20} />} width="full">
              Join for Free
            </PremiumButton>
          </div>
        </motion.div>

        {/* Search Widget Side */}
        <motion.div
          style={{ y: yCards }}
          initial={{ opacity: 0, x: 50, rotate: 5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ delay: 0.2, duration: 1, type: "spring" }}
          className="relative perspective-1000 w-full max-w-md mx-auto lg:max-w-full"
        >
          {/* Decorative Floaters */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-gold-400 to-orange-500 rounded-3xl blur-2xl opacity-30 rotate-12 hidden md:block" 
          />
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full blur-2xl opacity-30 hidden md:block" 
          />
          
          <div className="glass-card p-6 md:p-8 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl relative border border-white/20 dark:border-white/10 backdrop-blur-xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-3 lg:p-4 shadow-lg shadow-purple-500/30">
              <Search className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>

            <h3 className="text-2xl lg:text-3xl font-display font-bold mb-6 lg:mb-8 text-center text-gray-800 dark:text-white mt-4">
              Partner Search
            </h3>
            
            <div className="space-y-4 lg:space-y-6">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 items-start">
                <div className="space-y-2">
                  <label className="text-[10px] lg:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">I'm looking for</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 lg:px-5 lg:py-4 text-sm lg:text-base text-gray-700 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 outline-none transition-all hover:bg-white dark:hover:bg-white/5 cursor-pointer">
                      <option>Woman</option>
                      <option>Man</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                     <label className="text-[10px] lg:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Age Range</label>
                     <span className="text-[10px] font-bold text-purple-600 dark:text-gold-400 bg-purple-50 dark:bg-white/5 px-2 py-0.5 rounded">{ageRange[0]} - {ageRange[1]} Yrs</span>
                  </div>
                  <div className="pt-2 px-1">
                     <GradientRangeSlider 
                        min={18} max={60} 
                        value={ageRange} 
                        onChange={setAgeRange} 
                     />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] lg:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Religion</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 lg:px-5 lg:py-4 text-sm lg:text-base text-gray-700 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 outline-none transition-all hover:bg-white dark:hover:bg-white/5 cursor-pointer">
                    <option>Hindu</option>
                    <option>Christian</option>
                    <option>Muslim</option>
                    <option>Jain</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2">
                <PremiumButton onClick={onAction} variant="gradient" width="full">
                  Let's Begin
                </PremiumButton>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        style={{ opacity: opacityHero }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 lg:bottom-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Scroll to Explore</span>
        <div className="w-[1px] h-8 lg:h-12 bg-gradient-to-b from-purple-500/50 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
