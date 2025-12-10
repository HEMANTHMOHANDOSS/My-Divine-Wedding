
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Shield, Globe } from 'lucide-react';
import PremiumButton from './ui/PremiumButton';
import Logo from './ui/Logo';
import useTranslation from '../hooks/useTranslation';
import { LANGUAGES, Language } from '../utils/translations';

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  onLoginClick: () => void;
  onAdminClick: () => void;
  onNavigate: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleTheme, onLoginClick, onAdminClick, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  const MENU_ITEMS = [
    { label: t('nav.home'), id: 'landing' },
    { label: t('nav.communities'), id: 'communities' },
    { label: t('nav.membership'), id: 'membership-public' },
    { label: t('nav.stories'), id: 'stories' },
    { label: t('nav.contact'), id: 'contact' },
    { label: t('nav.company'), id: 'company' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLang = (code: Language) => {
    setLanguage(code);
    setLangMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 backdrop-blur-md bg-white/70 dark:bg-black/50 border-b border-gray-200/20 dark:border-white/10 shadow-lg' 
          : 'py-6 bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group z-50"
        >
          <Logo className="w-10 h-10 md:w-12 md:h-12" />
          <span className="text-xl md:text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-pink-600 to-purple-800 dark:from-gold-300 dark:via-white dark:to-gold-300 bg-[length:200%_auto] animate-gradient-x truncate max-w-[200px] xs:max-w-none">
            My Divine Wedding
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {MENU_ITEMS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-gold-400 transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 dark:bg-gold-400 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          
          <div className="flex items-center gap-2 border-l border-gray-200 dark:border-white/10 pl-6">
            
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gold-400 flex items-center gap-1"
              >
                <Globe size={20} />
                <span className="text-xs font-bold uppercase">{language}</span>
              </button>
              
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[150px]"
                  >
                    {LANGUAGES.map(lang => (
                      <button 
                        key={lang.code}
                        onClick={() => toggleLang(lang.code)}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-purple-50 dark:hover:bg-white/5 flex items-center justify-between ${language === lang.code ? 'text-purple-600 font-bold bg-purple-50 dark:bg-white/5' : 'text-gray-600 dark:text-gray-300'}`}
                      >
                        <span>{lang.label}</span>
                        <span className="text-xs text-gray-400">{lang.script}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={onAdminClick}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-cyan-400"
              title={t('nav.admin')}
            >
              <Shield size={20} />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gold-400"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="transform scale-90 origin-right">
             <PremiumButton onClick={onLoginClick} className="px-5 py-2">
                {t('nav.login')}
             </PremiumButton>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-4 z-50">
           <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="p-2 rounded-full bg-gray-100 dark:bg-white/10 transition-colors text-gray-700 dark:text-gold-400 font-bold text-xs uppercase"
          >
            {language}
          </button>
          <button 
            className="text-gray-700 dark:text-white p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl lg:hidden flex flex-col justify-center items-center"
          >
            <div className="flex flex-col items-center gap-6 p-6 w-full max-w-sm">
              <Logo className="w-20 h-20 mb-4" />

              {MENU_ITEMS.map((link, idx) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleNavClick(link.id)}
                  className="text-xl font-serif font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-gold-400"
                >
                  {link.label}
                </motion.button>
              ))}
              
              <div className="grid grid-cols-5 gap-2 my-4">
                 {LANGUAGES.map(lang => (
                    <button 
                      key={lang.code}
                      onClick={() => toggleLang(lang.code)}
                      className={`p-2 rounded-lg text-xs font-bold ${language === lang.code ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'}`}
                    >
                       {lang.code.toUpperCase()}
                    </button>
                 ))}
              </div>

              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAdminClick();
                }}
                className="flex items-center gap-2 text-lg font-medium text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-cyan-400"
              >
                <Shield size={20} /> {t('nav.admin')}
              </motion.button>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full"
              >
                <PremiumButton onClick={() => {
                    setMobileMenuOpen(false);
                    onLoginClick();
                  }} 
                  width="full"
                >
                  {t('nav.login')}
                </PremiumButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Language Menu Overlay */}
      <AnimatePresence>
         {langMenuOpen && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
               className="fixed top-20 right-4 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[150px] lg:hidden"
            >
               {LANGUAGES.map(lang => (
                  <button 
                  key={lang.code}
                  onClick={() => toggleLang(lang.code)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-purple-50 dark:hover:bg-white/5 flex items-center justify-between ${language === lang.code ? 'text-purple-600 font-bold bg-purple-50 dark:bg-white/5' : 'text-gray-600 dark:text-gray-300'}`}
                  >
                  <span>{lang.label}</span>
                  <span className="text-xs text-gray-400">{lang.script}</span>
                  </button>
               ))}
            </motion.div>
         )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
