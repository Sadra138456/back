import React from 'react';
import { TrendingUp, Flame, Star, GitFork, Shield } from 'lucide-react';
import { useLanguage } from '../language';

export const Explore: React.FC = () => {
  const { t } = useLanguage();
  const trendingRepos = [
    { name: 'microsoft/sentinel', desc: 'Cloud-native SIEM and SOAR solution.', lang: 'Jupyter Notebook', stars: '4.5k' },
    { name: 'projectdiscovery/nuclei', desc: 'Fast and customizable vulnerability scanner based on simple YAML based DSL.', lang: 'Go', stars: '18k' },
    { name: 'elastic/detection-rules', desc: 'Rules for Elastic Security\'s detection engine', lang: 'Python', stars: '3.2k' },
    { name: 'SigmaHQ/sigma', desc: 'Generic Signature Format for SIEM Systems', lang: 'YARA', stars: '8.1k' },
  ];

  const trendingDevs = [
    { name: 'geohot', desc: 'Security Researcher', lang: 'C' },
    { name: 'liveoverflow', desc: 'CTF Player & Youtuber', lang: 'Python' },
    { name: 'j00ru', desc: 'Google Project Zero', lang: 'C++' },
  ];

  return (
    <div className="container mx-auto max-w-[1024px] px-4 py-8 text-gh-text animate-fade-in">
        <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                {t('exploreTitle')}
            </h1>
            <p className="text-gh-secondary text-lg">
                {t('exploreSubtitle')}
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Trending Repos */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="flex items-center gap-2 border-b border-gh-border pb-2 mb-2">
                    <TrendingUp className="text-gh-text" />
                    <h2 className="text-xl font-bold">{t('trendingRepos')}</h2>
                </div>

                <div className="flex flex-col gap-4">
                    {trendingRepos.map((repo, i) => (
                        <div key={i} className="border border-gh-border bg-[#161b22] p-4 rounded-md hover:border-gh-secondary transition-colors cursor-pointer group">
                             <div className="flex justify-between items-start">
                                 <div>
                                     <h3 className="font-bold text-gh-link text-lg group-hover:underline mb-1" dir="ltr">{repo.name}</h3>
                                     <p className="text-sm text-gh-secondary mb-3">{repo.desc}</p>
                                     <div className="flex items-center gap-4 text-xs text-gh-secondary">
                                         <span>{repo.lang}</span>
                                         <span className="flex items-center gap-1"><Star size={12}/> {repo.stars}</span>
                                         <span className="flex items-center gap-1"><GitFork size={12}/> {Math.floor(Math.random() * 500)}</span>
                                         <span>Built by community</span>
                                     </div>
                                 </div>
                                 <button className="bg-[#21262d] border border-gh-border rounded-md px-3 py-1 text-xs font-semibold text-gh-text flex items-center gap-1 hover:bg-[#30363d] transition-colors">
                                    <Star size={14} /> {t('star')}
                                 </button>
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar - Trending Devs & Topics */}
            <div className="flex flex-col gap-8">
                <div>
                     <div className="flex items-center gap-2 border-b border-gh-border pb-2 mb-4">
                        <Flame className="text-orange-500" />
                        <h2 className="text-lg font-bold">{t('trendingDevs')}</h2>
                    </div>
                    <div className="flex flex-col gap-3">
                        {trendingDevs.map((dev, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <img src={`https://ui-avatars.com/api/?name=${dev.name}&background=random`} alt={dev.name} className="w-10 h-10 rounded-full" />
                                <div className="flex flex-col">
                                    <span className="font-bold text-gh-text hover:text-gh-link cursor-pointer">{dev.name}</span>
                                    <span className="text-xs text-gh-secondary">{dev.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 border-b border-gh-border pb-2 mb-4">
                        <Shield className="text-green-500" />
                        <h2 className="text-lg font-bold">{t('popularTopics')}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['Zero-Day', 'Kubernetes Security', 'eBPF', 'Rust', 'Supply Chain', 'DevSecOps'].map((tag, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-[#21262d] border border-gh-border text-xs text-gh-link hover:bg-gh-link hover:text-white cursor-pointer transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                
                <div className="p-4 rounded-md border border-gh-border bg-gradient-to-br from-[#161b22] to-[#1f242c]">
                    <h3 className="font-bold text-white mb-2">{t('subscribe')}</h3>
                    <p className="text-xs text-gh-secondary mb-3">{t('subscribeMsg')}</p>
                    <button className="w-full py-1.5 rounded-md bg-gh-green text-white text-sm font-bold hover:bg-gh-greenHover">{t('subscribeBtn')}</button>
                </div>
            </div>
        </div>
    </div>
  );
};