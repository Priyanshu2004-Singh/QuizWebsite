// To ensure user and admin are authenticated
export function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();

  req.flash("error", "⚠️ Please login to continue.");
  return res.redirect("/login");
}

// ! Only allow users with 'admin' role
export function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }

  req.flash('error', '⚠️ Access denied. Admins only.');
  res.redirect('/');
}


// Generic role checker for both admin and user ::: nothing [[[]]] 
export function ensureRole(role) {
  return (req, res, next) => {
    if (req.session?.user?.role === role) return next();

    req.flash("error", `🚫 ${role} access only.`);
    return res.redirect("/");
  };
}

