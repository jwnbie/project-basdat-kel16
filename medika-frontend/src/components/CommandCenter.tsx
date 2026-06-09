import React, { useState, useEffect } from 'react';
import { UserCircle, Wallet, Stethoscope, BedDouble, Loader2, BellRing, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence, animate } from 'framer-motion';

// ==========================================
// 1. FUNGSI FORMAT UANG & ANIMASI ANGKA
// ==========================================
const formatCompactCurrency = (value: number) => {
  if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1).replace('.0', '')}B`;
  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1).replace('.0', '')}M`;
  return `Rp ${Math.round(value).toLocaleString('id-ID')}`;
};

const AnimatedNumber = ({ value, isCurrency }: { value: number, isCurrency: boolean }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return controls.stop;
  }, [value]);

  if (isCurrency) return <>{formatCompactCurrency(display)}</>;
  return <>{Math.round(display).toLocaleString('id-ID')}</>;
};

export const CommandCenter = () => {
  const [stats, setStats] = useState({ patientsCount: 0, revenueCount: 0, doctorsCount: 0, roomsCount: 0, pendingCount: 0 });
  const [loading, setLoading] = useState(true);
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://project-basdat-kel16.onrender.com/api/dashboard/stats')
      .then(res => res.json())
      .then(statsData => {
        setStats(statsData);
        fetch('https://project-basdat-kel16.onrender.com/api/billing')
          .then(res => res.json())
          .then(billingData => {
            const pending = billingData.filter((item: any) => item.status.toLowerCase() === 'pending');
            setPendingTasks(pending);
            setLoading(false);
          }).catch(() => setLoading(false));
      }).catch(() => setLoading(false));
  }, []);

  const metricCards = [
    { title: 'Total Patients', rawValue: stats.patientsCount, label: 'Active Records', icon: UserCircle, isCurrency: false },
    { title: 'Total Income', rawValue: stats.revenueCount, label: 'Cleared Audit', icon: Wallet, isCurrency: true },
    { title: 'Active Staff', rawValue: stats.doctorsCount, label: 'Medical Personnel', icon: Stethoscope, isCurrency: false },
    { title: 'Available Wards', rawValue: stats.roomsCount, label: 'Ready Facilities', icon: BedDouble, isCurrency: false },
  ];

  return (
    <div className="w-full flex flex-col h-full relative">
      
      {/* ========================================== */}
      {/* BACKGROUND ORGANIC FLUID (Z-0) - DIJAMIN MUNCUL! */}
      {/* ========================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
        {/* Shape 1: Kanan Atas (Ungu Primary) */}
        <motion.div 
          animate={{ 
            borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
            rotate: [0, 15, 0],
            scale: [1, 1.05, 1]
          }} 
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute -top-32 -right-20 w-[45rem] h-[45rem] bg-primary/20 blur-[80px]" 
        />
        
        {/* Shape 2: Kiri Tengah (Soft Blue/Purple) */}
        <motion.div 
          animate={{ 
            borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%"],
            x: [0, 40, 0],
            y: [0, 20, 0]
          }} 
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-40 -left-32 w-[40rem] h-[40rem] bg-blue-500/10 blur-[90px]" 
        />

        {/* Shape 3: Bawah Kanan (Pinkish Purple) */}
        <motion.div 
          animate={{ 
            borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 20% 80% / 25% 80% 20% 75%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
            x: [0, -30, 0]
          }} 
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute -bottom-40 right-20 w-[35rem] h-[35rem] bg-purple-400/15 blur-[80px]" 
        />
      </div>

      {/* ========================================== */}
      {/* SEMUA KONTEN DI BAWAH INI PAKAI Z-10 AGAR DI ATAS BACKGROUND */}
      {/* ========================================== */}
      
      {/* HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-start justify-start text-left pt-16 pb-12 px-4 w-full max-w-6xl mx-auto"
      >
        <h1 className="text-[3.5rem] md:text-[5rem] text-on-surface tracking-tighter leading-[1.05] mb-6" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900 }}>
          Manage Faster.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Grow Smarter.</span>
        </h1>
        
        <p className="text-2xl md:text-3xl text-on-surface mb-3" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
          Hallo, <span className="text-primary">Aini!</span>
        </p>
        <p className="font-sans text-xs md:text-sm font-medium text-on-surface-variant max-w-xl leading-relaxed">
          You are currently overseeing the complete daily operational cycle of Sejahtera Medika.
        </p>
      </motion.div>

      {/* GRID STATISTIK (GLASSMORPHISM) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 mb-14 text-center">
        {loading ? (
           <div className="flex items-center justify-center py-12"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {metricCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div 
                  key={idx} whileHover={{ y: -8 }}
                  // Efek Kaca (Glassmorphism) transparan
                  className="bg-white/60 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-white shadow-[0_12px_40px_rgb(0,0,0,0.06)] flex flex-col items-center justify-center group text-center"
                >
                  <div className="w-14 h-14 mb-6 rounded-2xl bg-white shadow-sm border border-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Icon className="w-7 h-7 stroke-[2]" />
                  </div>
                  <span className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">
                    {card.title}
                  </span>
                  <h2 className="text-3xl md:text-4xl text-on-surface tracking-tight mt-1" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}>
                    <AnimatedNumber value={card.rawValue} isCurrency={card.isCurrency} />
                  </h2>
                  <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-widest block mt-2">
                    {card.label}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* ACTION BANNER (GLASSMORPHISM) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-left">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full bg-white/70 backdrop-blur-3xl rounded-[2.5rem] border border-white shadow-[0_12px_40px_rgb(0,0,0,0.06)] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="flex items-center gap-6 w-full relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                <BellRing className="w-7 h-7" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-xl text-on-surface tracking-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}>
                  {stats.pendingCount > 0 ? "Critical Action: Invoices Review" : "System Status Optimal"}
                </h3>
                <p className="font-sans text-[13px] font-medium text-on-surface-variant leading-relaxed">
                  {stats.pendingCount > 0 ? (
                    <><strong className="text-primary">{stats.pendingCount} pending approvals</strong> require your signature to proceed.</>
                  ) : (
                    "All clear! There are no pending approvals requiring your signature."
                  )}
                </p>
              </div>
          </div>
          <button 
            onClick={() => setIsActionCenterOpen(true)}
            className="relative z-10 w-full md:w-auto px-8 py-4 rounded-2xl bg-white text-primary font-bold text-xs uppercase tracking-widest shrink-0 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm border border-primary/10 flex items-center justify-center gap-2" 
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Open Action Center <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
      
      {/* Beri ruang kosong di bawah biar scrollable enak */}
      <div className="pb-32"></div>

      {/* MODAL ACTION CENTER */}
      <AnimatePresence>
        {isActionCenterOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsActionCenterOpen(false)} className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm cursor-pointer" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white/95 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-white overflow-hidden text-left"
            >
              <div className="px-8 py-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest/50">
                <div>
                  <h3 className="text-xl text-on-surface" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900 }}>Action Center</h3>
                  <p className="font-sans text-[11px] font-bold text-primary uppercase tracking-widest mt-1">Pending Clearances</p>
                </div>
                <button onClick={() => setIsActionCenterOpen(false)} className="p-2 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-all"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                {pendingTasks.length === 0 ? (
                  <div className="text-center py-10">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <p className="text-lg text-on-surface" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>All Caught Up!</p>
                    <p className="font-sans text-sm text-on-surface-variant mt-1">No pending actions require your signature.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingTasks.map((task, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-primary/20 bg-white shadow-sm">
                        <div>
                          <p className="text-sm text-on-surface" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>{task.id}</p>
                          <p className="font-sans text-xs text-on-surface-variant mt-0.5">Billed to: {task.patient}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-primary" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>{task.amount}</p>
                          <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline mt-1">Sign & Approve →</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};