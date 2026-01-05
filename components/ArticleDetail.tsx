import React from 'react';
import { Article } from '../types';
import { BookOpen, Calendar, Tag, ArrowLeft, Eye } from 'lucide-react';
import { useLanguage } from '../language';
import { USER_DATA } from '../constants';

interface ArticleDetailProps {
    article: Article;
    onBack: () => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
    const { t, lang } = useLanguage();

    return (
        <div className="w-full text-gh-text animate-fade-in">
             {/* Header */}
             <div className="bg-[#0d1117] border-b border-gh-border pt-4 pb-0 mb-6 px-4 md:px-0">
                <div className="container mx-auto max-w-[900px]">
                    <div className="flex items-center gap-2 mb-4 text-sm text-gh-secondary">
                        <button onClick={onBack} className="hover:text-gh-link flex items-center gap-1">
                            <ArrowLeft size={16} /> {t('back')}
                        </button>
                        <span>/</span>
                        <span className="truncate max-w-[200px]">{article.title}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gh-text mb-4 leading-tight">
                        {article.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gh-secondary mb-6">
                        <div className="flex items-center gap-2">
                             <img src={USER_DATA.avatarUrl} className="w-5 h-5 rounded-full" />
                             <span>{USER_DATA.username}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={14} /> {article.date}
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye size={14} /> {article.views} views
                        </div>
                    </div>
                </div>
             </div>

             {/* Content */}
             <div className="container mx-auto max-w-[900px] px-4 md:px-6">
                <article className="prose prose-invert prose-lg max-w-none pb-12 whitespace-pre-wrap font-sans leading-relaxed">
                    {article.content}
                </article>

                {article.tags.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gh-border">
                        <h3 className="text-sm font-bold text-gh-secondary mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag, i) => (
                                <span key={i} className="flex items-center gap-1 px-3 py-1 bg-[#161b22] border border-gh-border rounded-full text-xs text-gh-link">
                                    <Tag size={12} /> {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
             </div>
        </div>
    );
};