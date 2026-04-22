const router = require('express').Router();
const db = require('../db');
const { auth } = require('../auth');

// ── WEIGHTS ─────────────────────────────────────────────
router.get('/weights', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM weights WHERE user_id = ? ORDER BY recorded_at ASC').all(req.user.id);
  res.json(rows);
});

router.post('/weights', auth, (req, res) => {
  const { weight } = req.body;
  if (!weight) return res.status(400).json({ error: 'Kilo değeri gerekli' });
  db.prepare('INSERT INTO weights (user_id, weight) VALUES (?, ?)').run(req.user.id, weight);
  db.prepare('UPDATE users SET weight = ? WHERE id = ?').run(weight, req.user.id);
  res.json({ ok: true });
});

// ── MEASUREMENTS ─────────────────────────────────────────
router.get('/measurements', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM measurements WHERE user_id = ? ORDER BY recorded_at DESC').all(req.user.id);
  res.json(rows);
});

router.post('/measurements', auth, (req, res) => {
  const { kilo, boyun, ust_gogus, gogus, alt_gogus, kol, bel, gobek, kalca, bacak } = req.body;
  db.prepare(`
    INSERT INTO measurements (user_id, kilo, boyun, ust_gogus, gogus, alt_gogus, kol, bel, gobek, kalca, bacak)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.user.id, kilo||null, boyun||null, ust_gogus||null, gogus||null, alt_gogus||null, kol||null, bel||null, gobek||null, kalca||null, bacak||null);

  if (kilo) {
    db.prepare('INSERT INTO weights (user_id, weight) VALUES (?, ?)').run(req.user.id, kilo);
    db.prepare('UPDATE users SET weight = ? WHERE id = ?').run(kilo, req.user.id);
  }
  res.json({ ok: true });
});

// ── MEAL LOGS ────────────────────────────────────────────
router.get('/meals', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM meal_logs WHERE user_id = ? ORDER BY logged_at DESC LIMIT 50').all(req.user.id);
  res.json(rows);
});

router.post('/meals', auth, (req, res) => {
  const { meal, note } = req.body;
  if (!meal) return res.status(400).json({ error: 'Öğün bilgisi gerekli' });
  const user = db.prepare('SELECT stage FROM users WHERE id = ?').get(req.user.id);
  db.prepare('INSERT INTO meal_logs (user_id, meal, note, stage) VALUES (?, ?, ?, ?)').run(req.user.id, meal, note||null, user.stage);
  res.json({ ok: true });
});

// ── CHAT HISTORY ─────────────────────────────────────────
router.get('/chat', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at ASC').all(req.user.id);
  res.json(rows);
});

router.post('/chat', auth, (req, res) => {
  const { role, content } = req.body;
  if (!role || !content) return res.status(400).json({ error: 'role ve content gerekli' });
  const result = db.prepare('INSERT INTO chat_messages (user_id, role, content) VALUES (?, ?, ?)').run(req.user.id, role, content);
  res.json({ id: result.lastInsertRowid });
});

// ── USER PROFILE ─────────────────────────────────────────
router.get('/profile', auth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Bulunamadı' });
  const { password, ...rest } = user;
  res.json(rest);
});

module.exports = router;
