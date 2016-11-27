var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'./uploads'});
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var username = '';
var password = '';
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('go somewhere');
});

/* Register yourself */
router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
});

/* Login yourself */
router.get('/login', function(req, res, next) {
  res.render('login',{title:'Login'});
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:true}),
  function(req, res) {
    //console.log('m here');
     req.flash('success','You are logged in');
     res.redirect('/');
  });

passport.serializeUser(function(user, done) {
  console.log('m her4');
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('m here6');
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  
  function(username, password, done) {
    console.log('m here1');
    User.getUserbyusername(username, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false,{message: 'Unknown User'});
      }
      console.log('user password is:'+user.password);
     User.comparepassword(password,user.password, function (err, isMatch) {
       console.log('m here2');
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }else{
       return done(null, false,{message:'Invalid Password'});
      }
     });
    });
  }
));
/* Register yourself */
router.post('/register',upload.single('profileimage'), function(req, res, next) {

var username = req.body.username;
var email = req.body.email;
var address = req.body.address;
var phonenumber = req.body.phonenumber;
var password1 = req.body.password1;
var password2 = req.body.password2;
var filename = '';

if(req.file){

 console.log('we have a file');
 filename = req.file.filename;

}else{

 filename = 'NoImage.jpg';

}

// form validatior
req.checkBody('email','Email can not be empty').notEmpty();
req.checkBody('email','Email is not valid').isEmail();
req.checkBody('username','Username field can not be empty').notEmpty();
req.checkBody('phonenumber','phonenumber should be an integer').isInt();
req.checkBody('password1','password can not be empty').notEmpty();
req.checkBody('password2','Password not matching').equals(req.body.password1);

var errors = req.validationErrors();

if(errors){


res.render('register',{

  errors:errors
});
}else{

var newUser = new User({

  name:username,
  email:email,
  password:password1,
  phonenumber:phonenumber,
  profileimage:filename

})

User.createUser(newUser,function(err,user){

  if(err) {
  req.flash('error',err);
  }else{
  //req.flash('success','you are registered to login');
  }

});
req.flash('success', 'You are now registered and can login');
res.location('/');
res.redirect('/');

}
});

router.get('/logout', function(req, res, next) {
  console.log('logging out');
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});
module.exports = router;
