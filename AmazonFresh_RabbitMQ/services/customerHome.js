var mongo = require('./mongo');
var mongo1 = require('mongodb');
var mysql = require('./mysql');
var mongoURL = "mongodb://localhost:27017/AmazonFresh";
var redis = require('redis');
var client =redis.createClient(6379, 'localhost', {no_ready_check: true});

function customerDetails(msg, callback){
	console.log("In customer Details");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('customer_details');
		
		coll.findOne({cKey: msg.cKey}, function(err, customerDetails){
			if(customerDetails){
				var result={"status":"200","customerDetails":customerDetails};
			}else{
				var result={"status":"400","msg":"Something went wrong, Please try again"};
			}
			callback(result);
		});
	});
}

function customerUpdateDetails(msg,callback){
	
	
	
	console.log("In customerUpdateDetails on rebbit");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		
		var coll1 = mongo.collection('customer_details');
		
		coll1.update({cKey: msg.cKey},{ $set: {"cSSN": msg.cSSN, "cEmail":msg.cEmail,"cFirstName":msg.cFirstName,"cLastName": msg.cLastName, "cPhoneNumber":msg.cPhoneNumber,"cAddress":msg.cAddress,"cState":msg.cState,"cCity":msg.cCity,"cZip":msg.cZip}}, function(err, user){
			if(user){
				var result={"status":"200"};
			}else{
				var result={"status":"400","message":"Something Went wrong"};
			}
			callback(result);
		});
	});
	
	
	
}

