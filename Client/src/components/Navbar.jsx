import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronDown, Globe, Sparkles, X, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function Navbar({ selectedState, setSelectedState }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsStateDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'The Odyssey', path: '/odyssey' },
    { name: 'Voter Mode', path: '/voter-mode' },
    { name: 'Explorer', path: '/explore' },
    { name: 'AI Chat', path: '/chat' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-out ${
      scrolled ? 'py-2 md:py-3' : 'py-4 md:py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className={`glass rounded-2xl md:rounded-[2rem] px-4 md:px-8 h-14 md:h-16 flex items-center justify-between shadow-2xl transition-all duration-500 ${
          scrolled ? 'bg-white/95 border-white/80' : 'bg-white/70 border-white/40'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-navy_blue rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <Globe className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-lg md:text-2xl tracking-tighter text-navy_blue">ELECTRA</span>
              <span className="text-[6px] md:text-[8px] font-black tracking-[0.2em] text-saffron uppercase">{selectedState} Edition</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all relative ${
                  location.pathname === link.path 
                    ? 'text-navy_blue' 
                    : 'text-slate-400 hover:text-navy_blue'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-navy_blue/5 rounded-xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
            
            <div className="w-px h-6 bg-slate-200 mx-2 lg:mx-4" />

            {/* State Switcher */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                className="flex items-center gap-3 bg-navy_blue text-white px-4 lg:px-6 py-2.5 rounded-xl text-xs font-black hover:bg-slate-800 transition-all shadow-xl shadow-navy_blue/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-saffron animate-pulse" />
                <span className="hidden lg:inline">{selectedState.toUpperCase()}</span>
                <span className="lg:hidden">{selectedState.split(' ').map(s => s[0]).join('')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${isStateDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isStateDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-72 max-h-[70vh] overflow-y-auto glass-dark rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-4 scrollbar-hide border-white/10 backdrop-blur-3xl z-[110]"
                  >
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 px-4">Select Regional Edition</p>
                    {states.map((state) => (
                      <button
                        key={state}
                        onClick={() => {
                          setSelectedState(state);
                          setIsStateDropdownOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-bold transition-all mb-1 group ${
                          selectedState === state 
                            ? 'bg-saffron text-white shadow-lg shadow-saffron/20' 
                            : 'text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          {state}
                          {selectedState === state && <motion.div layoutId="active-dot" className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isMenuOpen ? 'bg-navy_blue text-white' : 'bg-slate-100 text-navy_blue'
            }`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-90 md:hidden pt-24 px-6 overflow-y-auto"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Navigation</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between group"
                  >
                    <span className={`text-4xl font-black transition-colors ${
                      location.pathname === link.path ? 'text-navy_blue' : 'text-slate-200 hover:text-navy_blue'
                    }`}>
                      {link.name}
                    </span>
                    <ArrowRight className={`w-6 h-6 transition-transform ${
                      location.pathname === link.path ? 'text-saffron translate-x-0' : 'text-slate-100 -translate-x-4 opacity-0'
                    }`} />
                  </Link>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Regional Edition</p>
                  <span className="text-xs font-black text-saffron">{selectedState}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {states.map(state => (
                    <button 
                      key={state}
                      onClick={() => {
                        setSelectedState(state);
                        setIsMenuOpen(false);
                      }}
                      className={`p-4 rounded-2xl text-[10px] font-black text-center transition-all ${
                        selectedState === state 
                          ? 'bg-navy_blue text-white shadow-xl shadow-navy_blue/20' 
                          : 'bg-slate-50 text-navy_blue active:scale-95'
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

