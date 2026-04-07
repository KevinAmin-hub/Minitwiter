const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-memory "database"
const posts = [
  { id: 1, author: 'Alice', text: 'Olá, mundo!' }
];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Mini Twitter API - rodando' });
});

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/posts', (req, res) => {
  const { author, text } = req.body;
  if (!author || !text) return res.status(400).json({ error: 'author and text are required' });
  const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
  const newPost = { id, author, text };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
