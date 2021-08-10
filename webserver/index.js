const request = require('request');
const express = require('express');
const app = express();
const port = 8080;
const api_url = "http://localhost:8180/api/users"  

app.set('view-engine', 'pug')

let current_user = null;

app.get('/', (req, res) => {
    if (!current_user) {
        res.render("login.pug");
    } else {
        res.render("index.pug", {
            fname: current_user.fname,
            lname: current_user.lname,
            email: current_user.email
        });
    }
});

app.get('/login', (req, res) => {
    var email = req.query.email;
    request(api_url+"?email="+email, {"json": true}, (err, _res, body) => {
        if (err) {
            res.render("error.pug", {error: err});
        } else if (!body) {
            res.render("error.pug", {error: "No user with email " + email});
        } else {
            current_user = body;
            res.redirect('/');
        }
    });
})

app.get("/logout", (req, res) => {
    current_user = null;
    res.redirect("/");
    
});

app.listen(port, () => {
    console.log(`webserver listnening on port ${port}`);
});