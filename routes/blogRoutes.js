const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const { createClient } = require('redis');

const Blog = mongoose.model('Blog');

// Create Redis client with error handling
let client;

const connectRedis = async () => {
  try {
    client = createClient({
      url: 'redis://127.0.0.1:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.log('Too many retries on Redis. Running without cache.');
            return false;
          }
          return Math.min(retries * 100, 3000);
        },
      }
    });

    client.on('error', (err) => {
      console.log('Redis Client Error:', err);
    });

    client.on('connect', () => {
      console.log('Redis Client Connected');
    });

    await client.connect();
  } catch (err) {
    console.log('Redis Connection Error:', err);
    client = null; // Set to null so we can fallback to no-cache mode
  }
};

connectRedis();

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    try {
        try {
          const cachedBlogs = await client.get(`users/${req.user.id}/blogs`);
          if (cachedBlogs) {
            console.log('Serving from cache');
            return res.json(JSON.parse(cachedBlogs));
          }
        } catch (cacheErr) {
          console.log('Cache error, falling back to DB:', cacheErr);
        }
      

      // Get from DB
      const blogs = await Blog.find({ _user: req.user.id });
      console.log('Fetching from DB');
        try {
          await client.set(
            `users/${req.user.id}/blogs`, 
            JSON.stringify(blogs),
            { EX: 300 }
          );
        } catch (cacheErr) {
          console.log('Cache set error:', cacheErr);
        }
      

      res.send(blogs);
    } catch (err) {
      console.error('Server Error:', err);
      res.status(500).send(err.message);
    }
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog); 
    } catch (err) {
      res.send(400, err);
    }
  });
};
