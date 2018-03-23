//var mysql = require("./mysql.js");
//var mongo = require("./mongo");
//var mongoURL = "mongodb://localhost:27017/AmazonFresh";

/* GET home page. */

exports.index = function(req, res){
   res.render('index');
};

function signIn(req, res){
	res.render('signIn');
}

function signUp(req, res){
	res.render('signUp');
}

function session(req,res){
	if(req.session.data){
		console.log("Session Exists..");
		res.send({"status":"200","signInAs":req.session.data.signInAs});
	}
	else{
		console.log("NO Session Exists..");
		var result={"status":"400"};
		res.send(result);
	}
}

function sessionEnd(req,res){
	
	console.log("/////////////////////////////Nitesh Wadhwa ///////////////////////");
	if(req.session.data){
		console.log("Session Exists..Destroying Session");
		req.session.destroy();
		console.log("Session Destroyed");
	}

	console.log("NO Session Exists..");
	var result={"status":"200"};
	res.send(result);
	
}

exports.sessionEnd=sessionEnd;
exports.session=session;
exports.signIn=signIn; 
exports.signUp=signUp; 
