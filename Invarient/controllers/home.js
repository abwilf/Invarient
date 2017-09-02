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
    });
  }
  else {
    res.render('home', {
      title: 'Invarient',
      headerType: 'notLogged'
    });
  }
};
