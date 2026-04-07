const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const pool = require('./db');

app.use(express.json());

// If DB unavailable, fall back to in-memory storage so the API can still run for delivery/tests
let useDb = true;
const inMemoryPosts = [ { id: 1, author: 'Alice', text: 'Olá, mundo!' } ];

async function ensureTables() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS posts (
      id INT PRIMARY KEY AUTO_INCREMENT,
      author VARCHAR(255) NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.promise().query(createTableSQL);
    console.log('Ensured posts table exists');
  } catch (err) {
    console.warn('Warning: could not create/access MySQL DB. Falling back to in-memory storage.');
    console.warn(err && err.message ? err.message : err);
    useDb = false;
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Mini Twitter API - rodando' });
});

app.get('/posts', async (req, res) => {
  if (!useDb) {
    return res.json(inMemoryPosts);
  }
  try {
    const [rows] = await pool.promise().query('SELECT id, author, text, created_at FROM posts ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/posts', async (req, res) => {
  const { author, text } = req.body;
  if (!author || !text) return res.status(400).json({ error: 'author and text are required' });
  if (!useDb) {
    const id = inMemoryPosts.length ? inMemoryPosts[inMemoryPosts.length - 1].id + 1 : 1;
    const newPost = { id, author, text, created_at: new Date().toISOString() };
    inMemoryPosts.push(newPost);
    return res.status(201).json(newPost);
  }
  try {
    const [result] = await pool.promise().execute('INSERT INTO posts (author, text) VALUES (?, ?)', [author, text]);
    const insertedId = result.insertId;
    const [rows] = await pool.promise().query('SELECT id, author, text, created_at FROM posts WHERE id = ?', [insertedId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

ensureTables().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port} (useDb=${useDb})`);
  });
});
