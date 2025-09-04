const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if(!userId) return res.status(400).json({ error: 'User ID is required' });

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if(error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error obtaining characters',
      error: error.message
    })
  }
})

router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if(!userId) return res.status(400).json({ error: 'User ID is required' });
    const { name, description, age, appearance, personality, background, goals, conflicts } = req.body;

    const { data, error } = await supabase
      .from('characters')
      .insert({
        user_id: userId,
        name,
        description,
        age,
        appearance,
        personality,
        background,
        goals,
        conflicts
      })
      .select()
      .single();
    
    if(error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating character',
      error: error.message
    })
  }
})

module.exports = router;