
import React from 'react';
import { Apple, Smartphone, Instagram, Facebook, Twitter, Linkedin, Heart, ShieldCheck } from 'lucide-react';
import Logo from './ui/Logo';
import useTranslation from '../hooks/useTranslation';

interface FooterProps {
  onAdminClick?: () => void;
  onNavigate?: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick, onNavigate }) => {
  const { t } = useTranslation();

  const handleNav = (e: React.MouseEvent, view: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-white/10 pt-20 pb-10 relative z-10">
      <div className="container mx-auto px-4">
        
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
               <Logo className="w-10 h-10" />
              <span className="text-xl font-display font-bold text-gray-900 dark:text-white">
                My Divine Wedding
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-purple-500/30">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-6">{t('footer.company')}</h4>
            <ul className="space-y-3">
              {[
                { label: t('nav.company'), id: 'company' }, 
                { label: t('nav.contact'), id: 'landing', section: 'contact' },
                { label: t('nav.stories'), id: 'landing', section: 'stories' }
              ].map(item => (
                <li key={item.label}>
                  <a 
                    href={item.section ? `#${item.section}` : '#'} 
                    onClick={(e) => item.section ? null : handleNav(e, item.id)}
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-gold-400 text-sm transition-colors relative group w-fit block cursor-pointer"
                  >
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-6">{t('footer.help')}</h4>
            <ul className="space-y-3">
              {[
                { label: 'FAQs', id: 'faq' },
                { label: 'Safety Tips', id: 'faq' },
                { label: 'Report Misuse', id: 'faq' }
              ].map(item => (
                <li key={item.label}>
                  <a 
                    href="#" 
                    onClick={(e) => handleNav(e, item.id)}
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-gold-400 text-sm transition-colors relative group w-fit block cursor-pointer"
                  >
                    {item.label}
                     <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-6">{t('footer.app')}</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Experience the best matchmaking on the go.
            </p>
            <div className="space-y-3">
              <button className="group relative w-full flex items-center gap-3 px-4 py-3 bg-black dark:bg-white/5 text-white rounded-xl overflow-hidden transition-transform active:scale-95">
                <div className="absolute inset-0 border border-gray-700 dark:border-white/10 rounded-xl group-hover:border-transparent transition-colors"></div>
                {/* Gradient Border Glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 -z-10 blur-md transition-opacity duration-300"></div>
                <div className="absolute inset-[1px] rounded-[10px] bg-black dark:bg-[#1a1a1a] -z-10"></div>
                
                <Apple size={24} className="group-hover:text-white transition-colors" />
                <div className="text-left relative z-10">
                  <div className="text-[10px] uppercase opacity-70">Download on the</div>
                  <div className="font-bold text-sm">App Store</div>
                </div>
              </button>
              
              <button className="group relative w-full flex items-center gap-3 px-4 py-3 bg-black dark:bg-white/5 text-white rounded-xl overflow-hidden transition-transform active:scale-95">
                 <div className="absolute inset-0 border border-gray-700 dark:border-white/10 rounded-xl group-hover:border-transparent transition-colors"></div>
                 {/* Gradient Border Glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 opacity-0 group-hover:opacity-100 -z-10 blur-md transition-opacity duration-300"></div>
                <div className="absolute inset-[1px] rounded-[10px] bg-black dark:bg-[#1a1a1a] -z-10"></div>

                <Smartphone size={24} className="group-hover:text-white transition-colors" />
                <div className="text-left relative z-10">
                  <div className="text-[10px] uppercase opacity-70">Get it on</div>
                  <div className="font-bold text-sm">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-500 text-sm text-center md:text-left">
            © 2024 My Divine Wedding. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
              {t('footer.made')} <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> for the Tamil Community
            </div>
            
            {/* Hidden/Subtle Admin Link */}
            {onAdminClick && (
              <button 
                onClick={onAdminClick}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 dark:hover:text-cyan-400 transition-colors opacity-50 hover:opacity-100"
              >
                <ShieldCheck size={12} /> Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
