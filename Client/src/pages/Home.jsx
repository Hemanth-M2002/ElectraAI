import { motion } from 'framer-motion';
import { ChevronRight, Landmark, Users, Search, ShieldCheck, Zap, Sparkles, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home({ selectedState }) {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-saffron" />,
      title: "Constituency Explorer",
      desc: `Search every corner of ${selectedState}. Get real-time candidate data and MLA roles.`,
      link: "/explore",
      color: "from-saffron/20 to-transparent",
      tag: "LIVE DATA"
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: "The Odyssey",
      desc: "Interactive roadmap of the election cycle. Visualize the majority math.",
      link: "/odyssey",
      color: "from-blue-500/20 to-transparent",
      tag: "INTERACTIVE"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      title: "Voter Mode",
      desc: "First-time voter? Walk through the process from registration to the booth.",
      link: "/voter-mode",
      color: "from-emerald-500/20 to-transparent",
      tag: "EDUCATION"
    }
  ];

  const myths = [
    { m: "EVMs can be hacked via WiFi.", f: "EVMs are standalone devices with no network capabilities." },
    { m: "My vote won't change anything.", f: "Many historic seats were won by less than 100 votes." }
  ];

  return (
    <div className="relative pt-24 md:pt-40 pb-20 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[200%] md:w-[150%] h-[500px] md:h-[800px] bg-gradient-to-b from-saffron/10 via-white to-transparent -z-10 rounded-[100%] blur-[80px] md:blur-[120px] opacity-60" />
      
      <section className="max-w-7xl mx-auto px-4 text-center mb-16 md:mb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 md:gap-3 bg-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-2xl shadow-navy_blue/5 border border-slate-100 mb-6 md:mb-10"
        >
          <Sparkles className="w-3 md:w-4 h-3 md:h-4 text-saffron" />
          <span className="text-[8px] md:text-[10px] font-black text-navy_blue uppercase tracking-[0.2em]">Empowering Indian Democracy</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-fluid-h1 font-black text-navy_blue mb-6 md:mb-10 tracking-tighter"
        >
          The Heart of <br /> 
          <span className="text-saffron inline-block relative">
            {selectedState}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-2 left-0 h-1 md:h-2 bg-saffron/20 rounded-full" 
            />
          </span> Decides.
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-fluid-p text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-10 md:mb-16 px-4"
        >
          An immersive, non-partisan educational portal for the 2026 {selectedState} Vidhan Sabha. 
          Discover the power of your vote through data-driven interactive modules.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 px-6"
        >
          <Link to="/explore" className="btn-primary group !px-10">
            Start Exploring 
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/odyssey" className="btn-secondary group">
            View The Odyssey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100 transition-all" />
          </Link>
          <div className="flex items-center justify-center">
            <Link 
              to="/chat"
              className="group flex items-center gap-3 px-6 py-2 rounded-full hover:bg-navy_blue/5 transition-all text-navy_blue/60 hover:text-navy_blue font-bold text-sm"
            >
              <div className="w-8 h-8 bg-saffron/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4 text-saffron" />
              </div>
              Ask Electra AI
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 mb-24 md:mb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="h-full"
            >
              <Link to={f.link} className="block group h-full">
                <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 h-full border border-slate-100 shadow-xl group-hover:shadow-3xl group-hover:-translate-y-3 transition-all duration-500 relative overflow-hidden flex flex-col">
                  <div className={`absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-gradient-to-br ${f.color} -mr-16 md:-mr-24 -mt-16 md:-mt-24 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="relative flex-grow">
                    <div className="flex justify-between items-start mb-8 md:mb-12">
                      <div className="w-14 md:w-20 h-14 md:h-20 bg-slate-50 rounded-2xl md:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner group-hover:shadow-none border border-slate-100/50">
                        {f.icon}
                      </div>
                      <span className="text-[9px] md:text-[10px] font-black text-slate-300 tracking-[0.2em] bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{f.tag}</span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black text-navy_blue mb-4 md:mb-6 leading-tight group-hover:text-saffron transition-colors">{f.title}</h3>
                    <p className="text-slate-400 font-medium leading-relaxed mb-8 text-sm md:text-base">{f.desc}</p>
                  </div>
                  <div className="relative mt-auto flex items-center gap-2 text-saffron font-black text-xs md:text-sm group-hover:gap-4 transition-all">
                    LEARN MORE <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Myth vs Fact */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-navy_blue rounded-[3rem] md:rounded-[5rem] p-8 md:p-24 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(10,25,47,0.3)]">
          <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-saffron/10 rounded-full -mr-48 md:-mr-72 -mt-48 md:-mt-72 blur-[100px] md:blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-tricolor_green/10 rounded-full -ml-48 md:-ml-72 -mb-48 md:-mb-72 blur-[100px] md:blur-[150px]" />
          
          <div className="relative grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-6xl font-black text-white mb-6 md:mb-10 tracking-tighter leading-tight">
                Shielding Democracy from <span className="text-saffron">Misinformation.</span>
              </h2>
              <p className="text-white/60 text-base md:text-xl font-medium leading-relaxed mb-8 md:mb-12 max-w-lg">
                Understanding the truth behind the voting process is the first step toward a secure democracy.
              </p>
              <div className="flex items-center gap-4 text-white/40 font-black text-[10px] md:text-xs tracking-widest uppercase bg-white/5 w-fit px-6 py-3 rounded-2xl border border-white/10">
                 <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-saffron" />
                 Verified ECI Context
              </div>
            </motion.div>
            
            <div className="space-y-4 md:space-y-8">
              {myths.map((m, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  className="bg-white/5 border border-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] backdrop-blur-2xl transition-all group"
                >
                  <p className="text-saffron font-black text-[10px] md:text-xs uppercase mb-3 md:mb-4 tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Myth vs Fact
                  </p>
                  <p className="text-white text-base md:text-xl font-bold mb-4 md:mb-6 opacity-40 italic group-hover:opacity-60 transition-opacity leading-snug">"{m.m}"</p>
                  <div className="text-white text-lg md:text-2xl font-black flex items-start gap-3 md:gap-5 leading-tight group-hover:text-tricolor_green transition-colors">
                    <div className="shrink-0 mt-1">
                      <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-tricolor_green" />
                    </div>
                    {m.f}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckCircle(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>; }

