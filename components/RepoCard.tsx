import React from 'react';
import { Star, GitFork } from 'lucide-react';
import { Repository } from '../types';
import { useLanguage } from '../language';

interface RepoCardProps {
  repo: Repository;
  fullWidth?: boolean;
  onClick?: (repo: Repository) => void;
}

export const RepoCard: React.FC<RepoCardProps> = ({ repo, fullWidth = false, onClick }) => {
  const { t } = useLanguage();

  return (
    <div className={`flex flex-col justify-between border border-gh-border rounded-md p-4 bg-gh-bg ${fullWidth ? 'w-full' : ''} mb-4`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
           <button 
             onClick={() => onClick && onClick(repo)}
             className="font-semibold text-gh-link text-lg hover:underline truncate text-left"
           >
            {repo.name}
          </button>
          <span className="text-xs border border-gh-border rounded-full px-2 py-0.5 text-gh-secondary">
             {t('public')}
          </span>
        </div>
        <p className="text-sm text-gh-secondary line-clamp-2 min-h-[40px]">
          {repo.description}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-gh-secondary">
        <div className="flex items-center gap-1">
          <span 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: repo.languageColor }}
          ></span>
          <span>{repo.language}</span>
        </div>

        {repo.stars > 0 && (
          <div className="flex items-center gap-1 hover:text-gh-link cursor-pointer">
            <Star size={14} />
            <span>{repo.stars}</span>
          </div>
        )}

        {repo.forks > 0 && (
          <div className="flex items-center gap-1 hover:text-gh-link cursor-pointer">
            <GitFork size={14} />
            <span>{repo.forks}</span>
          </div>
        )}

        <span>{repo.updatedAt}</span>
      </div>
    </div>
  );
};