import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, UserCircle, Wallet, FileText, Search, Bell, Settings, PlusCircle, X, ShieldAlert, Hospital, Stethoscope, BedDouble, Loader2, User, Receipt } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { CommandCenter } from './CommandCenter';
import { PatientsDirectory } from './PatientsDirectory';
import { BillingManagement } from './BillingManagement';
import { SystemReports } from './SystemReports';
import { DoctorsDirectory } from './DoctorsDirectory';
import { RoomsDirectory } from './RoomsDirectory';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewEntryClick: () => void;
}

export const Sidebar = ({ activeTab, setActiveTab, onNewEntryClick }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: UserCircle },
    { id: 'doctors', label: 'Medical Staff', icon: Stethoscope },
    { id: 'rooms', label: 'Rooms & Facilities', icon: BedDouble },
    { id: 'billing', label: 'Billing', icon: Wallet },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-white border-r border-outline-variant/40 py-6 px-5 fixed left-0 top-0 z-50 shadow-[2px_0_12px_rgba(0,0,0,0.01)]">
      
      {/* LOGO */}
      <div className="mb-8 px-1 flex items-center gap-3 shrink-0 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(70,72,212,0.1)] flex items-center justify-center transition-transform group-hover:scale-105 duration-500">
          <Hospital className="w-6 h-6 text-primary" />
        </div>
        <span 
          className="font-bold text-[22px] tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/60" 
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Medika OS
        </span>
      </div>

      {/* USER PROFILE CARD */}
      <div className="flex items-center gap-3 px-3 py-3 mb-6 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 shrink-0">
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-display font-black text-xs shrink-0">
           AN
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="font-display font-bold text-[13px] text-on-surface tracking-tight truncate">Aini Norris</p>
          <p className="font-sans text-[10px] font-extrabold text-on-surface-variant/80 uppercase tracking-wider block mt-0.5 whitespace-nowrap">
            Financial Director
          </p>
        </div>
      </div>

      {/* NAVIGATION MENUS */}
      <nav className="flex flex-col gap-1 flex-grow">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-200 group text-left w-full overflow-hidden",
                isActive 
                  ? "bg-primary/[0.05] text-primary" 
                  : "text-on-surface-variant/80 hover:bg-surface-container-low hover:text-on-surface"
              )}
            >
              {isActive && (
                <motion.div layoutId="sidebarActiveIndicator" className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-primary rounded-r-full" />
              )}
              <Icon className={cn("w-4 h-4 transition-all shrink-0", isActive ? "stroke-[2.5px]" : "group-hover:scale-105")} />
              <span className={cn("font-display text-[14px]", isActive ? "font-bold tracking-tight" : "font-semibold")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* NEW ENTRY BUTTON */}
      <button 
        onClick={onNewEntryClick}
        className="mt-auto flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl hover:bg-primary-900 transition-all font-display font-bold text-[13px] shadow-md shadow-primary/15 active:scale-[0.98] shrink-0 group"
      >
        <PlusCircle className="w-4 h-4 group-hover:scale-105 transition-transform" />
        New Entry
      </button>
    </aside>
  );
};

interface HeaderProps {
  onSettingsClick?: () => void;
  onResultClick: (type: 'patient' | 'billing' | 'report', data: any) => void;
}

