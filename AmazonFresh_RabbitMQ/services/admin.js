var crypto = require('crypto');
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/AmazonFresh";
var redis = require('redis');
var client =redis.createClient(6379, 'localhost', {no_ready_check: true});

function handle_request(msg, callback){
	console.log("sangit :::::"+msg.methodName);
	if(msg.methodName == "userAccepted"){
		console.log("userAccpeted and method type will be "+ msg.userType);
		if(msg.userType == "fSignUp"){
		farmerAccepted(msg,function(result){
			callback(null,result);
		});
		}
		else if(msg.userType =="cSignUp"){
			customerAccepted(msg,function(result){
				callback(null,result);
			});
		}
		else if(msg.userType =="pAdd"){
			console.log("My product accepted bitches");
			productAccepted(msg,function(result){
				callback(null,result);
			});
		}
	}
	
	if(msg.methodName == "userRejected"){
		if(msg.userType == "fSignUp"){
			farmerRejected(msg,function(result){
				callback(null,result);
			});
		}
		else if(msg.userType =="cSignUp"){
			customerRejected(msg,function(result){
				callback(null,result);
			});
		}
		else if(msg.userType =="pAdd"){
			console.log("My product rejected bitches");
			productRejected(msg,function(result){
				callback(null,result);
			});
		}
	}
	if(msg.methodName == "deleteFarmer"){
		farmerDeleted(msg, function(result){
			callback(null, result);
		});
	}
	if(msg.methodName == "deleteCustomer"){
		customerDeleted(msg, function(result){
			callback(null, result);
		});
	}
	if(msg.methodName == "deleteProduct"){
		productDeleted(msg, function(result){
			callback(null, result);
		});
	}
	if(msg.methodName == "deleteBill"){
		billDeleted(msg, function(result){
			callback(null, result);
		});
	}
	if(msg.methodName == "adminGetNotificationList"){
		adminGetNotificationList(msg, function(result){
			callback(null, result);
		});
	}
	if(msg.methodName == "adminGetCustomerList"){
		adminGetCustomerList(msg, function(result){
			callback(null, result);
		});
	}
	if(msg.methodName == "adminGetFarmerList"){
		adminGetFarmerList(msg, function(result){
			callback(null, result);
		});
	}
	if(msg.methodName == "adminGetProductList"){
		adminGetProductList(msg, function(result){
			callback(null, result);
		});
	}
	if(msg.methodName == "adminGetBillList"){
		adminGetBillList(msg, function(result){
			callback(null, result);
		});
	}
	if(msg.methodName == "adminGetTrucks"){
		adminGetTrucks(msg, function(result){
			callback(null, result);
		});
	}
		else if(msg.methodName == "ridesPerDriver"){
		ridesPerDriver(msg, function(result){
			callback(null, result);
		});
	}
	else if(msg.methodName == "tripsPerLocation"){
		tripsPerLocation(msg, function(result){
			callback(null, result);
		});
	}
	else if(msg.methodName == "ridesPerCustomer"){
		ridesPerCustomer(msg, function(result){
			callback(null, result);
		});
	}
	else if(msg.methodName == "ridesPerArea"){
		ridesPerArea(msg, function(result){
			callback(null, result);
		});
	}
	else if(msg.methodName == "revenuePerLocation"){
		revenuePerLocation(msg, function(result){
			callback(null, result);
		});
	}
}


function ridesPerDriver(msg,callback){
	var data = [];
	console.log("in rabbit mq ridesPerDriver");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('trip_details');
		coll.aggregate([{ $group: { _id: {driver_id:"$driver_id",driver_name:"$driver_name"}, count: { $sum: 1 } } }]).toArray(function(err, ridesPerDriverArray){
			if(ridesPerDriverArray){
				for(var i=0;i<ridesPerDriverArray.length;i++){
					//console.log(ridesPerDriverArray[i]._id.driver_name);
					data[i] = {"label": ridesPerDriverArray[i]._id.driver_id, "value": ridesPerDriverArray[i].count};
				}
				var result = {"status":"200","data1234":data};
			}
			else{
				var result = {"status":"400"};
			}
			callback(result);
		});	
	});
}

