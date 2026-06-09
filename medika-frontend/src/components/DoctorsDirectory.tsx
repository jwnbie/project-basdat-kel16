import React, { useState, useEffect } from 'react';
import { Loader2, Search, Stethoscope, Building2, Phone, X } from 'lucide-react';

export const DoctorsDirectory = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // FIX: URL diubah menjadi /api/medical-staff agar sesuai dengan server.js
    fetch('https://project-basdat-kel16.onrender.com/api/medical-staff')
      .then(res => res.json())
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal load dokter:", err);
        setLoading(false);
      });
  }, []);

  const filteredDoctors = doctors.filter((d: any) => 
    (d.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (d.specialization?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-[2rem] font-extrabold text-on-surface leading-none">Medical Staff</h1>
          <p className="text-[0.75rem] font-bold text-outline uppercase tracking-[0.2em] mt-2">REGISTERED DOCTORS OVERVIEW</p>
        </div>
        
        {/* SEARCH BAR */}
        <div className="w-full md:max-w-md bg-white p-2 rounded-[2rem] border border-outline-variant/30 shadow-sm flex items-center">
          <Search className="text-outline ml-3" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff name, specialty..."
            className="w-full h-9 px-4 focus:outline-none text-xs font-sans"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-outline p-1.5 hover:bg-surface-container rounded-full mr-1">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* GRID DOCTOR */}
      {loading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={32} /></div>
      ) : filteredDoctors.length === 0 ? (
        <div className="py-20 text-center text-outline font-medium text-sm">No medical staff found matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDoctors.map((d: any) => (
            <div key={d.id} className="bg-white p-5 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col items-center text-center hover:border-primary/30 transition-all">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-3">
                <Stethoscope size={24} />
              </div>
              <h3 className="font-bold text-sm text-on-surface">{d.name}</h3>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5 mb-4">{d.specialization}</p>
              
              <div className="w-full space-y-2 bg-surface-container-lowest/50 p-3 rounded-2xl">
                <div className="flex items-center justify-center gap-2 text-[11px] text-on-surface-variant">
                  <Building2 size={13} />
                  <span>Dept: {d.department_id}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-[11px] text-on-surface-variant">
                  <Phone size={13} />
                  <span>{d.phone_number || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-4 text-[9px] font-bold uppercase tracking-widest text-outline border border-outline-variant/20 px-3 py-1 rounded-full">
                {d.status || 'Active'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};