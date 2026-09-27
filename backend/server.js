require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Fetch Bible Verses
app.get('/api/bible/:book/:chapter', async (req, res) => {
  const { book, chapter } = req.params;
  const { data, error } = await supabase
    .from('bible_verses')
    .select('*')
    .eq('book', book)
    .eq('chapter', parseInt(chapter))
    .order('verse', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Fetch Saints
app.get('/api/saints', async (req, res) => {
  const { data, error } = await supabase.from('saints').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Fetch Today's Events
app.get('/api/events/today', async (req, res) => {
  const today = new Date().toISOString().split('T')[0]; 
  const { data, error } = await supabase
    .from('daily_events')
    .select('*')
    .eq('event_date', today);
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for Vercel Serverless
module.exports = app;