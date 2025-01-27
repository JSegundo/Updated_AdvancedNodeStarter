const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      console.log('Google authentication successful');
      res.redirect('http://localhost:3000/blogs');
    }
  );

  app.get('/auth/logout', (req, res, next) => {
    console.log('Logout initiated');
    
    if (!req.user) {
      console.log('No user to logout');
      return res.redirect('http://localhost:3000');
    }

    try {
      req.logout((err) => {
        if (err) {
          console.error('Logout error:', err);
          return next(err);
        }
        req.session = null; // Clear the session
        console.log('Logout successful, session cleared');
        res.redirect('http://localhost:3000');
      });
    } catch (error) {
      console.error('Unexpected logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
