import { supabaseAdmin } from '../supabase.js';

export async function requireAuth(req, res, next) {
  try {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'missing token' });
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ error: 'invalid token' });
    req.user = data.user;
    next();
  } catch (e) {
    res.status(401).json({ error: 'unauthorized' });
  }
}

export async function requireAdmin(req, res, next) {
  try {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'missing token' });
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ error: 'invalid token' });
    const uid = data.user.id;
    const { data: rows, error: dberr } = await supabaseAdmin.from('users').select('role').eq('id', uid).limit(1).maybeSingle();
    if (dberr || !rows || rows.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
    req.user = data.user;
    next();
  } catch (e) {
    res.status(403).json({ error: 'forbidden' });
  }
}