function customerUpdatePassword(msg,callback){
	console.log("In customerUpdatePassword on rebbit");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('customer_details');
		
		coll.findOne({cKey: msg.cKey,cPassword:msg.encryptOldPassword}, function(err, customerDetails){
			if(customerDetails){
				
				coll.update({cKey: msg.cKey},{ $set: {"cPassword": msg.encryptNewPassword}}, function(err, user){
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

function customerUpdateCC(msg,callback){
	console.log("In customerUpdateCC on rebbit");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('customer_details');
		console.log("inside customer updatecc rabbitmq: "+msg.cNewCCNo)
		coll.findOne({cKey: msg.cKey}, function(err, customerDetails){
			if(customerDetails){
				coll.update({cKey: msg.cKey},{ $set: {"cCCNo": msg.cNewCCNo,"cCVV":msg.cCVV,"cCCExpMonth":msg.cCCExpMonth,"cCCExpYear":msg.cCCExpYear}}, function(err, user){
					if(user){
						var result={"status":"200","msg":"Credit details Updated Successfully"};
					}else{
						var result={"status":"400","msg":"Something Went wrong"};
					}
					callback(result);
				});
				
			}else{
				var result={"status":"400","msg":"Please enter correct credit card information"};
				callback(result);
			}
		});
	});
}

function customerProductList(msg, callback){
	console.log("In customerProductList on rebbit");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('product_details');
		
		coll.find({"pActive":1}).sort({"pAvgRatings":-1}).toArray(function(err, productArray) {
			 if(err){
				var result={"status":"400"};
			 }else{
				 var result={"status":"200","productArray":productArray,"length":productArray.length};
			}
			callback(result);
		});
		
	});	
}


function customerProductListRedis(msg, callback){
	
	
	client.get("productList",function(err,productArray){
	        
			if(productArray !== null){
				console.log(productArray);
				console.log("Sending result from redis")
	            var result={"status":"200","productArray":JSON.parse(productArray),"length":JSON.parse(productArray.length)};
	            callback(result);
	        }
	        else{
	        	
	        	
	        	mongo.connect(mongoURL, function(){
	        		console.log('Connected to mongo at: ' + mongoURL);
	        		var coll = mongo.collection('product_details');
	        		coll.find({"pActive":1}).sort({"pAvgRatings":-1}).toArray(function(err, productArray) {
	        			 if(err){
	        				var result={"status":"400"};
	        				callback(result);
	        			 }else{
	        				 var result={"status":"200","productArray":productArray,"length":productArray.length};
	        				 
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


function getCustomerBills(msg, callback){
	console.log("In getCustomerBills on rebbit");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('bill_details');
		
		var today = 
		
		coll.find({"cKey":msg.cKey, "bill_show":1}).sort({"bDate":-1}).toArray(function(err, billArray) {
			 if(err){
				var result={"status":"400"};
			 }else{
				 var result={"status":"200","billArray":billArray,"length":billArray.length};
			}
			callback(result);
		});
		
	});	
}

function customerGetProductDetails(msg, callback){
	
	console.log("In customer-product Details");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('product_details');
		
		coll.findOne({"pID":msg.pID}, function(err, product){
			if(product){
				console.log(product);
				var result={"status":"200","productDetails":product};
			}else{
				var result={"status":"400","msg":"Something went wrong, Please try again"};
			}
			callback(result);
		});
	});
}

function customerGetBillDetails(msg, callback){
	
	console.log("In customerGetBillDetails");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('bill_details');
		
		coll.findOne({"bill_id":msg.bill_id}, function(err, bill){
			if(bill){
				console.log(bill);
				var result={"status":"200","billDetails":bill};
			}else{
				var result={"status":"400","msg":"Something went wrong, Please try again"};
			}
			callback(result);
		});
	});
}




function addToCart(msg, callback){
	
	console.log(msg.fKey);
	
	console.log("inside mysql addtocart: "+msg.pID+":"+msg.pName+":"+msg.pPrice+":"+msg.fKey+":"+msg.fName+":"+msg.cKey+":"+msg.cName+":"+msg.pQuantity);
	
		console.log(msg.pDiscount+" 	"+msg.discountedPrice);
	
		var source;
		var flag = "0";
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('farmer_details');
			
			coll.find({fKey: msg.fKey}).toArray(function(err, abc){
				if(abc){
					console.log("farmer location");
					console.log(abc[0].fAddress);
					if(flag == "0"){
					   source = abc[0].fAddress + "," + abc[0].fCity + "," + abc[0].fState + "," + abc[0].fZip;
					
					   console.log(source);
						var enterToCart = "INSERT INTO cart (pID, pName, pPrice, pQuantity, cKey, cName, fKey, fName, source, fState, pImage,discountedPrice,pDiscount) VALUES ('"+msg.pID+"', '"+msg.pName+"', '"+msg.pPrice+"', '"+msg.pQuantity+"','"+msg.cKey+"','"+msg.cName+"', '"+msg.fKey +"','"+msg.fName +"','"+source +"','"+abc[0].fState +"', '"+msg.pImage+"', '"+msg.discountedPrice+"','"+msg.pDiscount+"')";

						console.log("Query is:"+  enterToCart);	

						
						mysql.mysqlQuery(function (err, enter) 
							    {
							    	console.log("inside nysql query is:");	
							        if (true) 
							        {
							        	

							        	var results = {"status": "200", "msg": "item added"};
							        	
							        }
							        else 
							        {
							          var results = {"status": "401", "msg": "item not added, please try again"};
							           
							        }
							        
							        callback(results);
							    }, enterToCart);
						
					}
					flag = "1";
					var result={"status":"400","msg":"Something went wrong, Please try again"};
					
				}else{
					var result={"status":"400","msg":"Something went wrong, Please try again"};
				}
			});
		});	
}


function getCart(msg, callback){
	
	console.log("inside mysql getCart: ");
	
	var getCartQuery = "SELECT SUM(pQuantity) AS total_quantity,pName,pPrice,pID,fKey,fName,cKey,source,fState,pImage,pDiscount,discountedPrice FROM cart where cKey=";
		getCartQuery+="'"+msg.cKey+"'"; 
		getCartQuery+=" GROUP BY pName,pPrice, pID,fKey, fName, cKey, source, fState,pImage,pDiscount,discountedPrice;"
	
		mysql.mysqlQuery(function (err, cart) {
			    
			        if (cart) 
			        {
			        	

			        	var results = {"status": "200", "inCartDetails": cart};
			        	
			        }
			        else 
			        {
			          var results = {"status": "401", "msg": "no item, please try again"};
			           
			        }
			        
			        callback(results);
			    }, getCartQuery);
	
}


function getCartSummary(msg, callback){
	
	console.log("inside mysql getCartSummary: ");
	
	var d = new Date();
	var n = d.getDay();
	
	if(n==6 || n==0){
		var summaryQ = "SELECT SUM(discountedPrice*pQuantity) AS price_summary, SUM(pQuantity) AS quantity_summary, pID FROM cart where cKey=";
		summaryQ+="'"+msg.cKey+"'";
		summaryQ+=" GROUP BY pID;";

	}else{
		var summaryQ = "SELECT SUM(pPrice*pQuantity) AS price_summary, SUM(pQuantity) AS quantity_summary, pID FROM cart where cKey=";
		summaryQ+="'"+msg.cKey+"'";
		summaryQ+=" GROUP BY pID;";


	}
	
	
//	var summaryQ = "SELECT SUM(pPrice*pQuantity) AS price_summary, SUM(pQuantity) AS quantity_summary, pID FROM cart GROUP BY pID;";
	
		mysql.mysqlQuery(function (err, summary) {
			    
			        if (summary) 
			        {
			        	

			        	var results = {"status": "200", "cartSummary": summary};
			        	
			        }
			        else 
			        {
			          var results = {"status": "401", "msg": "no item, please try again"};
			           
			        }
			        
			        callback(results);
			    }, summaryQ);
	
}


function removeFromCart(msg, callback){
	
	console.log("inside mysql removeFromCart: ");
	
	var removeItem = "DELETE FROM cart WHERE pID = '"+msg.pID+"'"; 
	
		mysql.mysqlQuery(function (err, removed) {
			    
			        if (removed.affectedRows >0) 
			        {
			        	

			        	var abc = {"status": "200", "msg": "Removed!"};
			        	
			        }
			        else 
			        {
			          var abc = {"status": "401", "msg": "no item, please try again"};
			           
			        }
			        
			        callback(abc);
			    }, removeItem);
	
}


//function placeOrder(msg, callback){
//	
//	console.log("inside mysql placeOrder: ");
//	
//
//	        	mongo.connect(mongoURL, function(){
//	        		console.log('Connected to mongo at: ' + mongoURL);
//	        		var coll = mongo.collection('bill_details');
//	        		
//	        		var billID = Math.floor(Math.random()*100000);
//	        		billID = billID.toString();
//	        		var destination = msg.cAddress + "," + msg.cCity + "," + msg.cState + "," + msg.cZip;
//	        		
//	        		var today = new Date();
//	        	    var expectedDeliverydate = new Date();
//	        		var dd = expectedDeliverydate.getDate();
//	        		var mm = expectedDeliverydate.getMonth()+1; 
//	        		var yyyy = expectedDeliverydate.getFullYear();
//	        		var hh = expectedDeliverydate.getHours();
//	        		var mi = expectedDeliverydate.getMinutes();
//	        		var ss = expectedDeliverydate.getSeconds();
//	        		dd = parseInt(dd) + parseInt(msg.deliveryDate);
//	        		console.log("updated date" + dd);
//	        		if(dd < 10){
//	        			dd = '0'+dd;
//	        		}
//	        		if(mm < 10){
//	        			mm = '0'+mm;
//	        		}
//	        		if(hh < 10){
//	        			hh = '0'+hh;
//	        		}
//	        		if(mi < 10){
//	        			mi = '0'+mi;
//	        		}
//	        		if(ss < 10){
//	        			ss = '0'+ss;
//	        		}
//	        		
//	        		
//	        		expectedDeliverydate = yyyy+"-"+mm+"-"+dd;	
//	        		
//	        		coll.insert({"bill_id": billID, "bill_show": 1,"bDate":today, "bExpectedDeliveryDate": expectedDeliverydate, "cKey":msg.cKey, "cName": msg.cName, "bPickupLocation": "San Francisco", "bDropLocation": destination, "bDropCity":msg.cCity, "bDropState":msg.cState, "bPickUpState":msg.inCartDetails[0].fState, "driver_id": msg.inCartDetails[0].fState+"123", "truck_id": msg.inCartDetails[0].fState+"786", "driver_name": msg.inCartDetails[0].fState+"vid", "billingProducts": [], "bTotal": msg.bTotal},function(err, bill) {
//	        			 if(err){
//	        				var result={"status":"400"};
//	        			 }else{
//	        				
//	        				 for (var i = 0; i< msg.inCartDetails.length; i++){
//	        					
//	        					 console.log("placeorder: "+{"bill_id": billID}, {$push: {"billingProducts": {"bProductID": msg.inCartDetails[i].pID, "bProductName": msg.inCartDetails[i].pName, "bProductPrice": msg.inCartDetails[i].pPrice, "bProductQuantity": msg.inCartDetails[i].total_quantity, "pTotal": total, "pImage":msg.inCartDetails[i].pImage}}});
//		        					
//	        					 var d = new Date();
//	        						var n = d.getDay();
//	        						
//	        						if(n==6 || n==0){
//	        							 var total = msg.inCartDetails[i].discountedPrice * msg.inCartDetails[i].total_quantity;
//	        							coll.update({"bill_id": billID}, {$push: {"billingProducts": {"bProductID": msg.inCartDetails[i].pID, "bProductName": msg.inCartDetails[i].pName, "bProductPrice": msg.inCartDetails[i].discountedPrice, "bProductQuantity": msg.inCartDetails[i].total_quantity, "pTotal": total, "pImage":msg.inCartDetails[i].pImage}}}, function(err, billUpdate){
//			        						if(billUpdate){
//			        							console.log("bill updated" + i);
//			        							
//			        						}else{
//			        							console.log("bill not updated" + i);
//			        						}
//			        						
//			        					});
//	        						}else{
//	        							var total = msg.inCartDetails[i].pPrice * msg.inCartDetails[i].total_quantity;
//	        							coll.update({"bill_id": billID}, {$push: {"billingProducts": {"bProductID": msg.inCartDetails[i].pID, "bProductName": msg.inCartDetails[i].pName, "bProductPrice": msg.inCartDetails[i].pPrice, "bProductQuantity": msg.inCartDetails[i].total_quantity, "pTotal": total, "pImage":msg.inCartDetails[i].pImage}}}, function(err, billUpdate){
//			        						if(billUpdate){
//			        							console.log("bill updated" + i);
//			        							
//			        						}else{
//			        							console.log("bill not updated" + i);
//			        						}
//			        						
//			        					});
//	        						}
//	        					 
//	        					  
//	        					 
//	        				 }
//	        				 
//	        				 
//	        				 console.log("outside of for loop");
//	        				 
//	        				 var coll1 = mongo.collection('trip_details');
//	        				
//	        				 
//	        					coll1.createIndex({"bill_id":1, "tPickupLocation": 1}, {unique: true}, function(err, indexCreation){
//
//	        						if(indexCreation){
//	        							console.log("inside unique index");
//	        							
//	       	        				  for (var i=0; i<msg.inCartDetails.length; i++){
//	    	        					 
//	    	        					 var tripID = Math.floor(Math.random()*100000);
//	    	        					 var total = msg.inCartDetails[i].pPrice * msg.inCartDetails[i].total_quantity;
//	    	        					 
//	    		        					coll1.insert({"trip_id":tripID, "bill_id": billID, "tPrice": total, "tPickupLocation": msg.inCartDetails[i].source,"tDropCity":msg.cCity, "tDropState":msg.cState, "tDropLocation": destination, "tDate": Date(), "cKey": msg.cKey, "cName": msg.cName, "driver_id": msg.inCartDetails[i].fState+"123", "driver_name":msg.inCartDetails[i].fState+"vid","tPickUpState":msg.inCartDetails[i].fState, "truck_id": msg.inCartDetails[i].fState+"786"}, function(err, trips){
//
//	    		        						if(trips){
//	    		        							console.log("inside trips");
//	    		        							
//	    		        							
//	    		        						}else{
//	    		        							console.log("error trips");	 
//	    		        							}
//	    		        					});
//	    	        					 
//	    	        					 
//	    	        				    }
//	       	        				  
//	       	        				  var deleteCart = "DELETE FROM cart WHERE cKey='"+msg.cKey+"'";
//	       	        				  
//	       	        				  
//	       	        			    mysql.mysqlQuery(function (err, deleting) 
//	       	        			 	    {
//	       	        			 	        if (deleting.affectedRows > 0) 
//	       	        			 	        {
//	       	        			 	        	
//	       	        			 	        console.log("cart deleted");
//	       	        			 	        	
//	       	        			 	        }
//	       	        			 	        else 
//	       	        			 	        {
//	       	        			 	        console.log("cart not deleted");
//	       	        			 	        }
//	       	        			 	    }, deleteCart);
//	       	        				  
//	       	        				  console.log(billID);
//		        					  var result={"status":"200","msg":"trip and bills generated","billID":billID};
//
//	       	        				     
//	        						}else{
//	        							var result={"status":"400","msg":"Something went wrong fetching reviews after inserting, Please try again"};
//	        						}
//	        						
//	        						
//	        						callback(result); 
//	        					});
//
//	        				 var result={"status":"200", "msg": "bill updated","billID":billID};
//
//	        				 
//	        			}
//	        			callback(result);
//	        		});
//	        		
//	        	});		
//
//	
//}


function placeOrder(msg, callback){
	
	console.log("inside mysql placeOrder: ");
	

	        	mongo.connect(mongoURL, function(){
	        		console.log('Connected to mongo at: ' + mongoURL);
	        		var coll = mongo.collection('bill_details');
	        		
	        		var billID = Math.floor(Math.random()*100000);
	        		billID = billID.toString();
	        		var destination = msg.cAddress + "," + msg.cCity + "," + msg.cState + "," + msg.cZip;
	        		
	        		var today = new Date();
	        	    var expectedDeliverydate = new Date();
	        		var dd = expectedDeliverydate.getDate();
	        		var mm = expectedDeliverydate.getMonth()+1; 
	        		var yyyy = expectedDeliverydate.getFullYear();
	        		var hh = expectedDeliverydate.getHours();
	        		var mi = expectedDeliverydate.getMinutes();
	        		var ss = expectedDeliverydate.getSeconds();
	        		dd = parseInt(dd) + parseInt(msg.deliveryDate);
	        		console.log("updated date" + dd);
	        		if(dd < 10){
	        			dd = '0'+dd;
	        		}
	        		if(mm < 10){
	        			mm = '0'+mm;
	        		}
	        		if(hh < 10){
	        			hh = '0'+hh;
	        		}
	        		if(mi < 10){
	        			mi = '0'+mi;
	        		}
	        		if(ss < 10){
	        			ss = '0'+ss;
	        		}
	        		
	        		
	        		expectedDeliverydate = yyyy+"-"+mm+"-"+dd;	
	        		
	        		coll.insert({"bill_id": billID, "bill_show": 1,"bDate":today, "bExpectedDeliveryDate": expectedDeliverydate, "cKey":msg.cKey, "cName": msg.cName, "bPickupLocation": "San Francisco", "bDropLocation": destination, "bDropCity":msg.cCity, "bDropState":msg.cState, "bPickUpState":msg.inCartDetails[0].fState, "driver_id": msg.inCartDetails[0].fState+"123", "truck_id": msg.inCartDetails[0].fState+"786", "driver_name": msg.inCartDetails[0].fState+"vid", "billingProducts": [], "bTotal": msg.bTotal},function(err, bill) {
	        			 if(err){
	        				var result={"status":"400"};
	        			 }else{
	        				
	        				 for (var i = 0; i< msg.inCartDetails.length; i++){
	        					
	        					 console.log("placeorder: "+{"bill_id": billID}, {$push: {"billingProducts": {"bProductID": msg.inCartDetails[i].pID, "bProductName": msg.inCartDetails[i].pName, "bProductPrice": msg.inCartDetails[i].pPrice, "bProductQuantity": msg.inCartDetails[i].total_quantity, "pTotal": total, "pImage":msg.inCartDetails[i].pImage}}});
		        					
	        					 var d = new Date();
	        						var n = d.getDay();
	        						
	        						if(n==6 || n==0){
	        							 var total = msg.inCartDetails[i].discountedPrice * msg.inCartDetails[i].total_quantity;
	        							coll.update({"bill_id": billID}, {$push: {"billingProducts": {"bProductID": msg.inCartDetails[i].pID, "bProductName": msg.inCartDetails[i].pName, "bProductPrice": msg.inCartDetails[i].discountedPrice, "bProductQuantity": msg.inCartDetails[i].total_quantity, "pTotal": total, "pImage":msg.inCartDetails[i].pImage}}}, function(err, billUpdate){
			        						if(billUpdate){
			        							console.log("bill updated" + i);
			        							
			        						}else{
			        							console.log("bill not updated" + i);
			        						}
			        						
			        					});
	        						}else{
	        							var total = msg.inCartDetails[i].pPrice * msg.inCartDetails[i].total_quantity;
	        							coll.update({"bill_id": billID}, {$push: {"billingProducts": {"bProductID": msg.inCartDetails[i].pID, "bProductName": msg.inCartDetails[i].pName, "bProductPrice": msg.inCartDetails[i].pPrice, "bProductQuantity": msg.inCartDetails[i].total_quantity, "pTotal": total, "pImage":msg.inCartDetails[i].pImage}}}, function(err, billUpdate){
			        						if(billUpdate){
			        							console.log("bill updated" + i);
			        							
			        						}else{
			        							console.log("bill not updated" + i);
			        						}
			        						
			        					});
	        						}
	        					 
	        					  
	        					 
	        				 }
	        				 
	        				 
	        				 console.log("outside of for loop");
	        				 
	        				 var coll1 = mongo.collection('trip_details');
	        				
	        				 var nitesh = 0;
  	        				  var deleteCart = "DELETE FROM cart WHERE cKey='"+msg.cKey+"'";
  	        				  
  	        				  
  	        			    mysql.mysqlQuery(function (err, deleting) 
  	        			 	    {
  	        			 	        if (deleting.affectedRows > 0) 
  	        			 	        {
  	        			 	        	
  	        			 	        console.log("cart deleted");
  	        			 	        	
  	        			 	        }
  	        			 	        else 
  	        			 	        {
  	        			 	        console.log("cart not deleted");
  	        			 	        }
  	        			 	    }, deleteCart);
	        				 
	        					coll1.createIndex({"bill_id":1, "tPickupLocation": 1}, {unique: true}, function(err, indexCreation){

	        						if(indexCreation){
	        							console.log("inside unique index");
	        							
	       	        				  for (var i=0; i<msg.inCartDetails.length; i++){
	    	        					 
	    	        					 var tripID = Math.floor(Math.random()*100000);
	    	        					 var total = msg.inCartDetails[i].pPrice * msg.inCartDetails[i].total_quantity;
	    	        					 
	    		        					coll1.insert({"trip_id":tripID, "bill_id": billID, "tPrice": total, "tPickupLocation": msg.inCartDetails[i].source,"tDropCity":msg.cCity, "tDropState":msg.cState, "tDropLocation": destination, "tDate": Date(), "cKey": msg.cKey, "cName": msg.cName, "driver_id": msg.inCartDetails[i].fState+"123", "driver_name":msg.inCartDetails[i].fState+"vid","tPickUpState":msg.inCartDetails[i].fState, "truck_id": msg.inCartDetails[i].fState+"786"}, function(err, trips){
	    		        						nitesh++;
	    		        						if(trips){
	    		        							console.log("inside trips");
	    		        							if(nitesh == msg.inCartDetails.length){
	    		        								 console.log(billID);
	    		        								 var result={"status":"200","msg":"trip and bills generated","billID":billID};

	    		        							}
	    		        							
	    		        						}else{
	    		        							console.log("error trips");	 
	    		        							callback(result); 
	    		        							}
	    		        					});
	    	        					 
	    	        					 
	    	        				    }
	       	        				 
	       	        				  
	       	        				 		     
	        						}else{
	        							var result={"status":"400","msg":"Something went wrong fetching reviews after inserting, Please try again"};
	        							callback(result); 
	        						}
	        						
	        						
	        						
	        					});

	        				 var result={"status":"200", "msg": "bill updated","billID":billID};

	        				 
	        			}
	        			callback(result);
	        		});
	        		
	        	});		

	
}



	
	
//	console.log("In reabbitmq add To cart");
//	mongo.connect(mongoURL, function(){
//		console.log('Connected to mongo at: ' + mongoURL);
//		var coll = mongo.collection('product_details');
//		
//		coll.findOne({"pID":msg.pID}, function(err, product){
//			if(product){
//				var result={"status":"200","productDetails":product};
//			}else{
//				var result={"status":"400","msg":"Something went wrong, Please try again"};
//			}
//			callback(result);
//		});
//	});
//}

function pReviewRatings(msg, callback){
	
	console.log("In customer-product Details: "+msg.pReviewRatings.rating+"::"+msg.pReviewRatings.review+"::"+msg.pAvgRatings);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('product_details');
		//({"pID":8307452122},{$set:{"pReviewRatings":{"cKey":"3","Ratings":8,"Reviews":"Hello trying to update array"}}})
		
		//db.product_details.update({ },{$push:{"pReviewRatings":{"cKey":"3","date":Date(),"Ratings":8,"Reviews":"Hello trying to update array"}}})

		
		
		coll.update({"pID":msg.pID},{$set:{"pAvgRatings":msg.pAvgRatings},$push:{"pReviewRatings":{"cKey":msg.cKey,"cName":msg.cName,"rating":msg.pReviewRatings.rating,"review":msg.pReviewRatings.review,"date":Date()}}}, function(err, insertedReviewRatings){
			if(insertedReviewRatings){
				var result={"status":"200"};
				
				coll.findOne({"pID":msg.pID}, function(err, product){

					if(product){
						console.log(product);
						var result={"status":"200","productDetails":product};
					}else{
						var result={"status":"400","msg":"Something went wrong fetching reviews after inserting, Please try again"};
					}
				});
				
			}else{
				var result={"status":"400","msg":"Something went wrong while inserting review, Please try again"};
			}
			callback(result);
		});
	});
}


function customerDeleteAccount(msg, callback){
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('customer_details');
		
		coll.remove({"cKey":msg.cKey}, function(err, product){
			if(err){
				var result={"status":"400","msg":"Something went wrong, Please try again"};
			}else{
				var result={"status":"200","msg":"Customer Deleted Successfully"};
			}
			callback(result);
		});
		
	});
}

