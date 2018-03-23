var mq_client = require('../rpc/client');


function adminHome(req,res){
	console.log("in adminHome");
	res.render('adminHome');	
}

exports.adminGetNotificationList = function(req,res){
	
	console.log("in getNotificationList at client side adminHome.js")
	
	if(req.session.data){
	var data = {"methodName":"adminGetNotificationList"};	
	mq_client.make_request('admin_Queue',data, function(err,results){
		if(err){
			console.log("Error in adminHome: "+err);
			throw err;
		}
		else 
		{	
			if(results.status == "200"){
				console.log("nana::"+results.requests);
				var customerRequests=[];
				var farmerRequests = [];
				var productRequests = [];
				var  j=0,k=0,p=0;
				console.log(results.requests.length+" org length")
				for(var i=0;i<results.requests.length;i++){
					if(results.requests[i].operationType=='cSignUp'){
						customerRequests[j]=results.requests[i];
						j++;
					}
					if(results.requests[i].operationType=='fSignUp'){
						farmerRequests[k]=results.requests[i];
						k++;
					}
					if(results.requests[i].operationType=='pAdd'){
						
						productRequests[p]=results.requests[i];
						p++;
					}
					
				}
				
				//var result = {"requests":results.requests,"status":"200"};
				var result = {"cRequests":customerRequests,"fRequests":farmerRequests,"pRequests":productRequests,"status":"200"};
			}	
			res.send(result);
		}  
	});
	}
	else{
			res.send({"status":"400","message":"Please reload the page and try again"});
	}
}

exports.adminGetCustomerList = function(req,res){
	console.log("request for getCustomerList at adminHome.js");
	
	if(req.session.data){
	var data = {"methodName":"adminGetCustomerList"};	
	mq_client.make_request('admin_Queue',data, function(err,results){
		if(err){
			console.log("Error in gettling customer list: "+err);
			throw err;
		}
		else 
		{	
			if(results.status == "200"){
			var result = {"customers":results.customerList,"status":"200"};
			}	
			res.send(result);
		}  
	});
	}
	else{
			res.send({"status":"400","message":"Please reload the page and try again"});
	}
}

exports.adminGetFarmerList = function(req,res){
	console.log("request for getFarmerList at adminHome.js");
	
	if(req.session.data){
	var data = {"methodName":"adminGetFarmerList"};
	
	mq_client.make_request('admin_Queue',data, function(err,results){
		if(err){
			console.log("Error in gettling customer list: "+err);
			throw err;
		}
		else 
		{	
			if(results.status == "200"){
				var result = {"farmers":results.farmerList,"status":"200"};
			}	
			res.send(result);
		}  
	});
	}
	else{
			res.send({"status":"400","message":"Please reload the page and try again"});
	}
}

exports.adminGetProductList = function(req,res){
	console.log("request for getProductList at adminHome.js");
	
	if(req.session.data){
	var data = {"methodName":"adminGetProductList"};
	
	mq_client.make_request('admin_Queue',data, function(err,results){
		if(err){
			console.log("Error in gettling customer list: "+err);
			throw err;
		}
		else 
		{	
			if(results.status == "200"){
				var result = {"products":results.productList,"status":"200"};
			}	
			res.send(result);
		}  
	});
	}
	else{
			res.send({"status":"400","message":"Please reload the page and try again"});
	}
}

exports.adminGetBillList = function(req,res){
	console.log("request for getBillList at adminHome.js");
	
	if(req.session.data){
	var data = {"methodName":"adminGetBillList"};
	
	mq_client.make_request('admin_Queue',data, function(err,results){
		if(err){
			console.log("Error in gettling customer list: "+err);
			throw err;
		}
		else 
		{	
			if(results.status == "200"){
				
				var result = {"bills":results.billList,"status":"200"};
			}	
			res.send(result);
		}  
	});
	}
	else{
			res.send({"status":"400","message":"Please reload the page and try again"});
	}
}

function userAccepted(req, res){
	console.log("user accepted");
	console.log(req.body.userID+"*******************");
	
	if(req.session.data){
	var data = {"userID":req.body.userID, "userType":req.body.userType,"methodName":"userAccepted"};
	mq_client.make_request('admin_Queue',data, function(err,results){
		if(err){
			throw err;
		}
		else 
		{	
			if(results.status == "200"){
				var result = {"status":"200","requests":results.requests};
			}	
			res.send(result);
		}  
	});
	}
	else{
			res.send({"status":"400","message":"Please reload the page and try again"});
	}
}

