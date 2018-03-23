/**
 * New node file
 */
var mq_client = require('../rpc/client');
var crypto = require('crypto');
var multer = require('multer');

function farmerHome(req,res){
	console.log("in farmerHome");
	res.render('farmerHome');	
}

function farmerDetails(req,res){
	
console.log("nitesh");	
console.log(req.session.data.key);
if(req.session.data){
		
		var data = {key: req.session.data.key,"methodName":"farmerDetails"};
		mq_client.make_request('farmer_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				res.send(results);
			}  
		});
		
	}
	else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}
	
}

function farmerUpdateDetails(req, res){
	
	console.log("In farmerUpdateDetails on nOdejs");

	if(req.session.data){
		
	var data = {"fKey":req.session.data.key,"fActive":0,"fSSN": req.body.farmerDetails.fSSN, "fEmail":req.body.farmerDetails.fEmail,"fFirstName":req.body.farmerDetails.fFirstName,"fLastName": req.body.farmerDetails.fLastName, "fPhoneNumber":req.body.farmerDetails.fPhoneNumber,"fAddress":req.body.farmerDetails.fAddress,"fState":req.body.farmerDetails.fState,"fCity":req.body.farmerDetails.fCity,"fZip":req.body.farmerDetails.fZip,"methodName":"farmerUpdateDetails"};
	
	mq_client.make_request('farmer_queue',data, function(err,results){
		if(err){
			throw err;
		}
		else 
		{	
			if(results.status == "200"){
				res.redirect('/farmerDetails');
			}else{
				res.send(results);
			}
			
		}  
	});
	
	}
	else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}
	
}

function farmerUpdatePassword(req, res){
	
	console.log("In farmerUpdatePassword on nOdejs");
	
	if(req.session.data){
	var encryptOldPassword = crypto.createHash("md5").update(req.body.farmerDetails.fOldPassword).digest('hex');
	var encryptNewPassword = crypto.createHash("md5").update(req.body.farmerDetails.fNewPassword).digest('hex');
	
	var data = {"fKey":req.session.data.key,"encryptOldPassword":encryptOldPassword,"encryptNewPassword": encryptNewPassword,"methodName":"farmerUpdatePassword"};
	
	mq_client.make_request('farmer_queue',data, function(err,results){
		if(err){
			throw err;
		}
		else 
		{	
			res.send(results);
			
		}  
	});
	}
	else
	{
		res.send({"status":"400","message":"Please reload the page and try again to show cart details"});
	}
	
}

function addProduct(req, res){
	var imagePath="";
	if(req.session.data)
	{
	console.log("In farmerUpdatePassword on nOdejs");

	
	var storage = multer.diskStorage({ 
	    destination: function (req, file, cb) {
	        cb(null, '../public/uploads/images');
	    },
	    filename: function (req, file, cb) {
	        var datetimestamp = Date.now();
	        imagePath = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
	        cb(null, imagePath);
	    }
	});

	var upload = multer({ storage: storage}).single('file');

	upload(req,res,function(err){
	        if(err){
	             res.json({error_code:1,err_desc:err});
	             return;
	        }
	
			var pID = Math.floor(Math.random()*10000000000);
			
			var data = {"fKey":req.session.data.key,"fName":req.session.data.name,"pID":pID,"pName":req.body.productDetails.pName,"pPrice":req.body.productDetails.pPrice,"pDesc":req.body.productDetails.pDesc,"pImage":imagePath, "pDiscount": req.body.productDetails.pDiscount , "discountedPrice": req.body.productDetails.discountedPrice ,"methodName":"addProduct"};
			
			mq_client.make_request('farmer_queue',data, function(err,results){
				if(err){
					throw err;
				}
				else 
				{	
					res.send(results);
					
				}  
			});	
		});
	
	}
	else
		{
			res.send({"status":"400","message":"Please reload the page and try again because session is not set"});
		}
}


function farmerProductList(req,res){
	
	if(req.session.data){
		
		console.log("In product List Method");
		
		var data = {"fKey":req.session.data.key,"methodName":"farmerProductList"};
		mq_client.make_request('farmer_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				res.send(results);
			}  
		});
		
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function farmerDeletProduct(req, res){
	console.log(req.session.data);
	if(req.session.data){
		
		console.log("In farmerDeletProduct Method");
		
		var data = {"fKey":req.session.data.key,"pID":req.body.pID,"methodName":"farmerDeletProduct"};
		mq_client.make_request('farmer_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				res.send(results);
			}  
		});
		
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}
}

