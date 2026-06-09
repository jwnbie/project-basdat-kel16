/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
// Core Layout Components
import { Sidebar, Header } from './components/Layout';
// Clinical & Financial Operational Pages
import { CommandCenter } from './components/CommandCenter';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { PatientsDirectory } from './components/PatientsDirectory';
import { BillingManagement } from './components/BillingManagement'; 
import { SystemReports } from './components/SystemReports';
import { DoctorsDirectory } from './components/DoctorsDirectory';
import { RoomsDirectory } from './components/RoomsDirectory';
// IMPORT LOGIN SCREEN
import { LoginScreen } from './components/LoginScreen';

// UI Libraries
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Camera, HelpCircle, Shield, BellRing, Settings2, Globe2, Sparkles, PlusCircle, X, ShieldAlert, User, Receipt } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  // STATE BARU UNTUK MENGUNCI APLIKASI
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Global tab navigation controller
  const [activeTab, setActiveTab] = useState('home');
  
  // Internal sub-tab controller for Clinical Settings page
  const [activeSettingsTab, setActiveSettingsTab] = useState('account');

  // State untuk mengontrol overlay modal "New Entry" dari Sidebar
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);

  // State untuk mengontrol pop-up detail dari hasil pencarian global
  const [detailModal, setDetailModal] = useState<{type: 'patient' | 'billing' | 'report', data: any} | null>(null);

  // FUNGSI NAVIGASI GLOBAL DARI SEARCH BAR
  const handleGlobalNavigation = (type: 'patient' | 'billing' | 'report', data: any) => {
    if (type === 'patient') setActiveTab('patients');
    if (type === 'billing') setActiveTab('billing');
    if (type === 'report') setActiveTab('reports');
    
    // Delay halus agar tab berpindah dulu baru modal pop-up muncul secara estetik
    setTimeout(() => {
      setDetailModal({ type, data });
    }, 150);
  };

  // JIKA BELUM LOGIN, TAMPILKAN HALAMAN LOGIN
  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  // JIKA SUDAH LOGIN, TAMPILKAN APLIKASI UTAMA
  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20">
      {/* Meneruskan properti onNewEntryClick ke Sidebar agar sinkron dengan Layout.tsx */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onNewEntryClick={() => setIsNewEntryOpen(true)} 
      />
      
      {/* Content Canvas Container */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Main Header dengan Operan Properti onResultClick yang Sesuai Syarat TypeScript */}
        <Header onSettingsClick={() => setActiveTab('settings')} onResultClick={handleGlobalNavigation} />
        
        <main className="flex-1 px-6 md:px-12 py-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Feature Modules Conditional Routing */}
              {activeTab === 'home' && <CommandCenter />}
              {activeTab === 'dashboard' && <ExecutiveDashboard />}
              {activeTab === 'patients' && <PatientsDirectory />}
              {activeTab === 'doctors' && <DoctorsDirectory />}
              {activeTab === 'rooms' && <RoomsDirectory />}
              {activeTab === 'billing' && <BillingManagement />}
              {activeTab === 'reports' && <SystemReports />}
              
              {/* CORE MODULE: Settings Component */}
              {activeTab === 'settings' && (
                <div className="space-y-10 pb-12">
                  <div className="flex flex-col gap-1 border-b border-outline-variant/30 pb-6">
                    <h1 className="font-display font-extrabold text-4xl text-on-surface tracking-tight">System Settings</h1>
                    <p className="text-on-surface-variant font-sans text-[15px] mt-1">Configure Sejahtera Medika operational parameters and system preferences</p>
                  </div>

                  <div className="bg-white border border-outline-variant/50 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] min-h-[680px] flex flex-col md:flex-row overflow-hidden w-full relative z-10">
                    <div className="w-full md:w-64 bg-surface-container-lowest/50 border-r border-outline-variant/40 p-8 flex flex-col gap-y-6 shrink-0">
                      <nav className="flex flex-col gap-2">
                        {[
                          { id: 'account', label: 'Account Profile', icon: Settings2 },
                          { id: 'notifications', label: 'Notifications', icon: BellRing },
                          { id: 'privacy', label: 'Privacy & Rules', icon: Shield },
                          { id: 'languages', label: 'Localization', icon: Globe2 },
                          { id: 'help', label: 'Help & Logs', icon: HelpCircle },
                        ].map((subTab) => {
                          const Icon = subTab.icon;
                          const isSubActive = activeSettingsTab === subTab.id;
                          return (
                            <button
                              key={subTab.id}
                              onClick={() => setActiveSettingsTab(subTab.id)}
                              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-display font-bold text-[13px] text-left relative active:scale-95 ${
                                isSubActive 
                                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${isSubActive ? 'text-white' : 'text-outline'}`} />
                              {subTab.label}
                            </button>
                          );
                        })}
                      </nav>
                    </div>

                    <div className="flex-1 p-8 md:p-12 relative flex flex-col xl:flex-row gap-12 overflow-y-auto">
                      <div className="flex-1 max-w-2xl space-y-8">
                        <AnimatePresence mode="wait">
                          
                          {activeSettingsTab === 'account' && (
                            <motion.div key="account" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                              <div>
                                <h3 className="font-display font-black text-2xl tracking-tight text-on-surface">Account Settings</h3>
                                <p className="text-on-surface-variant font-sans text-sm mt-1">Manage Director credentials and global hospital profiles</p>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-display font-bold text-[11px] text-on-surface-variant uppercase tracking-widest">Basic info</h4>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 rounded-[1.5rem] border border-outline-variant/40 bg-surface-container-lowest/50">
                                  <div className="relative group cursor-pointer shrink-0">
                                    <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center font-display font-black text-2xl shadow-[0_8px_20px_rgb(70,72,212,0.15)] tracking-tighter transition-transform group-hover:scale-105">
                                      AN
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Camera className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                  <div className="text-sm space-y-1.5">
                                    <button className="font-display font-bold text-[13px] text-primary hover:text-primary-900 transition-colors block text-left bg-primary/5 px-4 py-2 rounded-full">Upload new picture</button>
                                    <button className="font-sans font-semibold text-[12px] text-outline hover:text-error transition-colors block text-left px-4">Remove profile avatar</button>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <RowInputItem label="Full Name" value="Aini Norris" />
                                <RowInputItem label="Role Title" value="Financial Director" isEditable={false} />
                                <RowInputItem label="Facility Name" value="RS Sejahtera Medika" />
                                <RowInputItem label="Email Address" value="aini.norris@sejahteramedika.com" />
                              </div>

                              <div className="space-y-4 pt-4">
                                <h4 className="font-display font-bold text-[11px] text-on-surface-variant uppercase tracking-widest">Account security</h4>
                                <div className="space-y-1">
                                  <RowInputItem label="System Username" value="aininorris08" />
                                  <RowInputItem label="Password" value="••••••••••••" />
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {activeSettingsTab === 'notifications' && (
                            <motion.div key="notifications" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                              <div>
                                <h3 className="font-display font-black text-2xl tracking-tight text-on-surface">Notification Channels</h3>
                                <p className="text-on-surface-variant font-sans text-sm mt-1">Configure emergency alert pings and operational broadcasts</p>
                              </div>
                              <div className="space-y-4 pt-2">
                                <ToggleRowItem title="Critical ER Surge Alerts" desc="Trigger instant flashing push banners when ER wait times cross 45 minutes." DefaultState={true} />
                                <ToggleRowItem title="Financial Batch Updates" desc="Send automated tracking alerts when insurance claims are processed." DefaultState={true} />
                                <ToggleRowItem title="Daily Pulse Digest Email" desc="Receive complete operational report cards inside your clinical email inbox every morning." DefaultState={false} />
                              </div>
                            </motion.div>
                          )}

                          {activeSettingsTab === 'privacy' && (
                            <motion.div key="privacy" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                              <div>
                                <h3 className="font-display font-black text-2xl tracking-tight text-on-surface">Privacy & Threshold Rules</h3>
                                <p className="text-on-surface-variant font-sans text-sm mt-1">Govern digital access logs and core monitoring safety parameters</p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                                <div className="space-y-3 flex flex-col">
                                  <label className="font-display font-bold text-[11px] text-on-surface-variant uppercase tracking-widest">Automated Session Timeout</label>
                                  <select className="w-full px-5 py-3 h-[52px] rounded-xl border border-outline-variant/60 bg-surface-container-lowest font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23767586%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E')] bg-[length:10px_auto] bg-[right_16px_center] bg-no-repeat">
                                    <option>15 Minutes of Inactivity</option>
                                    <option>30 Minutes of Inactivity</option>
                                    <option>1 Hour of Inactivity</option>
                                  </select>
                                </div>
                                <div className="space-y-3 flex flex-col">
                                  <label className="font-display font-bold text-[11px] text-on-surface-variant uppercase tracking-widest">ICU High Capacity Alarm (%)</label>
                                  <input type="number" defaultValue={90} className="w-full px-5 py-3 h-[52px] rounded-xl border border-outline-variant/60 bg-surface-container-lowest font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                </div>
                              </div>

                              <div className="space-y-4 pt-2">
                                <ToggleRowItem title="Enforce Patient Encryption" desc="Encrypt medical records completely during transmission." DefaultState={true} />
                                <ToggleRowItem title="Role-Based Security Locks" desc="Block nursing crew from accessing comprehensive billing tables." DefaultState={true} />
                              </div>
                            </motion.div>
                          )}

                          {activeSettingsTab === 'languages' && (
                            <motion.div key="languages" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                              <div>
                                <h3 className="font-display font-black text-2xl tracking-tight text-on-surface">Localization Settings</h3>
                                <p className="text-on-surface-variant font-sans text-sm mt-1">Select application interface language and currency format</p>
                              </div>
                              <div className="space-y-4 pt-2">
                                <div className="space-y-3">
                                  <label className="font-display font-bold text-[11px] text-on-surface-variant uppercase tracking-widest">Primary Language</label>
                                  <select className="w-full max-w-md px-5 py-3 h-[52px] rounded-xl border border-outline-variant/60 bg-surface-container-lowest font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23767586%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E')] bg-[length:10px_auto] bg-[right_16px_center] bg-no-repeat">
                                    <option>English (US) - Default</option>
                                    <option>Bahasa Indonesia</option>
                                  </select>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {activeSettingsTab === 'help' && (
                            <motion.div key="help" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                              <div>
                                <h3 className="font-display font-black text-2xl tracking-tight text-on-surface">Help & System Logs</h3>
                                <p className="text-on-surface-variant font-sans text-sm mt-1">Access system version details and audit logs</p>
                              </div>
                              <div className="border border-outline-variant/50 bg-surface-container-lowest p-8 rounded-[1.5rem] space-y-4 font-sans text-sm shadow-[0_4px_15px_rgb(0,0,0,0.02)]">
                                <p className="text-on-surface flex justify-between border-b border-outline-variant/30 pb-3">
                                  <strong className="font-display">System Version:</strong> <span>Medika Clinical OS v3.4.2</span>
                                </p>
                                <p className="text-on-surface flex justify-between border-b border-outline-variant/30 pb-3">
                                  <strong className="font-display">Database Status:</strong> <span className="text-primary font-bold">Synchronized</span>
                                </p>
                                <p className="text-on-surface flex justify-between">
                                  <strong className="font-display">Last Login:</strong> <span>Today, 08:15 AM</span>
                                </p>
                                <p className="text-on-surface-variant text-[11px] pt-6 uppercase tracking-widest font-bold">For direct developer assistance, contact helpdesk@sejahteramedika.com</p>
                              </div>
                            </motion.div>
                          )}

                        </AnimatePresence>
                      </div>

                      <div className="hidden xl:block w-[280px] shrink-0">
                        <div className="bg-primary/[0.03] border border-primary/10 rounded-[2rem] p-8 space-y-5 relative overflow-hidden group hover:border-primary/20 transition-all sticky top-0 shadow-[0_8px_30px_rgb(70,72,212,0.03)]">
                          <div className="p-3 bg-primary/10 rounded-2xl text-primary w-fit group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6 animate-pulse" />
                          </div>
                          <h4 className="font-display font-black text-lg text-on-surface leading-tight">Setup Assistant Guide</h4>
                          <p className="font-sans text-[13px] text-on-surface-variant leading-relaxed">
                            Need help configuring parameters? Review the official operational setup documentation of your deployment.
                          </p>
                          <button className="text-[13px] font-display font-bold text-primary hover:text-primary-900 flex items-center gap-1 pt-2 transition-colors">
                            Open Guide <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="px-6 md:px-12 py-8 border-t border-outline-variant/30 text-center">
          <p className="font-sans text-xs font-bold text-on-surface-variant">
            Medika Clinical OS <span className="text-outline/30 mx-2">|</span> © 2026 RS Sejahtera Medika - Precision in Care
          </p>
        </footer>
      </div>

      {/* MODAL SEARCH HASIL KLIK (MENGATASI ERROR FILTER SEARCH DIREKTUR) */}
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
                        {detailModal.data.initials || 'PT'}
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

      {/* MODAL HOVER OVERLAY "NEW ENTRY" UNTUK SINKRONISASI SISI SIDERBAR */}
      <AnimatePresence>
        {isNewEntryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsNewEntryOpen(false)}
              className="absolute inset-0 bg-on-surface/30 backdrop-blur-md cursor-pointer"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 16 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-[0_24px_60px_rgba(0,0,0,0.12)] border border-outline-variant/50 overflow-hidden"
            >
              <div className="px-8 py-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl"><PlusCircle className="w-4 h-4" /></div>
                  <div>
                    <h3 className="font-display font-black text-lg text-on-surface leading-tight">Create Ledger Entry</h3>
                    <p className="font-sans text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-0.5">Financial & Audit System</p>
                  </div>
                </div>
                <button onClick={() => setIsNewEntryOpen(false)} className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-full transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-8 space-y-5">
                <div className="space-y-2 flex flex-col">
                  <label className="font-display font-bold text-[10px] text-on-surface-variant uppercase tracking-widest ml-1">Transaction Subject</label>
                  <input type="text" placeholder="e.g. Procurement Insurance Batch Claims" className="w-full h-11 px-4 rounded-xl border border-outline-variant/60 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/40" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 flex flex-col">
                    <label className="font-display font-bold text-[10px] text-on-surface-variant uppercase tracking-widest ml-1">Entry Classification</label>
                    <select className="w-full h-11 px-4 rounded-xl border border-outline-variant/60 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 cursor-pointer text-on-surface">
                      <option>Receivable Ledger</option>
                      <option>Insurance Claims Settlement</option>
                      <option>Operational Expense</option>
                    </select>
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="font-display font-bold text-[10px] text-on-surface-variant uppercase tracking-widest ml-1">Total Valuation (IDR)</label>
                    <input type="text" placeholder="Rp 0,00" className="w-full h-11 px-4 rounded-xl border border-outline-variant/60 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/40" />
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-primary/[0.03] border border-primary/10 flex items-start gap-3 mt-2">
                  <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-[2px]" />
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    This cryptographic entry will be automatically hashed into the audit trail under supervisor clearance **"AN08"2026.**
                  </p>
                </div>
              </div>

              <div className="px-8 py-5 bg-surface-container-low/30 border-t border-outline-variant/30 flex justify-end gap-3">
                <button onClick={() => setIsNewEntryOpen(false)} className="px-5 py-2 rounded-xl font-display font-bold text-xs text-on-surface-variant hover:bg-surface-container transition-all">Cancel</button>
                <button onClick={() => setIsNewEntryOpen(false)} className="px-5 py-2 rounded-xl bg-primary text-white font-display font-bold text-xs shadow-md shadow-primary/15 transition-all active:scale-95">Commit Record</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --- ISOLATED COMPONENT: INTERNAL LIST ROW INPUT --- */
const RowInputItem = ({ label, value, isEditable = true }: { label: string, value: string, isEditable?: boolean }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-outline-variant/30 group hover:bg-surface-container-lowest/50 px-4 rounded-2xl transition-all w-full gap-2 sm:gap-4 cursor-pointer">
    <span className="font-sans font-bold text-[13px] text-on-surface-variant shrink-0">{label}</span>
    <div className="flex items-center gap-3 min-w-0 sm:flex-1 sm:justify-end">
      <span className={`font-display font-bold text-[15px] truncate max-w-full sm:text-right ${
        isEditable ? 'text-on-surface group-hover:text-primary transition-colors' : 'text-outline/70 cursor-not-allowed'
      }`}>
        {value}
      </span>
      {isEditable && (
        <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-colors shrink-0" />
      )}
    </div>
  </div>
);

/* --- ISOLATED COMPONENT: INTERNAL SWITCH INTERACTIVE ROW --- */
const ToggleRowItem = ({ title, desc, DefaultState }: { title: string, desc: string, DefaultState: boolean }) => {
  const [toggle, setToggle] = useState(DefaultState);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[1.5rem] border border-outline-variant/40 bg-surface-container-lowest hover:border-primary/30 hover:shadow-[0_4px_15px_rgb(70,72,212,0.03)] transition-all gap-6 cursor-pointer" onClick={() => setToggle(!toggle)}>
      <div className="space-y-1.5 flex-1 pr-4">
        <p className="font-display font-bold text-[15px] text-on-surface">{title}</p>
        <p className="font-sans text-[13px] text-on-surface-variant leading-relaxed">{desc}</p>
      </div>
      <button 
        className={`w-12 h-7 rounded-full relative p-1 transition-colors shrink-0 ${toggle ? 'bg-primary' : 'bg-surface-container-high'}`}
      >
        <motion.div 
          animate={{ x: toggle ? 20 : 0 }}
          className="w-5 h-5 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
};