function userRejected(req, res){
	console.log("user rejected");
	
	if(req.session.data){
	var data = {"userID":req.body.userID, "userType":req.body.userType,"methodName":"userRejected"};
	mq_client.make_request('admin_Queue',data, function(err,results){
		if(err){
			throw err;
		}
		else 
		{	
			if(results.status == "200"){
				var result = {"status":"200"};
			}	
			res.send(result);
		}  
	});
	}
	else{
			res.send({"status":"400","message":"Please reload the page and try again"});
	}
}


function deleteFarmer(req, res){
	
	if(req.session.data){
	var data = {"userID":req.body.userID,"methodName":"deleteFarmer"};
	mq_client.make_request('admin_Queue',data, function(err,results){
		if(err){
			throw err;
		}
		else 
		{	
			if(results.status == "200"){
				var result = {"status":"200","requests":results.requests};
			}	
			res.send(result);
		}  
	});
	}
	else{
			res.send({"status":"400","message":"Please reload the page and try again"});
	}
}

function deleteCustomer(req, res){
	
	if(req.session.data){
	var data = {"userID":req.body.userID,"methodName":"deleteCustomer"};
	mq_client.make_request('admin_Queue',data, function(err,results){
		if(err){
			throw err;
		}
		else 
		{	
			if(results.status == "200"){
				var result = {"status":"200","requests":results.requests};
			}	
			res.send(result);
		}  
	});
	}
	else{
			res.send({"status":"400","message":"Please reload the page and try again"});
	}
}


function deleteProduct(req, res){

	var data = {"userID":req.body.userID,"methodName":"deleteProduct"};
	
	if(req.session.data){
	mq_client.make_request('admin_Queue',data, function(err,results){
		if(err){
			throw err;
		}
		else 
		{				
			if(results.status == "200"){
				var result = {"status":"200"};
			}	
			res.send(result);
		}  
	});
	}
	else{
			res.send({"status":"400","message":"Please reload the page and try again"});
	}
}


function deleteBill(req, res){
	console.log("bill is gonna be deleted");
	
	if(req.session.data){
	var data = {"billID":req.body.billID,"methodName":"deleteBill"};
	mq_client.make_request('admin_Queue',data, function(err,results){
		if(err){
			throw err;
		}
		else 
		{				
			if(results.status == "200"){
				var result = {"status":"200"};
			}	
			res.send(result);
		}  
	});
	}
	else{
			res.send({"status":"400","message":"Please reload the page and try again"});
	}
}

function adminGetTrucks(req, res){
	console.log("Inside adminGetTrucks");
	if(req.session.data){
	var data = {"methodName":"adminGetTrucks"};
	mq_client.make_request('admin_Queue',data, function(err,results){
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


function ridesPerDriver(req,res){
	
	if(req.session.data){
	var data = {"methodName":"ridesPerDriver"};
	mq_client.make_request('admin_Queue',data, function(err,results){
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

function tripsPerLocation(req,res){
	
	if(req.session.data){
	var data = {"methodName":"tripsPerLocation"};
	mq_client.make_request('admin_Queue',data, function(err,results){
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

function ridesPerCustomer(req,res){
	
	if(req.session.data){
	var data = {"methodName":"ridesPerCustomer"};
	mq_client.make_request('admin_Queue',data, function(err,results){
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

function ridesPerArea(req,res){
	
	if(req.session.data){
	var data = {"methodName":"ridesPerArea"};
	mq_client.make_request('admin_Queue',data, function(err,results){
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

function revenuePerLocation(req,res){
	
	if(req.session.data){
	
	var data = {"methodName":"revenuePerLocation"};
	mq_client.make_request('admin_Queue',data, function(err,results){
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


exports.userAccepted=userAccepted;
exports.userRejected = userRejected;
exports.deleteFarmer = deleteFarmer;
exports.deleteCustomer = deleteCustomer;
exports.deleteProduct = deleteProduct;
exports.deleteBill = deleteBill;
exports.adminGetTrucks=adminGetTrucks;
exports.ridesPerDriver = ridesPerDriver;
exports.tripsPerLocation = tripsPerLocation;
exports.ridesPerCustomer=ridesPerCustomer;
exports.ridesPerArea=ridesPerArea;
exports.revenuePerLocation=revenuePerLocation;
exports.adminHome=adminHome;