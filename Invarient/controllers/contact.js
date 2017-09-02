const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');


const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD
  }
});

/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = (req, res) => {
  
  // REMEMBER: res.locals.user becomes just user in pug - can access here as res.locals.user
  // console.log('USER IS: ' + res.locals.user);

  // passport native func
  if (req.isAuthenticated()) {
    res.render('contact', {
      title: 'Contact',
      headerType: 'logged'
    });
  }
  else {
    res.render('contact', {
      title: 'Contact',
      headerType: 'notLogged',
    });
  }
  
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = (req, res) => {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('message', 'Message cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  // console.log("EMAIL: " + req.body.email);
  // console.log("NAME: "+  req.body.name + "MESSAGE: " + req.body.message);
  var newMessage = new Contact({
    email: req.body.email,
    name: req.body.name,
    message: req.body.message
  })
  newMessage.save(function(err) {
    if (err) {
      throw err;
    }
    else {
      req.flash('success', { msg: 'Email has been sent successfully!' });
      res.redirect('/contact');
    }
  });

/* FOR NOW - STORE IN DATABASE.  IN FUTURE, WILL USE MAILING FEATURE
  const mailOptions = {
    to: 'your@email.com',
    from: `${req.body.name} <${req.body.email}>`,
    subject: 'Contact Form | Hackathon Starter',
    text: req.body.message
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/contact');
  });
  */
};
