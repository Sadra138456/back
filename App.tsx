import React, { useState, useEffect } from 'react';
import { Book, Package, Star, Table2, BookOpen, Download, FileText, Cpu, Server, Globe, Terminal, Brain, CheckCircle2 } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RepoCard } from './components/RepoCard';
import { ContributionGraph } from './components/ContributionGraph';
import { REPOSITORIES as CONSTANT_REPOS, USER_DATA, SKILLS as CONSTANT_SKILLS, API_BASE_URL } from './constants';
import { TabView, Repository, UserProfile, Article, Skill } from './types';
import { ContactDialog, AboutDialog, FollowDialog } from './components/Dialogs';
import { RepoDetail } from './components/RepoDetail';
import { ArticleDetail } from './components/ArticleDetail';
import { LanguageProvider, useLanguage } from './language';
import { AdminLogin } from './components/AdminLogin';
import { Dashboard } from './components/Dashboard';

type ViewState = 'HOME' | 'REPO_DETAIL' | 'ADMIN' | 'ARTICLE_DETAIL';

function Content() {
  const { t, lang, dir } = useLanguage();
  const [view, setView] = useState<ViewState>('HOME');
  const [activeTab, setActiveTab] = useState<TabView>(TabView.OVERVIEW);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Data State
  const [repositories, setRepositories] = useState<Repository[]>(CONSTANT_REPOS);
  const [articles, setArticles] = useState<Article[]>([]);
  const [pinnedRepos, setPinnedRepos] = useState<Repository[]>(CONSTANT_REPOS.slice(0, 6));
  const [userProfile, setUserProfile] = useState<UserProfile>(USER_DATA);
  const [skillsList, setSkillsList] = useState<Skill[]>(CONSTANT_SKILLS);

  // Admin State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Hidden Click Counter
  const [clickCount, setClickCount] = useState(0);
  
  // Modal States
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFollowOpen, setIsFollowOpen] = useState(false);

  // Fetch Data on Load
  const fetchData = async () => {
    try {
        // Pointing to PHP endpoints using absolute URL
        const [repoRes, artRes, profileRes, skillRes] = await Promise.all([
            fetch(`${API_BASE_URL}/projects.php`),
            fetch(`${API_BASE_URL}/articles.php`),
            fetch(`${API_BASE_URL}/profile.php`),
            fetch(`${API_BASE_URL}/skills.php`)
        ]);
        
        if (repoRes.ok) {
            const data = await repoRes.json();
            if (Array.isArray(data) && data.length > 0) {
                setRepositories(data);
                setPinnedRepos(data.filter((r: Repository) => r.isPinned));
            }
        }
        
        if (artRes.ok) {
            const data = await artRes.json();
             if (Array.isArray(data)) setArticles(data);
        }

        if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData.avatarUrl) {
                // If the URL is relative (starts with my_back), prepend domain if needed or use as is if served from same domain.
                // Assuming PHP returns 'my_back/uploads/...' and we are on different domain or same, let's ensure it loads.
                // If api is on sadracheraghi.ir/my_back, and image is returned as 'my_back/uploads/x.jpg' relative to root...
                // We might need to construct full URL if the frontend is hosted elsewhere (like localhost).
                // But if deployed on same server, relative works. 
                // To be safe with the requested URL structure:
                let avatar = profileData.avatarUrl;
                if (avatar && !avatar.startsWith('http') && !avatar.startsWith('./')) {
                     // If PHP returns 'my_back/uploads/...' we might want to prepend domain if we are developing locally against remote API
                     if (window.location.hostname !== 'sadracheraghi.ir') {
                         avatar = `https://sadracheraghi.ir/${avatar}`;
                     }
                }
                setUserProfile(prev => ({...prev, avatarUrl: avatar || prev.avatarUrl}));
            }
        }

        if (skillRes.ok) {
             const data = await skillRes.json();
             if (Array.isArray(data)) setSkillsList(data);
        }

    } catch (e) {
        console.log("Running in offline mode or backend not ready");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRepoClick = (repo: Repository) => {
    setSelectedRepo(repo);
    setView('REPO_DETAIL');
  };

  const handleArticleClick = (article: Article) => {
      setSelectedArticle(article);
      setView('ARTICLE_DETAIL');
  };

  const handleHomeClick = () => {
      setView('HOME');
      setActiveTab(TabView.OVERVIEW);
      setSelectedRepo(null);
      setSelectedArticle(null);
  }

  const handleArticlesClick = () => {
      setView('HOME');
      setActiveTab(TabView.ARTICLES);
      setSelectedRepo(null);
      setSelectedArticle(null);
  }

  // Hidden Trigger Logic
  const handleCopyrightClick = () => {
      setClickCount(prev => prev + 1);
      if (clickCount + 1 >= 3) {
          setIsAdminLoginOpen(true);
          setClickCount(0);
      }
  };

  const handleAdminLogin = (token: string) => {
      setAuthToken(token);
      setIsAdminLoginOpen(false);
      setView('ADMIN');
  };

  if (view === 'ADMIN' && authToken) {
      return (
        <Dashboard 
            repositories={repositories} 
            skills={skillsList}
            onLogout={() => { setAuthToken(null); setView('HOME'); }}
            onRefresh={fetchData}
            currentAvatar={userProfile.avatarUrl}
            onUpdateAvatar={(url) => {
                let avatar = url;
                if (window.location.hostname !== 'sadracheraghi.ir' && !avatar.startsWith('http')) {
                    avatar = `https://sadracheraghi.ir/${avatar}`;
                }
                setUserProfile(prev => ({...prev, avatarUrl: avatar}));
            }}
        />
      );
  }

  // Helper to group skills
  const getGroupedSkills = () => {
    const grouped: Record<string, Skill[]> = {};
    skillsList.forEach(skill => {
        if (!grouped[skill.category]) grouped[skill.category] = [];
        grouped[skill.category].push(skill);
    });
    return grouped;
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
        case 'Language': return <Terminal size={18} className="text-gh-link" />;
        case 'DevOps': return <Server size={18} className="text-orange-400" />;
        case 'Cloud': return <Globe size={18} className="text-blue-400" />;
        case 'AI': return <Brain size={18} className="text-purple-400" />;
        case 'Methodology': return <CheckCircle2 size={18} className="text-green-400" />;
        default: return <Cpu size={18} className="text-gh-secondary" />;
    }
  };

  // Content Renderer based on Tabs (Only used when view === 'HOME')
  const renderTabContent = () => {
    switch (activeTab) {
      case TabView.OVERVIEW:
        return (
          <div className="flex flex-col gap-6">
            {/* Readme Section */}
             <div className="border border-gh-border rounded-md p-6 bg-gh-bg">
                <div className="prose prose-invert max-w-none">
                    <h3 className="text-gh-text mt-0">{t('hi')} {lang === 'fa' ? userProfile.firstName + ' هستم' : userProfile.firstName}</h3>
                    <p className="text-gh-secondary text-sm">
                        {userProfile.bio}
                    </p>
                    <h4 className="text-gh-text mb-2 text-sm uppercase tracking-wider font-bold">{t('techStack')}</h4>
                    <div className="flex flex-wrap gap-1">
                        {skillsList.map(s => (
                            <img 
                                key={s.name}
                                src={`https://img.shields.io/badge/${s.name.replace(/\s/g, '_')}-21262d?style=flat-square&logo=${s.name.toLowerCase()}&logoColor=white`} 
                                alt={s.name}
                                className="h-6"
                            />
                        ))}
                    </div>
                </div>
             </div>

             <div>
                <div className="flex justify-between items-baseline mb-2">
                  <h2 className="text-[16px] text-gh-text font-normal">{t('pinned')}</h2>
                  <span className="text-xs text-gh-secondary cursor-pointer hover:text-gh-link">{t('customizePins')}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pinnedRepos.length > 0 ? pinnedRepos.map(repo => (
                    <RepoCard key={repo.name} repo={repo} onClick={handleRepoClick} />
                  )) : <div className="text-sm text-gh-secondary col-span-2">No pinned repositories yet. Login to dashboard to add one.</div>}
                </div>
             </div>

             <div>
                <div className="flex justify-between items-baseline mb-2">
                  <h2 className="text-[16px] text-gh-text font-normal">{t('contributionActivity')}</h2>
                </div>
                <ContributionGraph repositories={repositories} />
             </div>
          </div>
        );

      case TabView.REPOSITORIES:
        return (
            <div>
                 <div className="flex flex-col sm:flex-row gap-2 border-b border-gh-border pb-4 mb-4">
                    <input 
                        type="text" 
                        placeholder={t('findRepo')}
                        className="bg-[#0d1117] border border-gh-border rounded-md px-3 py-1.5 text-sm w-full sm:w-1/2 focus:ring-2 focus:ring-gh-link focus:border-gh-link outline-none transition-all"
                    />
                    <div className="flex gap-1">
                        <button className="px-3 py-1.5 bg-[#21262d] border border-gh-border rounded-md text-sm font-semibold text-gh-text hover:bg-[#30363d]">{t('type')}</button>
                        <button className="px-3 py-1.5 bg-[#21262d] border border-gh-border rounded-md text-sm font-semibold text-gh-text hover:bg-[#30363d]">{t('language')}</button>
                        <button className="px-3 py-1.5 bg-[#21262d] border border-gh-border rounded-md text-sm font-semibold text-gh-text hover:bg-[#30363d]">{t('sort')}</button>
                        <button className="px-3 py-1.5 bg-[#21262d] border border-gh-border rounded-md text-sm font-semibold text-gh-text ms-auto hover:bg-[#30363d] flex items-center gap-1 transition-colors">
                            <Download size={16} /> {t('downloadCV')}
                        </button>
                    </div>
                 </div>
                 <div className="flex flex-col gap-0">
                    {repositories.map(repo => (
                        <div key={repo.name} className="border-b border-gh-border py-6 first:pt-0">
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleRepoClick(repo)}
                                            className="text-xl font-bold text-gh-link hover:underline cursor-pointer text-left"
                                        >
                                            {repo.name}
                                        </button>
                                        <span className="text-xs border border-gh-border rounded-full px-2 py-0.5 text-gh-secondary">{t('public')}</span>
                                    </div>
                                    <p className="text-gh-secondary text-sm max-w-xl">
                                        {repo.description}
                                    </p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-gh-secondary">
                                        <div className="flex items-center gap-1">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: repo.languageColor }}></span>
                                            <span>{repo.language}</span>
                                        </div>
                                        {repo.stars > 0 && <span className="hover:text-gh-link cursor-pointer flex items-center gap-1"><Star size={14}/> {repo.stars}</span>}
                                        <span className="text-xs">{t('updated')} {repo.updatedAt}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <button className="bg-[#21262d] border border-gh-border rounded-md px-3 py-1 text-xs font-semibold text-gh-text flex items-center gap-1 hover:bg-[#30363d] transition-colors">
                                        <Star size={14} /> {t('star')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        );
      
      case TabView.SKILLS:
        const groupedSkills = getGroupedSkills();
        return (
            <div className="animate-fade-in">
                <div className="mb-6 border-b border-gh-border pb-4">
                    <h2 className="text-xl font-bold">{t('toolsAndTech')}</h2>
                    <p className="text-sm text-gh-secondary mt-1">{t('skillsSubtitle')}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(groupedSkills).map(([category, skills]) => (
                        <div key={category} className="border border-gh-border rounded-md bg-gh-bg overflow-hidden hover:border-gh-secondary transition-colors">
                            <div className="bg-[#161b22] px-4 py-3 border-b border-gh-border flex items-center gap-2 font-semibold text-sm">
                                {getCategoryIcon(category)}
                                {category}
                            </div>
                            <div className="p-4 flex flex-wrap gap-2">
                                {skills.map(skill => (
                                    <div 
                                        key={skill.name} 
                                        className="flex items-center gap-2 px-3 py-1.5 bg-[#21262d] border border-gh-border rounded-full text-xs font-medium text-gh-text hover:bg-[#30363d] transition-colors hover:border-gh-link cursor-default"
                                    >
                                        <div className={`w-2 h-2 rounded-full ${category === 'Language' ? 'bg-blue-400' : category === 'DevOps' ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                                        {skill.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );

      case TabView.ARTICLES:
          return (
              <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center border-b border-gh-border pb-4 mb-2">
                      <h2 className="text-xl font-bold">{t('articles')}</h2>
                      <span className="bg-[#21262d] text-gh-secondary px-2 py-0.5 rounded-full text-xs">{articles.length}</span>
                  </div>
                  {articles.length === 0 ? (
                      <div className="text-center py-12 text-gh-secondary">{t('noArticles')}</div>
                  ) : (
                      articles.map(article => (
                          <div key={article.id} className="border border-gh-border rounded-md p-4 bg-gh-bg hover:border-gh-secondary transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                  <h3 
                                    onClick={() => handleArticleClick(article)}
                                    className="text-xl font-bold text-gh-link cursor-pointer hover:underline"
                                  >
                                      {article.title}
                                  </h3>
                                  <span className="text-xs text-gh-secondary">{article.date}</span>
                              </div>
                              <p className="text-gh-secondary text-sm mb-3 line-clamp-3">
                                  {article.summary}
                              </p>
                              <div className="flex gap-2">
                                  {article.tags.map(tag => (
                                      <span key={tag} className="text-xs bg-[#21262d] text-gh-link px-2 py-0.5 rounded-full border border-gh-border">
                                          {tag}
                                      </span>
                                  ))}
                              </div>
                          </div>
                      ))
                  )}
              </div>
          );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans" dir={dir}>
      <Navbar 
        onOpenContact={() => setIsContactOpen(true)}
        onHomeClick={handleHomeClick}
        onArticlesClick={handleArticlesClick}
        userAvatar={userProfile.avatarUrl}
      />

      <ContactDialog isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <AboutDialog isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <FollowDialog isOpen={isFollowOpen} onClose={() => setIsFollowOpen(false)} />
      
      {isAdminLoginOpen && (
          <AdminLogin onLogin={handleAdminLogin} onCancel={() => setIsAdminLoginOpen(false)} />
      )}

      {view === 'REPO_DETAIL' && selectedRepo ? (
          <RepoDetail repo={selectedRepo} />
      ) : view === 'ARTICLE_DETAIL' && selectedArticle ? (
          <ArticleDetail article={selectedArticle} onBack={handleArticlesClick} />
      ) : (
        <main className="container mx-auto max-w-[1280px] px-4 md:px-6 pt-8">
            <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar */}
            <div className="md:w-[296px] shrink-0">
                <Sidebar 
                    onOpenAbout={() => setIsAboutOpen(true)} 
                    onOpenFollow={() => setIsFollowOpen(true)} 
                    userProfile={userProfile}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {/* Sticky Tab Navigation */}
                <div className="sticky top-0 bg-[#0d1117] z-20 border-b border-gh-border mb-4 overflow-x-auto hide-scrollbar">
                    <nav className="flex gap-1" aria-label="Tabs">
                        <button 
                            onClick={() => setActiveTab(TabView.OVERVIEW)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === TabView.OVERVIEW 
                                ? 'border-[#f78166] text-gh-text font-semibold' 
                                : 'border-transparent text-gh-text hover:bg-[#161b22] hover:border-gh-border'
                            }`}
                        >
                            <BookOpen size={16} className="text-gh-secondary" /> {t('overview')}
                        </button>
                        <button 
                            onClick={() => setActiveTab(TabView.REPOSITORIES)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === TabView.REPOSITORIES
                                ? 'border-[#f78166] text-gh-text font-semibold' 
                                : 'border-transparent text-gh-text hover:bg-[#161b22] hover:border-gh-border'
                            }`}
                        >
                            <Book size={16} className="text-gh-secondary" /> {t('repositories')}
                            <span className="bg-[#21262d] text-gh-text text-xs rounded-full px-2 py-0.5 ms-1">{repositories.length}</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab(TabView.SKILLS)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === TabView.SKILLS
                                ? 'border-[#f78166] text-gh-text font-semibold' 
                                : 'border-transparent text-gh-text hover:bg-[#161b22] hover:border-gh-border'
                            }`}
                        >
                            <Cpu size={16} className="text-gh-secondary" /> {t('skills')}
                        </button>
                        <button 
                            onClick={() => setActiveTab(TabView.ARTICLES)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === TabView.ARTICLES
                                ? 'border-[#f78166] text-gh-text font-semibold' 
                                : 'border-transparent text-gh-text hover:bg-[#161b22] hover:border-gh-border'
                            }`}
                        >
                            <FileText size={16} className="text-gh-secondary" /> {t('articles')}
                        </button>
                    </nav>
                </div>

                <div className="pb-10 animate-fade-in">
                    {renderTabContent()}
                </div>
            </div>
            </div>
        </main>
      )}

      <footer className="mt-12 py-8 border-t border-gh-border text-xs text-gh-secondary select-none">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-gh-secondary opacity-20 hover:opacity-100 transition-opacity"></div>
                 <span onClick={handleCopyrightClick} className="cursor-default">© {new Date().getFullYear()} {t('copyright')}</span>
              </div>
          </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Content />
    </LanguageProvider>
  );
}