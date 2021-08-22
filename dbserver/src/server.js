const express = require('express');
const app = express();
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Router = require('./Router');

const port = 3000;

app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://192.168.2.11:3000")
    res.header("Access-Control-Allow-Methods", "POST")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    res.header("Access-Control-Allow-Credentials", true)
    next()
})

//Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'webuser',
    password: 'password',
    database: 'dbserver'
});

db.connect(function(err) {
    if (err) {
        console.log('DB error');
        throw err;
    }
});

const sessionStore = new MySQLStore({
    expiration: (1825 * 86400 * 1000),
    endConnectionOnClose: false
}, db);

app.use(session({
    key: 'random1',
    secret: 'random2',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false
    }
}));

new Router(app, db);

app.listen(port, () => console.log("Backend being served on port " + port));