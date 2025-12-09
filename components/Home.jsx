
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Hero from './Hero';
import Categories from './Categories';
import Features from './Features';
import Stories from './Stories';
import Footer from './Footer';
import AnimatedBackground from './ui/AnimatedBackground';
import LoginOverlay from './LoginOverlay';
import AdminLogin from './AdminLogin';
import AccessPanel from './AccessPanel';
import ContactSection from './ContactSection';
import ChatBot from './ChatBot';
import FAQPage from './FAQPage';
import CommunitiesPage from './public/CommunitiesPage';
import CompanyPage from './public/CompanyPage';
import SuccessStoriesPage from './public/SuccessStoriesPage';
import PublicMembership from './public/PublicMembership';

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [initialAuthView, setInitialAuthView] = useState('login');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [view, setView] = useState('landing');
  const navigate = useNavigate();

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const openLogin = () => {
    setInitialAuthView('login');
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    navigate('/register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAdminLogin = () => {
    setIsLoginOpen(false);
    setIsAdminLoginOpen(true);
  };

  const handleLoginSuccess = (role) => {
    setIsLoginOpen(false);
    setIsAdminLoginOpen(false);
    setTimeout(() => {
      if (role === 'parent') {
        navigate('/parent');
      } else {
        navigate('/dashboard');
      }
    }, 300);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    setTimeout(() => {
      navigate('/admin');
    }, 300);
  };

  const handleRegisterSuccess = () => {
    setIsLoginOpen(false);
    setTimeout(() => {
      navigate('/register');
    }, 300);
  };

  const handleParentRegistrationStart = () => {
    setIsLoginOpen(false);
    navigate('/parent-register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (viewId) => {
     setView(viewId);
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPublicView = ['landing', 'faq', 'communities', 'company', 'stories', 'membership-public', 'contact'].includes(view);

  return (
    <div className="relative min-h-screen text-gray-900 dark:text-white font-sans overflow-x-hidden">
      
      <ChatBot />

      <LoginOverlay 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        initialView={initialAuthView}
        onSwitchToAdmin={openAdminLogin}
        onSwitchToSignup={openRegister}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
        onStartParentRegistration={handleParentRegistrationStart}
      />
      <AdminLogin 
        isOpen={isAdminLoginOpen} 
        onClose={() => setIsAdminLoginOpen(false)} 
        onLoginSuccess={handleAdminLoginSuccess}
      />

      <AnimatePresence mode="wait">
        {isPublicView && (
          <motion.div 
            key="public-layout"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(10px)" }}
            className={`relative z-0 flex flex-col min-h-screen transition-all duration-500 ${isLoginOpen || isAdminLoginOpen ? 'blur-sm scale-[0.99] pointer-events-none' : ''}`}
          >
            <AnimatedBackground />
            <Header 
               darkMode={darkMode} 
               toggleTheme={toggleTheme} 
               onLoginClick={openLogin} 
               onAdminClick={openAdminLogin}
               onNavigate={handleNavClick}
            />
            
            <main className="flex-grow">
               {view === 'landing' && (
                  <>
                    <Hero onAction={openLogin} />
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-black/20 pointer-events-none" />
                      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-3xl border-t border-white/20 dark:border-white/5 transition-colors duration-500">
                        <Categories onAction={openLogin} />
                        <Features />
                        <Stories onAction={openLogin} />
                        <AccessPanel onLogin={openLogin} onRegister={openLogin} />
                        <ContactSection />
                      </div>
                    </div>
                  </>
               )}
               {view === 'faq' && <FAQPage />}
               {view === 'communities' && <CommunitiesPage onLogin={openLogin} />}
               {view === 'company' && <CompanyPage />}
               {view === 'stories' && <SuccessStoriesPage onLogin={openLogin} />}
               {view === 'membership-public' && <PublicMembership onLogin={openLogin} />}
               {view === 'contact' && (
                  <div className="pt-24 pb-20">
                     <ContactSection />
                  </div>
               )}
            </main>
            
            <Footer 
               onAdminClick={() => setIsAdminLoginOpen(true)} 
               onNavigate={(target) => handleNavClick(target)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
