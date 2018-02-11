const mongoose = require('mongoose');
const validator = require('validator');

var Schema = mongoose.Schema;

var appointmentSchema = new Schema({
	"userName"         : {"type" : String},
	"nodalCenter"      : {"type" : String, "required" : true},
	"date"             : {"type" : String, "required" : true},
	"time"        	   : {"type" : String, "required" : true},
	"phone"  	       : {"type" : Number},
	"email"		   	   : {"type" : String}
})

mongoose.model("Appointment",appointmentSchema,"appointment");
