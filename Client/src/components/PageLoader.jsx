import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-white"
    >
      <div className="relative flex flex-col items-center">
        {/* Stylized Tricolor Ring */}
        <div className="relative w-24 h-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-saffron"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-[3px] border-transparent border-t-tricolor_green"
          />
          
          {/* Ashoka Chakra Centerpiece */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 rounded-full border-2 border-navy_blue/20 flex items-center justify-center relative"
            >
              <div className="w-1 h-1 bg-navy_blue rounded-full" />
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-px h-3 bg-navy_blue/40 origin-bottom"
                  style={{ transform: `rotate(${i * 30}deg) translateY(-4px)` }}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Text Loader */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-black text-navy_blue uppercase tracking-[0.4em]">Initializing</span>
          <div className="flex gap-1.5">
            <motion.div 
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0 }}
              className="w-1.5 h-1.5 bg-saffron rounded-full" 
            />
            <motion.div 
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
              className="w-1.5 h-1.5 bg-slate-200 rounded-full" 
            />
            <motion.div 
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
              className="w-1.5 h-1.5 bg-tricolor_green rounded-full" 
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
