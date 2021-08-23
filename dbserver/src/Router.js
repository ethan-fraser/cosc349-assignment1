const bcrypt = require('bcryptjs');

class Router {

    constructor(app, db) {
        this.login(app, db);
        this.logout(app, db);
        this.isLoggedIn(app, db);
    }

    login(app, db) {
        app.post('/login', (req, res) => {
            let email = req.body.email;
            let password = req.body.password;

            email = email.toLowerCase();

            let cols = [email];
            db.query('SELECT * FROM users WHERE email = ? LIMIT 1', cols, (err, data, fields) => {

                if (err) {
                    res.json({
                        success: false,
                        msg: err
                    })
                    return;
                }

                if (data && data.length === 1) {
                    bcrypt.compare(password, data[0].passwd, (bcryptErr, verified) => {
                        if (verified) {
                            req.session.email = data[0].email
                            res.json({
                                success: true,
                                email: data[0].email,
                                fname: data[0].fname,
                                lname: data[0].lname
                            })
                            return;
                        } else {
                            res.json({
                                success: false,
                                msg: 'Invalid password'
                            })
                        }
                    });
                } else {
                    res.json({
                        success: false,
                        msg: 'User not found'
                    })
                }

            });
        });
    }

    logout(app, db) {
        app.post('/logout', (req, res) => {
            if (req.session.email) {
                req.session.destroy();
                res.json({
                    success: true
                })
                return true;
            } else {
                res.json({
                    success: false
                })
                return false;
            }
        });
    }

    isLoggedIn(app, db) {

        app.post('/isLoggedIn', (req, res) => {
            if (req.session.email) {
                let cols = [req.session.email];
                db.query('SELECT * FROM users WHERE email = ? LIMIT 1', cols, (err, data, fields) => {
                    if (data && data.length === 1) {
                        res.json({
                            success: true,
                            email: data[0].email,
                            fname: data[0].fname,
                            lname: data[0].lname
                        })
                        return true;
                    } else {
                        res.json({
                            success: false,
                            msg: "No user with that email"
                        })
                    }
                });
            } else {
                res.json({
                    success: false,
                    msg: "No email in session data"
                })
            }
        });
    }
}

module.exports = Router;