function customerRemoveBill(msg, callback){
	
	console.log("In customerDeleteBill");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('bill_details');
		
		coll.update({"bill_id": msg.bill_id},{$set: {"bill_show": 0}}, function(err, removed){
			if(removed){

				var result={"status":"200","msg":"bill removed!!"};
			}else{
				var result={"status":"400","msg":"Something went wrong, Please try again"};
			}
			callback(result);
		});
	});
}


function editBill(msg, callback){
	
	console.log("In editBill");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('bill_details');

        	    
        		coll.update({"bill_id": msg.bill_id},{$set: {"bExpectedDeliveryDate": msg.newDateSelected}}, function(err, removed){
        			if(removed){

        				var result={"status":"200","msg":"bill edited!!"};
        			}else{
        				var result={"status":"400","msg":"Something went wrong, Please try again"};
        			}
        			callback(result);
        		});
        	    
		
	});
}



function customerGetFarmerDetails(msg, callback){
	
	console.log("In customer-farmer Details");
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('farmer_details');
		
		coll.findOne({"fKey":msg.fKey},function(err, farmer){
			if(farmer){
				console.log("customerGetFarmerDetails farmer: "+farmer);
				
				var coll1 = mongo.collection('product_details');
				
				coll1.find({"fKey":msg.fKey}).toArray(function(err, product){
					if(product){
						console.log("customerGetFarmerDetails product: "+product);
						var result={"status":"200","farmerDetails":farmer,"productDetails":product};
						callback(result);
					}else{
						var result={"status":"400","msg":"Something went wrong, Please try again"};
						callback(result);
					}
				});
				
			}else{
				var result={"status":"400","msg":"Something went wrong, Please try again"};
				callback(result);
			}
		});
	});
}


