const request = require('supertest');
const app = require('../index');

describe('Mini Twitter API', () => {
  test('GET / returns status message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /posts returns an array', async () => {
    const res = await request(app).get('/posts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /posts validates body', async () => {
    const res = await request(app).post('/posts').send({ author: 'Test' }).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(400);
  });

  test('POST /posts creates a post', async () => {
    const payload = { author: 'TestUser', text: 'Hello from test' };
    const res = await request(app).post('/posts').send(payload).set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('author', payload.author);
    expect(res.body).toHaveProperty('text', payload.text);
  });
});
