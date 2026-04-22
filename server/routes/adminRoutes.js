const router = require('express').Router();
const db = require('../db');
const { auth, adminOnly } = require('../auth');

const guard = [auth, adminOnly];

// ── GET ALL PATIENTS ─────────────────────────────────────
router.get('/patients', guard, (req, res) => {
  const patients = db.prepare(`SELECT id, name, email, weight, height, age, city, stage, notes, created_at, start_date FROM users WHERE role = 'patient' ORDER BY created_at DESC`).all();

  const enriched = patients.map(p => {
    const weights = db.prepare('SELECT * FROM weights WHERE user_id = ? ORDER BY recorded_at ASC').all(p.id);
    const mealCount = db.prepare('SELECT COUNT(*) as c FROM meal_logs WHERE user_id = ?').get(p.id).c;
    const measureCount = db.prepare('SELECT COUNT(*) as c FROM measurements WHERE user_id = ?').get(p.id).c;
    const initWeight = weights[0]?.weight || p.weight || 0;
    const curWeight = p.weight || 0;
    return { ...p, weightHistory: weights, mealCount, measureCount, initWeight, weightLost: +(initWeight - curWeight).toFixed(1) };
  });

  res.json(enriched);
});

// ── GET SINGLE PATIENT DETAIL ────────────────────────────
router.get('/patients/:id', guard, (req, res) => {
  const patient = db.prepare(`SELECT id, name, email, weight, height, age, city, stage, notes, created_at FROM users WHERE id = ? AND role = 'patient'`).get(req.params.id);
  if (!patient) return res.status(404).json({ error: 'Hasta bulunamadı' });

  const weights = db.prepare('SELECT * FROM weights WHERE user_id = ? ORDER BY recorded_at ASC').all(patient.id);
  const measurements = db.prepare('SELECT * FROM measurements WHERE user_id = ? ORDER BY recorded_at DESC LIMIT 10').all(patient.id);
  const meals = db.prepare('SELECT * FROM meal_logs WHERE user_id = ? ORDER BY logged_at DESC LIMIT 20').all(patient.id);

  res.json({ ...patient, weights, measurements, meals });
});

// ── UPDATE PATIENT STAGE ─────────────────────────────────
router.patch('/patients/:id/stage', guard, (req, res) => {
  const { stage } = req.body;
  if (!stage || stage < 1 || stage > 4) return res.status(400).json({ error: 'Geçersiz etap (1-4)' });
  const result = db.prepare(`UPDATE users SET stage = ? WHERE id = ? AND role = 'patient'`).run(stage, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Hasta bulunamadı' });
  res.json({ ok: true });
});

// ── UPDATE PATIENT NOTES ─────────────────────────────────
router.patch('/patients/:id/notes', guard, (req, res) => {
  const { notes } = req.body;
  db.prepare(`UPDATE users SET notes = ? WHERE id = ?`).run(notes || null, req.params.id);
  res.json({ ok: true });
});

// ── GET MEASUREMENTS FOR PATIENT ─────────────────────────
router.get('/patients/:id/measurements', guard, (req, res) => {
  const rows = db.prepare('SELECT * FROM measurements WHERE user_id = ? ORDER BY recorded_at DESC').all(req.params.id);
  res.json(rows);
});

// ── STATS OVERVIEW ───────────────────────────────────────
router.get('/stats', guard, (req, res) => {
  const totalPatients = db.prepare(`SELECT COUNT(*) as c FROM users WHERE role = 'patient'`).get().c;
  const totalMeals    = db.prepare('SELECT COUNT(*) as c FROM meal_logs').get().c;
  const totalMeasures = db.prepare('SELECT COUNT(*) as c FROM measurements').get().c;

  const stageStats = [1,2,3,4].map(s => ({
    stage: s,
    count: db.prepare(`SELECT COUNT(*) as c FROM users WHERE role='patient' AND stage=?`).get(s).c
  }));

  const recentMeals = db.prepare(`
    SELECT ml.*, u.name as user_name FROM meal_logs ml
    JOIN users u ON ml.user_id = u.id
    ORDER BY ml.logged_at DESC LIMIT 20
  `).all();

  const recentMeasures = db.prepare(`
    SELECT m.*, u.name as user_name FROM measurements m
    JOIN users u ON m.user_id = u.id
    ORDER BY m.recorded_at DESC LIMIT 10
  `).all();

  res.json({ totalPatients, totalMeals, totalMeasures, stageStats, recentMeals, recentMeasures });
});

module.exports = router;
