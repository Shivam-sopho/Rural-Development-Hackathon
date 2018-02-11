const mongoose = require('mongoose');
const validator = require('validator');

var Schema = mongoose.Schema;

var enrollmentSchema = new Schema({
	"userName"         : {"type" : String, "required" : true},
	"nodalCenter"      : {"type" : String, "required" : true},
	"date"             : {"type" : String, "required" : true},
	"phone"  	       : {"type" : Number, "required" : true},
	"email"		   	   : {"type" : String, "required" : true},
	"address"		   : {"type" : String, "required" : true}
})

mongoose.model("Enrollment",enrollmentSchema,"enrollment");
