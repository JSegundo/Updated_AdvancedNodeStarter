const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
// const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const keys = require('./config/keys');

const app = express();

require('./models/User');
require('./models/Blog');
require('./services/passport');
// Update mongoose connection with modern syntax and options
mongoose.connect(keys.mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server only after successful connection
    app.listen(5000, () => {
      console.log('Server running on http://localhost:5000');
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

//  CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

app.use(bodyParser.json());

// Cookie-session configuration
app.use(
  cookieSession({
    name: 'session',
    keys: [keys.cookieKey],
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  })
);

app.set('trust proxy', 1); // trust first proxy for secure cookies

// Initialize passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);

// Update production route handling
if (['production'].includes(process.env.NODE_ENV)) {
  // Serve static files
  app.use(express.static('client/build'));

  const path = require('path');
  // Catch all routes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
