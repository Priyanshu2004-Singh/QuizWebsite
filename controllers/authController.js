import bcrypt from 'bcrypt';
import pool from '../db/db.js';


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

    if (user && await bcrypt.compare(password, user.password)) {
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

