import { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, AlertCircle, Trash2, Plus, Globe, ShieldCheck, 
  ChevronLeft, Loader2, X, Menu, Copy, ThumbsUp, ThumbsDown, MoreVertical,
  User, Bot, Settings, Image, FileText, Code, Moon, Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const chatHistories = [
  { id: 1, title: 'How do I register to vote?', preview: 'Process for new voters...', time: '2h ago' },
  { id: 2, title: 'EVM security in Tamil Nadu', preview: 'Are EVMs really secure?', time: '1d ago' },
  { id: 3, title: 'DMK candidates in Chennai', preview: 'List of contestants...', time: '3d ago' },
];

export default function AIChat({ selectedState }) {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `👋 **Welcome to Electra AI**

I'm your intelligent civic education assistant, specializing in India's democratic processes with a focus on **${selectedState}**.

I can help you with:
• Voter registration and verification
• Constituency and candidate information  
• Election schedules and procedures
• Understanding EVM and VVPAT systems
• General civic education

What would you like to know?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    inputRef.current?.focus();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    inputRef.current?.focus();

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const response = await axios.post(`${apiUrl}/api/chat`, {
        message: currentInput,
        state: selectedState,
        history: messages.map(m => ({ role: m.role, content: m.content }))
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.reply,
        model: response.data.model
      }]);
    } catch (error) {
      const errorMsg = error.response?.data?.reply || "I'm having trouble connecting to my knowledge base. Please try again.";
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
    setMessages([
      { 
        role: 'assistant', 
        content: `👋 **Welcome back to Electra AI**

I'm your intelligent civic education assistant for **${selectedState}**.

How can I help you today?` 
      }
    ]);
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-[#171717]' : 'bg-slate-50'} overflow-hidden font-jakarta relative`}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        className={`fixed lg:relative z-50 h-full ${darkMode ? 'bg-[#1A1A1A] border-[#2F2F2F]' : 'bg-white border-slate-200'} border-r transition-transform duration-300 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-72`}
      >
        {/* Sidebar Header */}
        <div className={`p-4 border-b ${darkMode ? 'border-[#2F2F2F]' : 'border-slate-200'}`}>
          <button 
            onClick={clearChat}
            className={`flex items-center justify-center gap-2 w-full p-3 rounded-lg ${darkMode ? 'bg-[#2F2F2F] hover:bg-[#3F3F3F]' : 'bg-slate-100 hover:bg-slate-200'} transition-all font-semibold text-sm`}
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className={`text-xs font-medium px-3 py-2 ${darkMode ? 'text-[#8A8A8A]' : 'text-slate-500'}`}>
            Recent Chats
          </div>
          {chatHistories.map(chat => (
            <button 
              key={chat.id}
              className={`flex flex-col items-start w-full p-3 rounded-lg transition-all ${
                darkMode 
                  ? 'hover:bg-[#2F2F2F] text-white' 
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="font-medium text-sm">{chat.title}</span>
              <span className={`text-xs ${darkMode ? 'text-[#8A8A8A]' : 'text-slate-400'}`}>{chat.time}</span>
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t ${darkMode ? 'border-[#2F2F2F]' : 'border-slate-200'}`}>
          <div className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-[#2F2F2F]' : 'bg-slate-100'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-[#10A37F]' : 'bg-emerald-500'}`}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-slate-700'}`}>Electra AI</div>
              <div className={`text-xs ${darkMode ? 'text-[#8A8A8A]' : 'text-slate-500'}`}>Online</div>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#3F3F3F]' : 'hover:bg-slate-200'}`}
            >
              {darkMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${darkMode ? 'border-[#2F2F2F] bg-[#1A1A1A]' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 rounded-lg lg:hidden ${darkMode ? 'hover:bg-[#2F2F2F]' : 'hover:bg-slate-100'}`}
            >
              <Menu className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-slate-600'}`} />
            </button>
            <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              Electra AI
            </h1>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${darkMode ? 'bg-[#10A37F]/20 text-[#10A37F]' : 'bg-emerald-100 text-emerald-600'}`}>
              Gemini
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              to="/" 
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#2F2F2F]' : 'hover:bg-slate-100'}`}
            >
              <Globe className={`w-5 h-5 ${darkMode ? 'text-[#8A8A8A]' : 'text-slate-400'}`} />
            </Link>
            <button 
              onClick={clearChat}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#2F2F2F]' : 'hover:bg-slate-100'}`}
            >
              <Trash2 className={`w-5 h-5 ${darkMode ? 'text-[#8A8A8A]' : 'text-slate-400'}`} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollContainerRef}
          className={`flex-1 overflow-y-auto ${darkMode ? 'bg-[#171717]' : 'bg-slate-50'}`}
        >
          <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'assistant' 
                    ? darkMode ? 'bg-[#10A37F]' : 'bg-emerald-600'
                    : darkMode ? 'bg-[#3F3F3F]' : 'bg-slate-300'
                }`}>
                  {msg.role === 'assistant' ? (
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <User className={`w-3.5 h-3.5 ${darkMode ? 'text-white' : 'text-slate-600'}`} />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex-1 min-w-0 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                  <div className={`inline-block px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#10A37F] text-white shadow-sm'
                      : darkMode 
                        ? 'bg-[#2F2F2F] text-slate-100'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                  }`}>
                    {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      className="markdown prose prose-sm dark:prose-invert max-w-none"
                      components={{
                        strong: ({ children, ...props }) => <strong {...props} className="font-bold text-inherit">{children}</strong>,
                        p: ({ children, ...props }) => <p {...props} className="m-0 leading-relaxed">{children}</p>,
                        ul: ({ children, ...props }) => <ul {...props} className="mt-2 mb-2 space-y-1">{children}</ul>,
                        li: ({ children, ...props }) => <li {...props} className="ml-4">{children}</li>
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                    ) : (
                      <p className="font-medium whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>

                  {/* Message Actions */}
                  {msg.role === 'assistant' && !msg.isError && (
                    <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className={`p-1 rounded-md ${darkMode ? 'hover:bg-[#2F2F2F]' : 'hover:bg-slate-100'} transition-colors`}>
                        <Copy className={`w-3 h-3 ${darkMode ? 'text-[#8A8A8A]' : 'text-slate-400'}`} />
                      </button>
                      <button className={`p-1 rounded-md ${darkMode ? 'hover:bg-[#2F2F2F]' : 'hover:bg-slate-100'} transition-colors`}>
                        <ThumbsUp className={`w-3 h-3 ${darkMode ? 'text-[#8A8A8A]' : 'text-slate-400'}`} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Loading State */}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  darkMode ? 'bg-[#10A37F]' : 'bg-emerald-500'
                }`}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl ${
                  darkMode ? 'bg-[#2F2F2F]' : 'bg-white border border-slate-200'
                }`}>
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-[#10A37F]' : 'bg-emerald-500'} animate-bounce`} style={{ animationDelay: '0ms' }} />
                    <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-[#10A37F]' : 'bg-emerald-500'} animate-bounce`} style={{ animationDelay: '150ms' }} />
                    <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-[#10A37F]' : 'bg-emerald-500'} animate-bounce`} style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className={`p-4 ${darkMode ? 'border-[#2F2F2F] bg-[#1A1A1A]' : 'border-slate-200 bg-white'}`}>
          <div className="max-w-3xl mx-auto">
            <div className={`relative rounded-xl overflow-hidden ${
              darkMode ? 'bg-[#2F2F2F] border-[#3F3F3F]' : 'bg-slate-50 border border-slate-200'
            } border focus-within:ring-2 ${
              darkMode ? 'focus-within:ring-[#10A37F]/50' : 'focus-within:ring-emerald-500/50'
            } transition-all`}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Send a message..."
                rows={1}
                className={`w-full bg-transparent px-4 py-3 pr-12 text-sm resize-none outline-none ${
                  darkMode ? 'text-white placeholder-[#8A8A8A]' : 'text-slate-800 placeholder-slate-400'
                }`}
                style={{ maxHeight: '200px' }}
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                  isLoading || !input.trim()
                    ? darkMode ? 'bg-[#2F2F2F] text-[#8A8A8A]' : 'bg-slate-200 text-slate-400'
                    : darkMode ? 'bg-[#10A37F] text-white hover:opacity-90' : 'bg-emerald-500 text-white hover:opacity-90'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Footer Text */}
            <div className={`text-center mt-3 text-xs ${darkMode ? 'text-[#8A8A8A]' : 'text-slate-400'}`}>
              Electra AI can make mistakes. Please verify with official ECI sources.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
