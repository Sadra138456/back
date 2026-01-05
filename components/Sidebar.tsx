import React from 'react';
import { MapPin, Link as LinkIcon, Building, Heart, User } from 'lucide-react';
import { USER_DATA, SKILLS } from '../constants';
import { useLanguage } from '../language';
import { UserProfile } from '../types';

interface SidebarProps {
  onOpenAbout: () => void;
  onOpenFollow: () => void;
  userProfile?: UserProfile; // Added prop for dynamic data
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAbout, onOpenFollow, userProfile }) => {
  const { t } = useLanguage();
  
  // Use passed profile or fallback to constant
  const data = userProfile || USER_DATA;

  // Calculate Age dynamically
  const birthDate = new Date(data.birthday);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs); 
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  return (
    <aside className="w-full md:w-[296px] flex flex-col gap-4 md:-mt-8 relative z-10 px-4 md:px-0">
      <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0">
        <div className="relative group">
          <img 
            src={data.avatarUrl} 
            alt="Profile" 
            className="w-16 h-16 md:w-[296px] md:h-[296px] rounded-full border border-gh-border bg-gh-bg object-cover"
          />
          <div className="absolute bottom-2 right-2 md:bottom-8 md:right-4 bg-gh-bg border border-gh-border rounded-full p-1.5 hidden md:block text-gh-secondary hover:text-gh-link cursor-pointer shadow-sm">
             <div className="text-xl">🎯</div>
          </div>
        </div>
        
        <div className="flex flex-col mt-2 md:mt-4">
          <h1 className="text-2xl font-bold text-gh-text leading-tight">{data.firstName} {data.lastName}</h1>
          <span className="text-xl text-gh-secondary font-light">{data.username}</span>
        </div>
      </div>

      <div className="text-gh-text text-[16px] leading-6">
        {data.bio}
      </div>

      <div className="flex flex-col gap-3 w-full">
         <button 
           onClick={onOpenFollow}
           className="w-full bg-[#21262d] text-gh-text border border-[rgba(240,246,252,0.1)] rounded-md py-1.5 px-3 text-sm font-semibold hover:bg-[#30363d] hover:border-[#8b949e] transition-all"
         >
            {t('follow')}
         </button>
      </div>

      {/* About Me Button */}
      <button 
        onClick={onOpenAbout}
        className="flex items-center justify-center gap-2 w-full py-2 border border-gh-border rounded-md hover:bg-[#161b22] transition-colors text-gh-text font-medium text-sm group"
      >
        <User size={16} className="text-gh-secondary group-hover:text-gh-link" />
        {t('aboutMe')}
      </button>

      <div className="flex flex-col gap-2 text-sm text-gh-text mt-2">
        <div className="flex items-center gap-2">
          <Building size={16} className="text-gh-secondary" />
          <span>{data.occupation}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gh-secondary" />
          <span>{data.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <LinkIcon size={16} className="text-gh-secondary" />
          <a href={data.website} className="hover:text-gh-link hover:underline">{data.website.replace('https://', '')}</a>
        </div>
        <div className="flex items-center gap-2">
           <Heart size={16} className="text-gh-secondary" />
           <span>{t('age')}: {age}</span>
        </div>
      </div>

      <div className="border-t border-gh-border my-2"></div>

      <div>
        <h3 className="font-semibold text-gh-text mb-2">{t('achievements')}</h3>
        <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center" title="Quick Draw">⚡</div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center" title="Arctic Code Vault">🧊</div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center" title="Pull Shark">🦈</div>
        </div>
      </div>

       <div className="border-t border-gh-border my-2"></div>
       
       <div>
        <h3 className="font-semibold text-gh-text mb-3">{t('topSkills')}</h3>
        <div className="flex flex-wrap gap-2">
            {SKILLS.slice(0, 8).map(skill => (
                <span key={skill.name} className="px-2 py-0.5 rounded-full bg-[#161b22] border border-gh-border text-xs text-gh-link font-medium">
                    {skill.name}
                </span>
            ))}
        </div>
       </div>
    </aside>
  );
};