
import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Briefcase, ArrowRight, Heart } from 'lucide-react';
import PremiumButton from './ui/PremiumButton';
import useTranslation from '../hooks/useTranslation';

interface AccessPanelProps {
  onLogin: () => void;
  onRegister: () => void;
  onBrokerLogin?: () => void;
}

const AccessPanel: React.FC<AccessPanelProps> = ({ onLogin, onRegister, onBrokerLogin }) => {
  const { t } = useTranslation();

  return (
    <section className="relative py-32 overflow-hidden z-20">
      {/* Parallax Background Elements */}
      <div className="absolute inset-0 bg-gray-50/50 dark:bg-[#080808] transition-colors duration-500 -z-20" />
      
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl -z-10"
      />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16 relative">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6"
          >
            {t('access.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto"
          >
            {t('access.desc')}
          </motion.p>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" 
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Primary Action Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110" />
            
            <div className="flex flex-col h-full justify-between space-y-8">
              <div>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-300">
                  <Heart size={32} className="animate-pulse-slow" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('access.soulmate.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('access.soulmate.desc')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                 <PremiumButton onClick={onRegister} variant="gradient" icon={<ArrowRight size={18} />}>
                   {t('access.create')}
                 </PremiumButton>
                 <PremiumButton onClick={onLogin} variant="secondary">
                   {t('access.login')}
                 </PremiumButton>
              </div>
            </div>
          </motion.div>

          {/* Secondary Actions Grid */}
          <div className="grid gap-6">
            
            {/* Parent Login */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="group flex items-center gap-6 bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-3xl hover:bg-white dark:hover:bg-white/10 transition-colors shadow-lg"
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{t('access.parent.title')}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('access.parent.desc')}</p>
                <button onClick={onLogin} className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:gap-2 transition-all">
                  {t('access.parent.btn')} <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>

            {/* Broker Login */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="group flex items-center gap-6 bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-3xl hover:bg-white dark:hover:bg-white/10 transition-colors shadow-lg"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{t('access.broker.title')}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('access.broker.desc')}</p>
                <button 
                  onClick={onBrokerLogin ? onBrokerLogin : onLogin} 
                  className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:gap-2 transition-all"
                >
                  {t('access.broker.btn')} <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessPanel;