function tripsPerLocation(msg,callback){
	var data = [];
	console.log("in rabbit mq tripsPerLocation");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('trip_details');
		coll.aggregate([{ $group: { _id: {tDropState:"$tDropState"}, count: { $sum: 1 } } }]).toArray(function(err, tripsPerLocationArray){
			if(tripsPerLocationArray){
				for(var i=0;i<tripsPerLocationArray.length;i++){
					//console.log(ridesPerDriverArray[i]._id.driver_name);
					data[i] = {"label": tripsPerLocationArray[i]._id.tDropState, "value": tripsPerLocationArray[i].count};
				}
				var result = {"status":"200","data1234":data};
			}
			else{
				var result = {"status":"400"};
			}
			callback(result);
		});	
	});
}

function ridesPerCustomer(msg,callback){
	var data = [];
	console.log("in rabbit mq ridesPerCustomer");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('trip_details');
		coll.aggregate([{ $group: { _id: {cKey:"$cKey",cName:"$cName"}, count: { $sum: 1 } } }]).toArray(function(err, ridesPerCustomerArray){
			if(ridesPerCustomerArray){
				for(var i=0;i<ridesPerCustomerArray.length;i++){
					//console.log(ridesPerDriverArray[i]._id.driver_name);
					data[i] = {"label": ridesPerCustomerArray[i]._id.cKey, "value": ridesPerCustomerArray[i].count};
				}
				var result = {"status":"200","data1234":data};
			}
			else{
				var result = {"status":"400"};
			}
			callback(result);
		});	
	});
}

function ridesPerArea(msg,callback){
	var data = [];
	console.log("in rabbit mq ridesPerArea");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('trip_details');
		coll.aggregate([{ $group: { _id: {tPickupLocation:"$tPickupLocation"}, count: { $sum: 1 } } }]).toArray(function(err, ridesPerAreaArray){
			if(ridesPerAreaArray){
				for(var i=0;i<ridesPerAreaArray.length;i++){
					//console.log(ridesPerDriverArray[i]._id.driver_name);
					data[i] = {"label": ridesPerAreaArray[i]._id.tPickupLocation, "value": ridesPerAreaArray[i].count};
				}
				var result = {"status":"200","data1234":data};
			}
			else{
				var result = {"status":"400"};
			}
			callback(result);
		});	
	});
}


function revenuePerLocation(msg,callback){
	var data = [];
	console.log("in rabbit mq revenuePerLocation");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('trip_details');
		coll.aggregate([{ $group: { _id: {tDropState:"$tDropState"}, count: { $sum: "$tPrice" } } }]).toArray(function(err, revenuePerLocation){
			if(revenuePerLocation){
				for(var i=0;i<revenuePerLocation.length;i++){
					console.log(revenuePerLocation[i].count);
					data[i] = {"label": revenuePerLocation[i]._id.tDropState, "value": revenuePerLocation[i].count};
				}
				var result = {"status":"200","data1234":data};
			}
			else{
				var result = {"status":"400"};
			}
			callback(result);
		});	
	});
}




function adminGetTrucks(msg,callback){
	console.log("in rabbit mq adminGetTrucks");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('trip_details');
		coll.find({}).toArray(function(err, trucks){
			if(trucks){
				var result = {"status":"200","trucksArray":trucks};
			}
			else{
				var result = {"status":"400"};
			}
			callback(result);
		});
		
	});
	
}


function adminGetNotificationList(msg, callback){
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('admin_notification');
		coll.find({}).toArray(function(err, request){
			if(request){
				var result = {"status":"200","requests":request};
				callback(result);
			}
			else{
				var result = {"status":"400"};
				callback(result);
			}
			
		});
		
	});
}


function adminGetCustomerList(msg, callback){
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('customer_details');
		coll.find({"cActive":1}).toArray(function(err, customers){
			if(customers){
				var result = {"status":"200","customerList":customers};
				callback(result);
			}
			else{
				var result = {"status":"400"};
				callback(result);
			}
			
		});
		
	});
}


