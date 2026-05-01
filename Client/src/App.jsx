import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Odyssey from './pages/Odyssey';
import VoterMode from './pages/VoterMode';
import Explorer from './pages/Explorer';
import ChatAssistant from './components/ChatAssistant';
import ChatPage from './pages/ChatPage';
import AIChat from './pages/AIChat';
import PageLoader from './components/PageLoader';
import { useState, useEffect } from 'react';

function App() {
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-saffron/30 selection:text-navy_blue relative">
      <AnimatePresence>
        {isPageLoading && <PageLoader />}
      </AnimatePresence>
      
      {!isChatPage && <Navbar selectedState={selectedState} setSelectedState={setSelectedState} />}
      
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home selectedState={selectedState} />} />
          <Route path="/odyssey" element={<Odyssey selectedState={selectedState} />} />
          <Route path="/voter-mode" element={<VoterMode selectedState={selectedState} />} />
          <Route path="/explore" element={<Explorer selectedState={selectedState} />} />
          <Route path="/chat" element={<ChatPage selectedState={selectedState} />} />
          <Route path="/aichat" element={<AIChat selectedState={selectedState} />} />
        </Routes>
      </AnimatePresence>

      {!isChatPage && <ChatAssistant selectedState={selectedState} isOpen={isChatOpen} setIsOpen={setIsChatOpen} />}
      
      {/* Footer */}
      <footer className="bg-navy_blue text-white py-24 md:py-32 px-4 mt-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-saffron via-white to-tricolor_green" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-xl border border-white/10">E</div>
                <span className="text-3xl font-black tracking-tighter">ELECTRA</span>
              </div>
              <p className="text-lg opacity-40 mb-10 max-w-lg leading-relaxed font-medium">
                The definitive platform for Indian election education. Empowering citizens through data transparency, neutral information, and conversational AI.
              </p>
              <div className="flex gap-4">
                {['ECI Official', 'PRS India', 'MyNeta'].map(source => (
                  <div key={source} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-60">
                    {source}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-saffron">Platform</h4>
              <ul className="space-y-4 text-sm font-bold opacity-60">
                <li><Link to="/" className="hover:text-white transition-colors">Mission Dashboard</Link></li>
                <li><Link to="/odyssey" className="hover:text-white transition-colors">Election Odyssey</Link></li>
                <li><Link to="/voter-mode" className="hover:text-white transition-colors">Voter Mode</Link></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">Constituency Explorer</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-tricolor_green">Accountability</h4>
              <p className="text-sm font-medium opacity-40 leading-relaxed italic">
                "Democracy cannot succeed unless those who express their choice are prepared to choose wisely."
              </p>
              <p className="text-[10px] font-black opacity-60">— Franklin D. Roosevelt</p>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">
                PROMPT WARS 2026 OFFICIAL ENTRY
              </p>
              <p className="text-[9px] font-medium opacity-20">Built with Gemini AI & Modern Civic Data</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="w-2 h-2 rounded-full bg-tricolor_green animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">SYSTEM STATUS: OPTIMIZED</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
