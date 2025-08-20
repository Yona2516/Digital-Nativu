import express from 'express';
import { supabaseAdmin } from '../supabase.js';

export const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  const { email, password, name, role = 'user' } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  if (!['admin', 'user'].includes(role)) return res.status(400).json({ error: 'invalid role' });
  try {
    const { data: signUp, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true
    });
    if (error) return res.status(400).json({ error: error.message });
    // upsert into public.users for RLS policies
    await supabaseAdmin.from('users').upsert({
      id: signUp.user.id,
      email,
      name,
      role
    }, { onConflict: 'email' });
    return res.json({ user: signUp.user });
  } catch (e) {
    return res.status(500).json({ error: 'signup failed' });
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });
    res.json({ session: data.session, user: data.user });
  } catch (e) {
    res.status(500).json({ error: 'login failed' });
  }
});

authRouter.post('/logout', async (_req, res) => {
  try {
    await supabaseAdmin.auth.signOut();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'logout failed' });
  }
});


