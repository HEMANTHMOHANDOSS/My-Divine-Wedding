
import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Smartphone, Star, Download, ShieldCheck, Heart, MessageCircle } from 'lucide-react';
import useTranslation from '../hooks/useTranslation';
import PremiumButton from './ui/PremiumButton';

const MobileAppShowcase: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-white to-purple-50 dark:from-[#0a0a0a] dark:to-[#1a1a1a]">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div 
             animate={{ y: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" 
          />
          <motion.div 
             animate={{ y: [0, 40, 0], opacity: [0.2, 0.5, 0.2] }}
             transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
             className="absolute bottom-20 left-20 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]" 
          />
      </div>

      <div className="container mx-auto px-6 relative z-10">
         <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">
            
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left space-y-8">
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/10 shadow-lg border border-purple-100 dark:border-white/10 text-sm font-bold text-purple-700 dark:text-purple-300"
               >
                  <Smartphone size={16} /> Best-in-Class App
               </motion.div>
               
               <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white leading-tight"
               >
                  {t('app.title')}
               </motion.h2>
               
               <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
               >
                  {t('app.subtitle')}
               </motion.p>
               
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
               >
                   <PremiumButton 
                      variant="gradient" 
                      className="!px-8 !py-4 flex items-center gap-3"
                      icon={<Apple size={24} className="mb-1" />}
                   >
                      <div className="text-left leading-none">
                         <span className="block text-[10px] uppercase font-bold opacity-80">Download on the</span>
                         <span className="text-lg font-bold">App Store</span>
                      </div>
                   </PremiumButton>
                   
                   <button className="flex items-center gap-3 px-8 py-3.5 bg-black dark:bg-white/10 text-white rounded-2xl hover:bg-gray-800 dark:hover:bg-white/20 transition-all shadow-xl">
                      <div className="w-6 h-6"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 1.5 24.195c-.34-.34-.5-.78-.5-1.28V1.085c0-.42.13-.78.41-1.07.28-.29.65-.43 1.1-.43.45 0 .75.14 1.099.429zM15.207 13.414l5.5 5.5-2.81 1.63c-.56.32-1.12.48-1.68.48-.56 0-1.03-.12-1.41-.35l-10.4-6.04 10.8-1.22zM23.25 10.22c.3.52.45 1.12.45 1.78s-.15 1.26-.45 1.78l-3.35 1.95-6.198-6.198 9.548 1.488zM2.8 1.66l10.4 6.04 2.81 1.63L2.8 1.66z"/></svg></div>
                      <div className="text-left leading-none">
                         <span className="block text-[10px] uppercase font-bold opacity-80">Get it on</span>
                         <span className="text-lg font-bold">Google Play</span>
                      </div>
                   </button>
               </motion.div>
               
               <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center lg:justify-start gap-8 pt-4"
               >
                  <div className="flex items-center gap-2">
                     <div className="flex text-amber-500">
                        {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                     </div>
                     <span className="font-bold text-gray-900 dark:text-white">{t('app.rating')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Download size={18} className="text-green-500" />
                     <span className="font-bold text-gray-900 dark:text-white">1M+ Downloads</span>
                  </div>
               </motion.div>
            </div>

            {/* Phone Graphic */}
            <div className="flex-1 relative flex justify-center perspective-1000">
               <motion.div 
                   animate={{ y: [0, -20, 0] }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                   className="relative z-10 w-[300px] h-[600px] bg-gray-900 rounded-[3.5rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden ring-1 ring-white/20"
               >
                   {/* Notch */}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-30 flex justify-center items-center">
                      <div className="w-16 h-1.5 bg-gray-800 rounded-full" />
                   </div>
                   
                   {/* Screen Content */}
                   <div className="w-full h-full bg-white dark:bg-gray-900 overflow-hidden relative flex flex-col">
                      
                      {/* App Header */}
                      <div className="pt-10 pb-4 px-6 bg-white dark:bg-black/40 backdrop-blur-md z-20 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
                            <span className="font-bold text-sm">Divine</span>
                         </div>
                         <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                         </div>
                      </div>

                      {/* Scrolling Match Cards */}
                      <div className="flex-1 relative overflow-hidden">
                         <motion.div 
                            animate={{ y: [0, -200] }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="space-y-4 p-4"
                         >
                            {[1, 2, 3, 4, 5].map((i) => (
                               <div key={i} className="bg-white dark:bg-white/5 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-white/5 flex gap-3 items-center">
                                  <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-white/10 shrink-0 overflow-hidden">
                                     <img src={`https://i.pravatar.cc/150?img=${i + 20}`} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                     <div className="h-3 w-24 bg-gray-200 dark:bg-white/10 rounded mb-1.5" />
                                     <div className="h-2 w-16 bg-gray-100 dark:bg-white/5 rounded" />
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                     <Heart size={14} fill="currentColor" />
                                  </div>
                               </div>
                            ))}
                            {/* Duplicate for infinite loop illusion */}
                            {[1, 2, 3].map((i) => (
                               <div key={`dup-${i}`} className="bg-white dark:bg-white/5 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-white/5 flex gap-3 items-center">
                                  <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-white/10 shrink-0 overflow-hidden">
                                     <img src={`https://i.pravatar.cc/150?img=${i + 20}`} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                     <div className="h-3 w-24 bg-gray-200 dark:bg-white/10 rounded mb-1.5" />
                                     <div className="h-2 w-16 bg-gray-100 dark:bg-white/5 rounded" />
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                     <Heart size={14} fill="currentColor" />
                                  </div>
                               </div>
                            ))}
                         </motion.div>

                         {/* Overlay Gradient */}
                         <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10" />
                         
                         {/* Floating Notification */}
                         <motion.div 
                           initial={{ opacity: 0, scale: 0.8, x: 20 }}
                           whileInView={{ opacity: 1, scale: 1, x: 0 }}
                           transition={{ delay: 1, duration: 0.5 }}
                           className="absolute bottom-6 right-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md p-3 rounded-xl shadow-xl border border-white/20 flex items-center gap-3 z-20"
                         >
                            <div className="relative">
                               <img src="https://i.pravatar.cc/150?img=32" className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800" />
                               <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>
                            </div>
                            <div>
                               <p className="text-xs font-bold text-gray-900 dark:text-white">New Interest Received!</p>
                               <p className="text-[10px] text-gray-500">Lakshmi sent you a request.</p>
                            </div>
                         </motion.div>
                      </div>
                      
                      {/* App Nav Bar */}
                      <div className="h-16 bg-white dark:bg-black border-t border-gray-100 dark:border-white/5 flex justify-around items-center px-2 z-20">
                         {[1,2,3,4].map(i => (
                            <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 1 ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'text-gray-400'}`}>
                               <div className="w-4 h-4 bg-current rounded-sm opacity-50" />
                            </div>
                         ))}
                      </div>

                   </div>
               </motion.div>

               {/* Decorative Circles behind phone */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-purple-500/20 rounded-full -z-10 animate-[spin_10s_linear_infinite]" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-dashed border-pink-500/20 rounded-full -z-10 animate-[spin_15s_linear_infinite_reverse]" />
            </div>
         </div>
      </div>
    </section>
  )
}

export default MobileAppShowcase;
