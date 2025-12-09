
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, X, Sun, Moon, Search, User, LogOut, LayoutDashboard, MessageCircle, Settings, Shield } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import PremiumButton from '../ui/PremiumButton';

const UserMenu = ({ onLinkClick }) => {
    const menuItems = [
      { label: 'My Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'My Profile', icon: User, href: '/profile/preview' },
      { label: 'Messages', icon: MessageCircle, href: '/dashboard/messages' },
      { label: 'Account Settings', icon: Settings, href: '/profile/edit' },
      { label: 'Parental Controls', icon: Shield, href: '/dashboard/parent-controls' },
    ];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute right-0 mt-2 w-64 bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
      >
         <div className="p-2">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10">
               <p className="text-sm font-semibold text-gray-900 dark:text-white">Srinivas Kumar</p>
               <p className="text-xs text-gray-500 dark:text-gray-400">srinivas.k@example.com</p>
            </div>
            <div className="py-2">
               {menuItems.map((item, i) => (
                  <Link href={item.href} key={i}>
                     <a onClick={onLinkClick} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                        <item.icon size={16} />
                        <span>{item.label}</span>
                     </a>
                  </Link>
               ))}
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-white/10">
               <a href="#" onClick={onLinkClick} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                  <LogOut size={16} />
                  <span>Logout</span>
               </a>
            </div>
         </div>
      </motion.div>
    );
};

const MobileMenu = ({ isOpen, setIsOpen }) => {
   const { theme, setTheme } = useTheme();

   const navLinks = [
     { name: "Dashboard", href: "/dashboard" },
     { name: "My Profile", href: "/profile/preview" },
     { name: "Search", href: "/dashboard/search" },
     { name: "Messages", href: "/dashboard/messages" },
     { name: "Upgrade", href: "/dashboard/premium" },
   ];

   return (
      <AnimatePresence>
         {isOpen && (
            <>
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                  onClick={() => setIsOpen(false)}
               />
               <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-900 z-50 p-6 flex flex-col shadow-2xl"
               >
                  <div className="flex justify-between items-center mb-10">
                     <span className="font-bold text-xl font-display text-purple-600">Vivaha</span>
                     <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-gray-900"><X size={24} /></button>
                  </div>
                  
                  <nav className="flex-1">
                     <ul className="space-y-4">
                        {navLinks.map(link => (
                           <li key={link.name}>
                              <Link href={link.href}>
                                 <a onClick={() => setIsOpen(false)} className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors pb-2 border-b-2 border-transparent hover:border-purple-300">
                                    {link.name}
                                 </a>
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </nav>

                  <div className="mt-auto">
                     <div className="flex items-center justify-between bg-gray-100 dark:bg-white/5 p-2 rounded-xl">
                        <span className="text-sm font-semibold ml-2">Appearance</span>
                        <div className="flex gap-1 bg-white dark:bg-black/20 p-1 rounded-lg">
                           <button onClick={() => setTheme('light')} className={`p-2 rounded-md ${theme === 'light' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}><Sun size={18} /></button>
                           <button onClick={() => setTheme('dark')} className={`p-2 rounded-md ${theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'text-gray-500'}`}><Moon size={18} /></button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>
   );
};

const DashboardHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
     setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <header className="bg-white/40 dark:bg-white/5 backdrop-blur-2xl sticky top-4 z-40 mx-4 md:mx-6 rounded-2xl shadow-lg shadow-black/[0.02] border border-white/50 dark:border-white/10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Side: Logo & Nav */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <a className="text-2xl font-bold font-display text-purple-700 dark:text-gold-400">
                Vivaha
              </a>
            </Link>
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
               <Link href="/dashboard/search/basic"><a className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-gold-400 transition-colors">Basic Search</a></Link>
               <Link href="/dashboard/search/advanced"><a className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-gold-400 transition-colors">Advanced Search</a></Link>
               <Link href="/dashboard/search/community"><a className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-gold-400 transition-colors">Community Search</a></Link>
               <Link href="/dashboard/matches"><a className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-gold-400 transition-colors">My Matches</a></Link>
            </nav>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block">
              <PremiumButton size="sm" />
            </div>

            <button onClick={toggleTheme} className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="relative p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white/40 dark:border-white/5 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
               <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-200 dark:border-gold-400/50 hover:border-purple-400 dark:hover:border-gold-400 transition-all"
               >
                  <img src="/images/user-avatar.jpg" alt="User Avatar" className="w-full h-full object-cover" />
               </button>
               <AnimatePresence>
                  {isUserMenuOpen && <UserMenu onLinkClick={() => setIsUserMenuOpen(false)} />}
               </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Component */}
      <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </header>
  );
};

export default DashboardHeader;
