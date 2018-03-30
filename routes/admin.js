var mongoose = require("mongoose");
require("../models/admin");
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
   app.post('/register',passport.authenticate('local-admin-signup',{
		successRedirect :  '/adminSuccessful',
		failureRedirect :  '/admin',
		failureFlash	: true
	}))

   //Admin Successful Login
   app.post('/adminLoggedin',passport.authenticate('local-admin-login',{
        successRedirect :  '/adminDashboard',
        failureRedirect : '/admin',
        failureFlash : true
    }));

   //Admin Dashboard
   app.get('/adminDashboard',isLoggedIn,function(req,res){
   		console.log(req.flash("errorMessage"))
   		res.render('adminDashboard');
   });

   //Admin Create's Booking
   app.get('/createBooking',isLoggedIn,function(req,res){
		res.render('createBooking.ejs');
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
				res.render("bookingCreateError.ejs");
			}
			else
			{
				res.render("bookingCreateSuccessful.ejs");
			}
	   	})
	});

   //Admin Check's Booking
   app.get('/checkBooking',isLoggedIn,function(req,res){
		appointmentModel.find({"filled" : 1},function(err,data){
			if(err)
				throw err;
			else
			{
				console.log(send);
				res.render('checkBooking.ejs');
			}
   	  	})
	});

   //Admin Enrolls Students
   app.get('/enroll',isLoggedIn,function(req,res){
		res.render('enroll.ejs');
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
				res.render("enrolledError.ejs");
			}
			else
			{	
				res.render("enrolledSuccessful.ejs");
			}
	  	})
	});

	//Admin Checks enrolled Students
	app.get('/checkEnrollments',isLoggedIn,function(req,res){
		enrollmentModel.find({},function(err,data){
			if(err)
				throw err;
			else
			{
				//console.log(send);
				res.render('checkEnrollments.ejs');
			}
		})
	});

	//Admin Logout
	app.get('/admLogout',isLoggedIn,function(req,res){
		res.render('admin.ejs');
	})
};