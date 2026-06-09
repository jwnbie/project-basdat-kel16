require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const queryDB = async (sql, params = []) => {
    try {
        const res = await pool.query(sql, params);
        return res.rows;
    } catch (err) {
        console.error("Database Error:", err);
        return [];
    }
};

// --- 9 ENDPOINT UTAMA ---

// 1. Billing (Join dengan Patients)
app.get('/api/billing', async (req, res) => {
    const sql = `SELECT b.*, p.name as patient_name FROM billing_records b LEFT JOIN patients p ON b.patient_id = p.id ORDER BY b.created_at DESC`;
    const data = await queryDB(sql);
    res.json(data.map(r => ({ ...r, patient: r.patient_name || 'Unknown' })));
});

// 2. Billing Stats
app.get('/api/billing-stats', async (req, res) => {
    const data = await queryDB(`
        SELECT 
            SUM(CASE WHEN status = 'Paid' THEN amount ELSE 0 END) as total_receivables,
            SUM(CASE WHEN status = 'Pending' THEN amount ELSE 0 END) as pending_claims,
            SUM(CASE WHEN status = 'Overdue' THEN amount ELSE 0 END) as overdue_accounts,
            COUNT(CASE WHEN status = 'Unverified' THEN 1 END) as unchecked_count
        FROM billing_records`);
    res.json(data[0] || { total_receivables: 0, pending_claims: 0, overdue_accounts: 0, unchecked_count: 0 });
});

// 3. Bill Details
app.get('/api/bill-details', async (req, res) => res.json(await queryDB('SELECT * FROM bill_details')));

// 4. Billing Records
app.get('/api/billing-records', async (req, res) => res.json(await queryDB('SELECT * FROM billing_records')));

// 5. Departments
app.get('/api/departments', async (req, res) => res.json(await queryDB('SELECT * FROM departments')));

// 6. Medical Staff (Doctors)
app.get('/api/medical-staff', async (req, res) => res.json(await queryDB('SELECT * FROM doctors')));

// 7. Patients
app.get('/api/patients', async (req, res) => res.json(await queryDB('SELECT * FROM patients')));

// 8. Rooms (Status Virtual)
app.get('/api/rooms', async (req, res) => {
    const data = await queryDB('SELECT * FROM rooms');
    res.json(data.map(r => ({ ...r, status: r.patient_name ? 'Occupied' : 'Available' })));
});

// 9. Services, Reports, & Visits
app.get('/api/services', async (req, res) => res.json(await queryDB('SELECT * FROM services')));
app.get('/api/reports', async (req, res) => res.json(await queryDB('SELECT * FROM system_reports')));
app.get('/api/visits', async (req, res) => res.json(await queryDB('SELECT * FROM visits')));

// --- FITUR TAMBAHAN (POST/DELETE) ---

// Add New Invoice
app.post('/api/billing', async (req, res) => {
    const { id, patient_id, service, amount, status } = req.body;
    const sql = `INSERT INTO billing_records (id, patient_id, service, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const data = await queryDB(sql, [id, patient_id, service, amount, status]);
    res.json(data[0]);
});

app.post('/api/reports', async (req, res) => {
    console.log("Data diterima:", req.body); // Tambahkan ini buat cek
    const { name, date, author, status, type } = req.body;
    try {
        const sql = `INSERT INTO system_reports (name, date, author, status, type) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const data = await queryDB(sql, [name, date, author, status, type]);
        res.json(data[0]);
    } catch (err) {
        console.error("Error di POST /api/reports:", err);
        res.status(500).json({ error: "Gagal simpan ke DB" });
    }
});

// DELETE: Hapus laporan
app.delete('/api/reports/:id', async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM system_reports WHERE id = $1`;
    await queryDB(sql, [id]);
    res.status(204).send();
});

// Endpoint untuk Dashboard Stats
app.get('/api/dashboard/stats', async (req, res) => {
    const stats = await queryDB(`
        SELECT 
            (SELECT COUNT(*) FROM patients) as "patientsCount",
            (SELECT SUM(amount) FROM billing_records WHERE status = 'Paid') as "revenueCount",
            (SELECT COUNT(*) FROM doctors) as "doctorsCount",
            (SELECT COUNT(*) FROM rooms WHERE patient_name IS NULL) as "roomsCount",
            (SELECT COUNT(*) FROM billing_records WHERE status = 'Pending') as "pendingCount"
    `);
    res.json(stats[0] || { patientsCount: 0, revenueCount: 0, doctorsCount: 0, roomsCount: 0, pendingCount: 0 });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Medika OS Backend aktif di port ${PORT}`));