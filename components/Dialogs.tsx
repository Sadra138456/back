import React from 'react';
import { X, Phone, MessageCircle, Send, Copy, Github, Linkedin, User } from 'lucide-react';
import { useLanguage } from '../language';
import { USER_DATA } from '../constants';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#161b22] border border-gh-border rounded-lg w-full max-w-md shadow-2xl transform transition-all scale-100">
        <div className="flex justify-between items-center p-4 border-b border-gh-border">
          <h3 className="font-semibold text-gh-text text-lg">{title}</h3>
          <button onClick={onClose} className="text-gh-secondary hover:text-gh-text">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
            {children}
        </div>
      </div>
    </div>
  );
};

export const ContactDialog: React.FC<{isOpen: boolean, onClose: () => void}> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={t('contactMe')}>
            <div className="flex flex-col gap-4">
                <a href="tel:+989123456789" className="flex items-center gap-3 p-3 rounded-md bg-[#0d1117] border border-gh-border hover:border-gh-link transition-colors group">
                    <div className="bg-green-600 p-2 rounded-full text-white">
                        <Phone size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-gh-secondary">Phone</span>
                        <span className="text-gh-text font-mono group-hover:text-gh-link">+98 912 345 6789</span>
                    </div>
                </a>
                
                <a href="https://wa.me/989123456789" target="_blank" className="flex items-center gap-3 p-3 rounded-md bg-[#0d1117] border border-gh-border hover:border-gh-link transition-colors group">
                    <div className="bg-[#25D366] p-2 rounded-full text-white">
                        <MessageCircle size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-gh-secondary">WhatsApp</span>
                        <span className="text-gh-text font-medium group-hover:text-gh-link">Chat on WhatsApp</span>
                    </div>
                </a>

                <a href="https://t.me/sadra_dev" target="_blank" className="flex items-center gap-3 p-3 rounded-md bg-[#0d1117] border border-gh-border hover:border-gh-link transition-colors group">
                    <div className="bg-[#0088cc] p-2 rounded-full text-white">
                        <Send size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-gh-secondary">Telegram</span>
                        <span className="text-gh-text font-medium group-hover:text-gh-link">@sadra_dev</span>
                    </div>
                </a>
            </div>
        </Dialog>
    );
}

export const DonateDialog: React.FC<{isOpen: boolean, onClose: () => void}> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const trxAddress = "TN3W4H6r5t8e9R1i0n2G3o4d5e6v7S8e9c"; // Fake TRX address for demo

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={t('supportWork')}>
            <div className="flex flex-col items-center gap-6 text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    <span className="font-bold text-xl">TRX</span>
                </div>
                <div>
                    <p className="text-gh-text mb-2">{t('donateTron')}</p>
                    <p className="text-xs text-gh-secondary">{t('donateMsg')}</p>
                </div>
                
                <div className="w-full bg-[#0d1117] border border-gh-border p-3 rounded-md flex items-center justify-between gap-2">
                    <code className="text-xs text-gh-link break-all font-mono">{trxAddress}</code>
                    <button 
                        className="text-gh-secondary hover:text-white"
                        onClick={() => navigator.clipboard.writeText(trxAddress)}
                        title="Copy Address"
                    >
                        <Copy size={16} />
                    </button>
                </div>

                <div className="w-32 h-32 bg-white p-2 rounded-md">
                    {/* Placeholder for QR Code */}
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${trxAddress}`} alt="TRX QR" className="w-full h-full" />
                </div>
            </div>
        </Dialog>
    );
}

export const AboutDialog: React.FC<{isOpen: boolean, onClose: () => void}> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t('aboutTitle')}>
      <div className="flex flex-col gap-4 text-center items-center">
         <div className="w-24 h-24 rounded-full border-2 border-gh-link overflow-hidden mb-2">
             <img src={USER_DATA.avatarUrl} alt="Sadra" className="w-full h-full object-cover" />
         </div>
         
         <div className="prose prose-invert text-sm leading-relaxed text-gh-text">
            <p className="font-medium text-lg">
              {t('hi')} {USER_DATA.firstName}!
            </p>
            <p className="text-gh-secondary">
               {USER_DATA.bio}
            </p>
            <div className="mt-4 p-3 bg-[#0d1117] border border-gh-border rounded-md italic text-gh-secondary">
               "Security is not a product, but a process."
            </div>
         </div>
      </div>
    </Dialog>
  );
};

export const FollowDialog: React.FC<{isOpen: boolean, onClose: () => void}> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t('followOn')}>
      <div className="grid grid-cols-2 gap-4">
        <a 
          href={USER_DATA.socials.github || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-2 p-6 bg-[#0d1117] border border-gh-border rounded-lg hover:border-gh-link hover:bg-[#21262d] transition-all"
        >
          <Github size={32} className="text-white" />
          <span className="font-semibold text-gh-text">{t('github')}</span>
        </a>
        
        <a 
          href={USER_DATA.socials.linkedin || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-2 p-6 bg-[#0d1117] border border-gh-border rounded-lg hover:border-[#0a66c2] hover:bg-[#21262d] transition-all"
        >
          <Linkedin size={32} className="text-[#0a66c2]" />
          <span className="font-semibold text-gh-text">{t('linkedin')}</span>
        </a>
      </div>
    </Dialog>
  );
};