import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Sparkles, AlertCircle, History, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function ChatAssistant({ selectedState, isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `Greetings! I am Electra, your neutral civic education assistant for India. 
      I'm here to help you navigate the democratic process of **${selectedState}**. 
      How can I assist you today?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: input,
        state: selectedState,
        history: messages.slice(1).map(m => ({ role: m.role, content: m.content }))
      });

      const cleanReply = response.data.reply.trim();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: cleanReply,
        model: response.data.model 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please check official ECI sources or try again in a moment.",
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[120]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
            className="mb-4 w-[360px] max-w-[95vw] h-[520px] max-h-[80vh] flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15),0_0_20px_rgba(0,0,128,0.05)] relative"
          >
            {/* Header */}
            <div className="bg-navy_blue p-5 flex justify-between items-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shadow-inner">
                   <Sparkles className="w-5 h-5 text-saffron" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base tracking-tight">Electra AI</h3>
                    <div className="w-1.5 h-1.5 bg-tricolor_green rounded-full animate-pulse shadow-[0_0_8px_rgba(18,136,7,0.8)]" />
                  </div>
                  <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-black">Region: {selectedState}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 relative z-10">
                <button 
                  onClick={(e) => {
                    // Prevent the click from bubbling which could reopen the panel
                    e.stopPropagation();
                    // Close the overlay state and navigate to the dedicated fullscreen route
                    setIsOpen(false);
                    navigate('/chat');
                  }}
                  className="hover:bg-white/10 p-2.5 rounded-xl transition-all active:scale-90"
                  title="Full Screen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="hover:bg-white/10 p-2.5 rounded-xl transition-all active:scale-90">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 scrollbar-hide scroll-smooth"
            >
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-navy_blue text-white shadow-sm' 
                      : msg.isError 
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : 'bg-white border border-slate-100 shadow-sm text-slate-800'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-slate prose-xs max-w-none">
                        <ReactMarkdown
                          components={{
                            strong: ({ children, ...props }) => <strong {...props} className="font-bold text-inherit">{children}</strong>,
                            p: ({ children, ...props }) => <p {...props} className="m-0">{children}</p>
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                        {msg.model && (
                          <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between opacity-40">
                            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">via {msg.model.replace('models/', '')}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="m-0 font-medium">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 px-5 py-4 rounded-[2rem] rounded-tl-none shadow-sm flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                        className="w-2 h-2 bg-saffron rounded-full" 
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="w-2 h-2 bg-saffron rounded-full" 
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="w-2 h-2 bg-saffron rounded-full" 
                      />
                    </div>
                    <span className="text-[10px] font-black text-navy_blue/40 uppercase tracking-widest">Thinking</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Disclaimer */}
            <div className="px-8 py-4 bg-white flex items-center gap-4 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                Electra provides neutral, non-partisan education based on official data. Always verify with the ECI.
              </p>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-saffron/20 to-tricolor_green/20 rounded-3xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex gap-2 bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200 focus-within:bg-white focus-within:border-navy_blue/20 transition-all">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent border-none rounded-[1.5rem] px-4 py-2.5 text-sm font-medium text-navy_blue focus:ring-0 outline-none placeholder:text-slate-300"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-navy_blue text-white p-3 rounded-2xl hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all active:scale-95 shadow-lg shadow-navy_blue/10"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 bg-navy_blue text-white rounded-2xl flex items-center justify-center shadow-[0_15px_35px_-10px_rgba(0,0,128,0.3)] border-2 border-white/20 group relative overflow-hidden backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-saffron/30 via-transparent to-tricolor_green/30 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X className="w-6 h-6 md:w-7 md:h-7" /> : <MessageSquare className="w-7 h-7 md:w-8 md:h-8" />}
        {!isOpen && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-saffron rounded-full border-4 border-white flex items-center justify-center"
          >
             <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}
