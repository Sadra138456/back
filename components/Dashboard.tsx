import React, { useState, useEffect } from 'react';
import { Repository, Article, Skill } from '../types';
import { Upload, Trash2, Pin, PinOff, Plus, FileArchive, X, User, FileText, Layout, Cpu, Pencil } from 'lucide-react';
import { useLanguage } from '../language';
import { API_BASE_URL } from '../constants';

interface DashboardProps {
    repositories: Repository[];
    skills: Skill[];
    onLogout: () => void;
    onRefresh: () => void;
    currentAvatar: string;
    onUpdateAvatar: (url: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ repositories, skills, onLogout, onRefresh, currentAvatar, onUpdateAvatar }) => {
    const { t, dir } = useLanguage();
    const [activeTab, setActiveTab] = useState<'PROJECTS' | 'ARTICLES' | 'SKILLS'>('PROJECTS');
    const [articles, setArticles] = useState<Article[]>([]);
    
    // Modal States
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isArticleOpen, setIsArticleOpen] = useState(false);
    const [isSkillOpen, setIsSkillOpen] = useState(false);
    
    // Project Upload State
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Article Upload State
    const [artTitle, setArtTitle] = useState('');
    const [artContent, setArtContent] = useState('');
    const [artTags, setArtTags] = useState('');
    const [artUploading, setArtUploading] = useState(false);

    // Skill Upload/Edit State
    const [skillName, setSkillName] = useState('');
    const [skillCategory, setSkillCategory] = useState<Skill['category']>('Language');
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null); // Track if editing
    const [skillUploading, setSkillUploading] = useState(false);

    // Avatar State
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>(currentAvatar);
    const [avatarUploading, setAvatarUploading] = useState(false);

    useEffect(() => {
        if (activeTab === 'ARTICLES') fetchArticles();
    }, [activeTab]);

    const fetchArticles = async () => {
        try {
            // Add cache busting here too
            const res = await fetch(`${API_BASE_URL}/articles.php?t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                setArticles(Array.isArray(data) ? data : []);
            }
        } catch(e) { console.error(e); }
    };

    const handleUploadProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !name) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', desc);
        formData.append('file', file);

        try {
            const res = await fetch(`${API_BASE_URL}/projects.php`, { method: 'POST', body: formData });
            if (res.ok) {
                onRefresh();
                setIsUploadOpen(false);
                setName('');
                setDesc('');
                setFile(null);
            } else {
                alert('Upload failed');
            }
        } catch (error) { console.error(error); } finally { setUploading(false); }
    };

    const handleCreateArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        setArtUploading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/articles.php`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: artTitle,
                    content: artContent,
                    tags: artTags
                })
            });
            if (res.ok) {
                fetchArticles();
                setIsArticleOpen(false);
                setArtTitle('');
                setArtContent('');
                setArtTags('');
            }
        } catch (e) { console.error(e); } finally { setArtUploading(false); }
    };

    const handleOpenAddSkill = () => {
        setEditingSkill(null);
        setSkillName('');
        setSkillCategory('Language');
        setIsSkillOpen(true);
    };

    const handleOpenEditSkill = (skill: Skill) => {
        setEditingSkill(skill);
        setSkillName(skill.name);
        setSkillCategory(skill.category);
        setIsSkillOpen(true);
    };

    const handleSkillSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSkillUploading(true);
        
        try {
            let res;
            if (editingSkill) {
                // Update existing - using PUT with query param in PHP
                res = await fetch(`${API_BASE_URL}/skills.php?name=${encodeURIComponent(editingSkill.name)}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name: skillName,
                        category: skillCategory
                    })
                });
            } else {
                // Create new
                res = await fetch(`${API_BASE_URL}/skills.php`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name: skillName,
                        category: skillCategory
                    })
                });
            }

            if (res.ok) {
                onRefresh();
                setIsSkillOpen(false);
                setSkillName('');
                setEditingSkill(null);
            } else {
                alert("Failed to save skill.");
            }
        } catch (e) { console.error(e); } finally { setSkillUploading(false); }
    };

    const handleDeleteSkill = async (name: string) => {
        if (!confirm('Delete this skill?')) return;
        try {
            await fetch(`${API_BASE_URL}/skills.php?name=${encodeURIComponent(name)}`, { method: 'DELETE' });
            onRefresh();
        } catch(e) { console.error(e); }
    };

    const handleDeleteArticle = async (id: string) => {
        if (!confirm('Delete this article?')) return;
        try {
            await fetch(`${API_BASE_URL}/articles.php?id=${id}`, { method: 'DELETE' });
            fetchArticles();
        } catch(e) { console.error(e); }
    };

    const handleUploadAvatar = async () => {
        if (!avatarFile) return;
        setAvatarUploading(true);
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        try {
            const res = await fetch(`${API_BASE_URL}/profile.php`, { method: 'POST', body: formData });
            if (res.ok) {
                const data = await res.json();
                // Construct absolute URL for the frontend immediately
                // The backend returns relative path like '/images/avatar-123.jpg'
                const fullAvatarUrl = data.avatarUrl.startsWith('/') 
                    ? `${API_BASE_URL}${data.avatarUrl}` 
                    : data.avatarUrl;
                
                onUpdateAvatar(fullAvatarUrl);
                setAvatarPreview(fullAvatarUrl);
                alert('Avatar updated!');
            }
        } catch (error) { console.error(error); } finally { setAvatarUploading(false); }
    };

    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try { await fetch(`${API_BASE_URL}/projects.php?id=${id}`, { method: 'DELETE' }); onRefresh(); } catch (e) { console.error(e); }
    };

    const handlePin = async (id: string) => {
        try { await fetch(`${API_BASE_URL}/projects.php?id=${id}&action=pin`, { method: 'PATCH' }); onRefresh(); } catch (e) { console.error(e); }
    };

    // Safe guards
    const safeRepos = Array.isArray(repositories) ? repositories : [];
    const safeSkills = Array.isArray(skills) ? skills : [];
    const safeArticles = Array.isArray(articles) ? articles : [];

    return (
        <div className="min-h-screen bg-[#0d1117] text-gh-text p-6 font-sans" dir={dir}>
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-gh-border pb-4">
                    <h1 className="text-2xl font-bold">{t('adminDashboard')}</h1>
                    <button onClick={onLogout} className="bg-[#21262d] border border-gh-border px-4 py-2 rounded-md hover:bg-[#30363d]">
                        Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                     {/* Avatar Section */}
                    <div className="lg:col-span-1 bg-[#161b22] border border-gh-border rounded-lg p-6 flex flex-col items-center">
                        <h3 className="font-bold mb-4">{t('uploadAvatar')}</h3>
                        <div className="w-32 h-32 rounded-full border-2 border-gh-border overflow-hidden mb-4 relative group">
                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer">
                                <User className="text-white"/>
                            </div>
                            <input type="file" accept="image/*" onChange={handleAvatarSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <button 
                            onClick={handleUploadAvatar} 
                            disabled={!avatarFile || avatarUploading}
                            className="w-full bg-[#21262d] border border-gh-border py-2 rounded-md hover:bg-[#30363d] disabled:opacity-50 text-sm"
                        >
                            {avatarUploading ? 'Uploading...' : t('upload')}
                        </button>
                    </div>

                    {/* Management Area */}
                    <div className="lg:col-span-3">
                         {/* Tabs */}
                        <div className="flex border-b border-gh-border mb-6 overflow-x-auto">
                            <button 
                                onClick={() => setActiveTab('PROJECTS')}
                                className={`px-6 py-3 font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'PROJECTS' ? 'border-gh-link text-gh-text' : 'border-transparent text-gh-secondary hover:text-gh-text'}`}
                            >
                                <Layout size={18} /> {t('manageProjects')}
                            </button>
                            <button 
                                onClick={() => setActiveTab('ARTICLES')}
                                className={`px-6 py-3 font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'ARTICLES' ? 'border-gh-link text-gh-text' : 'border-transparent text-gh-secondary hover:text-gh-text'}`}
                            >
                                <FileText size={18} /> {t('manageArticles')}
                            </button>
                            <button 
                                onClick={() => setActiveTab('SKILLS')}
                                className={`px-6 py-3 font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'SKILLS' ? 'border-gh-link text-gh-text' : 'border-transparent text-gh-secondary hover:text-gh-text'}`}
                            >
                                <Cpu size={18} /> {t('manageSkills')}
                            </button>
                        </div>

                        {activeTab === 'PROJECTS' ? (
                            <div className="bg-[#161b22] border border-gh-border rounded-lg overflow-hidden">
                                <div className="p-4 border-b border-gh-border flex justify-between items-center bg-[#0d1117]">
                                    <h3 className="font-bold">Project List</h3>
                                    <button onClick={() => setIsUploadOpen(true)} className="bg-gh-green text-white px-3 py-1.5 rounded-md hover:bg-gh-greenHover flex items-center gap-2 text-sm">
                                        <Plus size={14} /> {t('newProject')}
                                    </button>
                                </div>
                                <table className="w-full text-left">
                                    <thead className="bg-[#0d1117] border-b border-gh-border text-xs uppercase text-gh-secondary">
                                        <tr>
                                            <th className="p-4">{t('projects')}</th>
                                            <th className="p-4">{t('language')}</th>
                                            <th className="p-4 text-right">{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gh-border">
                                        {safeRepos.map(repo => (
                                            <tr key={repo.id || repo.name} className="hover:bg-[#21262d]/50">
                                                <td className="p-4 font-semibold">{repo.name}</td>
                                                <td className="p-4 flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: repo.languageColor}}></div>
                                                    {repo.language}
                                                </td>
                                                <td className="p-4 flex justify-end gap-2">
                                                    <button onClick={() => handlePin(repo.id!)} className={`p-2 rounded-md border ${repo.isPinned ? 'border-gh-link text-gh-link' : 'border-gh-border text-gh-secondary'} hover:bg-[#30363d]`}><Pin size={16}/></button>
                                                    <button onClick={() => handleDelete(repo.id!)} className="p-2 rounded-md border border-gh-border text-red-400 hover:bg-red-900/20 hover:border-red-900/50"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : activeTab === 'ARTICLES' ? (
                            <div className="bg-[#161b22] border border-gh-border rounded-lg overflow-hidden">
                                <div className="p-4 border-b border-gh-border flex justify-between items-center bg-[#0d1117]">
                                    <h3 className="font-bold">Article List</h3>
                                    <button onClick={() => setIsArticleOpen(true)} className="bg-gh-green text-white px-3 py-1.5 rounded-md hover:bg-gh-greenHover flex items-center gap-2 text-sm">
                                        <Plus size={14} /> {t('newArticle')}
                                    </button>
                                </div>
                                <div className="divide-y divide-gh-border">
                                    {safeArticles.length === 0 ? (
                                        <div className="p-8 text-center text-gh-secondary">No articles yet.</div>
                                    ) : (
                                        safeArticles.map(art => (
                                            <div key={art.id} className="p-4 flex justify-between items-center hover:bg-[#21262d]/50">
                                                <div>
                                                    <h4 className="font-bold text-gh-text">{art.title}</h4>
                                                    <span className="text-xs text-gh-secondary">{art.date} • {art.views} views</span>
                                                </div>
                                                <button onClick={() => handleDeleteArticle(art.id)} className="p-2 rounded-md border border-gh-border text-red-400 hover:bg-red-900/20 hover:border-red-900/50">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#161b22] border border-gh-border rounded-lg overflow-hidden">
                                <div className="p-4 border-b border-gh-border flex justify-between items-center bg-[#0d1117]">
                                    <h3 className="font-bold">Skill List</h3>
                                    <button onClick={handleOpenAddSkill} className="bg-gh-green text-white px-3 py-1.5 rounded-md hover:bg-gh-greenHover flex items-center gap-2 text-sm">
                                        <Plus size={14} /> {t('newSkill')}
                                    </button>
                                </div>
                                <table className="w-full text-left">
                                    <thead className="bg-[#0d1117] border-b border-gh-border text-xs uppercase text-gh-secondary">
                                        <tr>
                                            <th className="p-4">{t('skillName')}</th>
                                            <th className="p-4">{t('category')}</th>
                                            <th className="p-4 text-right">{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gh-border">
                                        {safeSkills.map(skill => (
                                            <tr key={skill.name} className="hover:bg-[#21262d]/50">
                                                <td className="p-4 font-semibold">{skill.name}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs border border-gh-border
                                                        ${skill.category === 'Language' ? 'bg-blue-900/20 text-blue-400' :
                                                          skill.category === 'DevOps' ? 'bg-orange-900/20 text-orange-400' :
                                                          skill.category === 'Cloud' ? 'bg-cyan-900/20 text-cyan-400' :
                                                          skill.category === 'AI' ? 'bg-purple-900/20 text-purple-400' :
                                                          'bg-green-900/20 text-green-400'}`}>
                                                        {skill.category}
                                                    </span>
                                                </td>
                                                <td className="p-4 flex justify-end gap-2">
                                                    <button onClick={() => handleOpenEditSkill(skill)} className="p-2 rounded-md border border-gh-border text-gh-link hover:bg-gh-link/20 hover:border-gh-link"><Pencil size={16} /></button>
                                                    <button onClick={() => handleDeleteSkill(skill.name)} className="p-2 rounded-md border border-gh-border text-red-400 hover:bg-red-900/20 hover:border-red-900/50"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Project Upload Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#161b22] w-full max-w-lg rounded-lg border border-gh-border shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{t('newProject')}</h3>
                            <button onClick={() => setIsUploadOpen(false)}><X size={20} className="text-gh-secondary hover:text-white"/></button>
                        </div>
                        <form onSubmit={handleUploadProject} className="flex flex-col gap-4">
                            <input type="text" placeholder="Project Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0d1117] border border-gh-border rounded-md px-3 py-2 outline-none focus:border-gh-link" required />
                            <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-[#0d1117] border border-gh-border rounded-md px-3 py-2 outline-none focus:border-gh-link h-24" />
                            <div className="border-2 border-dashed border-gh-border rounded-md p-6 flex flex-col items-center justify-center text-gh-secondary hover:border-gh-link transition-colors relative">
                                <FileArchive size={32} className="mb-2"/>
                                <span className="text-sm">{file ? file.name : "Drag ZIP file"}</span>
                                <input type="file" accept=".zip" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFile(e.target.files?.[0] || null)} required />
                            </div>
                            <button type="submit" disabled={uploading} className="mt-2 bg-gh-green text-white py-2 rounded-md font-bold hover:bg-gh-greenHover disabled:opacity-50 flex justify-center items-center gap-2">
                                {uploading ? 'Processing...' : t('upload')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Article Modal */}
            {isArticleOpen && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#161b22] w-full max-w-2xl rounded-lg border border-gh-border shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{t('newArticle')}</h3>
                            <button onClick={() => setIsArticleOpen(false)}><X size={20} className="text-gh-secondary hover:text-white"/></button>
                        </div>
                        <form onSubmit={handleCreateArticle} className="flex flex-col gap-4">
                            <input 
                                type="text" 
                                placeholder={t('articleTitle')} 
                                value={artTitle} 
                                onChange={e => setArtTitle(e.target.value)} 
                                className="w-full bg-[#0d1117] border border-gh-border rounded-md px-3 py-2 outline-none focus:border-gh-link" 
                                required 
                            />
                            <textarea 
                                placeholder={t('articleContent')} 
                                value={artContent} 
                                onChange={e => setArtContent(e.target.value)} 
                                className="w-full bg-[#0d1117] border border-gh-border rounded-md px-3 py-2 outline-none focus:border-gh-link h-64 font-mono text-sm" 
                                required
                            />
                            <input 
                                type="text" 
                                placeholder="Tags (comma separated)" 
                                value={artTags} 
                                onChange={e => setArtTags(e.target.value)} 
                                className="w-full bg-[#0d1117] border border-gh-border rounded-md px-3 py-2 outline-none focus:border-gh-link" 
                            />
                            <button type="submit" disabled={artUploading} className="mt-2 bg-gh-green text-white py-2 rounded-md font-bold hover:bg-gh-greenHover disabled:opacity-50">
                                {artUploading ? 'Publishing...' : t('publish')}
                            </button>
                        </form>
                    </div>
                 </div>
            )}

            {/* Skill Modal (Add & Edit) */}
            {isSkillOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#161b22] w-full max-w-sm rounded-lg border border-gh-border shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{editingSkill ? t('editSkill') : t('newSkill')}</h3>
                            <button onClick={() => setIsSkillOpen(false)}><X size={20} className="text-gh-secondary hover:text-white"/></button>
                        </div>
                        <form onSubmit={handleSkillSubmit} className="flex flex-col gap-4">
                            <input 
                                type="text" 
                                placeholder={t('skillName')}
                                value={skillName} 
                                onChange={e => setSkillName(e.target.value)} 
                                className="w-full bg-[#0d1117] border border-gh-border rounded-md px-3 py-2 outline-none focus:border-gh-link" 
                                required 
                            />
                            <select 
                                value={skillCategory} 
                                onChange={e => setSkillCategory(e.target.value as Skill['category'])}
                                className="w-full bg-[#0d1117] border border-gh-border rounded-md px-3 py-2 outline-none focus:border-gh-link"
                            >
                                <option value="Language">Language</option>
                                <option value="DevOps">DevOps</option>
                                <option value="Cloud">Cloud</option>
                                <option value="AI">AI</option>
                                <option value="Methodology">Methodology</option>
                            </select>
                            <button type="submit" disabled={skillUploading} className="mt-2 bg-gh-green text-white py-2 rounded-md font-bold hover:bg-gh-greenHover disabled:opacity-50">
                                {skillUploading ? 'Saving...' : (editingSkill ? t('updateSkill') : t('addSkill'))}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
