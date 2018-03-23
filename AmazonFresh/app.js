var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
require('./routes/passport')(passport);


var mongoSessionURL = "mongodb://localhost:27017/AmazonFresh";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var routes = require('./routes/index');
var users = require('./routes/users');
var farmerHome = require('./routes/farmerHome');
var adminHome = require('./routes/adminHome');
var customerHome = require('./routes/customerHome');

var app = express();

app.use(expressSessions({
	  secret: "CMPE273_passport",
	  resave: false,
	  saveUninitialized: false,
	  duration: 30 * 60 * 1000,
	  activeDuration: 5 * 6 * 1000,
	  store: new mongoStore({
	    url: mongoSessionURL
	  })
	}));
	app.use(passport.initialize());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/signIn', routes.signIn);
app.get('/signUp', routes.signUp);
//app.post('/userSignIn', users.userSignIn);
app.post('/farmerSignUp', users.farmerSignUp);
app.get('/farmerHome', farmerHome.farmerHome);
app.post('/farmerUpdateDetails', farmerHome.farmerUpdateDetails);
app.post('/farmerUpdatePassword', farmerHome.farmerUpdatePassword);
app.post('/addProduct', farmerHome.addProduct);
app.get('/farmerProductList', farmerHome.farmerProductList);
app.post('/farmerDeletProduct', farmerHome.farmerDeletProduct);
app.post('/farmerGetProductDetails', farmerHome.farmerGetProductDetails);
app.post('/updateProduct', farmerHome.updateProduct);
app.get('/farmerDetails', farmerHome.farmerDetails);
app.get('/index', routes.index);
app.post('/farmerDeleteAccount', farmerHome.farmerDeleteAccount);


// admin //

app.get('/adminHome', adminHome.adminHome);
app.get('/adminGetNotificationList',adminHome.adminGetNotificationList);
app.get('/adminGetCustomerList',adminHome.adminGetCustomerList);
app.get('/adminGetFarmerList',adminHome.adminGetFarmerList);
app.get('/adminGetBillList',adminHome.adminGetBillList);
app.get('/adminGetProductList',adminHome.adminGetProductList);
app.post('/adminUserAccepted', adminHome.userAccepted);
app.post('/adminUserRejected', adminHome.userRejected);
app.post('/admindeleteFarmer', adminHome.deleteFarmer);
app.post('/admindeleteCustomer', adminHome.deleteCustomer);
app.post('/admindeleteProduct', adminHome.deleteProduct);
app.get('/adminGetTrucks',adminHome.adminGetTrucks);
app.get('/ridesPerDriver',adminHome.ridesPerDriver);
app.get('/tripsPerLocation',adminHome.tripsPerLocation);
app.get('/ridesPerCustomer',adminHome.ridesPerCustomer);
app.get('/ridesPerArea',adminHome.ridesPerArea);
app.get('/revenuePerLocation',adminHome.revenuePerLocation);
app.post('/adminDeleteBill',adminHome.deleteBill);

// customer

app.post('/customerSignUp', users.customerSignUp);
app.get('/customerHome', customerHome.customerHome);
app.post('/customerUpdateDetails', customerHome.customerUpdateDetails);
app.post('/customerUpdatePassword', customerHome.customerUpdatePassword);
app.get('/customerProductList', customerHome.customerProductList);
app.post('/customerGetProductDetails', customerHome.customerGetProductDetails);
app.get('/customerDetails',customerHome.customerDetails);
app.post('/addToCart',customerHome.addToCart);
app.post('/customerUpdateCC',customerHome.customerUpdateCC);
app.post('/insertReviewRatings',customerHome.insertReviewRatings);
app.post('/customerDeleteAccount',customerHome.customerDeleteAccount);
app.post('/placeOrder',customerHome.placeOrder);
app.get('/getCart',customerHome.getCart);
app.get('/getCartSummary',customerHome.getCartSummary);
app.post('/removeFromCart',customerHome.removeFromCart);
app.get('/getCustomerBills',customerHome.getCustomerBills);
app.post('/customerRemoveBill',customerHome.customerRemoveBill);
app.post('/editBill',customerHome.editBill);
app.post('/customerGetBillDetails',customerHome.customerGetBillDetails);
app.post('/customerGetFarmerDetails',customerHome.customerGetFarmerDetails);


// session

app.get('/session', routes.session);
app.get('/sessionEnd', routes.sessionEnd);

app.post('/userSignInAdmin', function(req, res, next) {
	
	console.log("nitesh");
	console.log(req.body.username);
	
	  passport.authenticate('userSignInAdmin', function(err, results, info) {
		  if(results.status == "200"){
				req.session.data={"key":results.key,"name":results.name,"signInAs":results.signInAs};
			}	
			res.send(results);
	  })(req, res, next);
});

app.post('/userSignInCustomer', function(req, res, next) {
	
	console.log("nitesh");
	console.log(req.body.username);
	
	  passport.authenticate('userSignInCustomer', function(err, results, info) {
		  if(results.status == "200"){
				req.session.data={"key":results.key,"name":results.name,"signInAs":results.signInAs};
			}	
			res.send(results);
	  })(req, res, next);
});

app.post('/userSignInFarmer', function(req, res, next) {
	
	console.log("nitesh");
	console.log(req.body.username);
	
	  passport.authenticate('userSignInFarmer', function(err, results, info) {
		  if(results.status == "200"){
				req.session.data={"key":results.key,"name":results.name,"signInAs":results.signInAs};
			}	
			res.send(results);
	  })(req, res, next);
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
