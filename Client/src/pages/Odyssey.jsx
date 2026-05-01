import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Calendar, FileText, Search, Megaphone, VolumeX, Vote, BarChart3, Landmark, CheckCircle2, Sparkles, Play, ChevronDown, ChevronUp } from 'lucide-react';

const stateInfo = {
  'Tamil Nadu': { seats: 234, majority: 118 },
  'Uttar Pradesh': { seats: 403, majority: 202 },
  'Maharashtra': { seats: 288, majority: 145 },
  'West Bengal': { seats: 294, majority: 148 },
  'Andhra Pradesh': { seats: 175, majority: 88 },
  'Karnataka': { seats: 224, majority: 113 },
  'Bihar': { seats: 243, majority: 122 },
};

const getTimelineStages = (state) => {
  const info = stateInfo[state] || { seats: 'all', majority: 'a majority' };
  return [
  {
    id: 'announcement',
    title: 'Election Announced',
    description: 'ECI declares dates. Model Code of Conduct (MCC) begins.',
    icon: <Calendar className="w-6 h-6" />,
    details: `The Election Commission of India holds a press conference to announce the schedule for the ${info.seats} constituencies.`
  },
  {
    id: 'nomination',
    title: 'Nomination Filing',
    description: 'Candidates file affidavits. Security deposit submitted.',
    icon: <FileText className="w-6 h-6" />,
    details: 'Candidates must submit their nomination papers to the Returning Officer of their respective constituency.'
  },
  {
    id: 'scrutiny',
    title: 'Scrutiny & Withdrawal',
    description: 'Nominations verified. Candidates can withdraw names.',
    icon: <Search className="w-6 h-6" />,
    details: 'ECI officials verify the legitimacy of candidates. This is the last chance for independent candidates to finalize their entry.'
  },
  {
    id: 'campaign',
    title: 'Campaign Period',
    description: 'Public rallies, manifestos, and door-to-door visits.',
    icon: <Megaphone className="w-6 h-6" />,
    details: 'Political parties and candidates reach out to voters. All campaigning must stop 48 hours before polling starts.'
  },
  {
    id: 'silent',
    title: 'Silent Period',
    description: 'Campaigning stops. Voters reflect before the big day.',
    icon: <VolumeX className="w-6 h-6" />,
    details: 'The 48 hours leading up to the election are strictly monitored to ensure no undue influence is exerted on voters.'
  },
  {
    id: 'polling',
    title: 'Polling Day',
    description: 'Voters head to booths. EVM and VVPAT used.',
    icon: <Vote className="w-6 h-6" />,
    details: 'Millions of citizens cast their vote across thousands of polling stations in the state.'
  },
  {
    id: 'counting',
    title: 'Counting Day',
    description: 'Votes counted. Trends and winners emerge.',
    icon: <BarChart3 className="w-6 h-6" />,
    details: `Results are declared for all ${info.seats} seats. The "Magic Number" to watch is ${info.majority}.`
  },
  {
    id: 'government',
    title: 'Government Formation',
    description: 'Majority party invited. CM is sworn in.',
    icon: <Landmark className="w-6 h-6" />,
    details: `The Governor invites the party or alliance with ${info.majority}+ seats to form the new ${state} government.`
  }
];
};

