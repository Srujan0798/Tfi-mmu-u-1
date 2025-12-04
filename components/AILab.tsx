
import React, { useState } from 'react';
import MediaAnalysis from './MediaAnalysis';
import { analyzeBoxOffice } from '../services/geminiService';
import { BoxOfficeAnalysis } from '../types';

const defaultForecast: BoxOfficeAnalysis = {
    movieName: "Example Blockbuster",
    predictedReleaseDate: "Sankranti 2025",
    openingDayEstimate: "₹145 Cr",
    lifetimeEstimate: "₹900 Cr+",
    confidence: 89,
    trendFactors: [
        { name: 'Director Track Record', val: 95, color: 'bg-green-500' },
        { name: 'Star Power (Tier 1)', val: 90, color: 'bg-green-500' },
        { name: 'Music Buzz (Viral)', val: 85, color: 'bg-blue-500' },
        { name: 'Release Clash', val: 30, color: 'bg-red-500' },
        { name: 'Overseas Pre-sales', val: 70, color: 'bg-yellow-500' },
    ],
    reasoning: "Based on historical data from 500+ TFI releases since 2010.",
    graphData: [30, 45, 35, 60, 80, 75, 90, 100, 85, 70]
};

const AILab: React.FC = () => {
    const [activeModule, setActiveModule] = useState<'VISION' | 'FORECAST' | 'GENERATE'>('VISION');
    const [analysisResult, setAnalysisResult] = useState<string>("");
    
    // Forecast State
    const [movieInput, setMovieInput] = useState('');
    const [forecastData, setForecastData] = useState<BoxOfficeAnalysis>(defaultForecast);
    const [loadingForecast, setLoadingForecast] = useState(false);

    const handleForecast = async () => {
        if (!movieInput.trim()) return;
        setLoadingForecast(true);
        const result = await analyzeBoxOffice(movieInput);
        if (result) {
            setForecastData(result);
        }
        setLoadingForecast(false);
    };

    return (
        <div className="h-full bg-slate-950 p-6 lg:p-8 overflow-y-auto text-slate-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="material-icons-round text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">science</span>
                        TFI AI Lab
                    </h1>
                    <p className="text-slate-500 text-sm">Experimental features powered by Gemini 1.5 Pro</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {['VISION', 'FORECAST', 'GENERATE'].map(m => (
                        <button
                            key={m}
                            onClick={() => setActiveModule(m as any)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                                activeModule === m 
                                ? 'bg-slate-800 text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            <span className="material-icons-round text-sm">
                                {m === 'VISION' ? 'visibility' : m === 'FORECAST' ? 'trending_up' : 'auto_awesome'}
                            </span>
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {activeModule === 'VISION' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                    <div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-white mb-2">Poster & Image Analysis</h3>
                            <p className="text-sm text-slate-400 mb-6">Upload a movie poster or a still. Our AI will identify the movie, cast, release date, and even analyze the sentiment/genre.</p>
                            <MediaAnalysis onResult={setAnalysisResult} />
                        </div>

                        {analysisResult && (
                            <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl">
                                    <span className="material-icons-round">analytics</span>
                                </div>
                                <h4 className="text-sm font-bold text-indigo-400 uppercase mb-2">Analysis Result</h4>
                                <div className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed relative z-10">
                                    {analysisResult}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-6">
                         <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                             <h3 className="font-bold text-white mb-4">Capabilities</h3>
                             <ul className="space-y-3">
                                 <li className="flex gap-3 text-sm text-slate-400">
                                     <span className="material-icons-round text-green-500 text-sm">check_circle</span>
                                     <span>Optical Character Recognition (OCR) for release dates</span>
                                 </li>
                                 <li className="flex gap-3 text-sm text-slate-400">
                                     <span className="material-icons-round text-green-500 text-sm">check_circle</span>
                                     <span>Actor identification using facial recognition</span>
                                 </li>
                                 <li className="flex gap-3 text-sm text-slate-400">
                                     <span className="material-icons-round text-green-500 text-sm">check_circle</span>
                                     <span>Genre classification from visual cues</span>
                                 </li>
                             </ul>
                         </div>
                    </div>
                </div>
            )}

            {activeModule === 'FORECAST' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6">Box Office Predictive Model</h3>
                            
                            {/* Input Form */}
                            <div className="flex gap-4 mb-6">
                                <div className="flex-grow relative">
                                    <input 
                                        type="text" 
                                        value={movieInput}
                                        onChange={(e) => setMovieInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleForecast()}
                                        placeholder="Enter Movie Name (e.g. SSMB29)"
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    {loadingForecast && (
                                        <div className="absolute right-3 top-3">
                                            <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin block"></span>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={handleForecast}
                                    disabled={loadingForecast || !movieInput.trim()}
                                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-blue-600/20"
                                >
                                    Predict
                                </button>
                            </div>

                            {/* Graph */}
                            <div className="relative h-64 w-full bg-slate-950 rounded-lg border border-slate-800 p-4 flex items-end justify-between gap-2">
                                {(forecastData.graphData || []).map((h, i) => (
                                    <div key={i} className="w-full bg-blue-500/20 rounded-t hover:bg-blue-500/40 transition-colors relative group">
                                        <div 
                                            className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t transition-all duration-500"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                            Day {i+1} Trend
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                                <span>Day 1</span>
                                <span>Projected 10-Day Run: {forecastData.movieName}</span>
                                <span>Day 10</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                                 <div className="text-xs text-slate-500 uppercase font-bold mb-1">Opening Day Est.</div>
                                 <div className="text-2xl font-bold text-green-500">{forecastData.openingDayEstimate}</div>
                                 <div className="text-[10px] text-slate-500 mt-1">Confidence: {forecastData.confidence}%</div>
                             </div>
                             <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                                 <div className="text-xs text-slate-500 uppercase font-bold mb-1">Lifetime Worldwide</div>
                                 <div className="text-2xl font-bold text-yellow-500">{forecastData.lifetimeEstimate}</div>
                                 <div className="text-[10px] text-slate-500 mt-1">Release: {forecastData.predictedReleaseDate}</div>
                             </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="font-bold text-white mb-4">Trend Factors</h3>
                        <div className="space-y-4">
                            {forecastData.trendFactors.map(f => (
                                <div key={f.name}>
                                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                                        <span>{f.name}</span>
                                        <span>{f.val}/100</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${f.color} transition-all duration-1000`} style={{ width: `${f.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 leading-relaxed">
                            <span className="font-bold text-slate-300 block mb-1">AI Reasoning:</span>
                            {forecastData.reasoning}
                        </div>
                    </div>
                </div>
            )}

            {activeModule === 'GENERATE' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Auto-Content Generator</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold block mb-2">Topic / Movie</label>
                                    <input type="text" placeholder="e.g. Game Changer Trailer Launch" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold block mb-2">Format</label>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 bg-blue-600 text-white rounded text-xs font-bold">Twitter Thread</button>
                                        <button className="flex-1 py-2 bg-slate-800 text-slate-400 rounded text-xs font-bold hover:bg-slate-700">Insta Caption</button>
                                        <button className="flex-1 py-2 bg-slate-800 text-slate-400 rounded text-xs font-bold hover:bg-slate-700">News Article</button>
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-bold text-white shadow-lg shadow-purple-500/20">
                                    Generate Content
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                        <h3 className="font-bold text-white mb-4">Preview Output</h3>
                        <div className="flex-grow bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 leading-relaxed">
                            <span className="text-slate-500">Waiting for input...</span>
                            <br/><br/>
                            {/* Simulation of output */}
                            <span className="opacity-50">
                                1/5 🧵 The wait is over! #GameChangerTrailer drops today at 5 PM. Here's why the hype is real. 🔥<br/><br/>
                                2/5 🎬 Shankar's vision + Ram Charan's swag = Mass Eruption guaranteed. The political thriller genre is Shankar's forte. <br/><br/>
                                3/5 🎵 Thaman has promised "Ramp" BGM. Will it beat the expectations? <br/><br/>
                                #RamCharan #Shankar #TFI
                            </span>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button className="flex-1 py-2 border border-slate-700 rounded text-xs font-bold text-slate-400 hover:text-white">Copy Text</button>
                            <button className="flex-1 py-2 border border-slate-700 rounded text-xs font-bold text-slate-400 hover:text-white">Share</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AILab;
