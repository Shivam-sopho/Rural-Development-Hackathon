var express = require('express');
var router = express.Router();
//var app =express();

// router.get('/admins',function(res,req){
// 	res.render('admin.ejs');
// });

router.get('/', function(req, res){
	res.render('userL.ejs');
});



module.exports = router;