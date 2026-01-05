import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { API_BASE_URL } from '../constants';

interface AdminLoginProps {
    onLogin: (token: string) => void;
    onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            
            if (data.success) {
                onLogin(data.token);
            } else {
                setError('Access Denied');
            }
        } catch (err) {
            setError('Server connection failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-sm p-8 bg-[#161b22] border border-gh-border rounded-lg shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-[#21262d] rounded-full border border-gh-border">
                        <Lock size={24} className="text-gh-text" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-center text-gh-text mb-6">System Access</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter encryption key..."
                        className="bg-[#0d1117] border border-gh-border rounded-md px-3 py-2 text-gh-text focus:border-gh-link outline-none"
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                    
                    <div className="flex gap-2 mt-2">
                        <button 
                            type="button" 
                            onClick={onCancel}
                            className="flex-1 py-2 rounded-md bg-transparent border border-gh-border text-gh-text hover:bg-[#21262d]"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 py-2 rounded-md bg-gh-green text-white font-semibold hover:bg-gh-greenHover disabled:opacity-50"
                        >
                            {loading ? 'Authenticating...' : 'Unlock'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};