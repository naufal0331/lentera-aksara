import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from '../src/db.js';
const h = await bcrypt.hash('Password123!', 12);
await db.query("UPDATE users SET password_hash=? WHERE password_hash='x'", [h]);
console.log('Selesai. Login demo: admin@lenteraaksara.test / Password123!');
process.exit(0);
