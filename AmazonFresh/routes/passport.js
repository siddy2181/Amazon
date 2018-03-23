/**
 * Created by Vedang Jadhav on 4/16/16.
 */
var crypto = require('crypto');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require('./db/mongo');
var loginDatabase = "mongodb://localhost:27017/AmazonFresh";

module.exports = function(passport) {
    passport.use('userSignInAdmin', new LocalStrategy(function(username,password,done) {

    	console.log("nitesh wadhwa");
    	
    	var encryptPassword = crypto.createHash("md5").update(password).digest('hex');
    	
        mongo.connect(loginDatabase, function(connection) {

            var loginCollection = mongo.connectToCollection('admin_details', connection);
            var whereParams = {
            	aEmail:username,
            	aPassword:encryptPassword
            };

            process.nextTick(function(){
                loginCollection.findOne(whereParams, function(error, user) {
                	if(user){
    					var result={"status":"200","signInAs":"admin","key":user.aKey,"name":user.aFirstName+" "+user.aLastName};
                	}else{
    					var result={"status":"400","msg":"Either email or password is incorrect"};
    				}
                    done(null, result);
                });
            });
        });
    }));
    
    passport.use('userSignInCustomer', new LocalStrategy(function(username,password,done) {

    	console.log("nitesh wadhwa");
    	
    	var encryptPassword = crypto.createHash("md5").update(password).digest('hex');
    	
        mongo.connect(loginDatabase, function(connection) {

            var loginCollection = mongo.connectToCollection('customer_details', connection);
            var whereParams = {
            	cEmail:username,
            	cPassword:encryptPassword,
            	cActive:1
            };

            process.nextTick(function(){
                loginCollection.findOne(whereParams, function(error, user) {
                	if(user){
    					var result={"status":"200","signInAs":"customer","key":user.cKey,"name":user.cFirstName+" "+user.cLastName};
    				}else{
    					var result={"status":"400","msg":"Either email or password is incorrect OR System Admin didn't Approve SignUp request yet"};
    				}
                    done(null, result);
                });
            });
        });
    }));
    
    passport.use('userSignInFarmer', new LocalStrategy(function(username,password,done) {

    	console.log("nitesh wadhwa");
    	
    	var encryptPassword = crypto.createHash("md5").update(password).digest('hex');
    	
        mongo.connect(loginDatabase, function(connection) {

            var loginCollection = mongo.connectToCollection('farmer_details', connection);
            var whereParams = {
            	fEmail:username,
            	fPassword:encryptPassword,
            	fActive:1
            };

            process.nextTick(function(){
                loginCollection.findOne(whereParams, function(error, user) {
                	if(user){
    					var result={"status":"200","signInAs":"farmer","key":user.fKey,"name":user.fFirstName+" "+user.fLastName};
    				}else{
    					var result={"status":"400","msg":"Either email or password is incorrect OR System Admin didn't Approve SignUp request yet"};
    				}
                    done(null, result);
                });
            });
        });
    }));
    
}


