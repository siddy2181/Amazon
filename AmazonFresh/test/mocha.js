var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('should return the login if the url is correct', function(done){
		http.get('http://localhost:3000/', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

	it('should not return the home page if the url is wrong', function(done){
		http.get('http://localhost:3000/hone', function(res) {
			assert.equal(404, res.statusCode);
			done();
		})
	});

	it('it should return the product list of farmer', function(done){
		http.get('http://localhost:3000/farmerProductList', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	
	it('it should return the notification list at admin', function(done){
		http.get('http://localhost:3000/adminGetNotificationList', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	it('it should return all the bills known by the system at admin', function(done){
		http.get('http://localhost:3000/adminGetBillList', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	it('it should return all the customers using the system at admin', function(done){
		http.get('http://localhost:3000/adminGetCustomerList', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	it('it should return all the farmers using the system at admin', function(done){
		http.get('http://localhost:3000/adminGetFarmerList', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	it('it should return all the products known by the system at admin', function(done){
		http.get('http://localhost:3000/adminGetProductList', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	
});
