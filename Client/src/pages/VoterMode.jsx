import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, Landmark, ShieldCheck, Fingerprint, MapPin, Search, ChevronRight, ArrowLeft } from 'lucide-react';
import VoterID3D from '../components/VoterID3D';

const stepsData = [
  {
    title: "Eligibility Check",
    description: "Are you 18 or above? Do you have an EPIC card?",
    icon: <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />,
    color: "bg-blue-500",
    content: (
      <div className="space-y-2">
        <p className="text-xs md:text-sm font-bold text-blue-800 uppercase tracking-wide mb-2">Requirements</p>
        <ul className="text-xs md:text-sm text-blue-700 space-y-1 font-medium">
          <li>• Must be an Indian Citizen</li>
          <li>• 18 years of age on qualifying date</li>
          <li>• Ordinarily resident in constituency</li>
          <li>• Not disqualified for any reason</li>
        </ul>
      </div>
    )
  },
  {
    title: "Voter List Search",
    description: "Find your name on the electoral roll.",
    icon: <Search className="w-5 h-5 md:w-6 md:h-6" />,
    color: "bg-saffron",
    content: (
      <div className="text-center">
        <p className="text-xs md:text-sm text-slate-600 font-medium mb-4">
          Visit <a href="https://electoralsearch.eci.gov.in" target="_blank" className="text-saffron font-bold underline">electoralsearch.eci.gov.in</a>
        </p>
        <div className="mt-4 rounded-3xl overflow-hidden border border-slate-100 shadow-inner bg-white/50">
           <VoterID3D height="200px" interactive={false} />
        </div>
      </div>
    )
  },
  {
    title: "At the Polling Station",
    description: "Identification and finger marking.",
    icon: <Fingerprint className="w-5 h-5 md:w-6 md:h-6" />,
    color: "bg-purple-500",
    content: (
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-100 rounded-xl">
          <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Officer 1</p>
          <p className="text-xs font-bold text-slate-700">Verifies your ID</p>
        </div>
        <div className="p-3 bg-slate-100 rounded-xl">
          <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Officer 2</p>
          <p className="text-xs font-bold text-slate-700">Marks finger</p>
        </div>
      </div>
    )
  },
  {
    title: "The Voting Compartment",
    description: "Secret ballot using EVM and VVPAT.",
    icon: <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />,
    color: "bg-green-600",
    content: (
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl shadow-sm border border-green-100 flex items-center justify-center font-black text-green-600 text-xs">EVM</div>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl shadow-sm border border-green-100 flex items-center justify-center font-black text-green-600 text-[8px]">VVPAT</div>
        </div>
        <p className="text-xs md:text-sm text-green-800 font-medium">
          Press button next to candidate. Wait for beep. Check VVPAT slip for 7 seconds.
        </p>
      </div>
    )
  }
];

export default function VoterMode({ selectedState }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = stepsData;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen bg-slate-50 pt-32 md:pt-48 pb-20 overflow-x-hidden selection:bg-saffron/30 selection:text-navy_blue"
    >
      {/* Background Decor */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[200%] md:w-[150%] h-[500px] md:h-[800px] bg-gradient-to-b from-saffron/10 via-white to-transparent -z-10 rounded-[100%] blur-[80px] md:blur-[120px] opacity-60" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-tricolor_green/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-start">
          {/* Left: Info */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-12 md:mb-20"
            >
              <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-2xl shadow-navy_blue/5 border border-slate-100 mb-8 md:mb-12">
                <Landmark className="w-4 h-4 text-saffron" />
                <span className="text-[10px] font-black text-navy_blue uppercase tracking-[0.2em]">Civic Education Portal</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-navy_blue mb-6 md:mb-10 leading-[0.9] tracking-tighter">
                Every Vote <br />
                <span className="text-saffron relative inline-block">
                  Counts.
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute -bottom-2 left-0 h-2 bg-saffron/20 rounded-full" 
                  />
                </span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-400 font-medium leading-relaxed max-w-xl">
                Walking you through the democratic process in {selectedState}. From registration to the booth.
              </p>
            </motion.div>

            <div className="space-y-4 md:space-y-6">
              {steps.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full flex items-center gap-4 md:gap-8 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] transition-all duration-500 text-left group relative overflow-hidden ${
                    activeStep === idx 
                      ? 'bg-white shadow-[0_40px_80px_-20px_rgba(10,25,47,0.1)] border-slate-100 z-10' 
                      : 'hover:bg-slate-50 border-transparent opacity-60'
                  } border`}
                >
                  <div className={`w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-xl transition-transform duration-500 group-hover:scale-110 ${
                    activeStep === idx ? s.color : 'bg-slate-200'
                  }`}>
                    {s.icon}
                  </div>
                  <div className="flex-grow relative z-10">
                    <h3 className={`text-xl md:text-3xl font-black tracking-tight mb-1 ${activeStep === idx ? 'text-navy_blue' : 'text-slate-400'}`}>
                      {s.title}
                    </h3>
                    <p className="text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-widest hidden sm:block opacity-60">Phase {idx + 1}</p>
                  </div>
                  {activeStep === idx && (
                    <motion.div layoutId="arrow" className="hidden md:block">
                      <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center">
                        <ChevronRight className="w-6 h-6 text-saffron" />
                      </div>
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Interactive Display */}
          <div className="relative order-1 lg:order-2 lg:sticky lg:top-40">
            <div className="absolute inset-0 bg-saffron/5 blur-[120px] rounded-full" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="relative bg-white rounded-[4rem] md:rounded-[5rem] p-8 md:p-16 shadow-[0_50px_100px_-30px_rgba(10,25,47,0.2)] border border-slate-100 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-64 h-64 opacity-[0.03] ${steps[activeStep].color} rounded-bl-full`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center text-white shadow-2xl ${steps[activeStep].color}`}>
                      {steps[activeStep].icon}
                    </div>
                    <div className="px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {activeStep + 1} of {steps.length}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-4xl md:text-6xl font-black text-navy_blue mb-6 tracking-tighter leading-none">
                    {steps[activeStep].title}
                  </h2>
                  <p className="text-lg md:text-2xl text-slate-400 font-medium mb-12 md:mb-16 leading-relaxed">
                    {steps[activeStep].description}
                  </p>

                  <div className="bg-slate-50/50 rounded-[3rem] md:rounded-[4rem] p-6 md:p-12 border border-slate-100 shadow-inner">
                    {steps[activeStep].content}
                  </div>

                  <div className="mt-12 md:mt-24 pt-10 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                        disabled={activeStep === 0}
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-slate-200 transition-all duration-500 ${
                          activeStep === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-navy_blue hover:text-white hover:border-navy_blue shadow-md hover:shadow-2xl active:scale-90'
                        }`}
                        aria-label="Previous Stage"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="flex gap-2">
                        {steps.map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              i === activeStep ? 'w-10 bg-saffron shadow-[0_0_15px_rgba(255,153,51,0.5)]' : 'w-2.5 bg-slate-200'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                      disabled={activeStep === steps.length - 1}
                      className={`flex items-center gap-4 font-black transition-all duration-500 text-xs md:text-sm uppercase tracking-widest active:scale-95 ${
                        activeStep === steps.length - 1 ? 'opacity-20 cursor-not-allowed text-slate-400' : 'text-navy_blue hover:text-saffron group'
                      }`}
                    >
                      <span className="hidden sm:block">Next Stage</span>
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ${
                        activeStep === steps.length - 1 ? 'bg-slate-200' : 'bg-navy_blue text-white group-hover:bg-saffron group-hover:shadow-saffron/40'
                      }`}>
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}