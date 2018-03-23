//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var login = require('./services/user');
var farmerHome = require('./services/farmerHome');
var admin = require('./services/admin');
var customerHome = require('./services/customerHome');

//var home = require('./services/');
//var profile = require('./services/');

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	
	cnn.queue('login_Queue', function(q){
		console.log("listening on login_Queue");
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.handle_request(message, function(err,res){
				console.log(message);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('farmer_queue', function(q){
		console.log("listening on farmer_queue");
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			farmerHome.handle_request(message, function(err,res){
				console.log(message);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('admin_Queue', function(q){
		console.log("listening on admin_Queue");
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_request(message, function(err,res){
				console.log(message);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('customer_queue', function(q){
		console.log("listening on customer_queue");
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			customerHome.handle_request(message, function(err,res){
				console.log(message);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
//	cnn.queue('home_queue', function(q){
//		console.log("listening on home_queue");
//		q.subscribe(function(message, headers, deliveryInfo, m){
//			util.log(util.format( deliveryInfo.routingKey, message));
//			util.log("Message: "+JSON.stringify(message));
//			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
//			home.handle_request(message, function(err,res){
//				console.log(message);
//				//return index sent
//				cnn.publish(m.replyTo, res, {
//					contentType:'application/json',
//					contentEncoding:'utf-8',
//					correlationId:m.correlationId
//				});
//			});
//		});
//	});
//	
//	cnn.queue('profile_queue', function(q){
//		console.log("listening on profile_queue");
//		q.subscribe(function(message, headers, deliveryInfo, m){
//			util.log(util.format( deliveryInfo.routingKey, message));
//			util.log("Message: "+JSON.stringify(message));
//			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
//			profile.handle_request(message, function(err,res){
//				console.log(message);
//				//return index sent
//				cnn.publish(m.replyTo, res, {
//					contentType:'application/json',
//					contentEncoding:'utf-8',
//					correlationId:m.correlationId
//				});
//			});
//		});
//	});
	
});