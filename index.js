const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
// const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const keys = require('./config/keys');
const { initializeRedisClient } = require('./middlewares/redis');
require('dotenv').config();

// Import models and services
require('./models/User');
require('./models/Blog');
require('./services/passport');

async function initializeApp() {
  const app = express();

  // Initialize middleware
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  app.use(bodyParser.json());
  app.use(cookieSession({
    name: 'session',
    keys: [keys.cookieKey],
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }));

  // Initialize authentication
  app.use(passport.initialize());
  app.use(passport.session());
  app.set('trust proxy', 1);

  try {
    // Connect to MongoDB
    await mongoose.connect(keys.mongoURI);
    console.log('Connected to MongoDB');

    // Initialize Redis
    await initializeRedisClient();
    console.log('Redis initialized');

    // Register routes
    require('./routes/authRoutes')(app);
    require('./routes/blogRoutes')(app);

    // Production setup
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static('client/build'));
      const path = require('path');
      app.get('*', (req, res) => {
        res.sendFile(path.resolve('client', 'build', 'index.html'));
      });
    }

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

// Start the application
initializeApp().catch(error => {
  console.error('Application startup failed:', error);
  process.exit(1);
});
