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
app.use(expressSession({
    cookieName 	: 'session',
    secret	   	: 'ruraldev',
}))
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
const port = process.env.PORT || 8080;
const fs = require("fs");

mongoose.Promise = global.Promise
mongoose.connect("mongodb://ruraldev:ruraldev@ds125578.mlab.com:25578/rural-development");



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
let models_path =  './models';
//app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



require('./models/user');
const userModel = mongoose.model('User');
require('./models/admin');
const adminModel = mongoose.model('Admin');
require('./models/appointment');
const appointmentModel = mongoose.model('Appointment');
require('./models/enrollment');
const enrollmentModel = mongoose.model('Enrollment'); 



require('./config/passport')(passport);
require("./routes/admin")(app,passport);
require("./routes/users")(app,passport);


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
