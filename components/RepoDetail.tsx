import React, { useEffect, useState } from 'react';
import { Repository, FileEntry } from '../types';
import { 
  Star, Eye, Code, BookOpen, Folder, FileCode, ChevronDown, History, Download, ArrowLeft, FileArchive
} from 'lucide-react';
import { USER_DATA, API_BASE_URL } from '../constants';
import { useLanguage } from '../language';
import { FileViewer } from './FileViewer';

interface RepoDetailProps {
  repo: Repository;
}

export const RepoDetail: React.FC<RepoDetailProps> = ({ repo }) => {
  const { t, lang } = useLanguage();
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  
  // Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState<{name: string, content: string}>({name: '', content: ''});

  // Social State
  const [starCount, setStarCount] = useState(repo.stars);
  const [watchCount, setWatchCount] = useState(repo.watchers || 0);
  const [isStarred, setIsStarred] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  // Mock data for hardcoded repos
  const mockFiles: FileEntry[] = [
    { name: '.github/workflows', type: 'folder', message: 'Update CI pipeline', time: '2 days ago' },
    { name: 'src', type: 'folder', message: 'Refactor core logic', time: '1 week ago' },
    { name: 'tests', type: 'folder', message: 'Add unit tests', time: '1 week ago' },
    { name: '.gitignore', type: 'file', message: 'Initial commit', time: '2 months ago' },
    { name: 'LICENSE', type: 'file', message: 'MIT License', time: '2 months ago' },
    { name: 'README.md', type: 'file', message: 'Update documentation', time: '3 days ago' },
    { name: `main.${repo.language === 'Python' ? 'py' : repo.language === 'Go' ? 'go' : 'rs'}`, type: 'file', message: 'Entry point', time: '5 days ago' },
  ];

  useEffect(() => {
    // Check local storage for social state
    if (repo.id) {
        const storedStar = localStorage.getItem(`repo_${repo.id}_star`);
        const storedWatch = localStorage.getItem(`repo_${repo.id}_watch`);
        if (storedStar === 'true') setIsStarred(true);
        if (storedWatch === 'true') setIsWatched(true);
        
        // Ensure counts are synced with prop initially
        setStarCount(repo.stars);
        setWatchCount(repo.watchers || 0);

        fetchFiles(currentPath);
        if (currentPath === '') fetchReadme();
    } else {
        // Fallback for static mock projects
        setFiles(mockFiles);
        setReadmeContent(`# ${repo.name}\n${repo.description}\n\nThis is a static representation of a repository.`);
    }
  }, [repo, currentPath]);

  const fetchFiles = async (path: string) => {
      setLoading(true);
      try {
          // Changed to PHP endpoint with query params
          const res = await fetch(`${API_BASE_URL}/files.php?id=${repo.id}&path=${encodeURIComponent(path)}`);
          if (res.ok) {
              const data = await res.json();
              if (data.success && Array.isArray(data.files)) {
                  setFiles(data.files);
              } else {
                  setFiles([]);
              }
          } else {
              setFiles([]);
          }
      } catch (e) {
          console.error(e);
          setFiles([]);
      } finally {
          setLoading(false);
      }
  };

  const fetchReadme = async () => {
      try {
           // Changed to PHP endpoint with query params
          const res = await fetch(`${API_BASE_URL}/files.php?id=${repo.id}&mode=readme`);
          const text = await res.text();
          if (text) setReadmeContent(text);
          else setReadmeContent(null);
      } catch (e) { console.error(e); }
  };

  const handleSocialAction = async (type: 'star' | 'watch') => {
      if (!repo.id || socialLoading) return;
      setSocialLoading(true);

      const isActionActive = type === 'star' ? isStarred : isWatched;
      const action = isActionActive ? 'dec' : 'inc';

      try {
           // Changed to PHP endpoint with query params
          const res = await fetch(`${API_BASE_URL}/social.php?id=${repo.id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type, action })
          });

          if (res.ok) {
              const data = await res.json();
              
              if (type === 'star') {
                  setStarCount(data.stars);
                  setIsStarred(!isStarred);
                  localStorage.setItem(`repo_${repo.id}_star`, (!isStarred).toString());
              } else {
                  setWatchCount(data.watchers);
                  setIsWatched(!isWatched);
                  localStorage.setItem(`repo_${repo.id}_watch`, (!isWatched).toString());
              }
          }
      } catch (e) {
          console.error("Social action failed", e);
      } finally {
          setSocialLoading(false);
      }
  };

  const handleFileClick = async (file: FileEntry) => {
      if (file.type === 'folder') {
          const newPath = currentPath ? `${currentPath}/${file.name}` : file.name;
          setCurrentPath(newPath);
      } else {
          // Open Viewer logic
          if (repo.id) {
              // Real Backend Project
              const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
              try {
                // Changed to PHP endpoint
                const res = await fetch(`${API_BASE_URL}/files.php?id=${repo.id}&path=${encodeURIComponent(filePath)}&mode=content`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setViewingFile({ name: file.name, content: data.content });
                        setIsViewerOpen(true);
                    } else {
                        alert("Could not load file content: " + data.message);
                    }
                }
              } catch(e) {
                  alert("Error loading file.");
              }
          } else {
              // Static Mock Project
              const mockContent = `// File: ${file.name}\n\n// This is a simulation of the code editor viewer.\n// Since this is a static project, there is no real backend content.\n\nfunction helloWorld() {\n  console.log("Hello from ${repo.name}!");\n}\n\nexport default helloWorld;`;
              setViewingFile({ name: file.name, content: mockContent });
              setIsViewerOpen(true);
          }
      }
  };

  const handleBack = () => {
      if (!currentPath) return;
      const parts = currentPath.split('/');
      parts.pop();
      setCurrentPath(parts.join('/'));
  };

  const handleDownloadZip = () => {
      if (repo.downloadUrl) {
           // Construct download URL if relative
           let url = repo.downloadUrl;
           if (!url.startsWith('http')) {
               url = `${API_BASE_URL}/${url.replace('my_back/', '')}`;
           }
          window.open(url, '_blank');
      } else {
          alert("ZIP download not available for this project.");
      }
      setShowDownloadMenu(false);
  };

  const safeFiles = Array.isArray(files) ? files : [];

  return (
    <div className="w-full text-gh-text animate-fade-in">
      <FileViewer 
         isOpen={isViewerOpen} 
         onClose={() => setIsViewerOpen(false)} 
         fileName={viewingFile.name} 
         content={viewingFile.content} 
      />

      {/* Repo Header */}
      <div className="bg-[#0d1117] border-b border-gh-border pt-4 pb-0 mb-6 px-4 md:px-0 transition-all">
        <div className="container mx-auto max-w-[1280px] flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 text-lg md:text-xl text-gh-link break-all" dir="ltr">
                    <BookOpen size={18} className="text-gh-secondary" />
                    <span className="text-gh-link hover:underline cursor-pointer">{USER_DATA.username}</span>
                    <span className="text-gh-text">/</span>
                    <span className="font-bold hover:underline cursor-pointer">{repo.name}</span>
                    <span className="text-xs border border-gh-border rounded-full px-2 py-0.5 text-gh-secondary ms-2 font-normal text-gh-text">{t('public')}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm overflow-x-auto">
                    <button 
                        onClick={() => handleSocialAction('watch')}
                        className={`flex items-center gap-1 px-3 py-1 border rounded-md transition-colors whitespace-nowrap ${isWatched ? 'bg-[#21262d] border-gh-border text-gh-text' : 'bg-[#21262d] border-gh-border hover:bg-[#30363d]'}`}
                    >
                        <Eye size={16} className={`${isWatched ? 'text-gh-link' : 'text-gh-secondary'}`} />
                        <span>{isWatched ? t('unwatch') : t('watch')}</span>
                        <span className="bg-[#30363d] px-1.5 rounded-full text-xs ms-1">{watchCount}</span>
                    </button>
                    
                    <button 
                        onClick={() => handleSocialAction('star')}
                        className={`flex items-center gap-1 px-3 py-1 border rounded-md transition-colors whitespace-nowrap ${isStarred ? 'bg-[#21262d] border-gh-border text-gh-text' : 'bg-[#21262d] border-gh-border hover:bg-[#30363d]'}`}
                    >
                        <Star size={16} className={`${isStarred ? 'text-yellow-500 fill-yellow-500' : 'text-yellow-500'}`} />
                        <span>{isStarred ? t('unstar') : t('star')}</span>
                        <span className="bg-[#30363d] px-1.5 rounded-full text-xs ms-1">{starCount}</span>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1 overflow-x-auto hide-scrollbar">
                <button className="flex items-center gap-2 px-4 py-3 border-b-2 border-[#f78166] text-gh-text font-semibold whitespace-nowrap text-sm">
                    <Code size={16} /> {t('code')}
                </button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-[1280px] px-4 md:px-6 flex flex-col md:flex-row gap-8">
        <div className="flex-1 min-w-0">
            {/* Branch / Code Button */}
            <div className="flex justify-between items-center mb-4">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#21262d] border border-gh-border rounded-md text-sm font-semibold hover:bg-[#30363d]">
                    <div className="rotate-90">
                        <div className="rotate-[-90]">
                           <FileCode size={14} className="text-gh-secondary" />
                        </div>
                    </div>
                    <span>main</span>
                    <ChevronDown size={14} />
                </button>
                
                <div className="relative">
                    <button 
                        onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gh-green text-white border border-[rgba(240,246,252,0.1)] rounded-md text-sm font-semibold hover:bg-gh-greenHover"
                    >
                        <Download size={16} />
                        <span>{t('code')}</span>
                        <ChevronDown size={14} />
                    </button>
                    {showDownloadMenu && (
                        <div className={`absolute top-full mt-1 ${lang === 'fa' ? 'left-0' : 'right-0'} bg-[#161b22] border border-gh-border rounded-md shadow-xl z-50 w-48 overflow-hidden`}>
                            <div className="p-2 border-b border-gh-border text-xs font-bold text-gh-text">
                                {t('download')}
                            </div>
                            <button 
                                onClick={handleDownloadZip}
                                className="w-full text-left px-4 py-2 text-sm text-gh-text hover:bg-[#30363d] flex items-center gap-2"
                            >
                                <FileArchive size={16} />
                                {t('downloadZip')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* File Browser */}
            <div className="border border-gh-border rounded-md bg-gh-bg overflow-hidden mb-6">
                <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-gh-border text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                         {currentPath !== '' && (
                             <button onClick={handleBack} className={`hover:bg-[#30363d] p-1 rounded ${lang === 'fa' ? 'ml-2' : 'mr-2'}`}>
                                 <ArrowLeft size={16} className="text-gh-link" />
                             </button>
                         )}
                        <img src={USER_DATA.avatarUrl} className="w-5 h-5 rounded-full shrink-0" alt="avatar" />
                        <span className="font-bold shrink-0">{USER_DATA.username}</span>
                        <span className="text-gh-secondary truncate mx-1 text-xs">
                             {currentPath ? `/${currentPath}` : 'Initial commit'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gh-secondary text-xs md:text-sm shrink-0">
                        <History size={14} />
                        <span className="hidden sm:inline">Latest commit</span>
                    </div>
                </div>
                
                {loading ? (
                    <div className="p-4 text-center text-gh-secondary text-sm">Loading files...</div>
                ) : (
                    <div className="flex flex-col">
                        {currentPath !== '' && (
                            <div 
                                onClick={handleBack}
                                className="flex items-center px-4 py-2 border-b border-gh-border hover:bg-[#161b22] transition-colors text-sm cursor-pointer text-gh-link font-bold"
                            >
                                ..
                            </div>
                        )}
                        {safeFiles.map((file, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleFileClick(file)}
                                className="flex items-center justify-between px-4 py-2 border-b border-gh-border last:border-0 hover:bg-[#161b22] transition-colors text-sm group cursor-pointer"
                            >
                                <div className="flex items-center gap-3 w-1/3 min-w-0">
                                    {file.type === 'folder' ? (
                                        <Folder size={16} className="text-[#54aeff] fill-[#54aeff] shrink-0" />
                                    ) : (
                                        <FileCode size={16} className="text-gh-secondary shrink-0" />
                                    )}
                                    <span className="text-gh-text group-hover:text-gh-link group-hover:underline truncate" dir="ltr">{file.name}</span>
                                </div>
                                <div className="flex-1 text-gh-secondary text-xs md:text-sm truncate px-2 hidden sm:block">
                                    {file.message || 'Updated recently'}
                                </div>
                                <div className="text-gh-secondary text-xs md:text-sm w-24 text-right shrink-0">
                                    {file.time}
                                </div>
                            </div>
                        ))}
                        {safeFiles.length === 0 && (
                            <div className="p-4 text-center text-gh-secondary text-sm">Empty directory</div>
                        )}
                    </div>
                )}
            </div>

            {/* README */}
            {readmeContent && (
                <div className="border border-gh-border rounded-md bg-gh-bg">
                    <div className="px-4 py-2 border-b border-gh-border flex items-center gap-2 text-sm font-semibold sticky top-0 bg-gh-bg rounded-t-md">
                    <div className="p-1 hover:bg-[#30363d] rounded cursor-pointer">
                        <BookOpen size={16} />
                    </div>
                    {t('readme')}
                    </div>
                    <div className="p-8 prose prose-invert max-w-none break-words whitespace-pre-wrap font-sans" dir="ltr">
                        {readmeContent}
                    </div>
                </div>
            )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 flex flex-col gap-6 text-sm">
            <div className="border-b border-gh-border pb-4">
                <h3 className="font-semibold mb-2">{t('about')}</h3>
                <p className="text-gh-secondary mb-4">{repo.description}</p>
                
                <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2">
                         <BookOpen size={16} className="text-gh-secondary" />
                         <span>Readme</span>
                     </div>
                     <div className="flex items-center gap-2">
                         <Star size={16} className="text-gh-secondary" />
                         <span>{starCount} stars</span>
                     </div>
                     <div className="flex items-center gap-2">
                         <Eye size={16} className="text-gh-secondary" />
                         <span>{watchCount} watching</span>
                     </div>
                </div>
            </div>

            <div className="border-b border-gh-border pb-4">
                 <h3 className="font-semibold mb-2">{t('releases')}</h3>
                 <div className="flex items-center gap-2">
                     <div className="text-gh-link">v1.0.0</div>
                     <div className="text-xs bg-gh-green text-white px-2 rounded-full border border-[rgba(240,246,252,0.1)]">{t('latest')}</div>
                 </div>
                 <div className="text-xs text-gh-secondary mt-1">{repo.updatedAt}</div>
            </div>

            <div>
                 <h3 className="font-semibold mb-2">{t('language')}</h3>
                 <div className="flex h-2 rounded-full overflow-hidden mb-2">
                     <div style={{ width: '100%', backgroundColor: repo.languageColor }}></div>
                 </div>
                 <div className="flex gap-4 text-xs">
                     <div className="flex items-center gap-1">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.languageColor }}></div>
                         <span className="font-semibold">{repo.language}</span> 100.0%
                     </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};
