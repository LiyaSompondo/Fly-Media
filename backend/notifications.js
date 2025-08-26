import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const DB = path.join(process.cwd(), 'notifications.json');

async function readDB() {
  try {
    const raw = await fs.readFile(DB, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
async function writeDB(data) {
  await fs.writeFile(DB, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/notifications
router.get('/', async (req, res) => {
  const list = await readDB();
  res.json(list);
});

// POST /api/notifications
router.post('/', async (req, res) => {
  const { title, message, type, action_url } = req.body;
  const list = await readDB();
  const n = {
    id: Date.now(),
    title: title || 'Notification',
    message: message || '',
    type: type || 'info',
    action_url: action_url || null,
    created_at: new Date().toISOString(),
    read: false
  };
  list.unshift(n);
  await writeDB(list);
  res.status(201).json(n);
});

// PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res) => {
  const id = Number(req.params.id);
  const list = await readDB();
  const i = list.findIndex(x => x.id === id);
  if (i === -1) return res.sendStatus(404);
  list[i].read = true;
  await writeDB(list);
  res.json(list[i]);
});

// PUT /api/notifications/mark-all-read
router.put('/mark-all-read', async (req, res) => {
  const list = await readDB();
  const updated = list.map(n => ({ ...n, read: true }));
  await writeDB(updated);
  res.json(updated);
});

// DELETE /api/notifications/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const list = await readDB();
  const filtered = list.filter(n => n.id !== id);
  await writeDB(filtered);
  res.sendStatus(204);
});

export default router;
