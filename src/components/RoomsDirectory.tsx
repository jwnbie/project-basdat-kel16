import React, { useState, useEffect } from 'react';
import { Loader2, Search, DoorOpen, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { motion, useSpring, useTransform } from 'framer-motion';

// Komponen Angka yang bergerak
const Counter = ({ value }: { value: number }) => {
  const spring = useSpring(0, { duration: 1000 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.div>{display}</motion.div>;
};

export const RoomsDirectory = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/rooms')
      .then(res => res.json())
      .then(data => { setRooms(data); setLoading(false); });
  }, []);

  const stats = [
    { label: 'TOTAL ROOMS', count: rooms.length, icon: DoorOpen },
    { label: 'AVAILABLE', count: rooms.filter(r => r.status === 'Available').length, icon: CheckCircle2 },
    { label: 'OCCUPIED', count: rooms.filter(r => r.status === 'Occupied').length, icon: AlertCircle }
  ];

  const filteredRooms = rooms.filter(r => {
    if (activeFilter === 'AVAILABLE' && r.status !== 'Available') return false;
    if (activeFilter === 'OCCUPIED' && r.status !== 'Occupied') return false;
    const query = searchQuery.toLowerCase();
    return r.id.toLowerCase().includes(query) || r.patient_name.toLowerCase().includes(query);
  });

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col">
        <h1 className="text-[2rem] font-extrabold text-on-surface leading-none">Rooms & Facilities</h1>
        <p className="text-[0.75rem] font-bold text-outline uppercase tracking-[0.2em] mt-2">HOSPITAL WARD & CAPACITY OVERVIEW</p>
      </div>

      {/* STATS DENGAN ANIMASI COUNTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-primary p-8 rounded-[2rem] text-white shadow-lg flex flex-col items-center justify-center text-center">
            <stat.icon size={32} className="opacity-40 mb-3" />
            <div className="text-4xl font-extrabold">
              <Counter value={stat.count} />
            </div>
            <p className="text-[11px] font-bold tracking-[0.2em] opacity-80 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-outline-variant/30 shadow-sm">
        <div className="flex gap-2">
          {['ALL', 'AVAILABLE', 'OCCUPIED'].map(filter => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-colors ${activeFilter === filter ? 'bg-primary text-white' : 'bg-surface-container-low hover:bg-surface-container-high'}`}>
              {filter}
            </button>
          ))}
        </div>
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-3 text-outline" size={16} />
          <input type="text" onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full h-10 pl-10 pr-4 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-xs" />
        </div>
      </div>

      {/* TABEL LENGKAP */}
      <div className="w-full bg-white rounded-[2rem] border border-outline-variant/40 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-container-lowest/30">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold uppercase text-outline">Room ID</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase text-outline">Type</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase text-outline">Patient Assigned</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase text-outline text-center">Status</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {loading ? <tr><td colSpan={5} className="text-center py-10"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr> : 
            filteredRooms.map((r: any) => (
              <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={r.id} className="hover:bg-primary/5 cursor-pointer">
                <td className="px-8 py-5 text-[13px] font-bold">{r.id}</td>
                <td className="px-8 py-5 text-[13px] font-medium">{r.type}</td>
                <td className="px-8 py-5 text-[13px]">{r.patient_name || '-'}</td>
                <td className="px-8 py-5 text-center">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${r.status === 'Available' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <ChevronRight size={18} className="text-outline inline" />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};