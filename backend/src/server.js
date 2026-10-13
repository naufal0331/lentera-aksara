import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import auth from './routes/auth.js';
import novels from './routes/novels.js';
import library from './routes/library.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json({ limit: '1mb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }), auth);
app.use('/api/novels', novels);
app.use('/api/library', library);
app.get('/api/health', (_q, r) => r.json({ ok: true, app: 'Lentera Aksara' }));
app.use((err, _q, res, _n) => { console.error(err); res.status(500).json({ error: 'Terjadi kesalahan pada server.' }); });
app.listen(process.env.PORT || 4000, () => console.log('Lentera Aksara API aktif'));
