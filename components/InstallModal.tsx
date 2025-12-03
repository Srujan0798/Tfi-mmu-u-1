
import React from 'react';

interface InstallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><span className="material-icons-round">close</span></button>
                </div>
                
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                        <span className="material-icons-round text-slate-900 text-3xl">install_mobile</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Install TFI Timeline</h2>
                    <p className="text-slate-400 text-sm mt-2">Get the best experience on your device.</p>
                </div>

                <div className="space-y-3">
                    <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-xl flex items-center gap-4 transition-all group">
                        <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <span className="material-icons-round">desktop_windows</span>
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-white">Desktop App</div>
                            <div className="text-xs text-slate-500">Windows, macOS, Linux (Electron)</div>
                        </div>
                        <span className="material-icons-round text-slate-600 ml-auto">download</span>
                    </button>

                    <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-xl flex items-center gap-4 transition-all group">
                        <div className="w-10 h-10 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                            <span className="material-icons-round">touch_app</span>
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-white">Install PWA</div>
                            <div className="text-xs text-slate-500">Add to Home Screen (Mobile/Web)</div>
                        </div>
                        <span className="material-icons-round text-slate-600 ml-auto">add_circle_outline</span>
                    </button>
                </div>

                <p className="text-center text-[10px] text-slate-600 mt-6">
                    Version 2.4.0 • Build 8492 • Phase 5 Release
                </p>
            </div>
        </div>
    );
};

export default InstallModal;
