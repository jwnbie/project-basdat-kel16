import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Hospital, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

// --- FLUID & ELEGANT ANIMATION ORCHESTRATION ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Jeda muncul antar elemen yang pas
      delayChildren: 0.5,    // Nunggu lautan gelombang muncul dulu
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.5, // Durasi panjang biar smooth
      ease: [0.16, 1, 0.3, 1], // Cinematic Apple-style curve (SANGAT SMOOTH, NO KAKU)
    },
  },
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="relative min-h-screen bg-[#0a0b2e] flex flex-col items-center justify-center font-poppins overflow-hidden selection:bg-white/20">
      
      {/* --- HIGH-END AESTHETIC BACKGROUND SYSTEM --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* 1. Base Deep Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#2a2c85_0%,_#0a0b2e_60%)]" />

        {/* 2. Subtle Digital Neural Mesh Pattern */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* 3. Dynamic High-End Light Orbs (Fluid Movement) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2, x: [0, 60, -30, 0], y: [0, -40, 20, 0] }} 
          transition={{ 
            opacity: { duration: 3 },
            x: { duration: 22, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 25, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary rounded-full blur-[120px]" 
        />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15, x: [0, -50, 20, 0], y: [0, 50, -20, 0] }} 
          transition={{ 
            opacity: { duration: 3 },
            x: { duration: 28, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 24, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] bg-[#4648d4] rounded-full blur-[140px]" 
        />

        {/* 4. LAYERED FLUID WAVES */}
        <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0">
          
          {/* Wave 1: Deep Aura (Gerak Kiri-Kanan & Naik-Turun) */}
          <motion.svg 
            animate={{ x: ['0%', '-5%', '0%'], y: [0, -25, 0], scaleY: [1, 1.05, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 w-[120%] -left-[10%] h-[70vh] opacity-10" 
            preserveAspectRatio="none" viewBox="0 0 1440 320"
          >
            <path fill="#4648d4" d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,149.3C672,117,768,75,864,80C960,85,1056,139,1152,144C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </motion.svg>
          
          {/* Wave 2: Frosted Glass Layer (Gerak berlawanan dari Wave 1) */}
          <motion.svg 
            animate={{ x: ['0%', '5%', '0%'], y: [0, 20, 0], scaleY: [1, 0.95, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 w-[120%] -left-[10%] h-[60vh] opacity-[0.04]" 
            preserveAspectRatio="none" viewBox="0 0 1440 320"
          >
            <path fill="#ffffff" d="M0,64L40,85.3C80,107,160,149,240,149.3C320,149,400,107,480,117.3C560,128,640,192,720,202.7C800,213,880,171,960,138.7C1040,107,1120,85,1200,90.7C1280,96,1360,128,1400,144L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
          </motion.svg>
          
          {/* Wave 3: Sharp Bottom Highlight (HANYA GERAK KIRI-KANAN) */}
          <motion.svg 
            animate={{ x: ['0%', '-3%', '0%'] }} // Gerak Y sudah dihapus!
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-1px] w-[120%] -left-[10%] h-[30vh] opacity-[0.08]" 
            preserveAspectRatio="none" viewBox="0 0 1440 320"
          >
            <path fill="#ffffff" d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,208C840,192,960,128,1080,112C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </motion.svg>
        </motion.div>
      </div>

      {/* --- MAIN CONTENT (Smooth Fluid Entry) --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl px-6"
      >
        
        {/* LOGO */}
        <motion.div variants={itemVariants} className="flex items-center gap-3.5 mb-12">
          <div className="p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <Hospital className="w-8 h-8 text-white/90" />
          </div>
          <span className="font-poppins font-bold text-3xl text-white tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">Medika OS</span>
        </motion.div>

        {/* HEADLINES */}
        <div className="space-y-6">
          <motion.h1 variants={itemVariants} className="font-poppins font-bold text-3xl md:text-5xl lg:text-[3.8rem] text-white tracking-tighter leading-[1.12] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/80 drop-shadow-sm">
            Integrated Platform for <br className="hidden md:block" /> Executives & Medical Staff
          </motion.h1>
          <motion.p variants={itemVariants} className="font-poppins font-bold text-base md:text-xl text-white/60 tracking-wide mt-3 max-w-2xl mx-auto">
            Experience secure, swift, and centralized access to all hospital operational services.
          </motion.p>
        </div>

        {/* ACTION BUTTON WITH SWEEP LIGHT EFFECT */}
        <motion.div variants={itemVariants} className="mt-16 flex flex-col items-center">
          
          <button 
            onClick={onLogin}
            className="group relative overflow-hidden flex items-center gap-4 bg-white px-12 py-5 rounded-[1.3rem] hover:scale-[1.03] active:scale-[0.98] transition-all duration-500 ease-[0.16, 1, 0.3, 1] shadow-[0_20px_50px_rgba(70,72,212,0.3)] hover:shadow-[0_30px_70px_rgba(70,72,212,0.5)]"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />

            <ShieldCheck className="w-6 h-6 text-primary group-hover:rotate-[360deg] transition-transform duration-700 relative z-10" />
            <span className="font-poppins font-bold text-xl text-primary tracking-tight relative z-10">Sign in with Medika SSO</span>
          </button>

        </motion.div>

      </motion.div>
    </div>
  );
};