
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Star, Globe, ArrowRight, ChevronRight, Users, Sparkles } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';

const THEMES = {
  Hindu: {
    gradient: "from-orange-500 to-red-600",
    bg: "bg-orange-50 dark:bg-orange-900/10",
    border: "border-orange-100 dark:border-orange-900/30",
    text: "text-orange-700 dark:text-orange-300",
    icon: <Sun size={24} />,
    pattern: "radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.1) 0%, transparent 50%)"
  },
  Christian: {
    gradient: "from-blue-400 to-indigo-500",
    bg: "bg-blue-50 dark:bg-blue-900/10",
    border: "border-blue-100 dark:border-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    icon: <Star size={24} />,
    pattern: "radial-gradient(circle at 0% 0%, rgba(96, 165, 250, 0.1) 0%, transparent 40%)"
  },
  Muslim: {
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/10",
    border: "border-emerald-100 dark:border-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-300",
    icon: <Moon size={24} />,
    pattern: "repeating-linear-gradient(45deg, rgba(16, 185, 129, 0.03) 0px, rgba(16, 185, 129, 0.03) 10px, transparent 10px, transparent 20px)"
  },
  Jain: {
    gradient: "from-yellow-400 to-amber-500",
    bg: "bg-yellow-50 dark:bg-yellow-900/10",
    border: "border-yellow-100 dark:border-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-300",
    icon: <Sparkles size={24} />,
    pattern: "radial-gradient(circle at 100% 100%, rgba(251, 191, 36, 0.1) 0%, transparent 40%)"
  }
};

const COMMUNITIES_DATA = [
  {
    religion: 'Hindu',
    castes: ['Iyer', 'Iyengar', 'Mudaliar', 'Nadar', 'Vanniyar', 'Gounder', 'Chettiar', 'Pillai', 'Thevar', 'Naidu', 'Reddy', 'Viswakarma']
  },
  {
    religion: 'Christian',
    castes: ['Roman Catholic', 'CSI', 'Pentecostal', 'Syrian Catholic', 'Born Again', 'Protestant', 'Orthodox', 'Marthoma']
  },
  {
    religion: 'Muslim',
    castes: ['Sunni', 'Shia', 'Tamil Muslim', 'Rowther', 'Labbai', 'Maraikayar', 'Pathan', 'Sheikh']
  }
];

interface CommunitiesPageProps {
  onLogin: () => void;
}

const CommunitiesPage: React.FC<CommunitiesPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Hero Header */}
      <div className="text-center space-y-6 mb-20 relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-sm font-bold uppercase tracking-wider"
        >
          <Globe size={16} /> Vast Network
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white"
        >
          Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Community</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Connect with matches from your specific religion, caste, and cultural background. We support over 50+ communities with dedicated matchmaking.
        </motion.p>
      </div>

      {/* Community Sections */}
      <div className="space-y-16">
        {COMMUNITIES_DATA.map((comm, idx) => {
          const theme = THEMES[comm.religion as keyof typeof THEMES];
          
          return (
            <motion.div
              key={comm.religion}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl border ${theme.border} bg-white/40 dark:bg-black/40 backdrop-blur-xl`}
            >
              {/* Dynamic Background */}
              <div className="absolute inset-0 -z-10" style={{ background: theme.pattern }} />
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${theme.gradient} opacity-10 rounded-full blur-3xl`} />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white shadow-lg`}>
                    {theme.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
                      {comm.religion} Matrimony
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Exclusive profiles for the {comm.religion} community.</p>
                  </div>
                </div>
                <PremiumButton onClick={onLogin} variant="outline" className="shrink-0" icon={<ArrowRight size={18} />}>
                  Explore All
                </PremiumButton>
              </div>

              {/* Caste Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {comm.castes.map((caste, cIdx) => (
                  <motion.div
                    key={caste}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onLogin}
                    className={`
                      cursor-pointer rounded-2xl p-4 text-center border transition-all duration-300
                      ${theme.bg} ${theme.border} hover:shadow-lg hover:border-transparent group
                    `}
                  >
                    <h3 className={`font-bold text-sm md:text-base ${theme.text} mb-1`}>{caste}</h3>
                    <p className="text-[10px] text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                      1.2k+ Profiles
                    </p>
                  </motion.div>
                ))}
                {/* View More Card */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={onLogin}
                  className="cursor-pointer rounded-2xl p-4 text-center border border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm font-bold text-gray-500">View More</span>
                  <ChevronRight size={16} className="text-gray-400 mt-1" />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 py-16 text-center bg-black dark:bg-white/5 rounded-[3rem] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900 opacity-50" />
        <div className="relative z-10 space-y-6 px-6">
          <h2 className="text-3xl md:text-5xl font-display font-bold">Can't find your community?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            We support over 500+ sub-castes and communities. Sign up to search our complete database.
          </p>
          <div className="flex justify-center pt-4">
            <PremiumButton onClick={onLogin} variant="gradient" className="!px-10 !py-4">
              Search Complete Database
            </PremiumButton>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CommunitiesPage;