function farmerDeletProduct(req, res){
	console.log(req.session.data);
	if(req.session.data){
		
		console.log("In farmerDeletProduct Method");
		
		var data = {"fKey":req.session.data.key,"pID":req.body.pID,"methodName":"farmerDeletProduct"};
		mq_client.make_request('farmer_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				res.send(results);
			}  
		});
		
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

function farmerGetProductDetails(req,res){
	
	if(req.session.data){
		
		console.log("In getproductDetails Method");
		
		var data = {"fKey":req.session.data.key,"pID":req.body.pID,"methodName":"farmerGetProductDetails"};
		mq_client.make_request('farmer_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				res.send(results);
			}  
		});
		
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}

//function updateProduct(req, res){
//	
//	console.log("In updateProduct on nOdejs");
//	
//	if(req.session.data){
//	
//	var imagePath;
//	var storage = multer.diskStorage({ 
//	    destination: function (req, file, cb) {
//	        cb(null, '../public/uploads/images');
//	    },
//	    filename: function (req, file, cb) {
//	        var datetimestamp = Date.now();
//	        imagePath = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
//	        cb(null, imagePath);
//	    }
//	});
//
//	var upload = multer({ storage: storage}).single('file');
//
//	upload(req,res,function(err){
//	        if(err){
//	             res.json({error_code:1,err_desc:err});
//	             return;
//	        }
//	
//	
//	var data = {"fKey":req.session.data.key,"pID":req.body.productDetails.pID,"pName":req.body.productDetails.pName,"pPrice":req.body.productDetails.pPrice,"pDesc":req.body.productDetails.pDesc,"pImage":imagePath,"methodName":"updateProduct"};
//	console.log("///////////////////////////////////////////");
//	
//	console.log(req.session.data.key);
//	console.log(data);
//	
//	console.log("///////////////////////////////////////////");
//	mq_client.make_request('farmer_queue',data, function(err,results){
//		if(err){
//			throw err;
//		}
//		else 
//		{	
//				res.send(results);
//			
//		}  
//	});
//	});
//	
//	}
//	else
//	{
//		res.send({"status":"400","message":"Please reload the page and try again to show cart details"});
//	}
//	
//}

function updateProduct(req, res){
	
	console.log("In updateProduct on nOdejs");
	
	if(req.session.data){
	
	var imagePath;
	var storage = multer.diskStorage({ 
	    destination: function (req, file, cb) {
	        cb(null, '../public/uploads/images');
	    },
	    filename: function (req, file, cb) {
	        var datetimestamp = Date.now();
	        imagePath = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
	        cb(null, imagePath);
	    }
	});

	var upload = multer({ storage: storage}).single('file');

	upload(req,res,function(err){
	        if(err){
	             res.json({error_code:1,err_desc:err});
	             return;
	        }
	
	
	var data = {"fKey":req.session.data.key,"pID":req.body.productDetails.pID,"pName":req.body.productDetails.pName,"pPrice":req.body.productDetails.pPrice,"pDesc":req.body.productDetails.pDesc,"pImage":imagePath,"methodName":"updateProduct"};
	console.log("///////////////////////////////////////////");
	
	console.log(req.session.data.key);
	console.log(data);
	
	console.log("///////////////////////////////////////////");
	mq_client.make_request('farmer_queue',data, function(err,results){
		if(err){
			throw err;
		}
		else 
		{	
				res.send(results);
			
		}  
	});
	});
	
	}
	else
	{
		res.send({"status":"400","message":"Please reload the page and try again to show cart details"});
	}
	
}



function farmerDeleteAccount(req,res){
	if(req.session.data){
		console.log("Session contains: "+req.session.data.name+"::"+req.session.data.key);
		//console.log("In farmerDeleteAccount: "+req.body.fName);
		var data = {"fKey":req.session.data.key,"methodName":"farmerDeleteAccount"};
		mq_client.make_request('farmer_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				//console.log(results.inCart)
				res.send(results);
			}  
		});
	}
	else
	{
		res.send({"status":"400","message":"Please reload the page and try again to show cart details"});
	}
	
}


exports.farmerProductList=farmerProductList;
exports.farmerUpdatePassword=farmerUpdatePassword;
exports.farmerHome = farmerHome;
exports.farmerDetails=farmerDetails;
exports.farmerUpdateDetails = farmerUpdateDetails;
exports.addProduct = addProduct;
exports.farmerDeletProduct = farmerDeletProduct;
exports.farmerGetProductDetails = farmerGetProductDetails;
exports.updateProduct=updateProduct;
exports.farmerDeleteAccount=farmerDeleteAccount;