import express from 'express';
import { supabaseAdmin } from '../supabase.js';

export const contentRouter = express.Router();

// Create content (admin)
contentRouter.post('/', async (req, res) => {
  const { section, title, body, media_url } = req.body || {};
  if (!section) return res.status(400).json({ error: 'section required' });
  const { data, error } = await supabaseAdmin.from('contents').insert({ section, title, body, media_url }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ content: data });
});

// Get by section
contentRouter.get('/:section', async (req, res) => {
  const { section } = req.params;
  const { data, error } = await supabaseAdmin.from('contents').select('*').eq('section', section).order('updated_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ items: data });
});

// Update
contentRouter.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, body, media_url } = req.body || {};
  const { data, error } = await supabaseAdmin.from('contents').update({ title, body, media_url, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ content: data });
});

// Delete
contentRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabaseAdmin.from('contents').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});


