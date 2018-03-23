/**
 * New node file
 */

var mq_client = require('../rpc/client');
var crypto = require('crypto');

function customerHome(req,res){
	console.log("in customerHome");
	res.render('customerHome');	
}

function customerDetails(req,res){
	
	console.log("inside customer details");	
	console.log(req.session.data.key);
	if(req.session.data){
		
		var data = {"cKey":req.session.data.key,"methodName":"customerDetails"};	
		
		console.log(data);
		
		mq_client.make_request('customer_queue',data, function(err,results){
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

function customerUpdateDetails(req, res){
	
	console.log("In customerUpdateDetails on nOdejs");
	
	var data = {"cKey":req.session.data.key,"cActive":1,"cSSN": req.body.customerDetails.cSSN, "cEmail":req.body.customerDetails.cEmail,"cFirstName":req.body.customerDetails.cFirstName,"cLastName": req.body.customerDetails.cLastName, "cPhoneNumber":req.body.customerDetails.cPhoneNumber,"cAddress":req.body.customerDetails.cAddress,"cState":req.body.customerDetails.cState,"cCity":req.body.customerDetails.cCity,"cZip":req.body.customerDetails.cZip,"methodName":"customerUpdateDetails"};
	
	mq_client.make_request('customer_queue',data, function(err,results){
		if(err){
			throw err;
		}
		else 
		{	
			
			if(results.status == "200"){
				res.redirect('/customerDetails');
			}else{
				res.send(result);
			}
			
		}  
	});
	
}

function customerUpdatePassword(req, res){
	
	console.log("In customerUpdatePassword on nOdejs of customer");
	
	var encryptOldPassword = crypto.createHash("md5").update(req.body.customerDetails.cOldPassword).digest('hex');
	var encryptNewPassword = crypto.createHash("md5").update(req.body.customerDetails.cNewPassword).digest('hex');
	
	var data = {"cKey":req.session.data.key,"encryptOldPassword":encryptOldPassword,"encryptNewPassword": encryptNewPassword,"methodName":"customerUpdatePassword"};
	
	mq_client.make_request('customer_queue',data, function(err,results){
		if(err){
			throw err;
		}
		else 
		{	
			res.send(results);
			
		}  
	});
	
}

function customerUpdateCC(req, res){
	
	console.log("In customerUpdateCC on nOdejs of customer: "+req.body.customerDetails.cOldCCNo+"::"+req.body.customerDetails.cNewCCNo);
	
	var data = {"cKey":req.session.data.key,"cNewCCNo": req.body.customerDetails.cNewCCNo,"cCVV":req.body.customerDetails.cCreditCardSC,"cCCExpMonth":req.body.customerDetails.cCreditCardMonth,"cCCExpYear":req.body.customerDetails.cCreditCardYear,"methodName":"customerUpdateCC"};
	
	mq_client.make_request('customer_queue',data, function(err,results){
		if(err){
			throw err;
		}
		else 
		{	
			res.send(results);
			
		}  
	});
}

function customerProductList(req,res){
	
	if(req.session.data){
		
		console.log("In product List Method of customer");
		
		var data = {"cKey":req.session.data.key,"methodName":"customerProductList"};
		mq_client.make_request('customer_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				console.log(results);
				res.send(results);
			}  
		});
		
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}

}


function getCustomerBills(req,res){
	
	if(req.session.data){
		
		console.log("In getCustomerBills Method of customer");
		
		var data = {"cKey":req.session.data.key,"methodName":"getCustomerBills"};
		mq_client.make_request('customer_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				console.log(results);
				res.send(results);
			}  
		});
		
	}else{
		res.send({"status":"400","msg":"Please reload the page and try again"});
	}

}

function customerGetProductDetails(req,res){
	
	if(req.session.data){
		
		console.log("In getproductDetails Method of customer");
		
		var data = {"pID":req.body.pID,"methodName":"customerGetProductDetails"};
		mq_client.make_request('customer_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				//console.log(results.pName+"::"+results.pPrice+"::"+results.pReviewRatings);
				res.send(results);
			}  
		});
		
	}else{
		res.send({"status":"400","message":"Please reload the page and try again"});
	}
}



function customerGetBillDetails(req,res){
	
	if(req.session.data){
		
		console.log("In customerGetBillDetails Method of customer");
		
		var data = {"bill_id":req.body.bill_id,"methodName":"customerGetBillDetails"};
		mq_client.make_request('customer_queue',data, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				console.log("inside else of customerGetDetails: "+results.pName+"::"+results.pPrice+"::"+results.pReviewRatings);
				//console.log(results.pName+"::"+results.pPrice+"::"+results.pReviewRatings);
				res.send(results);
			}  
		});
		
	}else{
		res.send({"status":"400","msg":"Please reload the page and try again"});
	}
}


