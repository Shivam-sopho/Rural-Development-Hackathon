const express = require('express');
const path 	= require('path');
//const multer  =   require('multer');
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
mongoose.connect("mongodb://ruraldev:ruraldev@ds125578.mlab.com:25578/rural-development");

var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
let models_path =  './models';
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);


require('./models/User');
const userModel = mongoose.model('User');
require('./models/Admin');
const adminModel = mongoose.model('Admin');
require('./models/Appointment');
const appointmentModel = mongoose.model('Appointment');
require('./models/Enrollment');
const enrollmentModel = mongoose.model('Enrollment');


//User Register
app.get('/userRegister',function(req,res){
	res.render('userRegister.ejs');
});

var salt = bcrypt.genSaltSync(15);
var cryptedPassword;
var crypt=function(password){
	cryptedPassword = bcrypt.hashSync(password, salt);
}
app.post('/successfulRegister',function(req,res){
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
			res.render("userError.ejs");
		}
		else
		{
			res.render("userSuccessful.ejs");
		}
	})
});


//User Login
app.get('/userLogin',function(req,res){
	res.render("userLogin.ejs");
})

var salt = bcrypt.genSaltSync(15);
app.post("/userLoggedin",(req,res)=>{
    userModel.find({"userName":req.body.userName},(error,data1)=>{
    	if (data1.length) {
    			bcrypt.compare(req.body.password,data1[0].password,(err,data)=>{
                	if(data){
                		 	res.render("userDashboard.ejs");
                	}
                	else{
                    	res.render("userErrorMessage.ejs");
                	}
            	});
		}
    	else{
    		 res.render("userErrorMessage.ejs");
    	}
    });
});




//Admin Register
app.get('/adminRegister',function(req,res){
	res.render('adminRegister.ejs');
});

var salt = bcrypt.genSaltSync(15);
var cryptedPassword;
var crypt=function(password){
	cryptedPassword = bcrypt.hashSync(password, salt);
}
app.post('/successfuladminregister',function(req,res){
	crypt(req.body.password);
	var adm = new adminModel({
		"userName"       : req.body.userName,
        "name"	         : req.body.name,
        "phone"	 	  	 : req.body.phone,
        "nodalCenter"	 : req.body.nodalCenter,
        "password"       : cryptedPassword, 	
	});
	adm.save((err,data)=>{
		if(err)
		{
			console.log(err);
			res.render("adminError.ejs");
		}
		else
		{
			res.render("adminSuccessful.ejs");
		}
	})
});


//Admin Login
app.get('/adminLogin',function(req,res){
	res.render("adminLogin.ejs");
})

var salt = bcrypt.genSaltSync(15);
app.post("/adminLoggedin",(req,res)=>{
    adminModel.find({"userName":req.body.userName},(error,data1)=>{
    	if (data1.length) {
    			bcrypt.compare(req.body.password,data1[0].password,(err,data)=>{
                	if(data){
                		 	res.render("adminDashboard.ejs");
                	}
                	else{
                    	res.render("adminErrorMessage.ejs");
                	}
            	});
		}
    	else{
    		 res.render("adminErrorMessage.ejs");
    	}
    });
});


//Booking Creation
app.get('/createBooking',function(req,res){
	res.render('createBooking.ejs');
});

app.post('/booked',function(req,res){
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

app.get('/checkBooking',function(req,res){
	res.render('/checkBooking.ejs');
});


//User Time Booking
app.get('/timeBooking',function(req,res){
	var send = {};
	appointmentModel.find({},function(err,data){
		if(err)
			throw err;
		else{
			//console.log(data);
			send.nodalCenter = data;
			console.log(send);
			res.render('timeBooking.ejs',send);
		}
	})
});

app.post("/getDate",function(req,res){
	appointmentModel.find({"nodalCenter":req.body.nodalCenter},function(err,data){
		if(err)
			throw err;
		else{
			res.send(data)
		}
	})
})

app.post("/getTime",function(req,res){
	appointmentModel.find({"date":req.body.date},function(err,data){
		if(err)
			throw err;
		else{
			console.log(data);
			res.send(data);
		}
	})
})


app.post('/bookedbyUser',function(req,res){
	var appoint = new appointmentModel({
		"userName"    	 : req.body.userName,
        "phone"	         : req.body.phone,
        "email"	 	  	 : req.body.email	
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
 

app.get('/enroll',function(req,res){
	res.render('enroll.ejs');
});

app.post('/successfulenrolled',function(req,res){
	var enrol = new enrollmentModel({
		"userName"       : req.body.userName,
        "phone"	 	  	 : req.body.phone,
        "nodalCenter"	 : req.body.nodalCenter,
        "date"			 : req.body.date,
        "address"		 : req.body.address,
        "email"			 : req.body.email	
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




app.listen(port,(err)=>{
	if(!err){
		console.log("Server started on port " + port);
	}
});
