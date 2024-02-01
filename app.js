require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const passport = require('passport');
const {Strategy} = require('passport-local');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: 'This is our little secret',
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session())

app.set('view engine', 'ejs')


// mongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/userDB');

// userSchema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secrets: [String]
})

userSchema.plugin(findOrCreate);

// user model
const User = mongoose.model('User', userSchema)

// compare password
function comparePassword(password, hashed){

    return bcrypt.compareSync(password, hashed);
}

// passport config
passport.use(new Strategy(
    async function(username, password, done) {
        try{
            const user = await User.findOne({ email: username })
            
            if(!user) return done(null, false);
            if(!comparePassword(password, user.password)) return done(null, false);
            return done(null, user);

        } catch(error){
            return done(error, false);
        }

        
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
	try {
		const findUser = await User.findById(id);
		if (!findUser) throw new Error("User Not Found");
		done(null, findUser);
	} catch (err) {
		done(err, null);
	}
});

// Authentication Middleware (can use this instead of isAuthenticated() method)
function isAuthenticated(req, res, next){
    if(req.user) return next();
    res.redirect("/login");
}

// google oauth config
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/', function(req, res){
    res.render('home')
})

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }), function(req, res){

})

// get request done by google
app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/secrets');
});

app.get('/register', function(req, res){
    res.render('register')
})

app.get('/login', function(req, res){
    res.render('login')
})

app.get("/secrets", async function(req, res){

    const foundUsers = await User.find({ secrets: { $ne: [] } });
    // res.send(foundUsers);
    res.render("secrets",{usersWithSecrets: foundUsers});
    // res.render("secrets");


});

app.get("/submit", function(req, res){

    if(req.isAuthenticated()){
        res.render("submit");
    } else {
        res.redirect("/login")
    }  
});

app.post("/submit", async function(req, res){

    const submittedSecret = req.body.secret;
    const foundUser = await User.findById(req.user._id);
    foundUser.secrets.push(submittedSecret);
    await foundUser.save();
    res.redirect("/secrets")

})

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})



app.post("/register", async function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    const userFound = await User.findOne({email: username})
    if(userFound){
        return res.render('login')
    }

    const hash = bcrypt.hashSync(password, saltRounds);

    const user = {
        email: username,
        password: hash
    }
    const newUser = await User.create(user);

    passport.authenticate('local')(req, res, function(){
        res.redirect("/secrets");
    });

});

app.post("/login",passport.authenticate("local", {failureRedirect: "/register", successRedirect: "/secrets"}), function(req, res){

})



app.listen(3000, function(){
    console.log("Server is listening on port 3000")
})



// https://accounts.google.com/logout


