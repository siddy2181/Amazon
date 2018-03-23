/**
 * New node file
 */
//var crypto = require('crypto');
var mongo = require('./mongo');
var mongo1 = require('mongodb');
var GridStore = mongo1.GridStore;
var Server = mongo1.Server;
var ObjectID = mongo1.ObjectID;
var Db = mongo1.Db;

var server = new Server('localhost',27017,{auto_reconnect:true});
var db = new Db('AmazonFresh',server);


var mongoURL = "mongodb://localhost:27017/AmazonFresh";
//
//function getEncrypt (password) {
//    var hash = crypto.createHash("md5").update(password).digest('hex');
//    return hash;
//}

//function userSignIn(msg, callback){
//	
//	console.log("nitesh");
//	mongo.connect(mongoURL, function(){
//		console.log('Connected to mongo at: ' + mongoURL);
//		
//		if(msg.type == "customer"){
//			var coll = mongo.collection('customer_details');
//			
//			coll.findOne({cEmail: msg.email, cPassword:msg.password, "cActive":1}, function(err, user){
//				if(user){
//					var result={"status":"200","signInAs":"customer","key":user.cKey,"name":user.cFirstName+" "+user.cLastName};
//				}else{
//					var result={"status":"400","msg":"Either email or password is incorrect"};
//				}
//				callback(result);
//			});
//			
//		}else if(msg.type == "farmer"){
//			var coll = mongo.collection('farmer_details');
//			
//			coll.findOne({fEmail: msg.email, fPassword:msg.password,"fActive":1}, function(err, user){
//				if(user){
//					var result={"status":"200","signInAs":"farmer","key":user.fKey,"name":user.fFirstName+" "+user.fLastName};
//				}else{
//					var result={"status":"400","msg":"Either email or password is incorrect OR System Admin didn't Approve SignUp request yet"};
//				}
//				callback(result);
//			});
//			
//		}else if(msg.type == "admin"){
//			var coll = mongo.collection('admin_details');
//			
//			coll.findOne({aEmail: msg.email, aPassword:msg.password}, function(err, user){
//				if(user){
//					var result={"status":"200","signInAs":"admin","key":user.aKey,"name":user.aFirstName+" "+user.aLastName};
//				}else{
//					var result={"status":"400","msg":"Either email or password is incorrect"};
//				}
//				callback(result);
//			});
//		}
//		
//		
//	});
//}

function farmerDetails(msg, callback){
	
	console.log("In farmer Details");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('farmer_details');
		
		coll.findOne({fKey: msg.key}, function(err, farmerDetails){
			if(farmerDetails){
				var result={"status":"200","farmerDetails":farmerDetails};
			}else{
				var result={"status":"400","msg":"Something went wrong, Please try again"};
			}
			callback(result);
		});
	});
}


function farmerUpdateDetails(msg,callback){
	console.log("In farmerUpdateDetails on rebbit");

					mongo.connect(mongoURL, function(){
					console.log('Connected to mongo at: ' + mongoURL);
					var coll1 = mongo.collection('farmer_details');
		
					coll1.update({fKey: msg.fKey},{ $set: {"fSSN": msg.fSSN, "fEmail":msg.fEmail,"fFirstName":msg.fFirstName,"fLastName": msg.fLastName, "fPhoneNumber":msg.fPhoneNumber,"fAddress":msg.fAddress,"fState":msg.fState,"fCity":msg.fCity,"fZip":msg.fZip}}, function(err, user){
						if(user){
							var result={"status":"200","msg":"Farmer Details Updated Successfully"};
						}else{
							var result={"status":"400","msg":"Something Went wrong"};
						}
						callback(result);
					});
					});
		

}


function farmerUpdatePassword(msg,callback){
	console.log("In farmerUpdatePassword on rebbit");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('farmer_details');
		
		coll.findOne({fKey: msg.fKey,fPassword:msg.encryptOldPassword}, function(err, farmerDetails){
			if(farmerDetails){
				
				coll.update({fKey: msg.fKey},{ $set: {"fPassword": msg.encryptNewPassword}}, function(err, user){
					if(user){
						var result={"status":"200","msg":"Password Updated Successfully"};
					}else{
						var result={"status":"400","msg":"Something Went wrong"};
					}
					callback(result);
				});
				
			}else{
				var result={"status":"400","msg":"Please enter correct old password"};
				callback(result);
			}
		});
		
		
		
		
	});

}