function adminGetFarmerList(msg, callback){
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('farmer_details');
		coll.find({"fActive":1}).toArray(function(err,farmers){
			if(farmers){
				var result = {"status":"200","farmerList":farmers};
				callback(result);
			}
			else{
				var result = {"status":"400"};
				callback(result);
			}
			
		});
		
	});
}


function adminGetProductList(msg, callback){
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('product_details');
		coll.find({"pActive":1}).sort({"pAvgRatings": -1}).toArray(function(err, products){
			if(products){
				var result = {"status":"200","productList":products};
				callback(result);
			}
			else{
				var result = {"status":"400"};
				callback(result);
			}
			
		});
		
	});
}


function adminGetBillList(msg, callback){
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('bill_details');
		coll.find({}).sort({"bDate": -1}).toArray(function(err, bills){
			if(bills){
				console.log("found bill");
				var result = {"status":"200","billList":bills};
				callback(result);
			}
			else{
				var result = {"status":"400"};
				callback(result);
			}
			
		});
		
	});
}

function farmerAccepted(msg, callback){
	console.log("famer is here bitches" + msg.userID);
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('farmer_details');
		var coll1 = mongo.collection('admin_notification');
		coll.update({fKey:msg.userID},{$set:{fActive:1}}, function(err, result){
			if(err){
				var result = {"status":"400","msg":"Either email or password is incorrect"};
				callback(result);
			}
			else{
				console.log("fActive updated in farmer details");
				coll1.remove({id:msg.userID}, function(err, result1){
					if(err){
						var result = {"status":"400","msg":"Either email or password is incorrect"};
						callback(result);
					}
					else{
						console.log("notification bar also removed");
						var result = {"status":"200"};
						callback(result);
					}
					
				});
			}
		});
		
	});
}

function customerAccepted(msg, callback){
	console.log("customer is here bitches");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('customer_details');
		var coll1 = mongo.collection('admin_notification');
		coll.update({cKey:msg.userID},{$set:{cActive:1}}, function(err, result){
			if(err){
				var result = {"status":"400","msg":"Either email or password is incorrect"};
				callback(result);
			}
			else{
				console.log("fActive updated in customer details");
				coll1.remove({id:msg.userID}, function(err, result1){
					if(err){
						var result = {"status":"400","msg":"Either email or password is incorrect"};
						callback(result);
					}
					else{
						console.log("notification bar also removed");
						var result = {"status":"200"};
						callback(result);
					}
					
				});
			}
		});
		
	});
}


function farmerRejected(msg, callback){
	console.log("famer is gone bitches");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('farmer_details');
		var coll1 = mongo.collection('admin_notification');
		coll.remove({fKey:msg.userID}, function(err, success){
			if(err){
				var result = {"status":"400"};
				callback(result);
			}
			else{
				coll1.remove({id:msg.userID}, function(err, success){
					if(err){
						var result = {"status":"400"};
						callback(result);
					}
					else{
						var result = {"status":"200"};
						callback(result);
					}
					
				});
				
			}
			
		});
		
	});
}


function customerRejected(msg, callback){
	console.log("customer is gone bitches");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('customer_details');
		var coll1 = mongo.collection('admin_notification');
		coll.remove({cKey:msg.userID}, function(err, success){
			if(err){
				var result = {"status":"400"};
				callback(result);
			}
			else{
				coll1.remove({id:msg.userID}, function(err, success){
					if(err){
						var result = {"status":"400"}; 
						callback(result);
					}
					else{
						var result = {"status":"200"};
						callback(result);
					}
					
				});
				
			}
		});
		
	});
}

function customerDeleted(msg, callback){
	console.log("customer is deleted bitches");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('customer_details');
		//var coll1 = mongo.collection('admin_notification');
		coll.remove({cKey:msg.userID}, function(err, success){
			if(err){
				var result = {"status":"400"};
			}
			else{
				var result = {"status":"200"};	
			}
			callback(result);
		});
		
	});
}


