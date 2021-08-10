const express = require('express');
const app = express();
const port = 8180;

const mysql = require('mysql2');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "test"
});

app.get('/api/users', (req, res) => {
    let email = req.query.email;
    con.connect((err) => {
        if (err) throw err;
        // asking for a sql injection attack!
        con.query(`select * from users where email = "${email}";`, (err, result) => {
            if (err) throw err;
            res.json(result[0]);
        });
    })
});

app.listen(port, () => console.log(`dbserver listening on port ${port}`))