const express = require('express');
     const session = require('express-session');
     const passport = require('passport');
     const LocalStrategy = require('passport-local').Strategy;

     const app = express();

     // Session configuration (adjust secrets and settings)
     app.use(session({
         secret: 'your-secret-key',
         resave: false,
         saveUninitialized: false
     }));

     app.use(passport.initialize());
     app.use(passport.session());

     // User model (replace with your database interaction)
     const User = {
         findByUsername: (username, callback) => { 
             // Simulate database lookup
             if (username === 'testuser' && password === 'password') {
                 return callback(null, { id: 1, username: 'testuser' });
             } else {
                 return callback(null, false); 
             }
         }
     };

     // Passport configuration (Local Strategy)
     passport.use(new LocalStrategy(
         (username, password, done) => {
             User.findByUsername(username, (err, user) => {
                 if (err) { return done(err); }
                 if (!user) { return done(null, false); }
                 if (password !== 'password') { return done(null, false); } // In a real app, hash and compare passwords
                 return done(null, user);
             });
         }
     ));

     // Serialization/Deserialization (for sessions)
     passport.serializeUser((user, done) => {
         done(null, user.id);
     });

     passport.deserializeUser((id, done) => {
         // Retrieve user from database based on 'id'
         done(null, user); 
     });

     // Routes 
     app.post('/login', 
         passport.authenticate('local', { 
             successRedirect: '/dashboard', 
             failureRedirect: '/login' 
         })
     );

     app.get('/dashboard', (req, res) => {
         if (req.isAuthenticated()) {
             res.send('Welcome to your dashboard!'); 
         } else {
             res.redirect('/login'); 
         }
     });

     app.listen(3000, () => console.log('Server started on port 3000'));