var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var cookieParser = require('cookie-parser');
var db = require('./models/index.js');

var app = express();

app.set("view engine", "ejs");

app.use(methodOverride());
app.use(bodyParser({extended: true}));

// app.use(function(req, res, next){
//   console.log(req.method, req.url)
//   next()
// });

//Login page
app.get("/login", function(req,res){
	res.render("users/login", {message: null});
});

app.get("/inventory", function(req,res){
	db.vehicle.findAll().success(function(vehicle){
    console.log("ALL THE CARS ARE HERE!");
    console.log(vehicle);
    res.render("inventory", {vehicles:vehicle});
  });
    
});

app.get("/inventory", function(req,res){
  db.vehicle.findAll().success(function(vehicle){
    console.log("ALL THE CARS ARE HERE!");
    console.log(vehicle);
    res.render("inventory", {vehicles:vehicle});
  }); 
});

app.get("/postCar", function(req, res){
	res.render("postCar");
});

app.post("/login", function(req, res){
// call my authorize method
db.user.authorize(req.body.username, req.body.password, 
	function(err){
		console.log("FAIL");
		res.render("users/login", {message: err.message});
	},
	function(success){
		console.log("SUCCESS");
		res.redirect("inventory");
	});
});

// Sign up form
app.get('/', function(req,res){
res.render("index");
});

// Sign up user
app.post('/users', function (req, res) {
  var newUser = req.body.user;
  var handleError = function(error){
    res.render("error", {
      username: newUser.username,
      message: error.message
    });
  };
  var handleSuccess = function(currentUser, success){
    currentUser.getVehicles()
    .success(function(userVehicles){
      res.render("inventory", {
        vehicles: userVehicles,
        message: success.message
      });
    });
  };
  db.user.createNewUser(newUser.username, newUser.password, handleError, handleSuccess);
});



app.post("/newcar", function(req,res){
	db.vehicle.create({
		make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    description: req.body.description,
    // Fix this using passport
    // in your deserialize function you get back a user object. You can access the id by using req.user.id
    userId: 1
	}).success(function(vehicle){
    console.log(vehicle);
    res.redirect('/inventory');
  });
});


app.get("/signup", function (req, res) {
  res.render("users/signup", {username: ""});
});

app.listen(3000, function(){
console.log("THIS IS SPARTA");
});