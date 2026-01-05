import React, { useState, useEffect, useRef } from 'react';
import { TERMINAL_SCENARIOS } from '../constants';
import { X, Maximize2, Minus } from 'lucide-react';
import { useLanguage } from '../language';

interface TerminalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TerminalOverlay: React.FC<TerminalOverlayProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Safely get current scenario
  const currentScenario = TERMINAL_SCENARIOS[scenarioIndex] || TERMINAL_SCENARIOS[0];

  useEffect(() => {
    if (isOpen) {
      setLogs([]);
      setIsTyping(true);
      let lineIndex = 0;
      
      const interval = setInterval(() => {
        if (currentScenario && currentScenario.logs && lineIndex < currentScenario.logs.length) {
          const nextLog = currentScenario.logs[lineIndex];
          // Ensure the log entry exists before adding it to state
          if (nextLog) {
             setLogs(prev => [...prev, nextLog]);
          }
          lineIndex++;
          if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 600); 

      return () => clearInterval(interval);
    }
  }, [isOpen, scenarioIndex, currentScenario]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();

    if (cmd === 'next') {
        if (scenarioIndex < TERMINAL_SCENARIOS.length - 1) {
            setScenarioIndex(prev => prev + 1);
        } else {
            setScenarioIndex(0); // Loop back
        }
        setInputVal('');
    } else if (cmd === 'exit') {
        onClose();
    } else {
        setLogs(prev => [...prev, `bash: ${inputVal}: command not found. Try 'next' or 'exit'.`]);
        setInputVal('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" dir="ltr">
      <div className="w-full h-full md:w-[90%] md:h-[90%] bg-[#0c0c0c] border border-[#33ff00] shadow-[0_0_20px_rgba(51,255,0,0.3)] font-mono flex flex-col rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#1a1a1a] px-4 py-2 flex items-center justify-between border-b border-[#33ff00]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" onClick={onClose}></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-xs text-gray-400">sadra@kali-linux:~/{currentScenario?.id}</span>
          </div>
          <div className="text-[#33ff00] text-xs font-bold tracking-widest">PARROT OS / KALI TERMINAL</div>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto text-[#33ff00] text-sm md:text-base leading-relaxed font-bold custom-terminal-scroll">
            <div className="mb-4 text-xs text-gray-500 opacity-50">
                Parrot OS 5.3 (Electro Ara) - Linux 6.1.0-parrot1-amd64
            </div>
            
            <div className="mb-4">
                <span className="text-blue-500">sadra@kali</span>:<span className="text-blue-300">~/projects</span>$ {currentScenario?.command}
            </div>

            {logs.map((log, idx) => {
                if (!log) return null; // Defensive check
                const isError = log.includes && log.includes('[!]');
                const isSuccess = log.includes && log.includes('[SUCCESS]');
                
                return (
                    <div key={idx} className={`${isError ? 'text-red-500' : isSuccess ? 'text-white' : ''} mb-1`}>
                        {log}
                    </div>
                );
            })}
            
            {/* Input Line */}
            {!isTyping && (
                <div className="mt-4 flex items-center">
                    <span className="text-blue-500">sadra@kali</span>:<span className="text-blue-300">~/projects</span>$ 
                    <form onSubmit={handleCommand} className="flex-1 ml-2">
                        <input 
                            type="text" 
                            className="bg-transparent border-none outline-none text-[#33ff00] w-full"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            autoFocus
                            placeholder="Type 'next' for next project..."
                        />
                    </form>
                </div>
            )}
            <div ref={bottomRef}></div>
        </div>

        {/* Footer Hint */}
        <div className="bg-[#0c0c0c] p-2 border-t border-[#33ff00]/30 text-xs text-gray-500 flex justify-between">
            <span>{t('status')}: {isTyping ? t('executing') : t('idle')}</span>
            <span className="cursor-pointer hover:text-[#33ff00]" onClick={() => setInputVal('next')}>{t('clickToContinue')}</span>
        </div>
      </div>
    </div>
  );
};