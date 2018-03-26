const express = require('express');
const path 	= require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const flash = require('connect-flash');
const passport = require('passport');
const expressSession = require('express-session');
const expressValidator = require('express-validator');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const request = require("request");
const port = process.env.PORT || 8080;
const fs = require("fs");

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.Promise = global.Promise
mongoose.connect("mongodb://ruraldev:ruraldev@ds125578.mlab.com:25578/rural-development");


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
let models_path =  './models';
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



require('./models/User');
const userModel = mongoose.model('User');
require('./models/admin');
const adminModel = mongoose.model('Admin');
require('./models/Appointment');
const appointmentModel = mongoose.model('Appointment');
require('./models/Enrollment');
const enrollmentModel = mongoose.model('Enrollment'); 



app.use('/', index);
app.use('/user', users);
app.use('/admin',admin);
app.use('/register',admin);


app.use(expressSession({
	secret : 'secret',
	saveUninitialized : true,
	resave : true
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


app.use(flash());

/*app.use(function(req,res,next){
	res.local.success_msg =  req.flash('success_msg');
	res.local.error_msg = req.flash('error_msg');
	res.local.error = req.flash('error');
	next();
});*/


app.get('/adminDashboard', function(req,res){
	res.render('adminDashboard.ejs',send);
});


//Booking Creation
app.get('/createBooking',function(req,res){
	res.render('createBooking.ejs');
});

app.post('/bookingCreateSuccessful',function(req,res){
	console.log(admlog);
	var appoint = new appointmentModel({
		"nodalCenter"    : req.body.nodalCenter,
        "date"	         : req.body.date,
        "time"	 	  	 : req.body.time
	});
	appoint.save((err,data)=>{
		if(err)
		{
			console.log(err);
			res.render("bookingCreateError.ejs");
		}
		else
		{
			res.render("bookingCreateSuccessful.ejs");
		}
	})
});


//Checking Appointments

// NOTE : Carry the info regarding admin's nodal center for checking its appointments at the time of login!!!
app.get('/checkBooking',function(req,res){
	var ssend = {};
	appointmentModel.find({"filled" : 1},function(err,data){
		if(err)
			throw err;
		else{
			ssend.date = data;
			console.log(send);
			res.render('checkBooking.ejs',ssend);
		}
	})
});


//Enrollment
app.get('/enroll',function(req,res){
	res.render('enroll.ejs');
});

app.post('/successfulenrolled',function(req,res){
	var enrol = new enrollmentModel({
		"name"       : req.body.name,
        "phone"	 	  	 : req.body.phone,
        "nodalCenter"	 : req.body.nodalCenter,
        "enrollDate"	 : req.body.enrollDate,
        "address"		 : req.body.address,
        "email"			 : req.body.email,
        "customerFeedback" : 'Not provide',
		"adminReview"    : 'Not provided',
		"customerRating" : 'Not provided'
	});
	enrol.save((err,data)=>{
		if(err)
		{
			console.log(err);
			res.render("enrolledError.ejs");
		}
		else
		{
			res.render("enrolledSuccessful.ejs");
		}
	})
});


//Check Enrollment
app.get('/checkEnrollments',function(req,res){
	var sssend = {};
	enrollmentModel.find({},function(err,data){
		if(err)
			throw err;
		else{
			sssend.students = data;
			//console.log(send);
			res.render('checkEnrollments.ejs',sssend);
		}
	})
});


//Logout
app.get('/admLogout', function(req,res){
	res.render('admin.ejs');
})








app.get('/userDashboard', function(req,res){
	res.render('userDashboard.ejs');
})

//User Time Booking
app.get('/timeBooking',function(req,res){
	var send = {};
	appointmentModel.find({},function(err,data){
		if(err)
			throw err;
		else{
			send.nodalCenter = data;
			res.render('timeBooking.ejs',send);
		}
	})
});

var nodal;
app.post("/getDate",function(req,res){
	appointmentModel.find({"nodalCenter":req.body.nodalCenter,"email":""},function(err,data){
		if(err)
			throw err;
		else{
			nodal=req.body.nodalCenter;
			//console.log(data);
			res.send(data);
		}
	})
})

app.post("/getTime",function(req,res){
	appointmentModel.find({"date":req.body.date,"email":"","nodalCenter":nodal},function(err,data){
		if(err)
			throw err;
		else{
			console.log(data);
			res.send(data);
		}
	})
})

app.post("/bookingCreateSuccessful",(req,res)=>{
	appointmentModel.remove({ "nodalCenter": req.body.nodalCenter, "date": req.body.date , "time": req.body.time },function(err,data){
   		if(err)
   			console.log(err);
   		else
   		{
   			var appoint = new appointmentModel({
				"nodalCenter"    : req.body.nodalCenter,
        		"date"	         : req.body.date,
        		"time"	 	  	 : req.body.time,
        		"userName"		 : req.body.userName,
   				"phone" 		 : user.body.phone,
   				"email" 		 : user.body.email,
   				"filled"	     : 1
   			});
			appoint.save((err,data)=>{
			if(err)
			{
				console.log(err);
				res.render("bookingSuccessful.ejs");
			}
			else
			{	
				res.render("bookingSuccessful.ejs");
			}
		});
  	}
  });
});


app.get('/enrolledClasses',function(req,res){
	var ssend = {};
	enrollmentModel.find({},function(err,data){
		if(err)
			throw err;
		else{
			ssend.date = data;
			console.log(send);
			res.render('checkClasses.ejs',ssend);
		}
	})
});



app.get('/userLogout', function(req,res){
	res.render('user.ejs');
})



app.listen(port,(err)=>{
	if(!err){
		console.log("Server started on port " + port);
	}
});
