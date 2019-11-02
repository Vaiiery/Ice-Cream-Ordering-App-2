//Organizacion de Mongoose, etc...
var express             = require('express'),
    app                 = express(),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    passport            = require('passport'),
    LocalStrategy       = require('passport-local'),
    User                = require  ('./models/user')

//Database
mongoose.set('useUnitfiedTopology', true);
mongoose.set('useNewUrlParser',true);
//Create database
mongoose.connect("mongodb://localhost/Vale_Ice_Cream");

//Configuration to have a crean code
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(Require("express-session")({
    secret: "La vida es bella",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Use var user globally on the code!!
app.use(function(req, res, next){
    res.locals.currentUser = re.user;
    next();
});


//Create ice_cream

var ice_cream = new mongoose.UserSchema({
    name: String,
    description: String,
    author: {
        id:{
            type: mongoose.UserSchema.type.ObjectId,
            ref:"User"
        },
        username: String
    }

});
//Schema
var Helado = mongoose.model("Helado", ice_cream);

//Routes
app.get("/",function(req, res){
    res.render("Landing");
});

//Index route
app.get("/ValeIceCream", function(req,res){
    //Get all icecreams from database
    Helado.find({}, function(err, AllHelados){
        if(err){
            console.log(err);
        }else{
            res.render("index", {IceCream: AllHelados})
        }
    });
});


//List a new Ice Cream
app.get("/ValeIceCream/new", isLoggedIn, function(req, res){
    res.render("New");
});

//Add ice cream to the database
app.post("/ValeIceCream",isLoggedIn, function(req, res){
    //Add to icecreams array and get data from form
    var name = req.body.name;
    var description = req.body.description;
    var username = res.locals.currentUser = req.user;
    var newHelados = {name: name, description: description, username: username}
    //Save to database 
    icecream. create(newHelados, function(err, newAdded){
        if(err){
            console.log(err);
        }else{
            res.redirect("/ValeIceCream");
        }
    });
});


//authentication routes

//show register
app.get("/register", function(req, res){
    res.render("register");

});

//User Register
app.post("/register", function(req, res){
    var newUser = new uSER({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/ValIceCream"); 
        });
    });
});

//show login
app.get("/login", function(req, res){
    res.render("login");
});

//Login register
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/ValeIceCream",
        failureRedirect: "/login"

    }), function(req, res){

});

//Login route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
 });
 
 function isLoggedIn(req, res, next){
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/login");
 }

 //Error
 app.get("Vida", function(req, res){
    res.render("Error")
});

app.listen(3009, function(){
    console.log('Seguimos cansados');
});