function addToCart(req,res)
{
	if(req.session.data){
		
		console.log("In add to cart");
		console.log(req.session.data.key);
		var data = {"pID":req.body.pID,"pName":req.body.pName,"pPrice":req.body.pPrice,"cKey":req.session.data.key,"cName":req.session.data.name,"fKey":req.body.fKey,"fName":req.body.fName,"pQuantity":req.body.pQuantity,"pImage":req.body.pImage, "discountedPrice":req.body.discountedPrice,"pDiscount":req.body.pDiscount,"methodName":"addToCart"};
		
		console.log(data.discountedPrice+"  	"+data.pDiscount);
		
		mq_client.make_request('customer_queue',data, function(err,results){
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
		res.send({"status":"400","msg":"Please reload the page and try again to show cart details"});
	}
}


function placeOrder(req,res)
{
	if(req.session.data){
		
		console.log("In placeOrder");
		console.log(req.session.data.key);
		var data = {"cKey":req.session.data.key,"cName": req.session.data.name, "cAddress":req.body.cAddress,"cCity":req.body.cCity,"cState":req.body.cState,"cZip":req.body.cZip,"deliveryDate":req.body.deliveryDate, "inCartDetails": req.body.inCartDetails, "bTotal": req.body.bTotal, "methodName":"placeOrder"};
		mq_client.make_request('customer_queue',data, function(err,results){
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
		res.send({"status":"400","message":"Please reload the page and try again to show cart details"});
	}
}

function insertReviewRatings(req,res)
{
	if(req.session.data){
		
		console.log("In insert review ratings: ");
		var data = {"pID":req.body.pID,"pReviewRatings":req.body.pReviewRatings,"cKey":req.session.data.key,"cName":req.session.data.name,"pAvgRatings":req.body.pAvgRatings, "methodName":"pReviewRatings"};
		mq_client.make_request('customer_queue',data, function(err,results){
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
	}else{
		res.send({"status":"400","message":"Please reload the page and try again to show cart details"});
	}
}

function customerDeleteAccount(req,res)
{
	if(req.session.data){
		//console.log("Session contains: "+req.session.data.name+"::"+req.session.data.key);
		//console.log("In customerDeleteAccount: "+req.body.cName);
		var data = {"cKey":req.session.data.key,"methodName":"customerDeleteAccount"};
		mq_client.make_request('customer_queue',data, function(err,results){
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



function customerRemoveBill(req,res)
{
	if(req.session.data){
		console.log("Session contains: "+req.session.data.name+"::"+req.session.data.key);
		
		var data = {"bill_id": req.body.bill_id,"methodName":"customerRemoveBill"};
		mq_client.make_request('customer_queue',data, function(err,results){
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
		res.send({"status":"400","msg":"Please reload the page and try again to show cart details"});
	}
}



function editBill(req,res)
{
	if(req.session.data){
		console.log("Session contains: "+req.session.data.name+"::"+req.session.data.key);
		
		var data = {"bill_id": req.body.bill_id,"newDateSelected": req.body.newDateSelected,"expectedDelivery":req.body.expectedDelivery,"methodName":"editBill"};
		mq_client.make_request('customer_queue',data, function(err,results){
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
		res.send({"status":"400","msg":"Please reload the page and try again to show cart details"});
	}
}


function getCart(req,res){
	
	if(req.session.data){
		console.log("Session contains: "+req.session.data.name+"::"+req.session.data.key);
		
		var data = {"cKey":req.session.data.key,"methodName":"getCart"};
		mq_client.make_request('customer_queue',data, function(err,results){
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
	else
	{
		res.send({"status":"400","message":"Please reload the page and try again to show cart details"});
	}
	
}


function getCartSummary(req,res){
	
	if(req.session.data){
		console.log("Session contains: "+req.session.data.name+"::"+req.session.data.key);
		
		var data = {"cKey":req.session.data.key,"methodName":"getCartSummary"};
		mq_client.make_request('customer_queue',data, function(err,results){
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
	else
	{
		res.send({"status":"400","msg":"Please reload the page and try again to show cart details"});
	}
	
}


function customerGetFarmerDetails(req,res){
	
	if(true){
		
		console.log("In getfarmerDetails Method of customer");
		
		var data = {"fKey":req.body.fKey,"methodName":"customerGetFarmerDetails"};
		mq_client.make_request('customer_queue',data, function(err,results){
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

function removeFromCart(req,res){
	
	if(req.session.data){
		console.log("Session contains: "+req.session.data.name+"::"+req.session.data.key);
		
		var data = {"cKey":req.session.data.key,"pID":req.body.pID, "methodName":"removeFromCart"};
		mq_client.make_request('customer_queue',data, function(err,results){
			console.log(results+ "got response from server");
			if(err){
				throw err;
				console.log(results+ "got response if");
			}
			else 
			{
				
				console.log(results+ "got response else");
				res.send(results);
			}  
		});
	}
	else
	{
		res.send({"status":"400","message":"Please reload the page and try again to show cart details"});
	}
	
}



exports.customerDeleteAccount=customerDeleteAccount;
exports.insertReviewRatings=insertReviewRatings;
exports.addToCart=addToCart;
exports.customerGetProductDetails=customerGetProductDetails;
exports.customerProductList=customerProductList;
exports.customerUpdatePassword=customerUpdatePassword;
exports.customerUpdateCC=customerUpdateCC;
exports.customerUpdateDetails=customerUpdateDetails;
exports.customerDetails=customerDetails;
exports.getCustomerBills=getCustomerBills;
exports.customerHome = customerHome;
exports.placeOrder =placeOrder;
exports.getCart =getCart;
exports.getCartSummary =getCartSummary;
exports.removeFromCart =removeFromCart;
exports.editBill = editBill;
exports.customerGetBillDetails=customerGetBillDetails;
exports.customerGetFarmerDetails =customerGetFarmerDetails;
exports.customerRemoveBill = customerRemoveBill;