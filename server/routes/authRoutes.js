const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { sign } = require('../auth');

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, weight, height, age, city } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Ad, e-posta ve şifre zorunludur' });
  if (password.length < 6) return res.status(400).json({ error: 'Şifre en az 6 karakter olmalı' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Bu e-posta zaten kayıtlı' });

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    `INSERT INTO users (name, email, password, weight, height, age, city, role, start_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'patient', datetime('now'))`
  ).run(name, email, hash, weight || null, height || null, age || null, city || null);

  if (weight) {
    db.prepare('INSERT INTO weights (user_id, weight) VALUES (?, ?)').run(result.lastInsertRowid, weight);
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.json({ token: sign(user), user: safeUser(user) });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'E-posta veya şifre hatalı' });
  }
  res.json({ token: sign(user), user: safeUser(user) });
});

// GET /api/auth/me
router.get('/me', require('../auth').auth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  res.json(safeUser(user));
});

function safeUser(u) {
  const { password, ...rest } = u;
  return rest;
}

module.exports = router;
