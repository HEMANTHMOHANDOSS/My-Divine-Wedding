
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Features from './components/Features';
import Stories from './components/Stories';
import Footer from './components/Footer';
import AnimatedBackground from './components/ui/AnimatedBackground';
import LoginOverlay from './components/LoginOverlay';
import AdminLogin from './components/AdminLogin';
import UserDashboard from './components/dashboard/UserDashboard';
import ParentDashboard from './components/dashboard/ParentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import ParentRegistrationWizard from './components/parent/ParentRegistrationWizard';
import AccessPanel from './components/AccessPanel';
import ProfileCreationWizard from './components/profile/ProfileCreationWizard';
import ContactSection from './components/ContactSection';
import ChatBot from './components/ChatBot';
import FAQPage from './components/FAQPage';
import CommunitiesPage from './components/public/CommunitiesPage';
import CompanyPage from './components/public/CompanyPage';
import SuccessStoriesPage from './components/public/SuccessStoriesPage';
import PublicMembership from './components/public/PublicMembership';

type AppView = 'landing' | 'dashboard' | 'parent-dashboard' | 'admin-dashboard' | 'onboarding' | 'parent-registration' | 'faq' | 'communities' | 'company' | 'stories' | 'membership-public' | 'contact';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [initialAuthView, setInitialAuthView] = useState<'login' | 'register'>('login');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [view, setView] = useState<AppView>('landing');

  // Initialize theme
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Toggle body class
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
    setView('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAdminLogin = () => {
    setIsLoginOpen(false);
    setIsAdminLoginOpen(true);
  };

  const handleLoginSuccess = (role: 'self' | 'parent' | 'broker') => {
    setIsLoginOpen(false);
    setIsAdminLoginOpen(false);
    setTimeout(() => {
      if (role === 'parent') {
        setView('parent-dashboard');
      } else {
        setView('dashboard');
      }
    }, 300);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    setTimeout(() => {
      setView('admin-dashboard');
    }, 300);
  };

  const handleRegisterSuccess = () => {
    setIsLoginOpen(false);
    setTimeout(() => {
      setView('onboarding');
    }, 300);
  };

  const handleParentRegistrationStart = () => {
    setIsLoginOpen(false);
    setView('parent-registration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setView('landing');
    window.scrollTo(0, 0);
  };

  const handleOnboardingComplete = () => {
    setView('dashboard');
    window.scrollTo(0, 0);
  };

  const handleParentOnboardingComplete = () => {
    setView('parent-dashboard');
    window.scrollTo(0, 0);
  };

  const handleNavClick = (viewId: string) => {
     setView(viewId as AppView);
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to determine if we are in a public view (requiring header/footer)
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
        {view === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UserDashboard onLogout={handleLogout} toggleTheme={toggleTheme} darkMode={darkMode} />
          </motion.div>
        )}

        {view === 'parent-dashboard' && (
          <motion.div key="parent-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ParentDashboard onLogout={handleLogout} toggleTheme={toggleTheme} darkMode={darkMode} />
          </motion.div>
        )}

        {view === 'admin-dashboard' && (
          <motion.div key="admin-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AdminDashboard onLogout={handleLogout} toggleTheme={toggleTheme} darkMode={darkMode} />
          </motion.div>
        )}

        {view === 'onboarding' && (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <AnimatedBackground />
             <ProfileCreationWizard onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {view === 'parent-registration' && (
          <motion.div key="parent-registration" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <AnimatedBackground />
             <ParentRegistrationWizard onComplete={handleParentOnboardingComplete} />
          </motion.div>
        )}

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

export default App;
