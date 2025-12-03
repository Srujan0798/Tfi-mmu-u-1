
import React, { useState } from 'react';
import { TFIEvent } from '../types';

interface TicketingModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: TFIEvent | null;
}

const TicketingModal: React.FC<TicketingModalProps> = ({ isOpen, onClose, event }) => {
    const [step, setStep] = useState(1);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    
    if (!isOpen || !event) return null;

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const cols = [1,2,3,4,5,6,7,8,9,10,11,12];

    const toggleSeat = (seatId: string) => {
        if (selectedSeats.includes(seatId)) setSelectedSeats(prev => prev.filter(s => s !== seatId));
        else setSelectedSeats(prev => [...prev, seatId]);
    };

    const handleBooking = () => {
        alert(`Booking Confirmed for ${selectedSeats.join(', ')}! (Simulation)`);
        onClose();
        setStep(1);
        setSelectedSeats([]);
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden flex flex-col h-[80vh]">
                
                {/* Header */}
                <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-white font-bold">{event.title}</h2>
                        <p className="text-xs text-slate-400">Prasads Multiplex • {new Date(event.date).toDateString()} • 7:00 PM</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><span className="material-icons-round">close</span></button>
                </div>

                <div className="flex-grow flex flex-col p-6 overflow-hidden">
                    {step === 1 && (
                        <div className="flex flex-col h-full">
                            <div className="text-center mb-6">
                                <div className="h-2 w-full max-w-md mx-auto bg-slate-700 rounded-t-full mb-2"></div>
                                <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Screen this way</div>
                            </div>
                            
                            <div className="flex-grow overflow-y-auto flex justify-center items-center">
                                <div className="grid gap-2">
                                    {rows.map(row => (
                                        <div key={row} className="flex gap-2 items-center">
                                            <span className="text-xs text-slate-500 w-4 font-bold">{row}</span>
                                            {cols.map(col => {
                                                const seatId = `${row}${col}`;
                                                const isSelected = selectedSeats.includes(seatId);
                                                const isOccupied = Math.random() > 0.8;
                                                return (
                                                    <button
                                                        key={seatId}
                                                        disabled={isOccupied}
                                                        onClick={() => toggleSeat(seatId)}
                                                        className={`w-6 h-6 rounded-t-lg text-[8px] flex items-center justify-center transition-colors ${
                                                            isOccupied ? 'bg-slate-800 text-slate-600 cursor-not-allowed' :
                                                            isSelected ? 'bg-green-500 text-white' :
                                                            'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600'
                                                        }`}
                                                    >
                                                        {col}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-center gap-6 mt-6 text-xs text-slate-400">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-700 rounded"></div> Available</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-800 rounded"></div> Booked</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded"></div> Selected</div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col h-full justify-center max-w-sm mx-auto w-full space-y-4">
                            <h3 className="text-xl font-bold text-white mb-2">Order Summary</h3>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
                                <div className="flex justify-between text-sm text-slate-300">
                                    <span>Tickets ({selectedSeats.length})</span>
                                    <span>{selectedSeats.join(', ')}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-300">
                                    <span>Price per ticket</span>
                                    <span>₹295.00</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-300">
                                    <span>Convenience Fee</span>
                                    <span>₹35.40</span>
                                </div>
                                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-white text-lg">
                                    <span>Total</span>
                                    <span>₹{(selectedSeats.length * 295) + 35.40}</span>
                                </div>
                            </div>

                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Payment Method</h4>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-slate-700 rounded text-xs font-bold text-white border border-blue-500">UPI</button>
                                    <button className="flex-1 py-2 bg-slate-900 rounded text-xs font-bold text-slate-400 border border-slate-700">Card</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-800/50 flex justify-between items-center">
                    <div className="text-sm">
                        {step === 1 && <span className="text-slate-400">{selectedSeats.length} Seats selected</span>}
                        {step === 2 && <span className="text-green-400 font-bold">Secure Payment</span>}
                    </div>
                    {step === 1 ? (
                        <button 
                            disabled={selectedSeats.length === 0}
                            onClick={() => setStep(2)}
                            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold transition-colors"
                        >
                            Proceed
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white px-4 py-2 text-sm font-bold">Back</button>
                            <button onClick={handleBooking} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-green-600/20">
                                Pay Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketingModal;
