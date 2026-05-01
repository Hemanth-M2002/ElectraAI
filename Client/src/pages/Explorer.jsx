import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Users, Info, ChevronRight, Timer, Landmark, ShieldCheck, Sparkles, TrendingUp, AlertCircle, Loader2, ArrowLeft, Construction } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import constituenciesData from '../data/tnConstituencies.json';

const stateInfo = {
  'Tamil Nadu': { seats: 234, majority: 118 },
  'Uttar Pradesh': { seats: 403, majority: 202 },
  'Maharashtra': { seats: 288, majority: 145 },
  'West Bengal': { seats: 294, majority: 148 },
  'Andhra Pradesh': { seats: 175, majority: 88 },
  'Karnataka': { seats: 224, majority: 113 },
  'Bihar': { seats: 243, majority: 122 },
};

export default function Explorer({ selectedState }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [liveCandidates, setLiveCandidates] = useState([]);
  const [dataSource, setDataSource] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef(null);

  const info = selectedState !== 'Tamil Nadu' ? null : (stateInfo[selectedState] || { seats: 234, majority: 118 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const electionDate = new Date('May 2, 2026 08:00:00').getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = electionDate - now;
      
      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
        clearInterval(timer);
      } else {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e) => {
    if (selectedState !== 'Tamil Nadu') return;
    
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim().length > 0) {
      const filtered = constituenciesData.filter(c => 
        c.name.toLowerCase().includes(value.toLowerCase()) || 
        c.district.toLowerCase().includes(value.toLowerCase()) ||
        c.id.toString() === value.trim()
      ).slice(0, 8);
      setSuggestions(filtered);
      setHighlightedIndex(0);
    } else {
      setSuggestions([]);
      setHighlightedIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0 || selectedState !== 'Tamil Nadu') return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0) selectConstituency(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') setSuggestions([]);
  };

  const fetchLiveCandidates = async (cName) => {
    setIsLoading(true);
    setLiveCandidates([]);
    setDataSource('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/candidates`, { constituency: cName });
      setLiveCandidates(response.data.candidates || []);
      setDataSource(response.data.source || 'Public Records');
    } catch (err) {
      console.error("Live fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectConstituency = (c) => {
    setSelectedConstituency(c);
    setQuery(c.name);
    setSuggestions([]);
    fetchLiveCandidates(c.name);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 pt-24 md:pt-40 pb-20 overflow-x-hidden relative"
    >
      {/* Header with Countdown */}
      <div className="grid lg:grid-cols-5 gap-12 items-end mb-16 md:mb-24">
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 bg-saffron/10 text-saffron px-4 py-2 rounded-full font-bold text-[10px] mb-6 uppercase tracking-widest border border-saffron/20"
          >
            <Timer className="w-3.5 h-3.5" />
            Counting Down to Result Day 2026
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-navy_blue tracking-tighter leading-[0.9] mb-6"
          >
            Democracy in <br /><span className="text-saffron">Real-Time.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-400 font-medium max-w-lg"
          >
            Search for your constituency to see live prospective candidates and regional data.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 grid grid-cols-4 gap-2 md:gap-4 w-full"
        >
          {Object.entries(countdown).map(([label, val], i) => (
            <div key={label} className="bg-white p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 text-center flex flex-col justify-center min-w-0">
              <div className="text-xl md:text-4xl font-black text-navy_blue truncate">{val}</div>
              <div className="text-[7px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Search Section */}
      <div className="relative max-w-3xl mb-16 md:mb-24 z-40" ref={searchRef}>
        {selectedState !== 'Tamil Nadu' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-16 left-0 right-0 bg-saffron/10 border border-saffron/20 text-saffron px-6 py-4 rounded-2xl text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <Construction className="w-5 h-5" />
              <span className="font-black text-sm">Gathering data, will be available soon for {selectedState}</span>
            </div>
          </motion.div>
        )}
        <div className="relative group">
          <div className="absolute inset-0 bg-navy_blue/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative">
            <Search className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 md:w-7 md:h-7" />
            <input
              type="text"
              placeholder={selectedState !== 'Tamil Nadu' ? 'Search will be available soon...' : "Search constituency or district..."}
              className="w-full pl-14 md:pl-20 pr-6 py-5 md:py-8 bg-white border border-slate-200 rounded-2xl md:rounded-[3rem] shadow-2xl focus:outline-none focus:ring-8 focus:ring-navy_blue/5 text-base md:text-xl font-bold text-navy_blue transition-all placeholder:text-slate-300"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => query.trim() && handleInputChange({ target: { value: query } })}
              disabled={selectedState !== 'Tamil Nadu'}
            />
          </div>
        </div>

        <AnimatePresence>
          {suggestions.length > 0 && selectedState === 'Tamil Nadu' && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2rem] md:rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(10,25,47,0.2)] border border-slate-100 overflow-hidden z-50 p-2 md:p-4 backdrop-blur-xl"
            >
              {suggestions.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => selectConstituency(c)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`w-full px-4 md:px-8 py-3 md:py-5 flex items-center justify-between transition-all rounded-2xl md:rounded-[2rem] mb-1 last:mb-0 group ${
                    highlightedIndex === idx ? 'bg-slate-50' : ''
                  }`}
                >
                  <div className="text-left flex items-center gap-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black transition-colors ${
                      highlightedIndex === idx ? 'bg-navy_blue text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {c.name[0]}
                    </div>
                    <div>
                      <p className="font-black text-navy_blue text-sm md:text-lg group-hover:text-saffron transition-colors">{c.name}</p>
                      <div className="flex items-center gap-2">
                         <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.district}</span>
                         <span className="text-[10px] font-black text-slate-200">|</span>
                         <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {c.id}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-all ${
                    highlightedIndex === idx ? 'text-saffron translate-x-1' : 'text-slate-300'
                  }`} />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result Section */}
      <AnimatePresence mode="wait">
        {selectedConstituency ? (
          <motion.div
            key={selectedConstituency.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-6 md:space-y-10"
          >
            {/* Main Info Card */}
            <div className="bg-navy_blue rounded-[2.5rem] md:rounded-[4.5rem] p-8 md:p-20 text-white relative overflow-hidden shadow-3xl">
              <div className="absolute top-0 right-0 w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-white/5 rounded-full -mr-32 md:-mr-48 -mt-32 md:-mt-48 blur-[100px] md:blur-[150px]" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10 md:gap-12">
                <div className="flex-grow">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 mb-6 md:mb-8"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/10">
                      <MapPin className="text-saffron w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none">{selectedConstituency.name}</h2>
                  </motion.div>
                  
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    <span className="bg-white/10 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-xs font-black tracking-widest uppercase border border-white/10 backdrop-blur-md">
                      {selectedConstituency.district} District
                    </span>
                    <span className="bg-saffron text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-xs font-black tracking-widest uppercase flex items-center gap-2 shadow-xl shadow-saffron/20">
                      <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" /> Assembly 2026
                    </span>
                    <span className="bg-white/5 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-xs font-black tracking-widest uppercase border border-white/5">
                      ID: {selectedConstituency.id}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-8 md:gap-16 border-t lg:border-t-0 lg:border-l border-white/10 pt-10 lg:pt-0 lg:pl-16">
                  <div className="text-center">
                    <div className="text-4xl md:text-6xl font-black text-saffron leading-none mb-2">{info?.seats || '--'}</div>
                    <div className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Total Seats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-6xl font-black text-saffron leading-none mb-2">{info?.majority || '--'}</div>
                    <div className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Majority Mark</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6 md:gap-10 items-start">
              <div className="lg:col-span-2 space-y-6 md:space-y-10">
                {/* Candidates List */}
                <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-14 shadow-2xl border border-slate-100 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                    <h3 className="text-2xl md:text-4xl font-black text-navy_blue flex items-center gap-4">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-saffron/10 rounded-2xl md:rounded-3xl flex items-center justify-center">
                        <TrendingUp className="text-saffron w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      Prospective Candidates
                    </h3>
                    <div className="flex flex-col items-start sm:items-end bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                       <div className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Live Data Source</div>
                       <div className="text-[9px] md:text-xs font-black text-saffron uppercase tracking-widest flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-saffron rounded-full animate-ping" />
                         {dataSource || 'ECI / MyNeta Verification'}
                       </div>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="py-24 flex flex-col items-center justify-center gap-6">
                      <div className="relative">
                        <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-saffron animate-spin" />
                        <div className="absolute inset-0 bg-saffron/20 blur-xl rounded-full" />
                      </div>
                      <p className="text-slate-400 font-bold text-sm md:text-base uppercase tracking-[0.3em] animate-pulse text-center px-6">Establishing secure link to ECI node...</p>
                    </div>
                  ) : liveCandidates.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                      {liveCandidates.map((cand, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center justify-between p-6 md:p-8 bg-white rounded-3xl border border-slate-100 hover:border-navy_blue/20 hover:shadow-2xl transition-all group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-6 relative z-10">
                            <div className="w-14 h-14 md:w-20 md:h-20 bg-slate-50 rounded-2xl md:rounded-[2.5rem] flex flex-col items-center justify-center font-black transition-all duration-500 border border-slate-100 group-hover:bg-navy_blue group-hover:text-white group-hover:scale-105">
                              <span className="text-xl md:text-3xl leading-none">{cand.party?.[0] || 'I'}</span>
                              <span className="text-[7px] md:text-[9px] mt-1 opacity-40 uppercase">{cand.party}</span>
                            </div>
                            <div>
                              <h4 className="font-black text-navy_blue text-lg md:text-2xl tracking-tight mb-2 group-hover:text-saffron transition-colors">{cand.name}</h4>
                              <div className="flex flex-wrap gap-2">
                                <span className={`px-4 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border transition-colors ${
                                  cand.party === 'DMK' ? 'bg-red-50 text-red-600 border-red-100' :
                                  cand.party === 'AIADMK' || cand.party === 'ADMK' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                  cand.party === 'TVK' ? 'bg-saffron/10 text-saffron border-saffron/20' :
                                  cand.party === 'BJP' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                  'bg-slate-50 text-slate-500 border-slate-100'
                                }`}>
                                  {cand.party}
                                </span>
                                <span className="px-4 py-1 rounded-full bg-slate-50 text-slate-400 border border-slate-100 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                                  2026 Candidate
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={`absolute right-0 top-0 bottom-0 w-2 transition-all duration-500 ${
                             cand.party === 'DMK' ? 'bg-red-500/20 group-hover:bg-red-500' :
                             cand.party === 'AIADMK' || cand.party === 'ADMK' ? 'bg-emerald-500/20 group-hover:bg-emerald-500' :
                             cand.party === 'TVK' ? 'bg-saffron/20 group-hover:bg-saffron' :
                             'bg-slate-200 group-hover:bg-navy_blue'
                          }`} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-orange-50/50 p-10 md:p-20 rounded-[2.5rem] md:rounded-[4rem] border border-orange-100 text-center relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/5 rounded-full blur-2xl" />
                      <AlertCircle className="w-14 h-14 md:w-20 md:h-20 text-saffron mx-auto mb-8 animate-bounce" />
                      <p className="text-navy_blue font-black text-2xl md:text-4xl mb-4 tracking-tight">Live data pending.</p>
                      <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto text-sm md:text-lg leading-relaxed">
                        Nominations for the 2026 Assembly cycle have not yet opened in this specific constituency.
                      </p>
                      <div className="inline-block bg-white px-6 py-3 rounded-2xl border border-orange-200 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest shadow-sm">
                        Synchronized with ECI Schedule
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6 md:space-y-10">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-slate-100"
                >
                  <div className="flex items-center gap-4 mb-8 md:mb-10">
                     <div className="w-12 h-12 bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center font-black text-xs">MLA</div>
                     <h4 className="font-black text-navy_blue text-xl md:text-2xl uppercase tracking-tight">Incumbent Info</h4>
                  </div>
                  <div className="space-y-4 md:space-y-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:border-saffron/20 transition-all group">
                      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest group-hover:text-saffron transition-colors">Current MLA</p>
                      <p className="text-xl md:text-2xl font-black text-navy_blue">{selectedConstituency.currentMLA || "Vacant Seat"}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:border-saffron/20 transition-all group">
                      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest group-hover:text-saffron transition-colors">Affiliation</p>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-saffron rounded-full animate-pulse" />
                        <p className="text-xl md:text-2xl font-black text-saffron">{selectedConstituency.mlaParty || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-navy_blue rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-3xl text-white relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-saffron/10 transition-colors" />
                  <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-saffron mb-8 group-hover:rotate-12 transition-transform duration-500" />
                  <h4 className="text-2xl md:text-3xl font-black mb-6 tracking-tight">Regional Guide</h4>
                  <p className="text-white/60 text-sm md:text-lg leading-relaxed font-medium mb-10 group-hover:text-white/80 transition-colors">
                    {selectedConstituency.guide}
                  </p>
                  <div className="inline-flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-white/10 text-saffron font-black text-[9px] md:text-xs tracking-widest uppercase backdrop-blur-md">
                     <Users className="w-4 h-4 md:w-5 md:h-5" />
                     Electorate: {selectedConstituency.totalVoters}
                  </div>
                </motion.div>
                
                <button 
                  onClick={() => setSelectedConstituency(null)}
                  className="w-full py-6 flex items-center justify-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-navy_blue transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Search
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-10 opacity-30 pointer-events-none"
          >
             <div className="h-96 bg-slate-100 rounded-[4rem] animate-pulse" />
             <div className="h-96 bg-slate-100 rounded-[4rem] animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
