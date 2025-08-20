import express from 'express';
import { supabase, supabaseAdmin } from '../supabase.js';
import { requireAdmin } from '../middleware/auth.js';

export const commentsRouter = express.Router();

// Public: submit comment (status = pending)
commentsRouter.post('/', async (req, res) => {
  const { user_id = null, name = null, email = null, comment_text } = req.body || {};
  if (!comment_text) return res.status(400).json({ error: 'comment_text required' });
  try {
    const { data, error } = await supabase.from('comments').insert({
      user_id,
      comment_text,
      status: 'pending',
      name,
      email
    }).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ comment: data });
  } catch (e) {
    res.status(500).json({ error: 'failed to submit comment' });
  }
});

// Public: list approved comments
commentsRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase.from('comments').select('*').eq('status', 'approved').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ comments: data });
});

// Admin: list all comments
commentsRouter.get('/all', requireAdmin, async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('comments').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ comments: data });
});

// Admin: approve/reject
commentsRouter.patch('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!['approved', 'rejected', 'pending'].includes(status)) return res.status(400).json({ error: 'invalid status' });
  const { data, error } = await supabaseAdmin.from('comments').update({ status }).eq('id', id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ comment: data });
});

// Admin: delete comment
commentsRouter.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabaseAdmin.from('comments').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});


