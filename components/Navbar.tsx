import React, { useState } from 'react';
import { Menu, Command, Github, Phone, FileText } from 'lucide-react';
import { useLanguage } from '../language';

interface NavbarProps {
  onOpenContact: () => void;
  onHomeClick: () => void;
  onArticlesClick: () => void; // Added callback
  userAvatar?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
    onOpenContact, 
    onHomeClick,
    onArticlesClick,
    userAvatar
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, lang, setLang } = useLanguage();

  return (
    <header className="bg-[#161b22] text-[#c9d1d9] py-3 px-4 md:px-6 border-b border-gh-border sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden border border-gh-border p-1 rounded-md text-gh-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={20} />
          </button>
          
          <a href="#" onClick={(e) => { e.preventDefault(); onHomeClick(); }} className="text-white hover:text-gh-secondary transition-colors">
            <Github size={32} fill="white" />
          </a>

          <div className="hidden md:flex flex-col gap-1">
             <button onClick={onHomeClick} className="font-semibold text-sm leading-none hover:text-gh-link transition-colors text-left">Sadra's Portfolio</button>
          </div>

          <div className="hidden md:block relative ms-4">
            <div className="flex items-center bg-[#0d1117] border border-gh-border rounded-md px-2 py-1 w-64 focus-within:border-gh-link focus-within:ring-1 focus-within:ring-gh-link transition-all">
              <Command size={14} className="text-gh-secondary me-2" />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                className="bg-transparent border-none outline-none text-sm w-full placeholder-gh-secondary"
              />
            </div>
          </div>
          
          <nav className="hidden md:flex gap-4 text-sm font-semibold text-gh-text ms-4 items-center">
            <button onClick={onOpenContact} className="hover:text-gh-secondary flex items-center gap-1">
               <Phone size={14} /> {t('contact')}
            </button>
            <button onClick={onArticlesClick} className="hover:text-gh-secondary flex items-center gap-1">
               <FileText size={14} /> {t('articles')}
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {userAvatar && (
              <img src={userAvatar} className="w-5 h-5 rounded-full md:hidden" alt="avatar" />
          )}
          {/* Language Switcher */}
          <button 
            onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}
            className="border border-gh-border rounded-md px-3 py-1 text-sm font-semibold hover:bg-[#30363d] transition-colors"
          >
            {lang === 'en' ? 'فارسی' : 'English'}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-gh-border flex flex-col gap-2">
            <input 
                type="text" 
                placeholder={t('searchPlaceholderMobile')}
                className="bg-[#0d1117] border border-gh-border rounded-md p-2 text-sm text-gh-text mb-2"
              />
            <button onClick={onOpenContact} className="font-semibold text-sm py-1 text-left">{t('contact')}</button>
            <button onClick={onArticlesClick} className="font-semibold text-sm py-1 text-left">{t('articles')}</button>
            <div className="border-t border-gh-border my-1"></div>
            <button onClick={onHomeClick} className="flex items-center gap-2 text-sm py-1 text-left">
               {userAvatar && <img src={userAvatar} className="w-5 h-5 rounded-full" alt="avatar" />}
               Sadra Cheraghi
            </button>
        </div>
      )}
    </header>
  );
};