function farmerDeleted(msg, callback){
	console.log("farmer is deleted bitches");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('farmer_details');
		var coll1 = mongo.collection('product_details');
		coll.remove({fKey:msg.userID}, function(err, success){
			if(err){
				var result = {"status":"400"};
				callback(result);
			}
			else{

				console.log(msg.userID + " testin here*******************************");
				coll1.remove({fKey:msg.userID},function(err, sucess){
					if(err){
						var result = {"status":"400"};
					}
					else{
						var result = {"status":"200"};
					}
					callback(result);
				});
			}
			
		});
		
	});
}


function productAcceptedRedis(msg, callback){
	console.log("product is accepted bitches" + msg.userID);
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('product_details');
		var coll1 = mongo.collection('admin_notification');
		coll.update({pID:msg.userID},{$set:{pActive:1}}, function(err, result){
			if(err){
				var result = {"status":"400"};
				callback(result);
			}
			else{
				console.log("pActive updated in product details");
				coll1.remove({id:msg.userID}, function(err, result1){
					if(err){
						var result = {"status":"400"};
						callback(result);
					}
					else{
						
						var result = {"status":"200"};
                        callback(result);
						
			        		coll.find({"pActive":1}).sort({"pAvgRatings":-1}).toArray(function(err, productArray) {
			        			 if(err){
			        				var result = {"status":"400"};
			        				callback(result);
			        			 }else{
			        				 client.set("productList",JSON.stringify(productArray),function(err,ans){
			                             client.expire("productArray", 180, function(err,didSetExpire){
			                                 console.log("Expired");
			                                 var result = {"status":"200"};
			                                 callback(result);
			                             });
			                             
			                         });
			        			}
			        		});	
					}
					
				});
			}
		});
		
	});
}



function productAccepted(msg, callback){
	console.log("product is accepted bitches" + msg.userID);
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('product_details');
		var coll1 = mongo.collection('admin_notification');
		coll.update({pID:msg.userID},{$set:{pActive:1}}, function(err, result){
			if(err){
				var result = {"status":"400"};
				callback(result);
			}
			else{
				console.log("pActive updated in product details");
				coll1.remove({id:msg.userID}, function(err, result1){
					if(err){
						var result = {"status":"400"};
						callback(result);
					}
					else{
						console.log("notification menu also removed");
						var result = {"status":"200"};
						
						mongo.connect(mongoURL, function(){
			        		console.log('Connected to mongo at: ' + mongoURL);
			        		var coll = mongo.collection('product_details');
			        		
			        		coll.find({"pActive":1}).toArray(function(err, productArray) {
			        			 if(err){
			        				callback(result);
			        			 }else{
			        				 client.set("productList",JSON.stringify(productArray),function(err,ans){
			                             client.expire("productArray", 180, function(err,didSetExpire){
			                                 console.log("Expired");
			                             });
			                             callback(result);
			                         });
			        			}
			        		});
			        	});	
						
					}
					
				});
			}
		});
		
	});
}



function productRejected(msg, callback){
	console.log("product is gone bitches" + msg.userID);
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('product_details');
		var coll1 = mongo.collection('admin_notification');
		coll.remove({pID:msg.userID}, function(err, result){
			if(err){
				var result = {"status":"400"};
				callback(result);
			}
			else{
				console.log("pActive updated in product details");
				coll1.remove({id:msg.userID}, function(err, result1){
					if(err){
						var result = {"status":"400"};
					}
					else{
						console.log("notification meny is also removed");
						var result = {"status":"200"};
					}
					callback(result);
				});
			}
		});
		
	});
}

function productDeleted(msg, callback){
	console.log("product is deleted bitches");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('product_details');
		coll.remove({pID:msg.userID}, function(err, success){
			if(err){
				var result = {"status":"400"};
			}
			else{
				var result = {"status":"200"};	
			}
			callback(result);
		});
		
	});
}

function billDeleted(msg, callback){
	console.log("bill is deleted bitches");
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('bill_details');
		console.log(msg.billID+":: its bill_id here");
		coll.remove({bill_id:msg.billID}, function(err, success){
			if(err){
				var result = {"status":"400"};
				callback(result);
			}
			else{
				var result = {"status":"200"};
				callback(result);
			}
			
		});
		
	});
}


exports.adminGetTrucks=adminGetTrucks;
exports.handle_request = handle_request;