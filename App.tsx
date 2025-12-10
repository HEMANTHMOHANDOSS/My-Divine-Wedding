
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
import BrokerLogin from './components/broker/BrokerLogin';
import BrokerDashboard from './components/broker/BrokerDashboard';
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
import WelcomeIntro from './components/ui/WelcomeIntro';
import MobileAppShowcase from './components/MobileAppShowcase';
import InvitationPromo from './components/InvitationPromo';
import LoginTransition from './components/ui/LoginTransition';
import LogoutTransition from './components/ui/LogoutTransition';
import useLocalStorage from './hooks/useLocalStorage';
import { LanguageProvider } from './contexts/LanguageContext';

type AppView = 'landing' | 'dashboard' | 'parent-dashboard' | 'admin-dashboard' | 'broker-login' | 'broker-dashboard' | 'onboarding' | 'parent-registration' | 'faq' | 'communities' | 'company' | 'stories' | 'membership-public' | 'contact';

const AppContent: React.FC = () => {
  // Persist Theme preference
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('mdm_darkMode', false);
  
  // Persist Navigation View (Session State)
  const [view, setView] = useLocalStorage<AppView>('mdm_currentView', 'landing');
  
  // Persist Intro State (Only show once)
  const [introSeen, setIntroSeen] = useLocalStorage<boolean>('mdm_intro_seen', false);
  const [showIntro, setShowIntro] = useState(!introSeen);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [initialAuthView, setInitialAuthView] = useState<'login' | 'register'>('login');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Transition States
  const [showLoginTransition, setShowLoginTransition] = useState(false);
  const [pendingLoginRole, setPendingLoginRole] = useState<'self' | 'parent' | 'broker' | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Initialize theme class on body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
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
    setPendingLoginRole(role);
    setShowLoginTransition(true);
  };

  const handleTransitionComplete = () => {
    setShowLoginTransition(false);
    if (pendingLoginRole === 'parent') {
      setView('parent-dashboard');
    } else if (pendingLoginRole === 'broker') {
      setView('broker-dashboard'); 
    } else {
      setView('dashboard');
    }
    setPendingLoginRole(null);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    // Simple transition for admin (could use LoginTransition too if desired)
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

  // Trigger Logout Animation
  const handleLogout = () => {
    setIsLoggingOut(true);
  };

  // Finish Logout after animation
  const completeLogout = () => {
    setIsLoggingOut(false);
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
      
      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <WelcomeIntro onComplete={() => {
            setShowIntro(false);
            setIntroSeen(true);
          }} />
        )}
      </AnimatePresence>

      {/* Login Transition Animation */}
      <AnimatePresence>
        {showLoginTransition && pendingLoginRole && (
          <LoginTransition 
            role={pendingLoginRole} 
            onComplete={handleTransitionComplete} 
          />
        )}
      </AnimatePresence>

      {/* Logout Transition Animation */}
      <AnimatePresence>
        {isLoggingOut && (
          <LogoutTransition onComplete={completeLogout} />
        )}
      </AnimatePresence>

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
        {view === 'broker-login' && (
           <motion.div key="broker-login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BrokerLogin 
                onBack={() => setView('landing')} 
                onLoginSuccess={() => {
                   setPendingLoginRole('broker');
                   setShowLoginTransition(true);
                }} 
              />
           </motion.div>
        )}

        {view === 'broker-dashboard' && (
           <motion.div key="broker-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BrokerDashboard onLogout={handleLogout} />
           </motion.div>
        )}

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
             <ProfileCreationWizard onComplete={handleOnboardingComplete} onExit={() => setView('landing')} />
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
                        {/* New Feature Highlight: Digital Invitation */}
                        <InvitationPromo onAction={openLogin} />
                        <Stories onAction={openLogin} />
                        <AccessPanel onLogin={openLogin} onRegister={openLogin} onBrokerLogin={() => setView('broker-login')} />
                        <ContactSection />
                        <MobileAppShowcase />
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

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
