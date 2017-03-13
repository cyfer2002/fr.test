var express    = require('express');
var router     = express.Router();
var config     = require('./config');
var path       = require('path');
var babel      = require('babel-core');
var nodemailer = require('nodemailer');
var passport  = require('passport');
var Gallery = require('node-gallery');
var fs        = require('fs');

// Passport initialize
router.use(passport.initialize());
router.use(passport.session());


// Re Captcha configuration
var recaptcha = require('express-recaptcha');
recaptcha.init('6LfRgxYUAAAAAOBl7lYmn7XhlRB1gADhao1K0eAb', '6LfRgxYUAAAAAHm22ueVWynuS9xa1Hp9gDtNBLsV', { hl: 'fr' });

// Import es6 file
var checkContactForm = eval(babel.transformFileSync(path.join(__dirname, '../source/app/contact/check_form.es6'), {
  presets: ['es2015']
}).code);

var transporter = nodemailer.createTransport('smtps://sport-chru@gmx.fr:Mm2ppBCsf@mail.gmx.com');

router.get('/', function (req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || {};
  var params = req.session.params || {};
  var user = req.user;
  res.render('homepage', {
    title: config.title,
    params: params,
    success: success,
    errors: errors,
    user: user
  });
});

router.get('/news', function (req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || {};
  var params = req.session.params || {};
  var user = req.user;
  res.render('news', {
    title: "News",
    params: params,
    success: success,
    errors: errors,
    user: user
  });
});

router.get('/contact', recaptcha.middleware.render, function(req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || {};
  var params = req.session.params || {};
  var user = req.user;
//  req.session.reset();
  
  res.render('contact', {
    title: 'Contact',
    id: "contact",
    params: params,
    success: success,
    errors: errors,
    user: user,
    captcha: req.recaptcha
  });
});

router.post('/contact', recaptcha.middleware.verify, function(req, res, next) {
  // Check form fields
  var errors = checkContactForm(req.body);
  if (Object.keys(errors).length) {
    req.session.params = req.body;
    req.session.errors = errors;
    return res.redirect('/contact');
  }

  // Check recaptcha
  if (req.recaptcha.error) {
    if (req.xhr) {
      return res.json({ error: 'ReCaptcha Invalide.' });
    }
    req.session.params = req.body;
    req.session.errors = { error: 'Veuillez activer Javascript.' };
    return res.redirect('/contact');
  }

  // Send email asynchronously. This way the user won't have to wait.

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: config.company.replyEmail,
    to:   config.company.email,
    subject: req.body.name + " vous a envoyé un message",
    html: ("<a href='mailto:" + req.body.email + "'>" + req.body.name + "</a> ( Message ) :\n\n" + req.body.message).replace(/\n/g, '<br />')
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if (error){
      return console.log(error);
    }
  });

  // Ajax request
  var message = 'Votre message a bien ete envoyé.';
  if (req.xhr) {
    return res.json({ message: message });
  }

  // HTML request
  req.session.success = message;
  return res.redirect('/contact');
});

/* POST Login verification. */
router.post('/login',
  passport.authenticate('local', {
    successRedirect : '/loginSuccess',
    failureRedirect: '/loginFailure',
    failureFlash: true
  }));


/* POST LogOut page. */
router.get('/logOut', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/signIn', function (req, res, next) {
  res.render('signIn');
});

/* POST Login Failure. */
router.get('/loginFailure', function(req, res, next) {
  res.send({
    error: 'Failed to authenticate'
  });
});

/* POST Login Sucess. */
router.get('/loginSuccess', function(req, res, next) {
  console.log(req.user);
  res.send( {
    message: 'Successfully authenticated',
    user: req.user
  });
});

/* GET Picture page. */
router.get('/pictures', function (req, res, next) {
  var success = req.session.success;
  var errors = req.session.errors || {};
  var params = req.session.params || {};
  var user = req.user;
  var files = fs.readdirSync(path.join(__dirname, '../source/images/photos/'));
  console.log(files);
  
  res.render('/gallery', {
    title: "Galerie Photos",
    params: params,
    success: success,
    errors: errors,
    user: user,
    files: files
  });

});

var options = {
  title: 'Photos Badminton Mars 2017'
};
router.use('/gallery', Gallery(path.join(__dirname, '../source/images/photos/'), options));


module.exports = router;