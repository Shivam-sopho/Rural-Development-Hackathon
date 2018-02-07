const mongoose = require('mongoose');
const validator = require('validator');

var Schema = mongoose.Schema;

var adminSchema = new Schema({
	"userName"         : {"type" : String,  "required" : true, "unique" : true},
	"password"         : {"type" : String,  "required" : true},
	"collegeName"      : {"type" : String,  "required" : true},
	"adminType"		   : {"type" : String,  "required" : true}
})

mongoose.model("Admin",adminSchema,"admin");



//res.json("msg" : "OK");