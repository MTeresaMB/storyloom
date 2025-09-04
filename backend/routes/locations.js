const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if(!userId) return res.status(400).json({ error: 'User ID is required' });

    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if(error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error obtaining locations',
      error: error.message
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if(!userId) return res.status(400).json({ error: 'User ID is required' });

    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .single();
    
    if(error?.code === 'PGRST116') return res.status(404).json({ error: 'Location not found' });
    if(error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error obtaining location',
      error: error.message
    })
  }
})

router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if(!userId) return res.status(400).json({ error: 'User ID is required' });

    const { name, description, type, atmosphere, important_details } = req.body;

    const { data, error } = await supabase
      .from('locations')
      .insert({
        user_id: userId,
        name,
        description,
        type,
        atmosphere,
        important_details
      })
      .select()
      .single();
    
    if(error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating location',
      error: error.message
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if(!userId) return res.status(400).json({ error: 'User ID is required' });

    const update = req.body;

    const { data, error } = await supabase
      .from('locations')
      .update({...update, updated_at: new Date().toISOString()})
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if(error?.code === 'PGRST116') return res.status(404).json({ error: 'Location not found' });
    if(error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating location',
      error: error.message
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if(!userId) return res.status(400).json({ error: 'User ID is required' });

    const { data, error } = await supabase
      .from('locations')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if(error?.code === 'PGRST116') return res.status(404).json({ error: 'Location not found' });
    if(error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting location',
      error: error.message
    })
  }
})

module.exports = router;