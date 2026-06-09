import React, { useState, useEffect } from 'react';
import { Loader2, Search, Users, BedDouble, User } from 'lucide-react';
import { motion } from 'framer-motion';

// Gunakan 'export' biasa agar konsisten dengan import { PatientsDirectory }
export const PatientsDirectory = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/patients')
      .then(res => res.json())
      .then(data => { setPatients(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const filteredPatients = patients.filter(p => {
    const typeMatch = activeFilter === 'ALL' || 
                      (activeFilter === 'IN-PATIENT' && p.type?.toLowerCase() === 'in-patient') ||
                      (activeFilter === 'OUT-PATIENT' && p.type?.toLowerCase() === 'out-patient');
    const query = searchQuery.toLowerCase();
    const searchMatch = p.name?.toLowerCase().includes(query) || 
                        p.id?.toLowerCase().includes(query) || 
                        p.diagnosis?.toLowerCase().includes(query);
    return typeMatch && searchMatch;
  });

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-[2rem] font-extrabold text-on-surface leading-none">Patients Directory</h1>
        <p className="text-[0.75rem] font-bold text-outline uppercase tracking-[0.2em] mt-2">HOSPITAL PATIENT OVERVIEW</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'ALL PATIENTS', count: patients.length, icon: Users },
          { label: 'IN-PATIENT', count: patients.filter(p => p.type?.toLowerCase() === 'in-patient').length, icon: BedDouble },
          { label: 'OUT-PATIENT', count: patients.filter(p => p.type?.toLowerCase() === 'out-patient').length, icon: User }
        ].map((stat, i) => (
          <div key={i} className="bg-primary p-8 rounded-[2rem] text-white shadow-lg flex flex-col items-center justify-center text-center">
            <stat.icon size={32} className="opacity-40 mb-3" />
            <div className="text-4xl font-extrabold">{stat.count}</div>
            <p className="text-[11px] font-bold tracking-[0.2em] opacity-80 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-outline-variant/30 shadow-sm">
        <div className="flex gap-2">
          {['ALL', 'IN-PATIENT', 'OUT-PATIENT'].map(filter => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-6 py-2.5 rounded-xl font-bold text-xs ${activeFilter === filter ? 'bg-primary text-white' : 'bg-gray-100'}`}>
              {filter}
            </button>
          ))}
        </div>
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-3 text-outline" size={16} />
          <input type="text" onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full h-10 pl-10 pr-4 rounded-xl border border-outline-variant/40 text-xs" />
        </div>
      </div>

      <div className="w-full bg-white rounded-[2rem] border border-outline-variant/40 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-container-lowest/30">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold uppercase text-outline">ID Number</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase text-outline">Patient Profile</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase text-outline">Diagnosis</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase text-outline text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan={4} className="text-center py-10"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr> : 
            filteredPatients.map((p: any) => (
              <motion.tr key={p.id} className="hover:bg-primary/5">
                <td className="px-8 py-5 text-[13px] font-bold">{p.id}</td>
                <td className="px-8 py-5 font-bold">{p.name}</td>
                <td className="px-8 py-5 text-[13px]">{p.diagnosis}</td>
                <td className="px-8 py-5 text-center"><span className="text-[10px] font-bold bg-gray-100 px-3 py-1 rounded-full uppercase">{p.status}</span></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};