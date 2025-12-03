
import React, { useState, useRef, useEffect } from 'react';
import { ChatSession } from '@google/genai';
import { ChatMessage, TFIEvent, UserPreferences, QuizQuestion } from '../types';
import { startChatSession, sendMessageToGemini, generateTrivia, generatePrediction } from '../services/geminiService';

interface FloatingChatProps {
  onEventProposed: (event: TFIEvent) => void;
  userPreferences: UserPreferences | null;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ onEventProposed, userPreferences }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  // Quiz State locally to handle interactions
  const [selectedQuizOption, setSelectedQuizOption] = useState<{[key: string]: number}>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userPreferences && !session) {
        const chat = startChatSession(userPreferences);
        setSession(chat);
        setMessages([{
            id: 'init',
            role: 'model',
            text: `Namaskaram! 🙏 **Chaitanya** here. 🤖\nI'm connected to the live web 🌐. Ask me about *Salaar 2*, *Game Changer*, or check the latest hashtags! 🔥`,
            timestamp: new Date()
        }]);
    }
  }, [userPreferences, session]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !session) return;

    if (!isOpen) setIsOpen(true);
    setShowQuickActions(false);

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
      // Keep focus on input after send
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleQuickAction = async (action: 'trivia' | 'prediction' | 'recommend') => {
      setIsOpen(true);
      setShowQuickActions(false);
      setIsLoading(true);

      try {
          if (action === 'trivia') {
              const question = await generateTrivia();
              if (question) {
                  setMessages(prev => [...prev, {
                      id: Date.now().toString(),
                      role: 'model',
                      text: "Here is a TFI Challenge for you! 🧠",
                      timestamp: new Date(),
                      trivia: question
                  }]);
              } else {
                  setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Trivia generation failed. Try again!", timestamp: new Date() }]);
              }
          } else if (action === 'prediction') {
              const prediction = await generatePrediction();
              if (prediction) {
                   setMessages(prev => [...prev, {
                      id: Date.now().toString(),
                      role: 'model',
                      text: "Consulting the Box Office Oracle... 🔮",
                      timestamp: new Date(),
                      prediction: prediction
                  }]);
              } else {
                  setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Prediction failed. Try again!", timestamp: new Date() }]);
              }
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  };

  const handleQuizOptionClick = (msgId: string, optionIndex: number) => {
      setSelectedQuizOption(prev => ({...prev, [msgId]: optionIndex}));
  };

  return (
    <>
      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-lg h-[60vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-orange-500 flex items-center justify-center">
                        <span className="material-icons-round text-slate-900 text-sm">smart_toy</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white leading-none">Chaitanya AI</h3>
                        <p className="text-[10px] text-slate-400">TFI Intelligence • Online</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                    <span className="material-icons-round">close</span>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-950/50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {/* Text Bubble */}
                        <div 
                            className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-md ${
                                msg.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                            }`}
                        >
                            <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>') }}></p>
                        </div>

                        {/* Event Suggestion Card */}
                        {msg.suggestedEvents && msg.suggestedEvents.length > 0 && (
                            <div className="mt-2 w-[85%] space-y-2">
                                {msg.suggestedEvents.map(evt => (
                                    <div key={evt.id} className="bg-slate-900 border border-yellow-500/30 rounded-lg p-3 flex justify-between items-center shadow-lg">
                                        <div>
                                            <div className="text-yellow-500 font-bold text-xs">{evt.title}</div>
                                            <div className="text-slate-500 text-[10px]">{new Date(evt.date).toDateString()}</div>
                                        </div>
                                        <button 
                                            onClick={() => onEventProposed(evt)}
                                            className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                                        >
                                            <span className="material-icons-round text-xs">add</span>
                                            Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Trivia Card */}
                        {msg.trivia && (
                            <div className="mt-2 w-[90%] bg-slate-900 border border-purple-500/30 rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-icons-round text-purple-400 text-sm">quiz</span>
                                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Trivia Challenge</span>
                                </div>
                                <h4 className="text-white font-bold text-sm mb-3">{msg.trivia.question}</h4>
                                <div className="space-y-2">
                                    {msg.trivia.options.map((opt, idx) => {
                                        const isSelected = selectedQuizOption[msg.id] === idx;
                                        const isCorrect = idx === msg.trivia!.correctAnswerIndex;
                                        const showResult = selectedQuizOption[msg.id] !== undefined;
                                        
                                        let btnClass = "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700";
                                        if (showResult) {
                                            if (isCorrect) btnClass = "bg-green-500/20 border-green-500 text-green-300";
                                            else if (isSelected) btnClass = "bg-red-500/20 border-red-500 text-red-300";
                                            else btnClass = "bg-slate-800 border-slate-700 opacity-50";
                                        }

                                        return (
                                            <button 
                                                key={idx}
                                                disabled={showResult}
                                                onClick={() => handleQuizOptionClick(msg.id, idx)}
                                                className={`w-full text-left p-2 rounded-lg border text-xs font-medium transition-all ${btnClass}`}
                                            >
                                                {opt}
                                                {showResult && isCorrect && <span className="float-right material-icons-round text-sm">check</span>}
                                                {showResult && isSelected && !isCorrect && <span className="float-right material-icons-round text-sm">close</span>}
                                            </button>
                                        )
                                    })}
                                </div>
                                {selectedQuizOption[msg.id] !== undefined && (
                                    <div className="mt-3 p-2 bg-purple-900/20 rounded border border-purple-500/20 text-xs text-purple-200">
                                        <span className="font-bold">Fact: </span>{msg.trivia.explanation}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Prediction Card */}
                        {msg.prediction && (
                            <div className="mt-2 w-[90%] bg-slate-900 border border-blue-500/30 rounded-xl p-4 shadow-lg">
                                 <div className="flex items-center gap-2 mb-2">
                                    <span className="material-icons-round text-blue-400 text-sm">crystal_ball</span>
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{msg.prediction.type} Oracle</span>
                                </div>
                                <h4 className="text-white font-bold text-lg mb-1">{msg.prediction.title}</h4>
                                <p className="text-blue-200 text-sm italic mb-4">"{msg.prediction.prediction}"</p>
                                
                                <div className="mb-2">
                                    <div className="flex justify-between text-[10px] text-slate-400 mb-1 uppercase font-bold">
                                        <span>Confidence</span>
                                        <span>{msg.prediction.confidence}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 rounded-full" 
                                            style={{ width: `${msg.prediction.confidence}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-tight border-t border-slate-800 pt-2 mt-2">
                                    {msg.prediction.reasoning}
                                </p>
                            </div>
                        )}

                        <span className="text-[9px] text-slate-600 mt-1 px-1">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex items-start">
                        <div className="bg-slate-800 rounded-2xl rounded-bl-none p-3 flex gap-1 items-center border border-slate-700">
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce delay-75"></span>
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-slate-900 border-t border-slate-800">
                <div className="flex items-center gap-2 bg-slate-950 rounded-full px-4 py-2 border border-slate-800 focus-within:border-yellow-500 transition-colors shadow-inner">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="bg-transparent flex-grow text-slate-200 text-sm focus:outline-none placeholder-slate-600"
                    />
                    <button 
                        onClick={handleSend}
                        className="text-yellow-500 hover:text-yellow-400 disabled:opacity-30 transition-opacity"
                        disabled={!input.trim() || isLoading}
                    >
                        <span className="material-icons-round">send</span>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Floating Pill / Toggle */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[60]">
          
          {/* Quick Actions Menu (Above Pill) */}
          {showQuickActions && !isOpen && (
              <div className="flex gap-2 animate-fade-in mb-2">
                  <button 
                    onClick={() => handleQuickAction('trivia')}
                    className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                    title="Play Trivia"
                  >
                      <span className="text-lg">🧠</span>
                  </button>
                  <button 
                    onClick={() => handleQuickAction('prediction')}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                    title="Get Prediction"
                  >
                      <span className="text-lg">🔮</span>
                  </button>
              </div>
          )}

          {/* Main Floating Bar */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-full shadow-2xl p-1 pr-4 gap-2 backdrop-blur-md hover:border-yellow-500/50 transition-colors">
              <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg text-slate-900 hover:scale-105 transition-transform"
              >
                  <span className="material-icons-round">{isOpen ? 'close' : 'smart_toy'}</span>
              </button>
              
              {!isOpen && (
                  <div 
                    onClick={() => setIsOpen(true)}
                    className="text-sm font-medium text-slate-300 cursor-pointer hover:text-white"
                  >
                      Ask Chaitanya...
                  </div>
              )}

              {/* Quick Actions Toggle */}
              {!isOpen && (
                  <button 
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    className={`ml-2 p-1.5 rounded-full hover:bg-slate-800 transition-colors ${showQuickActions ? 'text-yellow-500' : 'text-slate-500'}`}
                  >
                      <span className="material-icons-round text-sm">bolt</span>
                  </button>
              )}
          </div>
      </div>
    </>
  );
};

export default FloatingChat;
