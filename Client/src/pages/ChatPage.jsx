import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertCircle, Trash2, History, Plus, Globe, ShieldCheck, ChevronLeft, Loader2, X, PanelLeftClose, PanelLeftOpen, PanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Mic, MicOff, Languages } from 'lucide-react';
import VoterID3D from '../components/VoterID3D';

export default function ChatPage({ selectedState }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`electra_chat_${selectedState}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    }
    return [
      { 
        role: 'assistant', 
        content: `Greetings! I am Electra, your neutral civic education assistant for **${selectedState}**.\n\nHow can I assist you today with the democratic process?` 
      }
    ];
  });
  
  const [chatSessions, setChatSessions] = useState(() => {
    const saved = localStorage.getItem(`electra_sessions_${selectedState}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    const savedId = localStorage.getItem(`electra_current_session_${selectedState}`);
    return savedId || Date.now().toString();
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [language, setLanguage] = useState('en-IN');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToBottom = () => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem(`electra_chat_${selectedState}`, JSON.stringify(messages));
    localStorage.setItem(`electra_current_session_${selectedState}`, currentSessionId);
    
    // Auto-save session if there is actual conversation
    if (messages.length > 1) {
      setChatSessions(prev => {
        const existingIndex = prev.findIndex(s => s.id === currentSessionId);
        // Use the first user message as the title
        const firstUserMsg = messages.find(m => m.role === 'user')?.content || 'New Discussion';
        const newTitle = firstUserMsg.length > 25 ? firstUserMsg.substring(0, 25) + "..." : firstUserMsg;
        
        const updatedSession = {
          id: currentSessionId,
          title: newTitle,
          messages: messages,
          date: new Date().toISOString()
        };
        
        let newSessions;
        if (existingIndex >= 0) {
          newSessions = [...prev];
          newSessions[existingIndex] = updatedSession;
        } else {
          newSessions = [updatedSession, ...prev];
        }
        
        localStorage.setItem(`electra_sessions_${selectedState}`, JSON.stringify(newSessions));
        return newSessions;
      });
    }
  }, [messages, selectedState, currentSessionId]);

  const loadSession = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    }
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition. Please try Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = language;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        setInput(transcript);
        handleSend(transcript);
      }
    };

    recognitionRef.current.start();
  };

  const handleSend = async (voiceMessage) => {
    const messageToSend = voiceMessage || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage = { role: 'user', content: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    if (!voiceMessage) setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: messageToSend,
        state: selectedState,
        language: language,
        history: messages.map(m => ({ role: m.role, content: m.content }))
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.reply,
        model: response.data.model
      }]);
    } catch (error) {
      const errorMsg = error.response?.data?.reply || "I'm having trouble connecting to the brain center. This is usually due to high traffic. Please try again in a moment.";
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMsg,
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    let greeting = `Greetings! I am Electra, your neutral civic education assistant for **${selectedState}**.\n\nHow can I assist you today with the democratic process?`;
    
    if (language === 'ta-IN') {
      greeting = `வணக்கம்! நான் எலெக்ட்ரா, **${selectedState}**-க்கான நடுநிலையான தேர்தல் கல்வி உதவியாளர்.\n\nதேர்தல் செயல்முறைகள் குறித்து உங்களுக்கு ஏதேனும் கேள்விகள் இருந்தால், தயவுசெய்து கேளுங்கள்!`;
    } else if (language === 'hi-IN') {
      greeting = `नमस्ते! मैं इलेक्ट्रा हूँ, **${selectedState}** के लिए आपका निष्पक्ष चुनाव शिक्षा सहायक।\n\nआज मैं लोकतांत्रिक प्रक्रिया में आपकी कैसे मदद कर सकता हूँ?`;
    }

    setMessages([
      { 
        role: 'assistant', 
        content: greeting
      }
    ]);
    setCurrentSessionId(Date.now().toString());
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen bg-white overflow-hidden font-jakarta relative"
    >
      {/* Sidebar - Mobile Overlay */}
      <AnimatePresence>
        {(isSidebarOpen) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-navy_blue/40 backdrop-blur-sm z-110 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <motion.div 
        className={`fixed lg:relative h-full bg-slate-50 border-r border-slate-200 z-120 flex flex-col p-6 shadow-[inset_-10px_0_20px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? 'w-80 min-w-[320px] translate-x-0' : 'w-0 min-w-0 p-0 border-none -translate-x-full lg:translate-x-0 lg:p-0'
        }`}
      >
        <div className="flex items-center justify-between mb-8 w-64">
          <Link to="/" className="flex items-center gap-3 group bg-white p-3 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-95 w-fit">
            <ChevronLeft className="w-4 h-4 text-navy_blue group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black text-navy_blue uppercase tracking-widest">Dashboard</span>
          </Link>
        </div>

        <button 
          onClick={clearChat}
          className="flex items-center gap-3 w-64 p-4 rounded-2xl bg-navy_blue text-white hover:bg-slate-800 transition-all font-black mb-8 group shadow-xl shadow-navy_blue/10 active:scale-95 flex-shrink-0"
        >
          <Plus className="w-5 h-5 text-saffron group-hover:rotate-90 transition-transform duration-500" />
          New Discussion
        </button>

        <div className="flex-grow space-y-8 overflow-y-auto scrollbar-hide w-64 pr-2">
          
          {chatSessions.length > 0 && (
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Recent Discussions</p>
              <div className="space-y-2">
                {chatSessions.map(session => (
                  <button 
                    key={session.id}
                    onClick={() => loadSession(session.id)}
                    className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all truncate flex items-center gap-3 ${
                      currentSessionId === session.id 
                        ? 'bg-saffron/10 text-navy_blue border border-saffron/20 shadow-sm' 
                        : 'bg-white border border-slate-100 text-slate-500 hover:border-saffron/30 hover:bg-slate-50'
                    }`}
                  >
                    <History className={`w-3.5 h-3.5 flex-shrink-0 ${currentSessionId === session.id ? 'text-saffron' : 'text-slate-400'}`} />
                    <span className="truncate">{session.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Knowledge Context</p>
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-tricolor_green animate-pulse" />
                <span className="text-xs font-bold text-navy_blue uppercase tracking-tighter">{selectedState} Election Cycle</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 group hover:border-saffron/30 transition-colors">
                    <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Total Seats</p>
                    <p className="text-xs font-black text-navy_blue">234</p>
                 </div>
                 <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 group hover:border-saffron/30 transition-colors">
                    <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Majority</p>
                    <p className="text-xs font-black text-navy_blue">118</p>
                 </div>
                 <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 group hover:border-saffron/30 transition-colors">
                    <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Polling Date</p>
                    <p className="text-xs font-black text-navy_blue truncate">Apr 23, 2026</p>
                 </div>
                 <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 group hover:border-saffron/30 transition-colors">
                    <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Results Date</p>
                    <p className="text-xs font-black text-navy_blue">May 04, 2026</p>
                 </div>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Capabilities</p>
            <div className="grid grid-cols-1 gap-2">
              {['Voter Registration', 'Constituency Data', 'EVM Security', 'Neutral FAQ'].map(item => (
                <div key={item} className="p-3 rounded-xl border border-slate-200 bg-white/50 text-[10px] font-black text-slate-500 uppercase tracking-tight flex items-center gap-2">
                  <div className="w-1 h-1 bg-saffron rounded-full" />
                  {item}
                </div>
              ))}
              <button 
                onClick={() => handleSend("Show me the Voter ID format")}
                className="w-full text-left p-3 rounded-xl border border-saffron/20 bg-saffron/5 text-[10px] font-black text-navy_blue uppercase tracking-tight flex items-center justify-between group hover:bg-saffron hover:text-white transition-all active:scale-95 cursor-pointer mt-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-saffron group-hover:bg-white rounded-full" />
                  Visual ID Guide
                </div>
                <Sparkles className="w-3 h-3 animate-pulse" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200">
          <div className="bg-gradient-to-br from-navy_blue to-slate-900 rounded-xl p-3 text-white relative overflow-hidden group shadow-md flex items-center gap-3">
            <div className="absolute top-0 right-0 w-16 h-16 bg-saffron/20 rounded-full -mr-8 -mt-8 blur-xl group-hover:bg-saffron/30 transition-colors" />
            <ShieldCheck className="w-5 h-5 text-saffron flex-shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-tight leading-tight">Verified Civic AI</p>
              <p className="text-[8px] opacity-50 font-medium leading-tight mt-0.5">ECI & PRS Data Validated</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col relative h-full bg-white">
        {/* Tricolor Top Bar Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex z-50">
          <div className="flex-grow bg-saffron" />
          <div className="flex-grow bg-white" />
          <div className="flex-grow bg-tricolor_green" />
        </div>

        {/* Chat Header */}
        <div className="px-6 md:px-8 py-4 md:py-6 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 transition-all hover:bg-slate-100 hover:shadow-sm active:scale-95 group cursor-pointer"
              title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-5 h-5 text-navy_blue group-hover:text-saffron transition-colors" />
              ) : (
                <PanelLeftOpen className="w-5 h-5 text-navy_blue group-hover:text-saffron transition-colors" />
              )}
            </button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-navy_blue rounded-2xl flex items-center justify-center shadow-2xl shadow-navy_blue/20 group cursor-pointer overflow-hidden">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-saffron group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-lg md:text-2xl font-black text-navy_blue tracking-tight">Electra AI</h1>
                  <span className="bg-saffron/10 text-saffron text-[7px] md:text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-saffron/20">Hybrid v2.5</span>
                </div>
                <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-tricolor_green shadow-[0_0_5px_rgba(18,136,7,0.5)]" />
                  Context: {selectedState}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={clearChat}
              className="p-3 text-slate-400 hover:text-red-500 transition-all rounded-xl hover:bg-red-50 active:scale-90 hidden sm:block"
              title="Clear Chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <Link to="/" className="p-3 text-slate-400 hover:text-navy_blue transition-all rounded-xl hover:bg-slate-50 active:scale-90">
              <Globe className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Messages List */}
        <div 
          ref={scrollContainerRef}
          className="flex-grow overflow-y-auto px-4 md:px-0 scroll-smooth bg-slate-50/20 scrollbar-hide"
        >
          <div className="max-w-4xl mx-auto py-10 md:py-16 space-y-12">
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`flex gap-4 md:gap-8 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-[10px] shadow-sm transition-transform duration-500 hover:rotate-6 ${
                  msg.role === 'assistant' 
                    ? 'bg-navy_blue text-white' 
                    : 'bg-white border border-slate-200 text-navy_blue'
                }`}>
                  {msg.role === 'assistant' ? <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-saffron" /> : 'YOU'}
                </div>
                
                <div className={`max-w-[85%] p-4 md:p-6 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-navy_blue text-white shadow-lg' 
                    : msg.isError 
                      ? 'bg-red-50 text-red-600 border border-red-100'
                      : 'bg-white border border-slate-200 shadow-sm prose prose-slate max-w-none prose-sm'
                }`}>
                  {msg.role === 'assistant' ? (
                    <>
                    <ReactMarkdown
                      components={{
                        strong: ({ children, ...props }) => <strong className="font-black text-navy_blue bg-saffron/10 px-1 rounded" {...props}>{children}</strong>,
                        p: ({ children, ...props }) => <p className="mb-4 last:mb-0 leading-relaxed" {...props}>{children}</p>,
                        blockquote: ({ children, ...props }) => (
                          <blockquote className="border-l-4 border-saffron bg-gradient-to-r from-saffron/10 to-transparent p-4 rounded-r-2xl my-6 text-navy_blue/90 font-medium shadow-sm" {...props}>
                            {children}
                          </blockquote>
                        ),
                        ul: ({ children, ...props }) => <ul className="space-y-3 my-5" {...props}>{children}</ul>,
                        ol: ({ children, ...props }) => <ol className="space-y-3 my-5 list-decimal list-inside" {...props}>{children}</ol>,
                        li: ({ children, ...props }) => (
                          <li className="flex gap-3 items-start" {...props}>
                            <span className="text-saffron mt-1 shadow-sm">✦</span>
                            <span className="flex-1">{children}</span>
                          </li>
                        )
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>

                    {/* 3D Voter ID Trigger */}
                    {msg.role === 'assistant' && (msg.content.toLowerCase().includes('voter id') || msg.content.toLowerCase().includes('epic card')) && !msg.isError && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden shadow-inner"
                      >
                         <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-2">
                               <Sparkles className="w-4 h-4 text-saffron" />
                               <span className="text-[10px] font-black text-navy_blue uppercase tracking-widest">Interactive Visual Guide</span>
                            </div>
                         </div>
                         <VoterID3D height="280px" />
                         <div className="p-4 bg-white flex flex-col gap-2">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">AI Enhancement</p>
                            <p className="text-[10px] text-navy_blue/70 font-medium italic">"Click and drag to rotate the card. Use the button below to inspect the back."</p>
                         </div>
                      </motion.div>
                    )}
                      {msg.model && (
                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[7px] md:text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Validated by {msg.model.replace('models/', '')} Engine</span>
                          <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-saffron" />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                            <div className="w-1.5 h-1.5 rounded-full bg-tricolor_green" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="font-medium text-sm md:text-base leading-relaxed">{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start gap-4 md:gap-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-navy_blue rounded-2xl flex-shrink-0 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-5 h-5 text-saffron opacity-50" />
                </div>
                <div className="bg-white border border-slate-200 p-6 md:p-10 rounded-[2.5rem] rounded-tl-none shadow-sm flex flex-col gap-4 min-w-[250px] md:min-w-[400px]">
                   <div className="flex gap-3 items-center">
                     <Loader2 className="w-5 h-5 text-saffron animate-spin" />
                     <span className="text-[10px] md:text-xs font-black text-navy_blue uppercase tracking-widest animate-pulse">
                       Electra is cross-referencing...
                     </span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                     <motion.div 
                       initial={{ x: "-100%" }}
                       animate={{ x: "100%" }}
                       transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                       className="h-full w-1/3 bg-gradient-to-r from-transparent via-saffron to-transparent rounded-full"
                     />
                   </div>
                   <div className="flex justify-between items-center">
                     <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       Accessing Constitutional Datasets
                     </p>
                     <div className="flex gap-1">
                        <div className="w-1 h-1 bg-tricolor_green rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-1 h-1 bg-tricolor_green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1 h-1 bg-tricolor_green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                     </div>
                   </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-32" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-100 relative">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-saffron/20 to-tricolor_green/20 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
              
              <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-1.5 focus-within:bg-white focus-within:border-navy_blue/20 transition-all">
                {/* Language Selector */}
                <div className="flex items-center pl-4 border-r border-slate-200 mr-2">
                  <Languages className="w-4 h-4 text-slate-400 mr-2" />
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-black text-navy_blue uppercase tracking-tight outline-none cursor-pointer pr-2 hover:text-saffron transition-colors"
                  >
                    <option value="en-IN">English</option>
                    <option value="ta-IN">Tamil</option>
                    <option value="hi-IN">Hindi</option>
                  </select>
                </div>

                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  className="flex-grow bg-transparent border-none px-4 py-3 text-sm md:text-base font-medium text-navy_blue focus:ring-0 outline-none placeholder:text-slate-300"
                  disabled={isLoading}
                />

                {/* Voice Input Button */}
                <button 
                  onClick={toggleVoiceInput}
                  className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-slate-400 hover:text-navy_blue hover:bg-slate-100'}`}
                  title="Voice Typing"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-navy_blue text-white p-3 rounded-xl hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all active:scale-95 shadow-md shadow-navy_blue/10 ml-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-8 px-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
                <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">Non-Partisan AI</p>
              </div>
              <div className="hidden sm:block h-1 w-1 bg-slate-200 rounded-full" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-tricolor_green/50" />
                <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">Ground Truth Validated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
