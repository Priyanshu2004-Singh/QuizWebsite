import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import flash from 'connect-flash';
dotenv.config();
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js'; // if you have
import homeRoutes from './routes/homeRoutes.js'; // if you have
import adminRoutes from './routes/adminRoutes.js'; // if you have
// import { ensureAuthenticated ,ensureAdmin ,ensureRole } from './middleware/auth.js';


const app = express();
// Setting Session
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false
}));

app.use(flash()); // for flash msg 


app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error')
  };
  res.locals.username = req.session.username || null;
  next();
});

// This ensures username only exists in EJS when the user is logged in.
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.username = req.session.user?.username || null;
  res.locals.role = req.session.user?.role || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});



// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Static + Routes
app.use(authRoutes);
app.use(quizRoutes); // use if you have other routes
app.use(homeRoutes)
app.use(adminRoutes)

// Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
