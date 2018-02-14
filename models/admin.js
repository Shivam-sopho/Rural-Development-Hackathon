const mongoose = require('mongoose');
const validator = require('validator');

var Schema = mongoose.Schema;

var adminSchema = new Schema({
	"userName"         : {"type" : String,  "required" : true, "unique" : true},
	"govtId"           : {"type" : String,  "required" : true, "unique" : true},
	"name"	           : {"type" : String,  "required" : true},
	"email"	           : {"type" : String,  "required" : true},
	"phone"            : {"type" : Number,  "required" : true},
	"password"         : {"type" : String,  "required" : true},
	"nodalCenter"      : {"type" : String,  "required" : true}
})

mongoose.model("Admin",adminSchema,"admin");
