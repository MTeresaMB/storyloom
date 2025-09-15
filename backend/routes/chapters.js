const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// GET /api/chapters
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    const mapped = (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      wordCount: row.word_count,
      lastModified: row.last_modified,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
    res.json(mapped);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error obtaining chapters', error: error.message });
  }
});

// POST /api/chapters
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const { title = 'Untitled', content = '' } = req.body || {};
    const now = new Date().toISOString();
    const word_count = countWords(content);

    const { data, error } = await supabase
      .from('chapters')
      .insert({
        user_id: userId,
        title,
        content,
        word_count,
        last_modified: now,
      })
      .select('*')
      .single();

    if (error) throw error;
    const mapped = {
      id: data.id,
      title: data.title,
      content: data.content,
      wordCount: data.word_count,
      lastModified: data.last_modified,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
    res.status(201).json(mapped);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating chapter', error: error.message });
  }
});

// PUT /api/chapters/:id
router.put('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const patch = req.body || {};
    const update = { ...patch };
    if (typeof patch.content === 'string') {
      update.word_count = countWords(patch.content);
    }
    update.last_modified = new Date().toISOString();

    const { data, error } = await supabase
      .from('chapters')
      .update(update)
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error?.code === 'PGRST116')
      return res.status(404).json({ error: 'Chapter not found' });
    if (error) throw error;
    const mapped = {
      id: data.id,
      title: data.title,
      content: data.content,
      wordCount: data.word_count,
      lastModified: data.last_modified,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
    res.json(mapped);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating chapter', error: error.message });
  }
});

// DELETE /api/chapters/:id
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const { data, error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .select('id')
      .single();

    if (error?.code === 'PGRST116')
      return res.status(404).json({ error: 'Chapter not found' });
    if (error) throw error;
    res.json({ success: true, id: data.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting chapter', error: error.message });
  }
});

module.exports = router;
