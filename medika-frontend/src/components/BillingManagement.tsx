import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { Loader2, Search, Download, Receipt, FileSignature, TrendingUp, FileText, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

// Komponen Counter untuk Unchecked Billing
const Counter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, { duration: 1.5, onUpdate: (v) => setCount(Math.floor(v)) });
    return () => controls.stop();
  }, [value]);
  return <>{count}</>;
};

export const BillingManagement = () => {
  const [billing, setBilling] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_receivables: 0, pending_claims: 0, overdue_accounts: 0, unchecked_count: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All');
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({ id: '', patient_id: '', service: '', amount: '', status: 'Pending' });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resBilling, resStats] = await Promise.all([
        fetch('https://project-basdat-kel16.onrender.com/api/billing'),
        fetch('https://project-basdat-kel16.onrender.com/api/billing-stats')
      ]);
      setBilling(await resBilling.json());
      setStats(await resStats.json());
    } catch (err) { console.error("Error fetching billing data:", err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('https://project-basdat-kel16.onrender.com/api/billing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    });
    setShowModal(false);
    loadData();
  };

  const filteredData = billing.filter(item => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const matchesSearch = item.id?.toLowerCase().includes(search.toLowerCase()) || 
                          item.patient?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-bold text-4xl text-on-surface">Billing</h1>
          <p className="text-outline font-bold text-[11px] uppercase tracking-widest mt-1">REVENUE CYCLE MANAGEMENT</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-outline-variant/30 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50"><Download size={14} /> Export</button>
          <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg"><Receipt size={14} /> New Invoice</button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'TOTAL RECEIVABLES', val: `Rp ${(stats.total_receivables / 1000000).toFixed(0)}M`, icon: TrendingUp },
          { label: 'PENDING CLAIMS', val: `Rp ${(stats.pending_claims / 1000000).toFixed(0)}M`, icon: FileText },
          { label: 'OVERDUE ACCOUNTS', val: `Rp ${(stats.overdue_accounts / 1000000).toFixed(0)}M`, icon: AlertTriangle },
          { label: 'UNCHECKED BILLING', val: <Counter value={stats.unchecked_count} />, icon: FileSignature, isSpecial: true }
        ].map((s, i) => (
          <div key={i} className={cn("p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center text-center", s.isSpecial ? "bg-primary text-white" : "bg-white")}>
            <s.icon size={22} className={s.isSpecial ? "opacity-60 mb-4" : "text-primary mb-4"} />
            <p className={cn("text-[9px] font-bold uppercase tracking-widest", s.isSpecial ? "opacity-70" : "text-outline")}>{s.label}</p>
            <h2 className="text-2xl font-extrabold mt-1">{s.val}</h2>
          </div>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2">
            {(['All', 'Paid', 'Pending', 'Overdue'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} 
                className={cn("px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all", 
                activeTab === tab ? "bg-primary text-white shadow-md" : "bg-white border border-outline-variant/20 text-outline hover:bg-gray-50")}>
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-3 text-outline" size={14} />
            <input className="w-full pl-9 py-3 bg-gray-50 rounded-xl text-[11px] font-bold outline-none" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-outline uppercase text-[10px] font-bold tracking-widest border-b border-gray-100">
              <th className="pb-6">Invoice ID</th>
              <th className="pb-6">Patient</th>
              <th className="pb-6">Amount</th>
              <th className="pb-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={4} className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr> :
            filteredData.map((r) => (
              <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors">
                <td className="py-7 text-sm font-bold text-on-surface">{r.id}</td>
                <td className="py-7 text-sm font-bold text-on-surface">{r.patient}</td>
                <td className="py-7 text-sm font-bold text-on-surface">Rp {Number(r.amount).toLocaleString()}</td>
                <td className="py-7 text-center">
                  <span className="px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">{r.status}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL INPUT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-[2rem] w-96 space-y-4">
            <h2 className="font-bold text-lg">New Invoice</h2>
            <input placeholder="Invoice ID" className="w-full p-3 bg-gray-50 rounded-xl text-xs" onChange={e => setNewEntry({...newEntry, id: e.target.value})} />
            <input placeholder="Patient ID" className="w-full p-3 bg-gray-50 rounded-xl text-xs" onChange={e => setNewEntry({...newEntry, patient_id: e.target.value})} />
            <input placeholder="Amount" className="w-full p-3 bg-gray-50 rounded-xl text-xs" onChange={e => setNewEntry({...newEntry, amount: e.target.value})} />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowModal(false)} className="w-full py-3 rounded-xl border border-outline-variant text-[10px] font-bold uppercase">Cancel</button>
              <button onClick={handleAddInvoice} className="w-full py-3 rounded-xl bg-primary text-white text-[10px] font-bold uppercase">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};