
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

interface MediaAnalysisProps {
    onResult: (text: string) => void;
}

const MediaAnalysis: React.FC<MediaAnalysisProps> = ({ onResult }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        onResult("Analyzing media with Gemini Pro...");

        try {
            // Convert to Base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Data = reader.result as string;
                const base64Content = base64Data.split(',')[1];

                // Safe Key Access
                const apiKey = (typeof process !== "undefined" && process.env) ? process.env.API_KEY : "";
                const ai = new GoogleGenAI({ apiKey });
                
                let model = 'gemini-3-pro-preview'; // Default for images
                let prompt = "Analyze this image related to Telugu Film Industry. Identify the movie, actor, or event.";
                
                // Enhanced prompt for Phase 5 Advanced AI Features (OCR + Tagging)
                prompt += " If there is text on the poster (like release dates), perform OCR and extract it. Also generate tags for Genre and Sentiment.";

                if (file.type.startsWith('audio/')) {
                    model = 'gemini-2.5-flash'; // Flash for audio usually sufficient and faster
                    prompt = "Transcribe this audio and identify the song or dialogue context if it's from a Telugu movie.";
                }

                const response = await ai.models.generateContent({
                    model: model,
                    contents: {
                        parts: [
                            {
                                inlineData: {
                                    mimeType: file.type,
                                    data: base64Content
                                }
                            },
                            { text: prompt }
                        ]
                    }
                });

                onResult(response.text || "No analysis returned.");
                setIsAnalyzing(false);
            };
            reader.readAsDataURL(file);

        } catch (error) {
            console.error(error);
            onResult("Error analyzing media.");
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 mt-4">
            <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                <span className="material-icons-round text-purple-400">add_a_photo</span>
                AI Media Scanner
            </h4>
            <div className="flex gap-4">
                <label className="flex-1 cursor-pointer bg-slate-700 hover:bg-slate-600 transition-colors rounded-lg border border-dashed border-slate-500 p-4 flex flex-col items-center justify-center text-slate-400">
                    <span className="material-icons-round text-2xl mb-1">image</span>
                    <span className="text-xs">Upload Poster/Still</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <label className="flex-1 cursor-pointer bg-slate-700 hover:bg-slate-600 transition-colors rounded-lg border border-dashed border-slate-500 p-4 flex flex-col items-center justify-center text-slate-400">
                    <span className="material-icons-round text-2xl mb-1">mic</span>
                    <span className="text-xs">Upload Audio Clip</span>
                    <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                </label>
            </div>
            {isAnalyzing && <div className="text-xs text-yellow-500 mt-2 animate-pulse">Processing media...</div>}
        </div>
    );
};

export default MediaAnalysis;
