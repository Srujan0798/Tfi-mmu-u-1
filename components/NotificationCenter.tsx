
import React, { useState } from 'react';
import { Notification } from '../types';

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: '1', title: 'Game Changer Release Date', message: 'Official announcement expected today at 6 PM!', type: 'ALERT', timestamp: new Date(Date.now() - 1000 * 60 * 30), isRead: false },
    { id: '2', title: 'Tickets Opened', message: 'Bookings for Devara are now open in Hyderabad.', type: 'REMINDER', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isRead: false },
    { id: '3', title: 'New Follower', message: '@mb_fan_club started following your calendar.', type: 'SOCIAL', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isRead: true },
    { id: '4', title: 'System Update', message: 'TFI Timeline v2.0 is live with Dark Mode enhancements.', type: 'SYSTEM', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), isRead: true },
];

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

    const displayed = filter === 'ALL' ? notifications : notifications.filter(n => !n.isRead);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getIcon = (type: Notification['type']) => {
        switch(type) {
            case 'ALERT': return 'local_fire_department';
            case 'REMINDER': return 'alarm';
            case 'SOCIAL': return 'group';
            case 'SYSTEM': return 'dns';
            default: return 'notifications';
        }
    };

    const getColor = (type: Notification['type']) => {
        switch(type) {
            case 'ALERT': return 'text-red-500 bg-red-500/10';
            case 'REMINDER': return 'text-yellow-500 bg-yellow-500/10';
            case 'SOCIAL': return 'text-blue-500 bg-blue-500/10';
            case 'SYSTEM': return 'text-slate-400 bg-slate-700/30';
            default: return 'text-slate-400';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-800 shadow-2xl z-40 transform transition-transform animate-fade-in flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <h2 className="font-bold text-white flex items-center gap-2">
                    <span className="material-icons-round text-yellow-500">notifications</span>
                    Inbox
                </h2>
                <div className="flex gap-2">
                    <button onClick={markAllRead} className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase" title="Mark all read">
                        Read All
                    </button>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <span className="material-icons-round">close</span>
                    </button>
                </div>
            </div>

            <div className="flex p-2 gap-2 border-b border-slate-800 bg-slate-900/50">
                <button 
                    onClick={() => setFilter('ALL')} 
                    className={`flex-1 py-1 text-xs font-bold rounded ${filter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilter('UNREAD')} 
                    className={`flex-1 py-1 text-xs font-bold rounded ${filter === 'UNREAD' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Unread
                </button>
            </div>

            <div className="flex-grow overflow-y-auto p-2 space-y-2">
                {displayed.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <span className="material-icons-round text-4xl mb-2 opacity-50">notifications_off</span>
                        <p className="text-sm">No notifications.</p>
                    </div>
                ) : (
                    displayed.map(n => (
                        <div key={n.id} className={`p-3 rounded-lg border relative group transition-colors ${n.isRead ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-blue-500/30'}`}>
                            <div className="flex gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getColor(n.type)}`}>
                                    <span className="material-icons-round text-base">{getIcon(n.type)}</span>
                                </div>
                                <div>
                                    <h4 className={`text-sm font-bold leading-tight ${n.isRead ? 'text-slate-300' : 'text-white'}`}>{n.title}</h4>
                                    <p className="text-xs text-slate-400 mt-1 leading-snug">{n.message}</p>
                                    <div className="text-[10px] text-slate-600 mt-2 font-mono">
                                        {n.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>
                            {!n.isRead && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500"></div>}
                            <button 
                                onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-500 transition-opacity"
                            >
                                <span className="material-icons-round text-sm">delete</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;
