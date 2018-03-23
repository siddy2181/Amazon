var mq_client = require('../rpc/client');
var crypto = require('crypto');
var multer = require('multer');

function getEncrypt (password) {
    var hash = crypto.createHash("md5").update(password).digest('hex');
    return hash;
}

function userSignIn(req, res){
	
	var encryptPassword = crypto.createHash("md5").update(req.body.signInDetails.password).digest('hex');
	
	var data = {"email":req.body.signInDetails.email,"password":encryptPassword,"type":req.body.signInDetails.type,"methodName":"userSignIn"};
	
	console.log(data);
	
	mq_client.make_request('login_Queue',data, function(err,results){
		if(err){
			throw err;
		}
		else 
		{	
			if(results.status == "200"){
				req.session.data={"key":results.key,"name":results.name,"signInAs":results.signInAs};
			}	
			res.send(results);
		}  
	});
}

function farmerSignUp(req, res){
	var videoPath="file-1111111111111.mp4";
	console.log("inside famer signup");
	
	
	var storage = multer.diskStorage({ 
	    destination: function (req, file, cb) {
	        cb(null, '../public/uploads/videos');
	    },
	    filename: function (req, file, cb) {
	        var datetimestamp = Date.now();
	        videoPath = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
	        console.log(videoPath);
	        cb(null, videoPath);
	    }
	});

	var upload = multer({ storage: storage}).single('file');

	upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        var encryptPassword = crypto.createHash("md5").update(req.body.farmerDetails.fPassword).digest('hex');
    	
    	var data = {"fKey":req.body.farmerDetails.fSSN,"fActive":0,"fSSN": req.body.farmerDetails.fSSN, "fEmail":req.body.farmerDetails.fEmail, "fPassword": encryptPassword, "fFirstName":req.body.farmerDetails.fFirstName,"fLastName": req.body.farmerDetails.fLastName, "fPhoneNumber":req.body.farmerDetails.fPhoneNumber,"fAddress":req.body.farmerDetails.fAddress,"fState":req.body.farmerDetails.fState,"fCity":req.body.farmerDetails.fCity,"fZip":req.body.farmerDetails.fZip,"fVideo":videoPath,"fRatingReview":[],"fDeliveryHistory":[],"methodName":"farmerSignUp"};
    	console.log("after inserting new farmer data");
    	mq_client.make_request('login_Queue',data, function(err,results){
    		if(err){
    			throw err;
    		}
    		else 
    		{	
    			if(results.status == "200"){
    				//req.session.data={"key":results.key,"name":results.name,"signInAs":"farmer"};
    			}
    			res.send(results);
    		}  
    	});
	});
}	

function customerSignUp(req, res){
	
	var encryptPassword = crypto.createHash("md5").update(req.body.customerDetails.cPassword).digest('hex');
	
	var data = {"cKey":req.body.customerDetails.cSSN,"cActive":1,"cSSN": req.body.customerDetails.cSSN, "cEmail":req.body.customerDetails.cEmail, "cPassword": encryptPassword, "cFirstName":req.body.customerDetails.cFirstName,"cLastName": req.body.customerDetails.cLastName, "cPhoneNumber":req.body.customerDetails.cPhoneNumber,"cAddress":req.body.customerDetails.cAddress,"cState":req.body.customerDetails.cState,"cCity":req.body.customerDetails.cCity,"cZip":req.body.customerDetails.cZip,"cCCNo":req.body.customerDetails.cCreditCardNumber,"cCVV":req.body.customerDetails.cCreditCardSC,"cCCExpMonth":req.body.customerDetails.cCreditCardMonth,"cCCExpYear":req.body.customerDetails.cCreditCardYear,"cRatingReview":[],"methodName":"customerSignUp"};
	
	mq_client.make_request('login_Queue',data, function(err,results){
		if(err){
			throw err;
		}
		else 
		{	
			if(results.status == "200"){
				//req.session.data={"cKey":results.cKey};
			}
			res.send(results);
		}  
	});
	
}

exports.customerSignUp=customerSignUp;
exports.farmerSignUp=farmerSignUp;
exports.userSignIn=userSignIn;