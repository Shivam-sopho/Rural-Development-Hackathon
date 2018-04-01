var mongoose = require("mongoose");
require("../models/admin");
require("../models/user");
require('../models/appointment');
require('../models/enrollment');
var Admin = mongoose.model("Admin");
var appointmentModel = mongoose.model('Appointment');
var enrollmentModel = mongoose.model('Enrollment'); 
module.exports = function(app,passport){
    /*middleware function to check the proper authentication */
   function isLoggedIn(req,res,next){
       if(req.isAuthenticated()){
           return next();
       }else{
           res.redirect("/admin")
       }
   }

   //First Page
   app.get('/',function(req,res){
   		//console.log("hello")
		res.render('home.ejs');
	});

   //Admin's Register-Login
   app.get('/admin',function(req,res){
   		res.render('admin.ejs')
   });

   //Admin Successful Register
   app.get('/adminSuccessful',function(req,res){
   		res.render('adminSuccessful')
   });

   //Admin Successful Register
   app.post('/register',passport.authenticate('local-signup',{
		successRedirect :  '/adminSuccessful',
		failureRedirect :  '/admin',
		failureFlash	: true
	}))

   //Admin Successful Login
   app.post('/adminLoggedin',passport.authenticate('local-login',{
        successRedirect :  '/adminDashboard',
        failureRedirect : '/admin',
        failureFlash : true
    }));

   //Admin Dashboard
   app.get('/adminDashboard',isLoggedIn,function(req,res){
   		console.log(req.flash("errorMessage"))
   		res.render('adminDashboard',{"user":req.user});
   });

   //Admin Create's Booking
   app.get('/createBooking',isLoggedIn,function(req,res){
		res.render('createBooking.ejs',{"user":req.user});
	});

   //Admin Booking Store in database
   app.post('/bookingCreateSuccessful',isLoggedIn,function(req,res){
		//console.log(admlog);
		var appoint = new appointmentModel({
			"nodalCenter"    : req.body.nodalCenter,
        	"date"	         : req.body.date,
        	"time"	 	  	 : req.body.time
		});
		appoint.save((err,data)=>{
			if(err)
			{
				console.log(err);
				res.render("bookingCreateError.ejs",{"user":req.user});
			}
			else
			{
				res.render("bookingCreateSuccessful.ejs",{"user":req.user});
			}
	   	})
	});

   //Admin Check's Booking
   app.get('/checkBooking',isLoggedIn,function(req,res){
   		var checkBooking = {};
		appointmentModel.find({"filled" : 1,"nodalCenter" : req.user.address},function(err,data){
			if(err)
				console.log(err);
			else
			{
				//console.log(req.user.address);
				//console.log(data);
				checkBooking = data;
				//console.log(checkBooking);
				res.render('checkBooking.ejs',{"user":req.user, checkBooking});
			}
   	  	})
	});

   //Admin Enrolls Students
   app.get('/enroll',isLoggedIn,function(req,res){
		res.render('enroll.ejs',{"user":req.user});
	});

   //Admin enrollment stores in Database
	app.post('/successfulenrolled',isLoggedIn,function(req,res){
		var enrol = new enrollmentModel({
			"name"           : req.body.name,
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
				res.render("enrolledError.ejs",{"user":req.user});
			}
			else
			{	
				res.render("enrolledSuccessful.ejs",{"user":req.user});
			}
	  	})
	});

	//Admin Checks enrolled Students
	app.get('/checkEnrollments',isLoggedIn,function(req,res){
		var checkEnrollment ={};
		enrollmentModel.find({"nodalCenter" : req.user.address},function(err,data){
			if(err)
				console.log(err);
			else
			{
				checkEnrollment=data;
				//console.log(send);
				res.render('checkEnrollments.ejs',{"user":req.user,checkEnrollment});
			}
		})
	});

	//Admin Logout
	app.get('/admLogout',isLoggedIn,function(req,res){
		res.render('admin.ejs');
	})
};