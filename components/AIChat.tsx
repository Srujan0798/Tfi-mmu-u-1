import React, { useState, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage, TFIEvent, UserPreferences } from '../types';
import { startChatSession, sendMessageToGemini } from '../services/geminiService';

interface AIChatProps {
  onEventProposed: (event: TFIEvent) => void;
  userPreferences: UserPreferences | null;
}

const AIChat: React.FC<AIChatProps> = ({ onEventProposed, userPreferences }) => {
  const [session, setSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Init chat session with preferences
    if (userPreferences) {
        const chat = startChatSession(userPreferences);
        setSession(chat);
        
        // Initial Greeting Personalized
        const heroGreeting = userPreferences.favoriteHeroes.length > 0 
            ? `I see you're a big fan of ${userPreferences.favoriteHeroes[0]}! mass!` 
            : "";
            
        setMessages([{
            id: 'init',
            role: 'model',
            text: `Namaskaram Boss! TFI Thammudu here. ${heroGreeting} What's the plan? Release dates, gossip, or analyzing a poster? Cheppu!`,
            timestamp: new Date()
        }]);
    }
  }, [userPreferences]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !session) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(session, userMsg.text);
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: new Date(),
        suggestedEvents: response.events
      };

      setMessages(prev => [...prev, modelMsg]);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700">
      <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
        <h3 className="text-yellow-400 font-bold flex items-center gap-2">
          <span className="material-icons-round">smart_toy</span>
          Thammudu AI
        </h3>
        <span className="text-xs text-slate-400 px-2 py-1 bg-slate-700 rounded-full">gemini-2.5-flash</span>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-slate-700 text-slate-200 rounded-bl-none border border-slate-600'
              }`}
            >
              {/* Basic formatting for markdown-style bold */}
              <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>') }}></p>
            </div>
            
            {/* Suggested Events from AI */}
            {msg.suggestedEvents && msg.suggestedEvents.length > 0 && (
                <div className="mt-2 space-y-2 w-[85%]">
                    {msg.suggestedEvents.map(evt => (
                        <div key={evt.id} className="bg-slate-800 border border-yellow-500/50 rounded-lg p-3 flex justify-between items-center shadow-lg">
                            <div>
                                <div className="text-yellow-400 font-bold text-xs">{evt.title}</div>
                                <div className="text-slate-400 text-xs">{new Date(evt.date).toDateString()}</div>
                            </div>
                            <button 
                                onClick={() => onEventProposed(evt)}
                                className="bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                            >
                                <span className="material-icons-round text-sm">event</span>
                                Add
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            <span className="text-[10px] text-slate-500 mt-1">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        
        {isLoading && (
           <div className="flex items-start">
             <div className="bg-slate-700 rounded-2xl rounded-bl-none p-3 flex gap-1 items-center">
               <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-75"></span>
               <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-150"></span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-slate-800 border-t border-slate-700">
        <div className="flex items-center gap-2 bg-slate-900 rounded-full px-4 py-2 border border-slate-700 focus-within:border-yellow-500 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about releases, reviews..."
            className="bg-transparent flex-grow text-slate-200 text-sm focus:outline-none placeholder-slate-500"
          />
          <button 
            onClick={handleSend}
            className="text-yellow-500 hover:text-yellow-400 disabled:opacity-50"
            disabled={!input.trim() || isLoading}
          >
            <span className="material-icons-round">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;