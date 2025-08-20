import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createRequire } from 'module';
import { authRouter } from './views/auth.js';
import { commentsRouter } from './views/comments.js';
import { filesRouter } from './views/files.js';
import { contentRouter } from './views/content.js';

const require = createRequire(import.meta.url);

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
app.use(cors({ origin: function (origin, cb) {
  if (!origin) return cb(null, true);
  if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return cb(null, true);
  return cb(new Error('Not allowed by CORS: ' + origin));
}, credentials: true }));

app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use('/auth', authRouter);
app.use('/comments', commentsRouter);
app.use('/files', filesRouter);
app.use('/content', contentRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
  console.log('Digital Natives API listening on http://localhost:' + port);
});


