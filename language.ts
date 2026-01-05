import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'en' | 'fa';

export const dictionary = {
  en: {
    // Navbar
    contact: 'Contact',
    articles: 'Articles',
    explore: 'Explore',
    searchPlaceholder: 'Type / to search',
    searchPlaceholderMobile: 'Search GitHub',
    
    // Tabs
    overview: 'Overview',
    repositories: 'Repositories',
    skills: 'Skills',
    stars: 'Stars',
    
    // Sidebar
    follow: 'Follow',
    sponsor: 'Sponsor this developer',
    aboutMe: 'About Me',
    aboutTitle: 'My Story',
    achievements: 'Achievements',
    topSkills: 'Top Skills',
    age: 'Age',
    
    // Follow Dialog
    followOn: 'Follow on...',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    
    // Repo List
    findRepo: 'Find a repository...',
    type: 'Type',
    language: 'Language',
    sort: 'Sort',
    downloadCV: 'Download CV',
    public: 'Public',
    star: 'Star',
    unstar: 'Unstar',
    watch: 'Watch',
    unwatch: 'Unwatch',
    updated: 'Updated',
    
    // Home
    pinned: 'Pinned',
    customizePins: 'Customize your pins',
    contributionActivity: 'Contribution activity',
    contributionsLastYear: 'contributions in the last year',
    contributionSettings: 'Contribution settings',
    less: 'Less',
    more: 'More',
    hi: "Hi there 👋, I'm",
    techStack: 'Tech Stack',
    
    // Footer
    copyright: 'Sadra Cheraghi Portfolio.',
    
    // Dialogs
    contactMe: 'Contact Me',
    supportWork: 'Support My Work',
    donateTron: 'Donate via Tron (TRX)',
    donateMsg: 'Your support helps me keep building open source tools.',
    
    // Repo Detail
    fork: 'Fork',
    code: 'Code',
    download: 'Download',
    downloadZip: 'Download ZIP',
    issues: 'Issues',
    pullRequests: 'Pull requests',
    actions: 'Actions',
    security: 'Security',
    readme: 'README.md',
    about: 'About',
    releases: 'Releases',
    latest: 'Latest',
    other: 'Other',
    back: 'Back',
    close: 'Close',
    
    // Skills
    toolsAndTech: 'Tools & Technologies',
    skillsSubtitle: 'A list of languages, tools, and methodologies I work with.',
    
    // Admin
    adminDashboard: 'Admin Dashboard',
    uploadAvatar: 'Update Profile Picture',
    newProject: 'New Project',
    newArticle: 'New Article',
    newSkill: 'New Skill',
    editSkill: 'Edit Skill',
    manageSkills: 'Manage Skills',
    manageProjects: 'Manage Projects',
    manageArticles: 'Manage Articles',
    projects: 'Projects',
    skillName: 'Skill Name',
    category: 'Category',
    addSkill: 'Add Skill',
    updateSkill: 'Update Skill',
    upload: 'Upload',
    publish: 'Publish',
    articleTitle: 'Article Title',
    articleContent: 'Content (Markdown Supported)',
    noArticles: 'No articles published yet.',

    // Terminal
    status: 'Status',
    executing: 'Executing',
    idle: 'Idle',
    clickToContinue: 'Click to continue...',

    // Explore
    exploreTitle: 'Explore the Ecosystem',
    exploreSubtitle: 'Discover trending repositories, developers, and security topics.',
    trendingRepos: 'Trending Repositories',
    trendingDevs: 'Trending Developers',
    popularTopics: 'Popular Topics',
    subscribe: 'Subscribe to Newsletter',
    subscribeMsg: 'Get the latest security research and tools delivered to your inbox.',
    subscribeBtn: 'Subscribe',
  },
  fa: {
    // Navbar
    contact: 'تماس با من',
    articles: 'مقالات',
    explore: 'کاوش',
    searchPlaceholder: 'برای جستجو / را بزنید',
    searchPlaceholderMobile: 'جستجو در گیت‌هاب',
    
    // Tabs
    overview: 'نگاه کلی',
    repositories: 'مخازن (Repositories)',
    skills: 'مهارت‌ها',
    stars: 'ستاره‌ها',
    
    // Sidebar
    follow: 'دنبال کردن',
    sponsor: 'حمایت مالی',
    aboutMe: 'درباره من',
    aboutTitle: 'داستان من',
    achievements: 'دستاوردها',
    topSkills: 'مهارت‌های اصلی',
    age: 'سن',
    
    // Follow Dialog
    followOn: 'دنبال کردن در...',
    github: 'گیت‌هاب',
    linkedin: 'لینکدین',
    
    // Repo List
    findRepo: 'جستجوی مخزن...',
    type: 'نوع',
    language: 'زبان',
    sort: 'مرتب‌سازی',
    downloadCV: 'دانلود رزومه',
    public: 'عمومی',
    star: 'ستاره',
    unstar: 'برداشتن ستاره',
    watch: 'دنبال کردن',
    unwatch: 'لغو دنبال کردن',
    updated: 'بروزرسانی شده',
    
    // Home
    pinned: 'پین شده',
    customizePins: 'مدیریت پین‌ها',
    contributionActivity: 'فعالیت‌های اخیر',
    contributionsLastYear: 'مشارکت در سال گذشته',
    contributionSettings: 'تنظیمات نمودار',
    less: 'کمتر',
    more: 'بیشتر',
    hi: "سلام 👋، من",
    techStack: 'تکنولوژی‌ها',
    
    // Footer
    copyright: 'پورتفولیوی صدرا چراغی.',
    
    // Dialogs
    contactMe: 'راه های ارتباطی',
    supportWork: 'حمایت از کار من',
    donateTron: 'دونیت با ترون (TRX)',
    donateMsg: 'حمایت شما به من کمک می‌کند تا ابزارهای متن‌باز بیشتری بسازم.',
    
    // Repo Detail
    fork: 'انشعاب (Fork)',
    code: 'کدها',
    download: 'دانلود',
    downloadZip: 'دانلود فایل زیپ',
    issues: 'مشکلات',
    pullRequests: 'درخواست‌های ادغام',
    actions: 'عملیات',
    security: 'امنیت',
    readme: 'توضیحات (README)',
    about: 'درباره پروژه',
    releases: 'نسخه‌ها',
    latest: 'آخرین نسخه',
    other: 'سایر',
    back: 'بازگشت',
    close: 'بستن',

    // Skills
    toolsAndTech: 'ابزارها و تکنولوژی‌ها',
    skillsSubtitle: 'لیستی از زبان‌ها، ابزارها و متدولوژی‌هایی که با آن‌ها کار می‌کنم.',

    // Admin
    adminDashboard: 'داشبورد مدیریت',
    uploadAvatar: 'تغییر عکس پروفایل',
    newProject: 'پروژه جدید',
    newArticle: 'مقاله جدید',
    newSkill: 'مهارت جدید',
    editSkill: 'ویرایش مهارت',
    manageSkills: 'مدیریت مهارت‌ها',
    manageProjects: 'مدیریت پروژه‌ها',
    manageArticles: 'مدیریت مقالات',
    projects: 'پروژه‌ها',
    skillName: 'نام مهارت',
    category: 'دسته‌بندی',
    addSkill: 'افزودن مهارت',
    updateSkill: 'بروزرسانی مهارت',
    upload: 'آپلود',
    publish: 'انتشار',
    articleTitle: 'عنوان مقاله',
    articleContent: 'محتوا (مارک‌داون پشتیبانی می‌شود)',
    noArticles: 'هنوز مقاله‌ای منتشر نشده است.',

    // Terminal
    status: 'وضعیت',
    executing: 'در حال اجرا',
    idle: 'آماده',
    clickToContinue: 'برای ادامه کلیک کنید...',

    // Explore
    exploreTitle: 'کاوش در اکوسیستم',
    exploreSubtitle: 'مخازن، توسعه‌دهندگان و موضوعات امنیتی داغ را کشف کنید.',
    trendingRepos: 'مخازن پرطرفدار',
    trendingDevs: 'توسعه‌دهندگان برتر',
    popularTopics: 'موضوعات محبوب',
    subscribe: 'عضویت در خبرنامه',
    subscribeMsg: 'آخرین تحقیقات امنیتی و ابزارها را در ایمیل خود دریافت کنید.',
    subscribeBtn: 'عضویت',
  }
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof dictionary.en) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('en');

  const t = (key: keyof typeof dictionary.en) => {
    return dictionary[lang][key] || dictionary['en'][key];
  };

  const dir = lang === 'fa' ? 'rtl' : 'ltr';

  return React.createElement(LanguageContext.Provider, { value: { lang, setLang, t, dir } }, children);
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};