var crypto = require('crypto');
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/AmazonFresh";

function getEncrypt (password) {
    var hash = crypto.createHash("md5").update(password).digest('hex');
    return hash;
}

function userSignIn(msg, callback){
	
	console.log("nitesh");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		
		if(msg.type == "customer"){
			var coll = mongo.collection('customer_details');
			
			coll.findOne({cEmail: msg.email, cPassword:msg.password, "cActive":1}, function(err, user){
				if(user){
					var result={"status":"200","signInAs":"customer","key":user.cKey,"name":user.cFirstName+" "+user.cLastName};
				}else{
					var result={"status":"400","msg":"Either email or password is incorrect"};
				}
				callback(result);
			});
			
		}else if(msg.type == "farmer"){
			var coll = mongo.collection('farmer_details');
			
			coll.findOne({fEmail: msg.email, fPassword:msg.password,"fActive":1}, function(err, user){
				if(user){
					var result={"status":"200","signInAs":"farmer","key":user.fKey,"name":user.fFirstName+" "+user.fLastName};
				}else{
					var result={"status":"400","msg":"Either email or password is incorrect OR System Admin didn't Approve SignUp request yet"};
				}
				callback(result);
			});
			
		}else if(msg.type == "admin"){
			var coll = mongo.collection('admin_details');
			
			coll.findOne({aEmail: msg.email, aPassword:msg.password}, function(err, user){
				if(user){
					var result={"status":"200","signInAs":"admin","key":user.aKey,"name":user.aFirstName+" "+user.aLastName};
				}else{
					var result={"status":"400","msg":"Either email or password is incorrect"};
				}
				callback(result);
			});
		}
		
		
	});
}

function farmerSignUp(msg, callback){
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('farmer_details');
		var col2 = mongo.collection('admin_notification');
		
		coll.findOne({$or: [{fEmail: msg.fEmail},{fKey: msg.fSSN},{fSSN: msg.fSSN}]}, function(err, success1){
			if(success1){
				var result={"status":"400",msg:"Farmer with the same name already exist"};
				callback(result);
			}else{
				coll.insert({"fKey":msg.fKey,"fActive":0,"fSSN": msg.fSSN, "fEmail":msg.fEmail, "fPassword": msg.fPassword, "fFirstName":msg.fFirstName,"fLastName": msg.fLastName, "fPhoneNumber":msg.fPhoneNumber,"fAddress":msg.fAddress,"fState":msg.fState,"fCity":msg.fCity,"fZip":msg.fZip,"fVideo":msg.fVideo,"fRatingReview":[],"fDeliveryHistory":[]}, function(err, farmer){
					if(farmer){
						col2.insert({"id":msg.fKey,"email":msg.fEmail,"name":msg.fFirstName+" "+msg.fLastName,dateTime: Date(),operationType:"fSignUp"}, function(err, success2){
							if(success2){
								var result={"status":"200","key":msg.fKey,"name":msg.fFirstName+" "+msg.fLastName};
							}else{
								var result={"status":"400",msg:"fuck u bitches"};
							}
							callback(result);
						});
					}else{
						var result={"status":"400",msg:""};
						callback(result);
					}
				});
			}
		});
	});
}

function customerSignUp(msg, callback){
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('customer_details');
		var col2 = mongo.collection('admin_notification');
		
		coll.findOne({$or: [{cEmail: msg.cEmail},{cKey: msg.cSSN}]}, function(err, success1){
			if(success1){
				var result={"status":"400",msg:"Customer with the same name already exist"};
				callback(result);
			}else{
				coll.insert({"cKey":msg.cKey,"cActive":0,"cSSN": msg.cSSN, "cEmail":msg.cEmail, "cPassword": msg.cPassword, "cFirstName":msg.cFirstName,"cLastName": msg.cLastName, "cPhoneNumber":msg.cPhoneNumber,"cAddress":msg.cAddress,"cState":msg.cState,"cCity":msg.cCity,"cZip":msg.cZip,"cCCNo":msg.cCCNo,"cCVV":msg.cCVV,"cCCExpMonth":msg.cCCExpMonth,"cCCExpYear":msg.cCCExpYear,"cRatingReview":[]}, function(err, customer){
					if(customer){
						col2.insert({"id":msg.cKey,"email":msg.cEmail,"name":msg.cFirstName+" "+msg.cLastName,dateTime: Date(),operationType:"cSignUp"}, function(err, success2){
							if(success2){
								var result={"status":"200","cKey":msg.cKey,"name":msg.cFirstName+" "+msg.cLastName};
							}else{
								var result={"status":"400",msg:""};
							}
							callback(result);
						});
					}else{
						var result={"status":"400",msg:""};
						callback(result);
					}
				});
			}
		});
	});
}


function handle_request(msg, callback){
	
	console.log("nitesh wadhwa in handle_request");
	if(msg.methodName == "userSignIn"){
		console.log("nitesh wadhwa in userSignIn");
		userSignIn(msg,function(result){
			callback(null,result);
		});
	}else if(msg.methodName == "farmerSignUp"){
		farmerSignUp(msg,function(result){
			callback(null,result);
		});
	} else if(msg.methodName == "customerSignUp"){
		console.log("Req in customer backend");
		customerSignUp(msg,function(result){
			callback(null,result);
		});
	}
}


exports.userSignIn=userSignIn;
exports.farmerSignUp=farmerSignUp;
exports.handle_request = handle_request;
exports.customerSignUp=customerSignUp;