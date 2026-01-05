const express = require('express');
const path = require('path');
const multer = require('multer');
const AdmZip = require('adm-zip');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'projects.db.json');
const ARTICLES_FILE = path.join(__dirname, 'articles.db.json');
const SKILLS_FILE = path.join(__dirname, 'skills.db.json');
const PROFILE_FILE = path.join(__dirname, 'profile.json');
const UPLOAD_DIR = path.join(__dirname, 'dist', 'uploads'); 
const DOWNLOAD_DIR = path.join(__dirname, 'dist', 'downloads');
const PUBLIC_IMG_DIR = path.join(__dirname, 'dist', 'images');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Ensure directories exist
[UPLOAD_DIR, DOWNLOAD_DIR, PUBLIC_IMG_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'avatar') {
            cb(null, PUBLIC_IMG_DIR);
        } else {
            cb(null, UPLOAD_DIR); // Temp for zip extraction
        }
    },
    filename: (req, file, cb) => {
        if (file.fieldname === 'avatar') {
            cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
        } else {
            cb(null, Date.now() + '-' + file.originalname);
        }
    }
});
const upload = multer({ storage: storage });

// Initial Data Seeds
const INITIAL_SKILLS = [
  { name: 'Python', category: 'Language' },
  { name: 'Rust', category: 'Language' },
  { name: 'Go', category: 'Language' },
  { name: 'Java', category: 'Language' },
  { name: 'JavaScript', category: 'Language' },
  { name: 'Linux', category: 'DevOps' },
  { name: 'AWS', category: 'Cloud' },
  { name: 'Cloud Computing', category: 'Cloud' },
  { name: 'AI & MLOps', category: 'AI' },
  { name: 'QA', category: 'DevOps' },
  { name: 'Sprint Methodology', category: 'Methodology' },
];

// Helpers
const getProjects = () => {
    if (!fs.existsSync(DB_FILE)) return [];
    try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { return []; }
};
const saveProjects = (projects) => fs.writeFileSync(DB_FILE, JSON.stringify(projects, null, 2));

const getArticles = () => {
    if (!fs.existsSync(ARTICLES_FILE)) return [];
    try { return JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8')); } catch { return []; }
};
const saveArticles = (articles) => fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2));

const getSkills = () => {
    if (!fs.existsSync(SKILLS_FILE)) {
        // If file doesn't exist, create it with initial data
        fs.writeFileSync(SKILLS_FILE, JSON.stringify(INITIAL_SKILLS, null, 2));
        return INITIAL_SKILLS;
    }
    try { return JSON.parse(fs.readFileSync(SKILLS_FILE, 'utf8')); } catch { return []; }
};
const saveSkills = (skills) => fs.writeFileSync(SKILLS_FILE, JSON.stringify(skills, null, 2));

const getProfile = () => {
    if (!fs.existsSync(PROFILE_FILE)) {
        return { avatarUrl: './avatar.jpg' }; // Default
    }
    try { return JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf8')); } catch { return { avatarUrl: './avatar.jpg' }; }
};
const saveProfile = (data) => fs.writeFileSync(PROFILE_FILE, JSON.stringify(data, null, 2));

const detectLanguage = (folderPath) => {
    let detectedLang = 'Other';
    const entries = fs.readdirSync(folderPath, { recursive: true });
    for (const file of entries) {
        if (file.endsWith('.py')) return 'Python';
        if (file.endsWith('.js') || file.endsWith('.jsx')) return 'JavaScript';
        if (file.endsWith('.ts') || file.endsWith('.tsx')) return 'TypeScript';
        if (file.endsWith('.go')) return 'Go';
        if (file.endsWith('.rs')) return 'Rust';
        if (file.endsWith('.java')) return 'Java';
        if (file.endsWith('.php')) return 'PHP';
        if (file.endsWith('.rb')) return 'Ruby';
        if (file.endsWith('.html')) return 'HTML';
        if (file.endsWith('.css')) return 'CSS';
    }
    return detectedLang;
};

// --- API ROUTES ---

// Login
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === 'admin123') res.json({ success: true, token: 'fake-jwt-token' });
    else res.status(401).json({ success: false });
});

