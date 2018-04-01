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
		var nodalCenter= {};
		appointmentModel.find({"filled" : 0},function(err,data){
			if(err)
				console.log(err);
			else
			{
				nodalCenter=data;
				//console.log(data);
				res.render('timeBooking.ejs',{"user" :req.user,nodalCenter});
			}
		})
	});

	var tempNodal;
	var tempDate;
	var tempTime;
	//AJAX 1
	app.post("/getDate",isLoggedIn,function(req,res){
		var date = {};
		appointmentModel.find({"nodalCenter" : req.body.nodalCenter, "filled" : 0},function(err,data){
			if(err)
				console.log(err);
			else
			{
				date=data;
				//console.log(data);
				//console.log(date);
				tempNodal=req.body.nodalCenter;
				res.send(date);
			}
		})
	});

	//AJAX 2
	app.post("/getTime",isLoggedIn,function(req,res){
		var time = {};
		appointmentModel.find({"date" : req.body.date, "nodalCenter" : tempNodal, "filled" : 0},function(err,data){
			if(err)
				console.log(err);
			else
			{
				tempDate=req.body.date;
				time = data;
				//console.log(data);
				//console.log(temp);
				console.log(tempDate);
				//console.log('hiiiii');
				res.send(time);
			}
		})
	});

	//User Time Booked
	app.post("/bookingDoneSuccessful",isLoggedIn,(req,res)=>{
			console.log('h123iiiii');
		appointmentModel.remove({ "nodalCenter": tempNodal, "date": tempDate , "time": req.body.time },function(err,data){
	   		if(err)
   			{
   				console.log(err);
   			}
   			else
   			{
   				console.log('hiiiii');
   				var appoint = new appointmentModel({
					"nodalCenter"    : tempNodal,
    	    		"date"	         : tempDate,
        			"time"	 	  	 : req.body.time,
        			"userName"		 : req.user.name,
   					"phone" 		 : req.user.phone,
   					"email" 		 : req.user.email,
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
						console.log('success');
						res.render("bookingSuccessful.ejs");
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
		req.logout();
		res.redirect('/userL');
	});

};