import React, { useState } from 'react';
import { UserPreferences } from '../types';

interface OnboardingProps {
  onComplete: (prefs: UserPreferences) => void;
}

const HEROES = ['Prabhas', 'Mahesh Babu', 'Pawan Kalyan', 'Allu Arjun', 'NTR', 'Ram Charan', 'Vijay Deverakonda', 'Nani'];
const INTERESTS = ['Box Office', 'Music/BGM', 'Direction', 'Rumors', 'Vintage Classics', 'Technical Aspects'];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedHeroes, setSelectedHeroes] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFinish = () => {
    onComplete({
      favoriteHeroes: selectedHeroes,
      interests: selectedInterests,
      hasCompletedOnboarding: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-slate-200 p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Panel - Visual */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-yellow-500 to-red-600 p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">Tfi <br/>తmmuḍu</h1>
            <p className="text-slate-900/80 font-medium mt-2">Your Personal TFI Digital Brain</p>
          </div>
          <div className="relative z-10">
             <div className="flex gap-1 mb-2">
                <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-slate-900' : 'bg-slate-900/30'}`}></div>
                <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-slate-900' : 'bg-slate-900/30'}`}></div>
                <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-slate-900' : 'bg-slate-900/30'}`}></div>
             </div>
             <p className="text-slate-900 font-bold text-sm">Step {step} of 3</p>
          </div>
        </div>

        {/* Right Panel - Content */}
        <div className="w-full md:w-2/3 p-8 flex flex-col">
          
          {step === 1 && (
            <div className="flex-grow flex flex-col justify-center animate-fade-in">
              <h2 className="text-2xl font-bold mb-4">Namaskaram! 🙏</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Welcome to the ultimate timeline for Telugu Cinema. 
                Before we start, I need to know a bit about your taste to customize your 
                calendar and AI assistant.
              </p>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                    <span className="material-icons-round text-yellow-500">auto_awesome</span>
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-200">Meet "Thammudu"</h4>
                    <p className="text-xs text-slate-500">I speak TFI slang and track every update.</p>
                 </div>
              </div>
              <button onClick={() => setStep(2)} className="bg-slate-100 text-slate-900 hover:bg-white font-bold py-3 px-6 rounded-lg self-start transition-colors">
                Let's Go
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex-grow flex flex-col animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">Who are your favorites?</h2>
              <p className="text-slate-400 text-sm mb-6">Select the stars you follow closely.</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6 overflow-y-auto max-h-60">
                {HEROES.map(hero => (
                   <button 
                      key={hero}
                      onClick={() => toggleSelection(hero, selectedHeroes, setSelectedHeroes)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          selectedHeroes.includes(hero) 
                          ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                   >
                      <span className="font-semibold">{hero}</span>
                      {selectedHeroes.includes(hero) && <span className="material-icons-round text-sm">check_circle</span>}
                   </button>
                ))}
              </div>

              <div className="mt-auto flex justify-between">
                <button onClick={() => setStep(1)} className="text-slate-500 font-semibold">Back</button>
                <button 
                    onClick={() => setStep(3)} 
                    className="bg-slate-100 text-slate-900 hover:bg-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                    Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-grow flex flex-col animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">What interests you?</h2>
              <p className="text-slate-400 text-sm mb-6">Customize your feed and AI personality.</p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                 {INTERESTS.map(interest => (
                    <button 
                      key={interest}
                      onClick={() => toggleSelection(interest, selectedInterests, setSelectedInterests)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                          selectedInterests.includes(interest)
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                        {interest}
                    </button>
                 ))}
              </div>

              <div className="mt-auto flex justify-between items-center">
                <button onClick={() => setStep(2)} className="text-slate-500 font-semibold">Back</button>
                <button 
                    onClick={handleFinish} 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-900 font-bold py-3 px-8 rounded-lg shadow-lg shadow-orange-500/20 transition-all transform hover:scale-105"
                >
                    Get Started
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Onboarding;