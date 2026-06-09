import React, { useEffect, useState } from 'react';
import { FileDown, Loader2, Trash2, History, Wrench } from 'lucide-react';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Pastikan sudah install jspdf-autotable
import { cn } from '../lib/utils';

export const SystemReports = () => {
  const [archiveData, setArchiveData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportForm, setReportForm] = useState({ 
    source: 'Clinical Outcomes', 
    department: 'Cardiology Unit', 
    level: 'Executive Summary' 
  });

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://project-basdat-kel16.onrender.com/api/reports');
      const data = await response.json();
      setArchiveData(data);
    } catch (e) { console.error("Fetch Error:", e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // 1. Fetch data
      const billingRes = await fetch('https://project-basdat-kel16.onrender.com/api/billing');
      const billingData = await billingRes.json();
      const totalBill = billingData.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);

      // 2. Generate PDF
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.text("MEDIKA OS HOSPITAL", 105, 15, { align: 'center' });
      doc.setFontSize(10);
      doc.text("Laporan Resmi Medika OS", 105, 22, { align: 'center' });
      doc.line(10, 28, 200, 28);
      
      doc.setFontSize(12);
      doc.text(`Tipe Laporan: ${reportForm.source}`, 15, 40);
      doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 15, 48);

      // Tabel
      autoTable(doc, {
        startY: 55,
        head: [['Invoice ID', 'Pasien', 'Layanan', 'Jumlah']],
        body: billingData.map((i: any) => [
          i.id || '-', 
          i.patient || '-', 
          i.service || '-', 
          `Rp ${(Number(i.amount) || 0).toLocaleString('id-ID')}`
        ]),
        theme: 'grid',
        headStyles: { fillColor: [85, 81, 219] }
      });

      // Total Pendapatan
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Total Pendapatan: Rp ${totalBill.toLocaleString('id-ID')}`, 140, finalY);
      
      doc.save(`Report_${Date.now()}.pdf`);

      // 3. Simpan ke Database
      await fetch('https://project-basdat-kel16.onrender.com/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${reportForm.source} - ${reportForm.level}`,
          date: new Date().toLocaleDateString('id-ID'),
          author: 'Aini Norris',
          status: 'Ready',
          type: 'pdf'
        })
      });
      
      fetchReports();
    } catch (err) {
      console.error("PDF/Fetch Error:", err);
      alert("Terjadi kesalahan saat membuat PDF. Pastikan backend aktif.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await fetch(`https://project-basdat-kel16.onrender.com/api/reports/${id}`, { method: 'DELETE' });
      fetchReports();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-8 pb-12">
      <h1 className="font-bold text-5xl">System Reports</h1>
      
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
           <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Wrench size={20}/></div>
           <h3 className="font-bold text-2xl">Custom Report Builder</h3>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <select className="bg-gray-50 p-4 rounded-xl text-xs font-bold" onChange={(e) => setReportForm({...reportForm, source: e.target.value})}>
            <option>Clinical Outcomes</option>
            <option>Financial Audit</option>
          </select>
          <select className="bg-gray-50 p-4 rounded-xl text-xs font-bold" onChange={(e) => setReportForm({...reportForm, department: e.target.value})}>
            <option>Cardiology Unit</option>
            <option>Emergency (ER)</option>
          </select>
          <select className="bg-gray-50 p-4 rounded-xl text-xs font-bold" onChange={(e) => setReportForm({...reportForm, level: e.target.value})}>
            <option>Executive Summary</option>
            <option>Detailed Ledger</option>
          </select>
        </div>
        <button onClick={handleGenerate} className="bg-primary text-white font-bold text-xs px-8 py-4 rounded-xl flex items-center gap-2">
          {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <FileDown size={16}/>} Generate PDF & Archive
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100">
        <div className="px-8 py-6 border-b flex items-center gap-4">
           <History className="text-primary" size={20}/>
           <h3 className="font-bold text-xl">Generated Archive</h3>
        </div>
        <table className="w-full text-center">
          <thead>
            <tr className="text-[10px] uppercase font-bold text-outline border-b">
              <th className="px-8 py-5 text-left">Report Name</th>
              <th className="px-8 py-5">Generated Date</th>
              <th className="px-8 py-5">Author</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {archiveData.map((item) => (
              <tr key={item.id} className="border-b text-sm font-bold">
                <td className="px-8 py-5 text-left">{item.name}</td>
                <td className="px-8 py-5">{item.date || 'N/A'}</td>
                <td className="px-8 py-5">{item.author}</td>
                <td className="px-8 py-5 text-primary">{item.status}</td>
                <td className="px-8 py-5">
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};