import { UserProfile, Repository, Skill } from './types';

// Removed the trailing slash to ensure valid path concatenation (e.g., .../my_back/login.php)
export const API_BASE_URL = 'https://sadracheraghi.ir/my_back';

export const USER_DATA: UserProfile = {
  firstName: 'Sadra',
  lastName: 'Cheraghi',
  username: 'sadra-cheraghi',
  birthday: '2005-02-17',
  nationality: 'Iran',
  location: 'Tehran, Iran',
  occupation: 'DevSecOps Engineer | DEV',
  avatarUrl: './avatar.jpg', // Please ensure you name your image file 'avatar.jpg' and place it in the public folder
  bio: 'DevSecOps engineer & Developer. Passionate about Cloud Computing, AI/MLOps, and securing infrastructure. Transforming coffee into Rust & Go code.',
  email: 'sadra.dev@example.com',
  website: 'https://sadra.dev',
  socials: {
    github: 'https://github.com/sadra-cheraghi',
    linkedin: 'https://linkedin.com/in/sadra-cheraghi'
  }
};

export const SKILLS: Skill[] = [
  { name: 'Python', category: 'Language' },
  { name: 'Rust', category: 'Language' },
  { name: 'Go', category: 'Language' },
  { name: 'Java', category: 'Language' },
  { name: 'PHP', category: 'Language' },
  { name: 'Ruby', category: 'Language' },
  { name: 'JavaScript', category: 'Language' },
  { name: 'Linux', category: 'DevOps' },
  { name: 'AWS', category: 'Cloud' },
  { name: 'Cloud Computing', category: 'Cloud' },
  { name: 'AI & MLOps', category: 'AI' },
  { name: 'QA', category: 'DevOps' },
  { name: 'Sprint Methodology', category: 'Methodology' },
];

// Data is now fetched from PHP backend, so we start with an empty list
export const REPOSITORIES: Repository[] = [];

export const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  PHP: '#4F5D95',
  Ruby: '#701516',
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  HTML: '#e34c26',
  CSS: '#563d7c',
};

export const TERMINAL_SCENARIOS = [
  {
    id: 'portfolio-init',
    command: 'npm run dev',
    logs: [
      '[SUCCESS] Initializing React environment...',
      '[INFO] Loading components...',
      '[INFO] Fetching user data...',
      '[SUCCESS] Portfolio ready at localhost:3000',
    ]
  },
  {
    id: 'security-scan',
    command: './scan_vulnerabilities.sh',
    logs: [
      '[INFO] Starting vulnerability scan...',
      '[INFO] Checking for XSS vulnerabilities... [SAFE]',
      '[INFO] Checking for SQL Injection... [SAFE]',
      '[SUCCESS] System is secure.',
    ]
  }
];
