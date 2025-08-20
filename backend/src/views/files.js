import express from 'express';
import multer from 'multer';
import { supabaseAdmin } from '../supabase.js';
import { requireAdmin } from '../middleware/auth.js';

const upload = multer({ storage: multer.memoryStorage() });
export const filesRouter = express.Router();

// Upload file (admin)
filesRouter.post('/upload', requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file required' });
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'digitalnatives_files';
  const category = req.body?.category || 'general';
  const fileType = req.file.mimetype;
  const fileName = `${Date.now()}-${req.file.originalname}`;
  try {
    const { data, error } = await supabaseAdmin.storage.from(bucket).upload(fileName, req.file.buffer, {
      contentType: fileType,
      upsert: false
    });
    if (error) return res.status(400).json({ error: error.message });
    const { data: pub } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path);
    const { data: inserted, error: dberr } = await supabaseAdmin.from('files').insert({
      admin_id: null,
      file_url: pub.publicUrl,
      file_type: fileType,
      category
    }).select().single();
    if (dberr) return res.status(400).json({ error: dberr.message });
    res.json({ file: inserted });
  } catch (e) {
    res.status(500).json({ error: 'upload failed' });
  }
});

// List public files
filesRouter.get('/', async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('files').select('*').order('uploaded_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ files: data });
});

// Delete file (admin)
filesRouter.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabaseAdmin.from('files').delete().eq('id', id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  // Optionally delete from storage if we stored the path
  res.json({ ok: true, file: data });
});


