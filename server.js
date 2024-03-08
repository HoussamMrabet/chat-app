if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
// Create an instance of the express application and assign it to the variable 'app'
const app = express();
// Import the http module, create an HTTP server using the express app, and assign it to the variable 'http'
const http = require("http").Server(app);
// Import the socket.io module and pass the HTTP server to it to create a WebSocket server, and assign it to the variable 'io'
const io = require("socket.io")(http);

// Importing all Libraies that we installed using npm

const bcrypt = require("bcrypt") // Importing bcrypt package
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")
const path = require('path');

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)



const users = []

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // We wont resave the session variable if nothing is changed
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))

// Configuring the register post functionality
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login",
    failureFlash: true
}))

// Configuring the register post functionality
app.post("/Register", checkNotAuthenticated, async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        console.log(users); // Display newly registered in the console
        res.redirect("/login")

    } catch (e) {
        console.log(e);
        res.redirect("/Register")
    }
})

// Routes
app.get('/', (req, res) => {
    res.render("landingPage.ejs");
});

app.get('/index', checkAuthenticated, (req, res) => {
    res.render("index.ejs", { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render("login.ejs")
})

app.get('/Register', checkNotAuthenticated, (req, res) => {
    res.render("Register.ejs")
})
// End Routes

// app.delete('/logout', (req, res) => {
//     req.logOut()
//     res.redirect('/login')
//   })

app.delete("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect("/")
    })
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/login")
    }
    next();
}



// Listen for a 'connection' event on the 'io' WebSocket server
io.on("connection", function (socket) {
    console.log('A new client has connected to the server');

    socket.on("message", (data, userId) => {
        console.log(`Message :${data}`, `User id :${userId}`);

        io.emit('message', { message: data, sender: userId });
    });
});

// Serve static files from the current directory (the directory where the script is located)
app.use(express.static('public'));


app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

// Start the HTTP server and make it listen on port 8080
http.listen(3001, () => {
    console.log('Server is listening on port 3001');
})