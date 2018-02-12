const mongoose = require('mongoose');
const validator = require('validator');

var Schema = mongoose.Schema;

var appointmentSchema = new Schema({
	"userName"         : {"type" : String, "default" : ""},
	"nodalCenter"      : {"type" : String, "required" : true},
	"date"             : {"type" : String, "required" : true},
	"time"        	   : {"type" : String, "required" : true},
	"phone"  	       : {"type" : Number, "default" : 0},
	"email"		   	   : {"type" : String, "default" : ""},
	"filled"		   : {"type" : Number, "default" : 0}
})

mongoose.model("Appointment",appointmentSchema,"appointment");
