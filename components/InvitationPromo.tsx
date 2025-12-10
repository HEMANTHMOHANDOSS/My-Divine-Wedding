
import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Sparkles, ArrowRight, Heart, Share2, Download } from 'lucide-react';
import PremiumButton from './ui/PremiumButton';

interface InvitationPromoProps {
  onAction: () => void;
}

const InvitationPromo: React.FC<InvitationPromoProps> = ({ onAction }) => {
  return (
    <section className="py-20 px-4 md:px-6 relative z-10 overflow-hidden">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] dark:from-black dark:via-purple-950/30 dark:to-black rounded-[3rem] p-8 md:p-16 overflow-hidden shadow-2xl border border-white/10 group"
        >
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            
            {/* LEFT: Text Content */}
            <div className="text-center lg:text-left space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-gold-300 text-xs font-bold uppercase tracking-widest"
              >
                <Sparkles size={14} className="text-gold-400 animate-pulse" /> New Feature
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
                Design Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-yellow-200 to-gold-400">Perfect Invitation</span>
              </h2>
              
              <p className="text-lg text-purple-200/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Create stunning, culturally rich digital wedding cards in minutes. Choose from 50+ premium templates, customize details, and share instantly with loved ones.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                <PremiumButton onClick={onAction} variant="gradient" className="!px-8 !py-4 text-lg shadow-gold-500/20">
                   Start Designing
                </PremiumButton>
                <button className="px-8 py-4 rounded-2xl border border-white/20 text-white font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                   View Templates <ArrowRight size={18} />
                </button>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-6 text-sm font-medium text-white/60">
                 <span className="flex items-center gap-2"><CheckCircle /> 50+ Premium Themes</span>
                 <span className="flex items-center gap-2"><CheckCircle /> Instant PDF Download</span>
                 <span className="flex items-center gap-2"><CheckCircle /> Tamil & English Support</span>
              </div>
            </div>

            {/* RIGHT: Visual Animation */}
            <div className="relative h-[400px] w-full flex items-center justify-center perspective-1000">
               
               {/* Card 1 (Back) */}
               <motion.div 
                  animate={{ y: [0, -10, 0], rotate: [5, 2, 5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-64 h-80 bg-white rounded-2xl shadow-2xl border-4 border-purple-100 rotate-6 translate-x-12 opacity-60 scale-90 z-0"
               />
               
               {/* Card 2 (Middle) */}
               <motion.div 
                  animate={{ y: [0, -15, 0], rotate: [-5, -8, -5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute w-64 h-80 bg-[#1a0b2e] rounded-2xl shadow-2xl border border-gold-500/30 -rotate-3 -translate-x-12 opacity-80 scale-95 z-10 flex flex-col items-center justify-center p-6 text-center"
               >
                  <div className="border border-gold-500/20 h-full w-full p-4 flex flex-col justify-center">
                     <p className="text-gold-400 text-[10px] uppercase tracking-[0.2em] mb-2">Save the Date</p>
                     <h3 className="font-display text-white text-xl mb-1">Arjun & Sneha</h3>
                     <p className="text-white/60 text-xs">24th October 2024</p>
                  </div>
               </motion.div>

               {/* Card 3 (Front - Hero) */}
               <motion.div 
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-72 h-96 bg-white dark:bg-[#fff9e6] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-double border-gold-400 z-20 flex flex-col items-center text-center p-6 overflow-hidden cursor-pointer group"
                  onClick={onAction}
               >
                  {/* Decorative Corners */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-gold-600" />
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-gold-600" />
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-gold-600" />
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-gold-600" />

                  <div className="mt-8 mb-4">
                     <div className="w-12 h-12 mx-auto bg-gold-100 rounded-full flex items-center justify-center text-gold-700 mb-4">
                        <Heart size={20} fill="currentColor" />
                     </div>
                     <p className="text-gold-800 text-xs font-bold uppercase tracking-widest mb-2">The Wedding Of</p>
                     <h2 className="font-display text-3xl text-gray-900 mb-1">Karthik</h2>
                     <span className="text-gold-600 font-serif italic text-lg">&</span>
                     <h2 className="font-display text-3xl text-gray-900 mt-1">Lakshmi</h2>
                  </div>
                  
                  <div className="mt-auto space-y-2">
                     <p className="text-gray-600 text-xs uppercase tracking-wider">Monday, Dec 15th</p>
                     <p className="text-gray-900 font-bold text-sm">Taj Coromandel, Chennai</p>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                     <PremiumButton className="!py-2 !px-6 !text-xs" icon={<PenTool size={14} />}>Edit Template</PremiumButton>
                  </div>
               </motion.div>

               {/* Floating Icons */}
               <motion.div 
                  animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-10 right-0 bg-white p-3 rounded-xl shadow-lg z-30"
               >
                  <Share2 className="text-purple-600" size={20} />
               </motion.div>
               <motion.div 
                  animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                  className="absolute bottom-20 left-0 bg-white p-3 rounded-xl shadow-lg z-30"
               >
                  <Download className="text-green-600" size={20} />
               </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const CheckCircle = () => (
   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
      <polyline points="20 6 9 17 4 12" />
   </svg>
)

export default InvitationPromo;
