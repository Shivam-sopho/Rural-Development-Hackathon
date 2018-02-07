const express = require('express');
const path 	= require('path');
const multer  =   require('multer');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt');
const request = require("request");
const port = process.env.PORT || 8080;
const fs = require("fs");

var index = require('./routes/index');
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGOLAB_URI||"mongodb://ruraldev:ruraldev@ds125578.mlab.com:25578/rural-development");//{useMongoClient: true});

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
let models_path =  './models';
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);


require('./models/User');
const userModel = mongoose.model('User');

app.get('/register',function(req,res){
	res.render('register.ejs');
});

var salt = bcrypt.genSaltSync(15);
var cryptedPassword;
var crypt=function(password){
	cryptedPassword = bcrypt.hashSync(password, salt);
}
app.post('/successfulregister',function(req,res){
	crypt(req.body.password);
	var usr = new userModel({
		"email"          : req.body.email,
		"userName"       : req.body.userName,
        "name"	         : req.body.name,
        "phone"	 	  	 : req.body.phone,
        "address"		 : req.body.address,
        "password"       : cryptedPassword, 	
	});
	usr.save((err,data)=>{
		if(err)
		{
			console.log(err);
			res.render("error.ejs");
		}
		else
		{
			res.render("successful.ejs");
		}
	})
});

//Redirecting to registration page
app.get('/successfulregister',function(req,res){
	res.render("register.ejs");
})




/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


*/

app.listen(port,(err)=>{
	if(!err){
		console.log("Server started on port " + port);
	}
});
