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

// const helmet = await import('helmet').then(m => m.default).catch(() => null);
// const compression = await import('compression').then(m => m.default).catch(() => null);
// const morgan = await import('morgan').then(m => m.default).catch(() => null);
// const csurf = await import('csurf').then(m => m.default).catch(() => null);
// const rateLimit = await import('express-rate-limit').then(m => m.default).catch(() => null);

// if (helmet) app.use(helmet());
// if (compression) app.use(compression());
// if (morgan && process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Static assets with a cache TTL for optimization
app.use(express.static('public', { maxAge: '1d' }));

// Setting Session with safer defaults
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
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

// Basic rate limiting on auth endpoints
// if (rateLimit) {
//   const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
//   app.use('/login', limiter);
//   app.use('/register', limiter);
// }

// CSRF protection (optional)
// if (csurf) {
//   app.use(csurf());
//   app.use((req, res, next) => {
//     res.locals.csrfToken = req.csrfToken?.() || '';
//     next();
//   });
// }

// Static + Routes
app.use(authRoutes);
app.use(quizRoutes); // use if you have other routes
app.use(homeRoutes)
app.use(adminRoutes)

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
