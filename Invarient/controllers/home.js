/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
   // passport native func
  if (req.isAuthenticated()) {
    res.render('account/userspace', {
      title: 'Invarient',
      headerType: 'logged'
      // NOTE: res.locals.user is passed here too
    });
  }
  else {
    res.render('home', {
      title: 'Invarient',
      headerType: 'notLogged'
    });
  }
};
