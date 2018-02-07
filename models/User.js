const mongoose = require('mongoose');
const validator = require('validator');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	"email"         : {"type" : String,  "required" : true, "unique" : true},
	"userName"      : {"type" : String,  "required" : true, "unique" : true},
	"name"  	    : {"type" : String,  "required" : true},
	"phone"			: {"type" : Number,  "required" : true},
	"address"		: {"type" : String,  "required" : true},
	"password"      : {"type" : String,  "required" : true}

})

mongoose.model("User",userSchema,"user");

