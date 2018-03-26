var express = require('express');
var router = express.Router();
//var app =express();

// router.get('/admins',function(res,req){
// 	res.render('admin.ejs');
// });

router.get('/', function(req, res){
	res.render('admin.ejs');
});


router.post('/',function(req,res){
	var userName = req.body.userName;
	var name = req.body.name;
	var govtId = req.body.govtId;
	var email = req.body.email;
	var phone = req.body.phone;
	var nodalCenter = req.body.nodalCenter;
	var password = req.body.password;

	console.log(name);
	//res.render('home.ejs');
})


module.exports = router;