import bcrypt from 'bcrypt';
import pool from '../db/db.js';
import crypto from 'crypto';
import { addMinutes } from '../utils/time.js';


// Role based access control

// Render register page
export const showRegister = (req, res) => {
  res.render('register'); // flash messages available via res.locals
};

// Render login page
export const showLogin = (req, res) => {
  res.render('login'); // flash messages available via res.locals
};

// Handle user registration
export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Basic validation
    if (!username || username.trim().length < 4) {
      req.flash('error', 'Username must be at least 4 characters.');
      return res.redirect('/register');
    }

    if (!password || password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/register');
    }

    const userExists = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (userExists.rows.length > 0) {
      req.flash('error', '⚠️ Username already exists.');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'user'; // Default role for new users
    await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
      [username, hashedPassword, role]
    );

    req.flash('success', '✅ Registration successful! Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', '❌ Error registering user.');
    res.redirect('/register');
  }
};

// Handle login
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    const storedPassword = user?.password || user?.password_hash;

    if (user && storedPassword && await bcrypt.compare(password, storedPassword)) {
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role // make sure role is selected from DB
      };

      // Role-based redirection
      if (user.role === 'admin') {
        res.redirect('/admin');
      } else {
        res.redirect('/');
      }
    } else {
      req.flash('error', '❌ Invalid username or password.');
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    req.flash('error', '❌ Login error.');
    res.redirect('/login');
  }
};

// Handle logout
export const logout = (req, res) => {
  // Store flash message BEFORE destroying session
  req.flash('success', '👋 Logged out successfully.');

  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      // Set flash again because session is still alive
      req.flash('error', '⚠️ Logout failed.');
      return res.redirect('/');
    }

    res.redirect('/');
  });
};

// Render forgot password page
export const showForgot = (req, res) => {
  res.render('forgot');
};

// Handle forgot password: create token and show it (demo)
export const handleForgot = async (req, res) => {
  const { username } = req.body;
  if (!username) {
    req.flash('error', 'Please provide username.');
    return res.redirect('/forgot');
  }

  try {
    const result = await pool.query('SELECT id, username FROM users WHERE username = $1', [username.trim()]);
    const user = result.rows[0];
    if (!user) {
      req.flash('error', 'No account with that username.');
      return res.redirect('/forgot');
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = addMinutes(new Date(), 60); // 1 hour

    await pool.query('INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)', [user.id, token, expiresAt]);
    console.log('Created reset token for user', user.username, token, 'expiresAt', expiresAt);

    // For demo purposes, render a page that shows the token and link.
    res.send(`<p>Reset token created. Use link: <a href="/reset/${token}">/reset/${token}</a></p><p>Or copy token: ${token}</p>`);
  } catch (err) {
    console.error('Error creating reset token', err);
    req.flash('error', 'Failed to create reset token.');
    res.redirect('/forgot');
  }
};

// Render reset form
export const showResetForm = async (req, res) => {
  const token = req.params.token;
  try {

    const r = await pool.query('SELECT * FROM password_resets WHERE token = $1', [token]);
    console.log('Token lookup for', token, 'result rows:', r.rows.length);
    if (r.rows.length === 0) {
      req.flash('error', 'Invalid or expired reset token.');
      return res.redirect('/forgot');
    }

    const row = r.rows[0];
    const expires = new Date(row.expires_at);
    if (isNaN(expires.getTime()) || expires < new Date()) {
      req.flash('error', 'Invalid or expired reset token.');
      return res.redirect('/forgot');
    }

    res.render('reset', { token, tokenDisclaimer: 'Token valid for 1 hour. For demo, token shown once.' });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error validating token.');
    res.redirect('/forgot');
  }
};

// Handle reset submission
export const handleReset = async (req, res) => {
  const token = req.params.token;
  const { password, confirm } = req.body;
  if (!password || password !== confirm) {
    req.flash('error', 'Passwords do not match.');
    return res.redirect(`/reset/${token}`);
  }

  try {
    const r = await pool.query('SELECT * FROM password_resets WHERE token = $1', [token]);
    if (r.rows.length === 0) {
      req.flash('error', 'Invalid or expired token.');
      return res.redirect('/forgot');
    }

    const row = r.rows[0];
    const expires = new Date(row.expires_at);
    if (isNaN(expires.getTime()) || expires < new Date()) {
      req.flash('error', 'Invalid or expired token.');
      return res.redirect('/forgot');
    }
    const hashed = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, row.user_id]);
    await pool.query('DELETE FROM password_resets WHERE id = $1', [row.id]);

    req.flash('success', 'Password reset successful. You may now log in.');
    res.redirect('/login');
  } catch (err) {
    console.error('Error resetting password', err);
    req.flash('error', 'Failed to reset password.');
    res.redirect('/forgot');
  }
};

