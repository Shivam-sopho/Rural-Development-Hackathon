var mongoose = require("mongoose");
require("../models/user");
require('../models/appointment');
require('../models/enrollment');
var User = mongoose.model("User");
var appointmentModel = mongoose.model('Appointment');
var enrollmentModel = mongoose.model('Enrollment'); 
module.exports = function(app,passport){
    /*middleware function to check the proper authentication */
   function isLoggedIn(req,res,next){
       if(req.isAuthenticated()){
           return next();
       }else{
           res.redirect("/userL")
       }
   }

   //User Register-Login Page
   app.get('/userL',function(req,res){
   		res.render('userL.ejs')
   });

   //User Register
   app.post('/successfulUserRegister',passport.authenticate('local-signup',{
		successRedirect :  '/userSuccessful',
		failureRedirect :  '/userL',
		failureFlash	: true
	}))

   //User successful Register
   app.get('/userSuccessful',function(req,res){
   		res.render('userSuccessful.ejs')
   });

   //User Dashboard
   app.get('/userDashboard',isLoggedIn,function(req,res){
   		res.render('userDashboard',{"user" :req.user})
   });

   //User Login
   app.post('/userLoggedin',passport.authenticate('local-login',{
        successRedirect :  '/userDashboard',
        failureRedirect : '/userL',
        failureFlash : true
    }));

   //User Time Booking
	app.get('/timeBooking',isLoggedIn,function(req,res){
		appointmentModel.find({},function(err,data){
			if(err)
				console.log(err);
			else
			{
				
				res.render('timeBooking.ejs',{"user" :req.user});
			}
		})
	});

	//AJAX 1
	app.post("/getDate",isLoggedIn,function(req,res){
		//var cenner
		appointmentModel.find({"address" : req.body.address,"email":""},function(err,data){
			if(err)
				throw err;
			else
			{
				nodal=req.body.nodalCenter;
				//console.log(data);
				res.send(data);
			}
		})
	});

	//AJAX 2
	app.post("/getTime",isLoggedIn,function(req,res){
		appointmentModel.find({"date":req.body.date,"email":"","nodalCenter":nodal},function(err,data){
			if(err)
				throw err;
			else
			{
				console.log(data);
				res.send(data);
			}
		})
	});

	//User Time Booked
	app.post("/bookingCreateSuccessful",isLoggedIn
		,(req,res)=>{
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
						res.render("bookingSuccessful.ejs",{"user" :req.user});
					}
					else
					{	
						res.render("bookingSuccessful.ejs",{"user" :req.user});
					}
				});
  			}
  		});
	});

	//User Checks enrolled classes
	app.get('/enrolledClasses',isLoggedIn,function(req,res){
		enrollmentModel.find({},function(err,data){
			if(err)
				throw err;
			else
			{
				console.log(send);
				res.render('checkClasses.ejs',{"user" :req.user});
			}
		})
	});	

	//User Logout
	app.get('/userLogout',isLoggedIn,function(req,res){
		res.render('user.ejs');
	});

};