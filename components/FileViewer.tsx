import React from 'react';
import { X, Lock, FileCode } from 'lucide-react';
import { useLanguage } from '../language';

interface FileViewerProps {
    isOpen: boolean;
    onClose: () => void;
    fileName: string;
    content: string;
}

export const FileViewer: React.FC<FileViewerProps> = ({ isOpen, onClose, fileName, content }) => {
    const { t, lang } = useLanguage();

    if (!isOpen) return null;

    // Generate line numbers
    const lines = content.split('\n');
    const lineNumbers = Array.from({ length: lines.length }, (_, i) => i + 1);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-4xl h-[80vh] bg-[#1e1e1e] border border-[#333] rounded-lg shadow-2xl flex flex-col overflow-hidden font-mono">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#1e1e1e] text-[#cccccc]">
                    <div className="flex items-center gap-2">
                        <FileCode size={16} className="text-[#519aba]" />
                        <span className="text-sm font-medium">{fileName}</span>
                        <div className="flex items-center gap-1 text-[10px] bg-[#3c3c3c] px-2 py-0.5 rounded-sm text-gray-300">
                            <Lock size={10} />
                            READ-ONLY
                        </div>
                    </div>
                    <button onClick={onClose} className="hover:bg-[#333] p-1 rounded-md transition-colors">
                        <X size={18} className="text-[#cccccc]" />
                    </button>
                </div>

                {/* Editor Body */}
                <div className="flex-1 overflow-auto flex text-sm">
                    {/* Line Numbers */}
                    <div className="bg-[#1e1e1e] text-[#858585] px-3 py-2 text-right select-none border-r border-[#333] min-w-[3rem]">
                        {lineNumbers.map(num => (
                            <div key={num} className="leading-6">{num}</div>
                        ))}
                    </div>
                    
                    {/* Code Content */}
                    <div className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] px-4 py-2 whitespace-pre overflow-x-auto">
                        {/* Using standard pre/code for performance, pretending highlighters */}
                        <code>
                            {lines.map((line, i) => (
                                <div key={i} className="leading-6 min-h-[1.5rem]">{line || ' '}</div>
                            ))}
                        </code>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-[#007acc] text-white px-3 py-1 text-xs flex justify-between items-center">
                    <div className="flex gap-4">
                        <span>Ln {lines.length}, Col 1</span>
                        <span>UTF-8</span>
                    </div>
                    <div>
                        {lang === 'fa' ? 'نمایشگر کد' : 'Code Viewer Mode'}
                    </div>
                </div>
            </div>
        </div>
    );
};