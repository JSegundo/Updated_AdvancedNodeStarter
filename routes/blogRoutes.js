const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const { redisCacheMiddleware, invalidateCacheMiddleware } = require('../middlewares/redis');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin ,redisCacheMiddleware({}, false), async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, redisCacheMiddleware({}, false), async (req, res) => {
    try {
      console.log('Fetching blogs from DB');
      const blogs = await Blog.find({ _user: req.user.id });
      res.send(blogs);
    } catch (err) {
      console.error('Server Error:', err);
      res.status(500).send(err.message);
    }
  });

  app.post('/api/blogs', 
    requireLogin,
    invalidateCacheMiddleware('blogs:*'), // Use a static pattern or
    async (req, res) => {
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
        res.status(400).send(err);
      }
    }
  );
};