function addProduct(msg, callback){

	console.log("In Add Product Function");
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('product_details');
		var col2 = mongo.collection('admin_notification');
		
		coll.insert({"fKey":msg.fKey,"fName":msg.fName,"pID":msg.pID,"pActive":0,"pName": msg.pName, "pPrice":msg.pPrice, "pDiscount": msg.pDiscount, "discountedPrice": msg.discountedPrice, "pDesc": msg.pDesc, "pImage":msg.pImage,"pReviewRatings": []}, function(err, product){
			if(product){
				col2.insert({"id":msg.pID,"email":"","name":msg.pName,dateTime: Date(),operationType:"pAdd"}, function(err, success2){
					if(success2){
						var result={"status":"200",msg:"Product added Successfully"};
					}else{
						var result={"status":"400",msg:"Failed"};
					}
					callback(result);
				});
			}else{
				var result={"status":"400",msg:"failed"};
				callback(result);
			}
		});
		
	});
		
}

function farmerProductList(msg, callback){
	
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('product_details');
		
		coll.find({"fKey":msg.fKey,"pActive":1}).toArray(function(err, productArray) {
			 if(err){
				var result={"status":"400"};
			 }else{
				 var result={"status":"200","productArray":productArray,"length":productArray.length};
			}
			callback(result);
		});
		
	});	
}


function farmerDeletProduct(msg, callback){
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('product_details');
		
		coll.remove({"fKey":msg.fKey,"pID":msg.pID}, function(err, product){
			if(err){
				var result={"status":"400","msg":"Something went wrong, Please try again"};
			}else{
				var result={"status":"200","msg":"Product removed sucessfully"};
			}
			callback(result);
		});
		
	});

}

function farmerDeleteAccount(msg, callback){
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('farmer_details');
		
		coll.remove({"fKey":msg.fKey}, function(err, product){
			if(err){
				var result={"status":"400","msg":"Something went wrong, Please try again"};
			}else{
				var result={"status":"200","msg":"Farmer Deleted Successfully"};
			}
			callback(result);
		});
		
	});

}

function farmerGetProductDetails(msg, callback){
	
	console.log("In farmer Details");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('product_details');
		
		coll.findOne({"fKey":msg.fKey,"pID":msg.pID}, function(err, product){
			if(product){
				var result={"status":"200","productDetails":product};
			}else{
				var result={"status":"400","msg":"Something went wrong, Please try again"};
			}
			callback(result);
		});
	});
}
//
//function updateProduct(msg,callback){
//	console.log("In updateProduct on rebbit");
//	mongo.connect(mongoURL, function(){
//		console.log('Connected to mongo at: ' + mongoURL);
//		var coll1 = mongo.collection('product_details');
//		
//		coll1.update({"fKey":msg.fKey,"pID":parseInt(msg.pID)},{ $set: {"pName": msg.pName, "pPrice":msg.pPrice, "pDesc": msg.pDesc, "pImage":msg.pImage}}, function(err, user){
//			if(user){
//				console.log("Nitesh");
//				var result={"status":"200","msg":"Product Details updated Sucessfully"};
//				callback(result);
//			}else{
//				console.log("wadhwa");
//				var result={"status":"400","msg":"Something Went wrong"};
//				callback(result);
//			}	
//		});
//	});
//
//}



function updateProduct(msg,callback){
	console.log("In updateProduct on rebbit");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll1 = mongo.collection('product_details');
		
		coll1.update({"fKey":msg.fKey,"pID":parseInt(msg.pID)},{ $set: {"pName": msg.pName, "pPrice":msg.pPrice, "pDesc": msg.pDesc, "pImage":msg.pImage}}, function(err, user){
			if(user){
				console.log("Nitesh");
				var result={"status":"200","msg":"Product Details updated Sucessfully"};
				callback(result);
			}else{
				console.log("wadhwa");
				var result={"status":"400","msg":"Something Went wrong"};
				callback(result);
			}	
		});
	});

}





function handle_request(msg, callback){
	
	console.log("nitesh wadhwa in handle_request");
	if(msg.methodName == "farmerDetails"){
		console.log("nitesh wadhwa in userSignIn");
		farmerDetails(msg,function(result){
			callback(null,result);
		});
	}	
	else if(msg.methodName == "farmerUpdateDetails"){
		farmerUpdateDetails(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "farmerUpdatePassword"){
		farmerUpdatePassword(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "addProduct"){
		addProduct(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "farmerProductList"){
		farmerProductList(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "farmerDeletProduct"){
		farmerDeletProduct(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "farmerGetProductDetails"){
		farmerGetProductDetails(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "updateProduct"){
		updateProduct(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "farmerDeleteAccount"){
		farmerDeleteAccount(msg,function(result){
			callback(null,result);
		});
	}
	
	
	
}

exports.updateProduct=updateProduct;
exports.farmerGetProductDetails=farmerGetProductDetails;
exports.farmerDeletProduct=farmerDeletProduct;
exports.addProduct=addProduct;
exports.farmerUpdatePassword=farmerUpdatePassword;
exports.farmerDetails=farmerDetails;
exports.farmerUpdateDetails=farmerUpdateDetails;
exports.handle_request = handle_request;
exports.farmerDeleteAccount =farmerDeleteAccount;