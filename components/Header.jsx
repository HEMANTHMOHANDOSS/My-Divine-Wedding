import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Shield } from 'lucide-react';
import PremiumButton from './ui/PremiumButton';

const MENU_ITEMS = [
  { label: 'Home', id: 'landing' },
  { label: 'Communities', id: 'communities' },
  { label: 'Membership', id: 'membership-public' },
  { label: 'Success Stories', id: 'stories' },
  { label: 'Contact', id: 'contact' },
  { label: 'Company', id: 'company' },
];

const Header = ({ darkMode, toggleTheme, onLoginClick, onAdminClick, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
            {/* Logo Image */}
            <img 
              src="/logo.png" 
              alt="My Divine Wedding Logo" 
              className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="text-xl md:text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-pink-600 to-purple-800 dark:from-gold-300 dark:via-white dark:to-gold-300 bg-[length:200%_auto] animate-gradient-x truncate max-w-[200px] xs:max-w-none">
            My Divine Wedding
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {MENU_ITEMS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.id)}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-gold-400 transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 dark:bg-gold-400 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          
          <div className="flex items-center gap-2 border-l border-gray-200 dark:border-white/10 pl-6">
            <button
              onClick={onAdminClick}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-cyan-400"
              title="Admin Login"
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
                Login
             </PremiumButton>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-4 z-50">
           <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-white/10 transition-colors text-gray-700 dark:text-gold-400"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
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
            <div className="flex flex-col items-center gap-8 p-6 w-full max-w-sm">
              <div className="w-20 h-20 mb-4">
                 <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>

              {MENU_ITEMS.map((link, idx) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleNavClick(link.id)}
                  className="text-2xl font-serif font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-gold-400"
                >
                  {link.label}
                </motion.button>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full h-px bg-gray-200 dark:bg-white/10 my-4" 
              />

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
                <Shield size={20} /> Admin Access
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
                  Login / Register
                </PremiumButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;