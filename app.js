var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
// need to install
var passport = require('passport');
// need to install
var passportLocal = require('passport-local');
var db = require('./models/index.js');
var flash = require('connect-flash');
var crypto = require('crypto');


var app = express();

app.set("view engine", "ejs");

app.use(methodOverride());
app.use(bodyParser({extended: true}));
app.use(express.static(__dirname + '/public'));

//API
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;


// make sure AWS Keys are working 
// console.log(AWS_ACCESS_KEY)
// console.log(AWS_SECRET_KEY)
// console.log(S3_BUCKET)


app.use(cookieSession( {
  secret: 'secretkey',
  name: 'cookie session',
  maxage: 50000000,
  })
);

//passport initialization
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//passport functions
passport.serializeUser(function(user, done){
  console.log("Serialize Working");
  done(null, user.id);
});

//why user in serialize and id in deserialize)
passport.deserializeUser(function(id, done) {
  console.log("Deserialize Working");
  db.user.find({
    where: {
      id: id
    }
  })
  .done(function(error, user) {
    done(error, user);
  });
});

//landing page - sign up/login
app.get('/', function(req,res){
res.render("index");
});

// Sign up user
app.post('/users', function (req, res) {
  db.user.createNewUser(req.body.username, req.body.password, 
    function(err){
      console.log("PROBLEM SIGNING UP THE USER");
      console.log(err);
    },
    function(success){
      console.log("USER CREATED!");
      res.render('users/login');
    });
});

//Login page
app.get("/login", function(req,res){
	res.render("users/login", {message: null});
});

app.get("/myvehicles/:id", function(req,res){
  db.vehicle.findAll({
    where: {
      userId: req.params.id
    }
  }).success(function(vehicles){
    res.render("myvehicles", {myvehicles: vehicles});  
  });
  
});


app.get("/vehicle/:id", function(req, res){
  db.vehicle.find({
    where: {
      id: req.params.id
    }
  }).success(function(vehicle){
    console.log(vehicle);
    res.render("viewCar", {vehicle: vehicle});  
  });
});

app.get("/inventory", function(req,res){
	db.vehicle.findAll().success(function(vehicle){
    console.log("ALL THE CARS ARE HERE!");
    console.log(vehicle);
    res.render("inventory", {
      vehicles:vehicle,
      isAuthenticated: req.isAuthenticated(),
      user: req.user
    });
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


app.post("/login", passport.authenticate('local',{
  successRedirect: '/inventory',
  failureRedirect: '/login',
  failureFlash: true
}));
// call my authorize method

app.get('/sign_s3', function(req, res){
    var object_name = req.query.s3_object_name;
    var mime_type = req.query.s3_object_type;

    var now = new Date();
    var expires = Math.ceil((now.getTime() + 10000)/1000); // 10 seconds from now
    var amz_headers = "x-amz-acl:public-read";  

    var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/"+S3_BUCKET+"/"+object_name;
    var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_request).digest('base64');
    signature = encodeURIComponent(signature.trim());
    signature = signature.replace('%2B','+');

    var url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+object_name;

    var credentials = {
        signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
        url: url
    };
    res.write(JSON.stringify(credentials));
    res.end();
});

app.post("/newcar", function(req,res){
	db.vehicle.create({
		make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    description: req.body.description,
    imageURL: req.body.avatar_url,
    userId: req.user.id
	}).success(function(vehicle){
    console.log(vehicle);
    res.redirect('/inventory');
  });
});

app.get("/signup", function (req, res) {
  res.render("users/signup", {username: ""});
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect('/');
});

app.get("*", function (req, res) {
  res.render("404");
});
app.listen(process.env.PORT || 3000, function(){
console.log("THIS IS SPARTA");
});