function handle_request(msg, callback){
	console.log("customerHome in handle_request");
	if(msg.methodName == "customerDetails"){
		customerDetails(msg,function(result){
			callback(null,result);
		});
	}	
	else if(msg.methodName == "customerUpdateDetails"){
		customerUpdateDetails(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "customerUpdatePassword"){
		customerUpdatePassword(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "customerUpdateCC"){
		customerUpdateCC(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "customerProductList"){
		customerProductList(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "customerGetProductDetails"){
		customerGetProductDetails(msg,function(result){
			callback(null,result);
		});
	}	
	else if(msg.methodName == "addToCart"){
		console.log("inside add to cart in cusomterHome.js")
		addToCart(msg,function(result){
			callback(null,result);
		});
	}	//ReviewRatings
	else if(msg.methodName == "pReviewRatings"){
		console.log("inside pReviewRatings in cusomterHome.js ")
		pReviewRatings(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "customerDeleteAccount"){
		console.log("inside customerDeleteAccount in cusomterHome.js ")
		customerDeleteAccount(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "placeOrder"){
		console.log("inside placeOrder in cusomterHome.js ")
		placeOrder(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "getCart"){
		console.log("inside getCart in cusomterHome.js ")
		getCart(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "removeFromCart"){
		console.log("inside removeFromCart in cusomterHome.js ")
		removeFromCart(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "getCustomerBills"){
		console.log("inside getCustomerBills in cusomterHome.js ")
		getCustomerBills(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "customerRemoveBill"){
		console.log("inside customerRemoveBill in cusomterHome.js ")
		customerRemoveBill(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "editBill"){
		console.log("inside editBill in cusomterHome.js ")
		editBill(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "customerGetBillDetails"){
		console.log("inside customerGetBillDetails in cusomterHome.js ")
		customerGetBillDetails(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "getCartSummary"){
		console.log("inside getCartSummary in cusomterHome.js ")
		getCartSummary(msg,function(result){
			callback(null,result);
		});
	}
	else if(msg.methodName == "customerGetFarmerDetails"){
		console.log("inside customerGetFarmerDetails in customerGetFarmerDetails.js ")
		customerGetFarmerDetails(msg,function(result){
			callback(null,result);
		});
	}
}





exports.customerGetProductDetails=customerGetProductDetails;
exports.customerProductList=customerProductList;
exports.customerUpdateDetails=customerUpdateDetails;
exports.customerUpdatePassword=customerUpdatePassword;
exports.customerUpdateCC=customerUpdateCC;
exports.customerDetails=customerDetails;
exports.getCustomerBills=getCustomerBills;
exports.addToCart=addToCart;
exports.pReviewRatings=pReviewRatings;
exports.customerDeleteAccount=customerDeleteAccount;
exports.placeOrder=placeOrder;
exports.getCart = getCart;
exports.getCartSummary = getCartSummary;
exports.removeFromCart = removeFromCart;
exports.customerRemoveBill =customerRemoveBill;
exports.editBill =editBill;
exports.customerGetBillDetails =customerGetBillDetails;
exports.customerGetFarmerDetails =customerGetFarmerDetails;
exports.handle_request = handle_request;