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

   //Maps
   app.get('/map',isLoggedIn,function(req,res){
	var locat = {};
	User.find({'userType' : 'ADMIN'},function(err,data){
		if(err)
			console.log(err);
		else
		{
			locat.locat=data;
			//console.log(locat);
			res.render('map',locat);
		}
	})
})
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
			//console.log('h123iiiii');
		appointmentModel.findOneAndUpdate({ "nodalCenter": tempNodal, "date": tempDate , "time": req.body.time },{"userName" : req.user.name,
			"phone":req.user.phone,"email":req.user.email,"filled":1},function(err,data){
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
	});

	//User Checks enrolled classes
	//console.log("user":req.user.phone);
	app.get('/enrolledClasses',isLoggedIn,function(req,res){
		//console.log("hi");
		enrollmentModel.find({"phone":req.user.phone},function(err,data){
			//console.log(data);
			if(err)
				throw err;
			else
			{
				//console.log(data);
				clas=data;
				//console.log(data[].phone);
				res.render('checkClasses.ejs',{"user" :req.user,clas});
			}
		})
	});	

	//Feedback
	app.get('/feedback',isLoggedIn,function(req,res){
			res.render('feedback.ejs',{"user":req.user});
	})

	app.post('/successFeedback',isLoggedIn,function(req,res){
		enrollmentModel.findOneAndUpdate({"phone": req.user.phone}, {"customerFeedback": req.body.feedback},function(err,data){
			if(err)
				console.log(err)
			else
			{
				// var enroll=new enrollmentModel({
				// 	"name": req.user.name,
    // 				"phone": req.user.phone,
    // 				"nodalCenter": data[0].nodalCenter,
    // 				"enrollDate": data[0].enrollDate,
    // 				"address": req.user.address,
    // 				"email": req.user.email,
    // 				"customerFeedback": req.body.feedback,
    // 				"customerRating": "Not provided",
    // 				"adminRemarks": "",
				// });
				// enroll.save((err,data)=>{
				// 	if(err)
				// 	{
				// 		console.log(err);
				// 		res.render("bookingSuccessful.ejs");
				// 	}
				// 	else
				// 	{	
				// 		console.log('success');
				// 		res.render("home.ejs");
				// 	}
				// });

				console.log('success');
				res.render("userDashboard.ejs");


			}
		});
	});


	//User Navigation
	app.get('/navigation',isLoggedIn,function(req,res){
		var email = req.user.email;
		var nodal={};
		appointmentModel.find({'email' : email},function(err,data){
			if(err)
				console.log(err);
			else
			{
				nodal.nodal = data;
				//console.log(nodal);
				res.render('navigation',nodal);
			}

		})
	})

	//User Logout
	app.get('/userLogout',isLoggedIn,function(req,res){
		req.logout();
		res.redirect('/userL');
	});

};