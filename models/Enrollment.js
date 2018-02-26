const mongoose = require('mongoose');
const validator = require('validator');

var Schema = mongoose.Schema;

var enrollmentSchema = new Schema({
	"name"         : {"type" : String, "required" : true},
	"nodalCenter"      : {"type" : String, "required" : true},
	"enrollDate"       : {"type" : String, "required" : true},
	"phone"  	       : {"type" : Number, "required" : true},
	"email"		   	   : {"type" : String, "required" : true},
	"address"		   : {"type" : String, "required" : true},
	"adminRemarks"	   : {"type" : String, "default" : ""},
	"customerFeedback" : {"type" : String, "default" : ""},
	"customerRating"   : {"type" : String, "default" : ""}
}) 

mongoose.model("Enrollment",enrollmentSchema,"enrollment");
