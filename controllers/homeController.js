import pool from '../db/db.js';

export const homePage = (req, res) => {
  res.render("home", {
    
    user: req.session.user?.username || null,
  });
};