export const Header = ({ onSettingsClick, onResultClick }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown kalau klik di luar area search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logika Fetch Search Database (Debounce 400ms)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setShowSearchDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setShowSearchDropdown(true);
      try {
        const response = await fetch(`https://project-basdat-kel16.onrender.com/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Gagal mencari:", error);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const executeResultClick = (type: 'patient' | 'billing' | 'report', data: any) => {
    onResultClick(type, data); 
    setShowSearchDropdown(false); 
    setSearchQuery(''); 
  };

  return (
    <header className="flex justify-between items-center w-full px-8 md:px-10 h-16 bg-white/60 backdrop-blur-xl sticky top-0 z-40 border-b border-outline-variant/20">
      <div className="flex items-center gap-6 flex-1">
         <div ref={searchContainerRef} className="relative hidden md:block w-full max-w-md z-50">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4 z-20 pointer-events-none" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
              placeholder="Search financial records, patient ID, name..."
              className="w-full h-9 pl-10 pr-8 rounded-xl border border-outline-variant/40 bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-xs font-sans relative z-20"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setShowSearchDropdown(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface z-20">
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* DROPDOWN HASIL PENCARIAN */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden z-[100] max-h-[60vh] flex flex-col">
                {isSearching ? (
                  <div className="p-6 flex flex-col items-center justify-center text-primary gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">Scanning Database...</span>
                  </div>
                ) : searchResults ? (
                  <div className="overflow-y-auto py-2">
                    
                    {searchResults.patients?.length > 0 && (
                      <div className="px-4 py-3">
                        <p className="px-3 font-display font-bold text-[10px] text-on-surface-variant/70 uppercase tracking-widest mb-2">Patients</p>
                        {searchResults.patients.map((p: any) => (
                          <div key={p.id} onClick={() => executeResultClick('patient', p)} className="w-full text-left flex items-center gap-3 p-3 hover:bg-primary/5 rounded-xl cursor-pointer transition-colors">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg"><User className="w-4 h-4" /></div>
                            <div className="leading-tight">
                              <p className="font-display font-bold text-[13px] text-on-surface">{p.name}</p>
                              <p className="font-sans font-medium text-[11px] text-on-surface-variant">{p.id} • {p.diagnosis}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {searchResults.billing?.length > 0 && (
                      <div className="px-4 py-3 border-t border-outline-variant/20">
                        <p className="px-3 font-display font-bold text-[10px] text-on-surface-variant/70 uppercase tracking-widest mb-2">Billing Records</p>
                        {searchResults.billing.map((b: any) => (
                          <div key={b.id} onClick={() => executeResultClick('billing', b)} className="w-full text-left flex items-center justify-between p-3 hover:bg-primary/5 rounded-xl cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg"><Receipt className="w-4 h-4" /></div>
                              <div className="leading-tight">
                                <p className="font-display font-bold text-[13px] text-on-surface">{b.id}</p>
                                <p className="font-sans font-medium text-[11px] text-on-surface-variant">{b.patient}</p>
                              </div>
                            </div>
                            <span className="font-sans font-bold text-[12px] text-on-surface">{b.amount}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {(!searchResults.patients?.length && !searchResults.billing?.length && !searchResults.reports?.length) && (
                      <div className="p-6 text-center">
                        <p className="font-sans font-medium text-[12px] text-on-surface-variant">No records found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
         </div>
      </div>
      
      <div className="flex items-center gap-4 relative">
        <div className="flex items-center bg-surface-container-low/80 p-1 rounded-xl border border-outline-variant/20 relative">
          <button className="text-on-surface-variant hover:bg-white hover:text-primary transition-all p-1.5 rounded-lg relative active:scale-95 z-50">
            <Bell className="w-4 h-4" />
          </button>
          <button onClick={onSettingsClick} className="text-on-surface-variant hover:bg-white hover:text-primary transition-all p-1.5 rounded-lg active:scale-95">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        <div className="w-[1px] h-6 bg-outline-variant/30 mx-0.5" />
        <div onClick={onSettingsClick} className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-display font-black text-[11px] shadow-md shadow-primary/10 cursor-pointer active:scale-95 transition-transform">
           AN
        </div>
      </div>
    </header>
  );
};

export default function Layout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [detailModal, setDetailModal] = useState<{type: 'patient' | 'billing' | 'report', data: any} | null>(null);

  const handleGlobalNavigation = (type: 'patient' | 'billing' | 'report', data: any) => {
    if (type === 'patient') setActiveTab('patients');
    if (type === 'billing') setActiveTab('billing');
    if (type === 'report') setActiveTab('reports');
    
    setTimeout(() => {
      setDetailModal({ type, data });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-on-surface selection:bg-primary/10 flex flex-col">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onNewEntryClick={() => setIsNewEntryOpen(true)} />
      
      <div className="md:pl-64 flex flex-col min-h-screen flex-grow">
        <Header onSettingsClick={() => setActiveTab('settings')} onResultClick={handleGlobalNavigation} />
        
        <main className="flex-1 px-8 md:px-10 py-8 relative z-0 flex flex-col justify-between">
          
          {/* DIV SAKTI: Menggunakan kombinasi key dan Tailwind CSS animate-in utk bypass deadlock Framer Motion */}
          <div className="flex-grow animate-in fade-in duration-300" key={activeTab}>
            {activeTab === 'dashboard' && <CommandCenter />}
            {activeTab === 'patients' && <PatientsDirectory />}
            {activeTab === 'doctors' && <DoctorsDirectory />}
            {activeTab === 'rooms' && <RoomsDirectory />}
            {activeTab === 'billing' && <BillingManagement />}
            {activeTab === 'reports' && <SystemReports />}
            {activeTab === 'settings' && (
              <div className="p-6 text-center border border-outline-variant/40 bg-white rounded-3xl max-w-md mx-auto mt-12 shadow-sm relative z-10">
                <h2 className="font-display font-black text-xl text-primary">System Parameters</h2>
                <p className="text-on-surface-variant font-sans text-xs mt-2">Global configuration options are accessible here.</p>
                <div className="mt-6 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between">
                  <span className="font-sans font-bold text-[12px] text-on-surface">System Version</span>
                  <span className="font-sans font-bold text-[12px] text-primary">v2.4.1 Build 8092</span>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <footer className="mt-16 pb-4 pt-6 border-t border-outline-variant/20 text-center w-full">
            <p className="font-sans text-[11px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
              Medika Hospital OS | © 2026 RS Sejahtera Medika - Precision in Care
            </p>
          </footer>
        </main>
      </div>

      {/* MODAL DETAIL SEARCH DROPDOWN */}
      <AnimatePresence>
        {detailModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetailModal(null)} className="absolute inset-0 bg-on-surface/50 backdrop-blur-sm cursor-pointer" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 16 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-[0_24px_60px_rgba(0,0,0,0.12)] border border-outline-variant/50 overflow-hidden"
            >
              <div className="px-8 py-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
                <h3 className="font-display font-black text-lg text-on-surface">
                  {detailModal.type === 'patient' ? 'Patient Overview' : detailModal.type === 'billing' ? 'Invoice Details' : 'Report Details'}
                </h3>
                <button onClick={() => setDetailModal(null)} className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-8">
                {detailModal.type === 'patient' && (
                  <>
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-2xl">
                        {detailModal.data.initials}
                      </div>
                      <div>
                        <h2 className="font-display font-bold text-2xl text-on-surface">{detailModal.data.name}</h2>
                        <p className="font-sans text-sm text-on-surface-variant font-medium">{detailModal.data.id} - {detailModal.data.type}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
                        <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Diagnosis</p>
                        <p className="font-sans font-bold text-sm text-on-surface">{detailModal.data.diagnosis}</p>
                      </div>
                      <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
                        <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Department</p>
                        <p className="font-sans font-bold text-sm text-on-surface">{detailModal.data.dept}</p>
                      </div>
                      <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
                        <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Status</p>
                        <p className={cn("font-sans font-bold text-sm", detailModal.data.status === 'Critical' ? 'text-error' : 'text-primary')}>{detailModal.data.status}</p>
                      </div>
                    </div>
                  </>
                )}

                {detailModal.type === 'billing' && (
                  <>
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center"><Receipt className="w-8 h-8" /></div>
                      <div>
                        <h2 className="font-display font-bold text-2xl text-on-surface">{detailModal.data.id}</h2>
                        <p className="font-sans text-sm text-on-surface-variant font-medium">Billed to: {detailModal.data.patient}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
                        <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="font-sans font-bold text-sm text-on-surface">{detailModal.data.amount}</p>
                      </div>
                      <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
                        <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Status</p>
                        <p className="font-sans font-bold text-sm text-on-surface">{detailModal.data.status}</p>
                      </div>
                      <div className="col-span-2 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
                        <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Service Details</p>
                        <p className="font-sans font-bold text-sm text-on-surface">{detailModal.data.service}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL NEW ENTRY FORM */}
      <AnimatePresence>
        {isNewEntryOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNewEntryOpen(false)} className="absolute inset-0 bg-on-surface/30 backdrop-blur-md cursor-pointer" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 16 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-outline-variant/50 overflow-hidden"
            >
              <div className="px-8 py-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl"><PlusCircle className="w-4 h-4" /></div>
                  <div>
                    <h3 className="font-display font-black text-lg text-on-surface leading-tight">Create Ledger Entry</h3>
                    <p className="font-sans text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-0.5">Financial & Audit System</p>
                  </div>
                </div>
                <button onClick={() => setIsNewEntryOpen(false)} className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-all"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-8 space-y-5">
                <div className="space-y-2 flex flex-col">
                  <label className="font-display font-bold text-[10px] text-on-surface-variant uppercase tracking-widest ml-1">Transaction Subject</label>
                  <input type="text" placeholder="e.g. Procurement Insurance Batch Claims" className="w-full h-11 px-4 rounded-xl border border-outline-variant/60 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/40" />
                </div>
                <div className="p-4 rounded-xl bg-primary/[0.03] border border-primary/10 flex items-start gap-3 mt-2">
                  <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-[2px]" />
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    This cryptographic entry will be automatically hashed into the audit trail under supervisor clearance **"AN08"2026**.
                  </p>
                </div>
              </div>
              <div className="px-8 py-5 bg-surface-container-low/30 border-t border-outline-variant/30 flex justify-end gap-3">
                <button onClick={() => setIsNewEntryOpen(false)} className="px-5 py-2 rounded-xl font-display font-bold text-xs text-on-surface-variant hover:bg-surface-container transition-all">Cancel</button>
                <button onClick={() => setIsNewEntryOpen(false)} className="px-5 py-2 rounded-xl bg-primary text-white font-display font-bold text-xs shadow-md shadow-primary/15 transition-all">Commit Record</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}