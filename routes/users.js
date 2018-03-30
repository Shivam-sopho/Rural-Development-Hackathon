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


   app.get('/userL',function(req,res){
   		res.render('userL.ejs')
   });

   app.post('/successfulUserRegister',passport.authenticate('local-user-signup',{
		successRedirect :  '/userSuccessful',
		failureRedirect :  '/userL',
		failureFlash	: true
	}))

   app.get('/userSuccessful',function(req,res){
   		res.render('userSuccessful.ejs')
   });

   app.get('/userDashboard',isLoggedIn,function(req,res){
   		res.render('userDashboard')
   });

   app.post('/userLoggedin',passport.authenticate('local-user-login',{
        successRedirect :  '/userDashboard',
        failureRedirect : '/userL',
        failureFlash : true
    }));

   
};