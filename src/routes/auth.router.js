
const express = require('express');
const router = express.Router();
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.resolve('src/data/users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
}

async function writeUsers(users) {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const users = await readUsers();
    if (users.find(u => u.email === email)) return res.status(409).json({ error: 'User already exists' });

    const hashed = await hashPassword(password);
    const user = { id: Date.now().toString(), email, password: hashed };
    users.push(user);
    await writeUsers(users);

    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const users = await readUsers();
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ message: 'Authenticated', userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;