// Profile API
app.get('/api/profile', (req, res) => {
    res.json(getProfile());
});

app.post('/api/profile/avatar', upload.single('avatar'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
        
        const avatarUrl = `/images/${req.file.filename}`;
        const profile = getProfile();
        profile.avatarUrl = avatarUrl;
        saveProfile(profile);
        
        res.json({ success: true, avatarUrl });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// Skills API
app.get('/api/skills', (req, res) => {
    res.json(getSkills());
});

app.post('/api/skills', (req, res) => {
    try {
        const { name, category } = req.body;
        if (!name || !category) return res.status(400).json({ success: false });
        
        const skills = getSkills();
        // Avoid duplicates
        if (!skills.find(s => s.name.toLowerCase() === name.toLowerCase())) {
            skills.push({ name, category });
            saveSkills(skills);
        }
        res.json({ success: true, skills });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

app.put('/api/skills/:originalName', (req, res) => {
    try {
        const { originalName } = req.params;
        const { name, category } = req.body;
        
        let skills = getSkills();
        const index = skills.findIndex(s => s.name === originalName);
        
        if (index !== -1) {
            skills[index] = { name: name || skills[index].name, category: category || skills[index].category };
            saveSkills(skills);
            res.json({ success: true, skills });
        } else {
            res.status(404).json({ success: false, message: 'Skill not found' });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

app.delete('/api/skills/:name', (req, res) => {
    try {
        const { name } = req.params;
        let skills = getSkills();
        skills = skills.filter(s => s.name !== name);
        saveSkills(skills);
        res.json({ success: true, skills });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// Articles API
app.get('/api/articles', (req, res) => {
    res.json(getArticles());
});

app.post('/api/articles', (req, res) => {
    try {
        const { title, content, summary, tags } = req.body;
        const newArticle = {
            id: Date.now().toString(),
            title,
            content,
            summary: summary || content.substring(0, 150) + '...',
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            date: new Date().toISOString().split('T')[0],
            views: 0
        };
        const articles = getArticles();
        articles.unshift(newArticle);
        saveArticles(articles);
        res.json({ success: true, article: newArticle });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

app.delete('/api/articles/:id', (req, res) => {
    const { id } = req.params;
    let articles = getArticles();
    articles = articles.filter(a => a.id !== id);
    saveArticles(articles);
    res.json({ success: true });
});

// Projects API
app.get('/api/projects', (req, res) => {
    res.json(getProjects());
});

app.get('/api/projects/:id/files', (req, res) => {
    const { id } = req.params;
    const { path: queryPath } = req.query;
    const project = getProjects().find(p => p.id === id);
    if (!project || !project.path) return res.status(404).json({ success: false });

    const baseDir = path.join(__dirname, 'dist', project.path); 
    const safeQueryPath = (queryPath || '').toString().replace(/\.\./g, '');
    const currentDir = path.join(baseDir, safeQueryPath);

    if (!fs.existsSync(currentDir)) return res.status(404).json({ success: false });

    try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        const files = entries.map(entry => {
            const stats = fs.statSync(path.join(currentDir, entry.name));
            return {
                name: entry.name,
                type: entry.isDirectory() ? 'folder' : 'file',
                size: stats.size,
                time: 'Just now' 
            };
        });
        files.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1));
        res.json({ success: true, files });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.get('/api/projects/:id/file-content', (req, res) => {
    const { id } = req.params;
    const { path: queryPath } = req.query;
    const project = getProjects().find(p => p.id === id);
    if (!project || !project.path) return res.status(404).json({ success: false, message: 'Project not found' });

    const baseDir = path.join(__dirname, 'dist', project.path);
    const safeQueryPath = (queryPath || '').toString().replace(/\.\./g, '');
    const filePath = path.join(baseDir, safeQueryPath);

    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'File not found' });

    try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) return res.status(400).json({ success: false, message: 'Is a directory' });
        
        // Basic check to avoid reading binary files as text
        const ext = path.extname(filePath).toLowerCase();
        const binaryExts = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip', '.exe'];
        
        if (binaryExts.includes(ext)) {
             return res.json({ success: true, content: '[Binary File] Cannot display content.', isBinary: true });
        }

        const content = fs.readFileSync(filePath, 'utf8');
        res.json({ success: true, content, isBinary: false });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

app.get('/api/projects/:id/readme', (req, res) => {
    const { id } = req.params;
    const project = getProjects().find(p => p.id === id);
    if (!project || !project.path) return res.status(404).send('');
    
    const baseDir = path.join(__dirname, 'dist', project.path);
    try {
        const files = fs.readdirSync(baseDir);
        const readme = files.find(f => f.toLowerCase() === 'readme.md');
        if (readme) res.send(fs.readFileSync(path.join(baseDir, readme), 'utf8'));
        else res.send('');
    } catch { res.send(''); }
});

app.post('/api/projects/:id/social', (req, res) => {
    const { id } = req.params;
    const { type, action } = req.body; // type: 'star'|'watch', action: 'inc'|'dec'
    const projects = getProjects();
    const project = projects.find(p => p.id === id);
    
    if (project) {
        if (type === 'star') {
            project.stars = (project.stars || 0) + (action === 'inc' ? 1 : -1);
            if (project.stars < 0) project.stars = 0;
        } else if (type === 'watch') {
            project.watchers = (project.watchers || 0) + (action === 'inc' ? 1 : -1);
            if (project.watchers < 0) project.watchers = 0;
        }
        saveProjects(projects);
        res.json({ success: true, stars: project.stars, watchers: project.watchers });
    } else {
        res.status(404).json({ success: false });
    }
});

app.post('/api/projects', upload.single('file'), (req, res) => {
    try {
        const { name, description } = req.body;
        const file = req.file;
        let language = 'Unknown';
        let projectPath = '';
        let downloadPath = '';

        if (file && file.mimetype.includes('zip')) {
            const folderName = name.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now();
            const extractPath = path.join(UPLOAD_DIR, folderName);
            
            // Unzip
            const zip = new AdmZip(file.path);
            zip.extractAllTo(extractPath, true);
            
            // Move zip to downloads folder instead of deleting
            const zipName = `${folderName}.zip`;
            const destZipPath = path.join(DOWNLOAD_DIR, zipName);
            fs.renameSync(file.path, destZipPath);
            
            language = detectLanguage(extractPath);
            projectPath = `/uploads/${folderName}`;
            downloadPath = `/downloads/${zipName}`;
        }

        const newProject = {
            id: Date.now().toString(),
            name,
            description,
            language,
            languageColor: getLanguageColor(language),
            stars: 0,
            forks: 0,
            watchers: 0, // Init watchers
            updatedAt: 'Just now',
            isPinned: false,
            path: projectPath,
            downloadUrl: downloadPath
        };

        const projects = getProjects();
        projects.unshift(newProject);
        saveProjects(projects);

        res.json({ success: true, project: newProject });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.patch('/api/projects/:id/pin', (req, res) => {
    const projects = getProjects();
    const idx = projects.findIndex(p => p.id === req.params.id);
    if (idx !== -1) {
        projects[idx].isPinned = !projects[idx].isPinned;
        saveProjects(projects);
        res.json({ success: true });
    } else res.status(404).json({ success: false });
});

app.delete('/api/projects/:id', (req, res) => {
    let projects = getProjects();
    projects = projects.filter(p => p.id !== req.params.id);
    saveProjects(projects);
    res.json({ success: true });
});

function getLanguageColor(lang) {
    const colors = {
        'Python': '#3572A5', 'Rust': '#dea584', 'Go': '#00ADD8',
        'Java': '#b07219', 'PHP': '#4F5D95', 'Ruby': '#701516',
        'JavaScript': '#f1e05a', 'TypeScript': '#2b7489',
        'HTML': '#e34c26', 'CSS': '#563d7c'
    };
    return colors[lang] || '#8b949e';
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});