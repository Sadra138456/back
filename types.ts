
export interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  birthday: string;
  nationality: string;
  location: string;
  occupation: string;
  avatarUrl: string;
  bio: string;
  email: string;
  website: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface Skill {
  name: string;
  category: 'Language' | 'DevOps' | 'Cloud' | 'AI' | 'Methodology';
}

export interface Repository {
  id?: string; // Added for DB
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  watchers?: number; // Added for Watch logic
  updatedAt: string;
  tags: string[];
  isPrivate?: boolean;
  isPinned?: boolean; // Added for pinning
  path?: string; // Path to source files
  downloadUrl?: string; // Path to zip file
}

export interface Article {
  id: string;
  title: string;
  content: string; // Markdown or simple text
  summary: string;
  tags: string[];
  date: string;
  views: number;
}

export interface FileEntry {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  time: string;
  message?: string;
}

export enum TabView {
  OVERVIEW = 'Overview',
  REPOSITORIES = 'Repositories',
  SKILLS = 'Skills',
  ARTICLES = 'Articles',
}