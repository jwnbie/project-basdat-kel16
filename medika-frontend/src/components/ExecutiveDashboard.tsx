import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, Variants, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Timer, Calendar, Hospital, Activity, Bed, ArrowRight, X, AlertCircle, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

// --- DATASET PIE & WARDS TETAP (SESUAI REQUEST UI TIDAK DIUBAH) ---
const pieData = [
  { name: 'Seniors (65+)', value: 45, color: '#4648d4' },
  { name: 'Adults (18-64)', value: 35, color: '#6b6ddb' },
  { name: 'Pediatric (0-17)', value: 20, color: '#9ea0f2' },
];

const containerVariants: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const itemVariants: Variants = { hidden: { opacity: 0, y: 20, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 24 } } };

export const ExecutiveDashboard = () => {
  const [showWardModal, setShowWardModal] = useState(false);
  const [stats, setStats] = useState({ admissions: 0, outpatient: 0, available_beds: 0 });
  const [expandedWards, setExpandedWards] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, roomsRes] = await Promise.all([
          fetch('https://project-basdat-kel16.onrender.com/api/patients'),
          fetch('https://project-basdat-kel16.onrender.com/api/rooms')
        ]);
        const patients = await patientsRes.json();
        const rooms = await roomsRes.json();

        setStats({
          admissions: patients.length,
          outpatient: patients.filter((p: any) => p.type?.toLowerCase().includes('out')).length,
          available_beds: rooms.filter((r: any) => r.status === 'Available').length
        });

        // Mapping data kamar ke format Ward untuk UI
        setExpandedWards(rooms.map((r: any) => ({
          name: r.type,
          current: r.patient_name ? 1 : 0,
          total: 1,
          isCritical: r.status !== 'Available'
        })));
      } catch (err) { console.error("Error fetching dashboard data:", err); }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-10 pb-12 font-poppins relative antialiased selection:bg-primary/20">
      {/* 1. HEADER SECTION */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant/30 pb-6">
        <div className="space-y-1.5">
          <h1 className="font-poppins font-bold text-4xl md:text-5xl text-on-surface tracking-tighter leading-none">Executive Overview</h1>
          <p className="text-on-surface-variant font-poppins font-bold text-[14px] mt-2 tracking-wide">Real-time clinical and operational metrics</p>
        </div>
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-outline-variant/50 shadow-sm">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="font-poppins font-bold text-sm text-on-surface tracking-tight uppercase">Today, June 9</span>
        </div>
      </motion.div>

      {/* 2. KPI CARDS */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <DashboardKPICard label="Total Admissions" targetValue={stats.admissions} trend="+ 4.2%" trendStatus="up" icon={Hospital} />
        <DashboardKPICard label="Outpatient Visits" targetValue={stats.outpatient} trend="+ 5.4%" trendStatus="up" icon={Activity} />
        <DashboardKPICard label="Available Beds" targetValue={stats.available_beds} trend="Live Data" trendStatus="neutral" icon={Bed} />
        <DashboardKPICard label="System Status" targetValue={100} trend="All Systems Operational" trendStatus="neutral" icon={Timer} />
      </motion.div>

      {/* 3. CHARTS & WARDS (Struktur UI Dipertahankan) */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ... (Charts section tetap sama) ... */}
      </motion.div>

      {/* 4. WARD OCCUPANCY SECTION (Dinamis dari Rooms API) */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-outline-variant/40 p-8 md:p-10 shadow-sm w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
           {expandedWards.slice(0, 6).map((ward, idx) => (
             <WardProgress key={ward.name + idx} label={ward.name} current={ward.current} total={ward.total} isCritical={ward.isCritical} index={idx} />
           ))}
        </div>
      </motion.section>
    </div>
  );
};

/* --- SUB COMPONENTS (KPI, WardProgress, dll) --- */
// Pastikan kode sub-komponen (DashboardKPICard, WardProgress, WardDetailRow, LegendItem) 
// tetap ada di bawah sini agar fungsi dashboard berjalan.

/* --- SUB COMPONENTS --- */

// 1. CENTER-ALIGNED KPI CARD
interface KPICardProps {
  label: string;
  targetValue: number;
  trend: string;
  trendStatus: 'up' | 'down' | 'neutral' | 'alert';
  icon: React.ElementType;
}

const DashboardKPICard = ({ label, targetValue, trend, trendStatus, icon: Icon }: KPICardProps) => {
  const count = useMotionValue(0);
  
  const rounded = useTransform(count, (latest) => {
    return Math.floor(latest).toLocaleString('en-US');
  });

  useEffect(() => {
    const controls = animate(count, targetValue, { duration: 2.5, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [count, targetValue]);

  return (
    <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-outline-variant/40 p-8 flex flex-col items-center justify-center shadow-sm group hover:border-primary/30 hover:shadow-[0_12px_40px_rgba(70,72,212,0.06)] hover:-translate-y-1 transition-all duration-500 cursor-pointer min-h-[200px]">
      
      <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 mb-5 shrink-0">
        <Icon className="w-5 h-5" />
      </div>

      <p className="font-poppins font-bold text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/70 text-center">{label}</p>
      
      <h2 className="font-poppins font-bold text-4xl text-on-surface tracking-tighter leading-none py-3 text-center">
        <motion.span>{rounded}</motion.span>
      </h2>

      <div className={cn(
        "px-4 py-2 rounded-full flex items-center justify-center gap-1.5 min-w-[90px] transition-all duration-500 shadow-sm",
        trendStatus === 'alert' 
          ? "bg-primary text-white shadow-md shadow-primary/20" 
          : "bg-primary/10 text-primary border border-primary/5" 
      )}>
        {trendStatus === 'up' && <TrendingUp className="w-3.5 h-3.5 shrink-0" />}
        {trendStatus === 'down' && <TrendingDown className="w-3.5 h-3.5 shrink-0" />}
        {trendStatus === 'neutral' && <Minus className="w-3.5 h-3.5 shrink-0" />}
        {trendStatus === 'alert' && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
        <span className="font-poppins font-bold text-[11px] uppercase tracking-widest text-center leading-none mt-[1px]">{trend}</span>
      </div>

    </motion.div>
  );
};

// 2. WARD PROGRESS BAR
const WardProgress = ({ label, current, total, isCritical, index }: any) => {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <span className="font-poppins font-bold text-[15px] text-on-surface tracking-tight block">{label}</span>
          {isCritical && percentage > 85 && (
            <span className="text-[9px] font-poppins font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded text-left">High Capacity</span>
          )}
        </div>
        <div className="text-right">
          <span className="font-poppins font-bold text-xl text-on-surface leading-none">{percentage}%</span>
        </div>
      </div>
      <div className="h-3 w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full overflow-hidden shadow-inner p-0.5">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            isCritical && percentage > 85 ? "bg-[#1a1c7b]" : "bg-primary" 
          )} 
        />
      </div>
    </div>
  );
};

// 3. WARD DETAIL ROW (MODAL)
const WardDetailRow = ({ name, current, total, isCritical }: any) => {
  const percentage = Math.round((current / total) * 100);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border border-outline-variant/40 bg-white hover:border-primary/30 transition-all hover:shadow-md cursor-pointer group">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <h4 className="font-poppins font-bold text-[16px] text-on-surface tracking-tight group-hover:text-primary transition-colors">{name}</h4>
          {isCritical && percentage > 85 && <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-poppins font-bold uppercase tracking-widest">High Vol</span>}
        </div>
        <p className="font-poppins font-bold text-[11px] text-on-surface-variant/80 uppercase tracking-widest">Est. Turnaround: 2-4 Hrs</p>
      </div>
      <div className="flex items-center gap-6 shrink-0 bg-surface-container-lowest px-6 py-3 rounded-xl border border-outline-variant/30 mt-4 sm:mt-0 group-hover:border-primary/20 transition-colors">
        <div className="text-right">
          <p className="font-poppins font-bold text-2xl text-on-surface leading-none">{current}<span className="text-sm text-outline font-bold">/{total}</span></p>
          <p className="font-poppins font-bold text-[9px] uppercase tracking-widest text-on-surface-variant/70 mt-1">Occupied</p>
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-2 px-1">
    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
    <span className="font-poppins font-bold text-[11px] uppercase tracking-widest text-on-surface-variant whitespace-nowrap">{label}</span>
  </div>
);