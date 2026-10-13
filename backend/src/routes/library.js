import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { auth, validate } from '../middleware.js';
const r = Router(); r.use(auth);

r.get('/', async (req, res) => res.json((await db.query(
  `SELECT n.id,n.title,n.cover_url,n.status,u.username AS author FROM library l JOIN novels n ON n.id=l.novel_id
   JOIN users u ON u.id=n.author_id WHERE l.user_id=? ORDER BY l.added_at DESC`, [req.user.id]))[0]));
r.post('/:novelId', async (req, res) => { await db.query('INSERT IGNORE INTO library(user_id,novel_id) VALUES(?,?)', [req.user.id, req.params.novelId]); res.status(201).json({ ok: true }); });
r.delete('/:novelId', async (req, res) => { await db.query('DELETE FROM library WHERE user_id=? AND novel_id=?', [req.user.id, req.params.novelId]); res.json({ ok: true }); });

// Sinkronisasi progres baca antar perangkat
r.put('/progress', validate(z.object({ novelId: z.number().int(), chapterId: z.number().int(), scrollPct: z.number().min(0).max(100) })), async (req, res) => {
  const { novelId, chapterId, scrollPct } = req.body;
  await db.query(`INSERT INTO reading_progress(user_id,novel_id,chapter_id,scroll_pct) VALUES(?,?,?,?)
    ON DUPLICATE KEY UPDATE chapter_id=VALUES(chapter_id),scroll_pct=VALUES(scroll_pct)`, [req.user.id, novelId, chapterId, Math.round(scrollPct)]);
  res.json({ ok: true });
});
r.get('/history', async (req, res) => res.json((await db.query(
  `SELECT n.id AS novel_id,n.title,n.cover_url,c.number AS chapter_number,c.title AS chapter_title,p.scroll_pct,p.updated_at
   FROM reading_progress p JOIN novels n ON n.id=p.novel_id JOIN chapters c ON c.id=p.chapter_id
   WHERE p.user_id=? ORDER BY p.updated_at DESC`, [req.user.id]))[0]));

r.post('/bookmarks/:chapterId', async (req, res) => { await db.query('INSERT IGNORE INTO bookmarks(user_id,chapter_id) VALUES(?,?)', [req.user.id, req.params.chapterId]); res.status(201).json({ ok: true }); });
r.delete('/bookmarks/:chapterId', async (req, res) => { await db.query('DELETE FROM bookmarks WHERE user_id=? AND chapter_id=?', [req.user.id, req.params.chapterId]); res.json({ ok: true }); });
export default r;
