const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if(!userId) return res.status(400).json({ error: 'User ID is required' });

    const { data, error } = await supabase
      .from('objects')
      .select(
        '*',
        'locations:location_id(id, name)'
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if(error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error obtaining objects',
      error: error.message
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if(!userId) return res.status(400).json({ error: 'User ID is required' });

    const { data, error } = await supabase
      .from('objects')
      .select(
        '*',
        'locations:location_id(id, name)'
      )
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .single();
    
    if(error?.code === 'PGRST116') return res.status(404).json({ error: 'Object not found' });
    if(error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error obtaining object',
      error: error.message
    })
  }
})

router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if(!userId) return res.status(400).json({ error: 'User ID is required' });
    const { name, description, type, importance, location_id } = req.body;

    const { data, error } = await supabase
      .from('objects')
      .insert({
        user_id: userId,
        name,
        description,
        type,
        importance,
        location_id
      })
      .select(
        '*',
        'locations:location_id(id, name)'
      )
      .single();
    
    if(error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating object',
      error: error.message
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if(!userId) return res.status(400).json({ error: 'User ID is required' });

    const update = req.body;

    const { name, description, type, importance, location_id } = req.body;

    const { data, error } = await supabase
      .from('objects')
      .update({...update, updated_at: new Date().toISOString()})
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .select(
        '*',
        'locations:location_id(id, name)'
      )
      .single();
    
    if(error?.code === 'PGRST116') return res.status(404).json({ error: 'Object not found' });
    if(error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating object',
      error: error.message
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if(!userId) return res.status(400).json({ error: 'User ID is required' });

    const { data, error } = await supabase
      .from('objects')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if(error?.code === 'PGRST116') return res.status(404).json({ error: 'Object not found' });
    if(error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting object',
      error: error.message
    })
  }
})

module.exports = router;