export default function Odyssey({ selectedState }) {
  const [activeStage, setActiveStage] = useState(null);
  const [simulationValue, setSimulationValue] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const info = stateInfo[selectedState] || { seats: 234, majority: 118 };
  const timelineStages = getTimelineStages(selectedState);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationValue(0);
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= info.majority) {
        setSimulationValue(info.majority);
        clearInterval(interval);
        setIsSimulating(false);
      } else {
        setSimulationValue(current);
      }
    }, 20);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative pb-24 overflow-x-hidden" 
      ref={containerRef}
    >
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-saffron z-110 origin-left shadow-[0_0_15px_rgba(255,153,51,0.5)]"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <div className="bg-navy_blue text-white pt-32 pb-24 px-4 md:pt-48 md:pb-40 overflow-hidden relative shadow-3xl">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-10 h-full">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-white/20" />
            ))}
          </div>
        </div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-saffron/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-tricolor_green/10 rounded-full blur-[100px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-saffron/20 text-saffron px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-[10px] md:text-xs mb-8 md:mb-10 uppercase tracking-widest border border-saffron/30"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            The Election Journey
          </motion.div>
          <h1 className="text-fluid-h1 font-black mb-6 md:mb-10 tracking-tighter">
            The Voter's <span className="text-saffron">Odyssey</span>
          </h1>
          <p className="text-fluid-p text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
            Experience the 8 crucial stages of the {selectedState} Vidhan Sabha election. From announcement to the swearing-in of the Chief Minister.
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-6xl mx-auto px-4 mt-20 md:mt-32 relative">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 md:-translate-x-1/2" />

        <div className="space-y-16 md:space-y-32">
          {timelineStages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative flex items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Desktop/Mobile Dot */}
              <div className="absolute left-8 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-10 h-10 md:w-16 md:h-16 bg-white rounded-full border-4 border-saffron z-10 flex items-center justify-center shadow-2xl group">
                <span className="text-xs md:text-lg font-black text-navy_blue">{index + 1}</span>
                <div className="absolute inset-0 bg-saffron/10 rounded-full animate-ping" />
              </div>

              {/* Content Card */}
              <div className={`w-full md:w-[45%] pl-20 md:pl-0 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                <div 
                  onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
                  className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] shadow-xl border border-slate-100 hover:border-saffron/40 transition-all duration-500 cursor-pointer group relative overflow-hidden"
                >
                  <div className={`flex items-center gap-4 md:gap-6 mb-4 md:mb-6 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 text-navy_blue rounded-2xl md:rounded-3xl flex items-center justify-center group-hover:bg-saffron group-hover:text-white transition-all duration-500 border border-slate-100 group-hover:border-transparent">
                      {stage.icon}
                    </div>
                    <h3 className="text-xl md:text-3xl font-black text-navy_blue tracking-tight leading-none">{stage.title}</h3>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed mb-4 text-sm md:text-lg">{stage.description}</p>
                  
                  <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-saffron ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    {activeStage === stage.id ? 'Close Details' : 'View Breakdown'}
                    {activeStage === stage.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </div>

                  <AnimatePresence>
                    {activeStage === stage.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 border-t border-slate-100 mt-6 text-sm md:text-base text-slate-600 font-medium bg-slate-50 p-6 rounded-3xl italic leading-relaxed">
                          {stage.details}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Simulation Section */}
      <div className="max-w-5xl mx-auto px-4 mt-32 md:mt-48">
        <div className="bg-navy_blue p-8 md:p-24 rounded-[3rem] md:rounded-[5rem] shadow-3xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-saffron/10 rounded-full -mr-48 -mt-48 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tricolor_green/10 rounded-full -ml-48 -mb-48 blur-[100px]" />
          
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-10 md:mb-16"
            >
              <h2 className="text-3xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">Visualizing Majority Math</h2>
              <p className="text-white/60 text-base md:text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed px-4">
                {selectedState} has {info.seats} total seats. A party needs at least <strong>{info.majority} seats</strong> to form the government.
              </p>
            </motion.div>

            <div className="space-y-8 md:space-y-12 max-w-3xl mx-auto">
              <div className="flex justify-between text-[10px] md:text-xs font-black text-white/40 uppercase tracking-[0.3em] px-2">
                <span>Majority Mark: {info.majority}</span>
                <span>Total Seats: {info.seats}</span>
              </div>
              <div className="h-6 md:h-12 bg-white/5 rounded-full overflow-hidden p-1.5 border border-white/10 backdrop-blur-md">
                <motion.div 
                  className="h-full bg-gradient-to-r from-navy_blue via-saffron to-tricolor_green rounded-full shadow-[0_0_30px_rgba(255,153,51,0.4)] relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${(simulationValue / info.seats) * 100}%` }}
                >
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                </motion.div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 py-4">
                <div className="text-7xl md:text-9xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
                  {simulationValue}
                </div>
                {simulationValue >= info.majority && (
                   <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="flex items-center gap-3 bg-tricolor_green text-white px-8 py-4 rounded-3xl font-black text-sm md:text-base shadow-[0_20px_40px_-10px_rgba(18,136,7,0.4)] uppercase tracking-widest"
                   >
                     <CheckCircle2 className="w-6 h-6" />
                     Majority Secured
                   </motion.div>
                )}
              </div>

              <button
                onClick={startSimulation}
                disabled={isSimulating}
                className={`w-full md:w-auto px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 ${
                  isSimulating 
                    ? 'bg-white/10 text-white/40 cursor-wait' 
                    : 'bg-white text-navy_blue hover:bg-slate-100 shadow-2xl'
                }`}
              >
                <Play className={`w-5 h-5 ${isSimulating ? 'animate-pulse' : ''}`} />
                {simulationValue > 0 ? 'RESET SIMULATION' : 'START MAJORITY SIMULATION'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

