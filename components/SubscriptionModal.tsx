
import React from 'react';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const plans = [
        { name: 'Fan (Free)', price: '₹0', features: ['Basic Calendar', '3 Creator Syncs', 'Limited AI Chat', 'Ad-supported'], active: true },
        { name: 'TFI Gold', price: '₹99/mo', features: ['Ad-free Experience', 'Unlimited Syncs', 'AI Predictions (Oracle)', 'Early Access Tickets', 'Custom Themes'], recommended: true },
        { name: 'Creator Pro', price: '₹499/mo', features: ['Verified Badge', 'Event Analytics', 'Monetization Tools', 'Priority Support', 'Bulk Management'] }
    ];

    return (
        <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden flex flex-col md:flex-row shadow-2xl">
                
                <div className="md:w-1/3 bg-gradient-to-br from-yellow-600 to-orange-700 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">Upgrade to<br/>TFI Gold</h2>
                        <p className="opacity-90 text-sm">Experience Tollywood like a true insider.</p>
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="material-icons-round bg-white/20 p-1 rounded-full">block</span>
                            <span className="font-medium text-sm">No Ads</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-icons-round bg-white/20 p-1 rounded-full">psychology</span>
                            <span className="font-medium text-sm">Advanced AI</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-icons-round bg-white/20 p-1 rounded-full">confirmation_number</span>
                            <span className="font-medium text-sm">Priority Booking</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 text-9xl text-white/10 material-icons-round">star</div>
                </div>

                <div className="md:w-2/3 p-8 bg-slate-950">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Choose Plan</h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-white"><span className="material-icons-round">close</span></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {plans.map((plan, i) => (
                            <div key={i} className={`border rounded-xl p-4 flex flex-col ${plan.recommended ? 'border-yellow-500 bg-yellow-900/10' : 'border-slate-800 bg-slate-900'} ${plan.active ? 'opacity-70' : ''}`}>
                                {plan.recommended && <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mb-2">Best Value</div>}
                                <h4 className="font-bold text-white text-lg">{plan.name}</h4>
                                <div className="text-2xl font-bold text-slate-200 my-2">{plan.price}</div>
                                <ul className="space-y-2 mb-6 flex-grow">
                                    {plan.features.map(f => (
                                        <li key={f} className="text-xs text-slate-400 flex items-start gap-2">
                                            <span className="material-icons-round text-[10px] text-green-500 mt-0.5">check</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-2 rounded-lg text-xs font-bold ${plan.active ? 'bg-slate-800 text-slate-500 cursor-default' : plan.recommended ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                                    {plan.active ? 'Current Plan' : 'Select'}
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <p className="text-center text-[10px] text-slate-500 mt-6">Secure payment powered by Stripe. Cancel anytime.</p>
                </div>

            </div>
        </div>
    );
};

export default SubscriptionModal;
