const bcrypt = require('bcryptjs');
const crypto = require('crypto');

function randomString(size = 8) {  
    return crypto
      .randomBytes(size)
      .toString('hex')
      .slice(0, size)
}

class Router {

    constructor(app, db) {
        this.login(app, db);
        this.logout(app, db);
        this.isLoggedIn(app, db);
        this.registerUser(app, db);
    }

    getFlatNameByID(db, id){
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM flats WHERE flatID = ?', id, (err, data) => {
                if (err) {
                    reject(err)
                }
                if (data && data.length === 1) {
                    resolve(data[0].name)
                }
            })
        })
    }

    login(app, db) {
        app.post('/login', (req, res) => {
            let email = req.body.email;
            let password = req.body.password;

            email = email.toLowerCase();

            let cols = [email];
            db.query('SELECT * FROM users WHERE email = ? LIMIT 1', cols, (err, data) => {

                if (err) {
                    res.json({
                        success: false,
                        msg: err
                    })
                    return;
                }

                if (data && data.length === 1) {
                    bcrypt.compare(password, data[0].password, (bcryptErr, verified) => {
                        if (verified) {
                            req.session.email = data[0].email
                            this.getFlatNameByID(db, data[0].flatID)
                                .then(flatName => {
                                    res.json({
                                        success: true,
                                        email: data[0].email,
                                        fname: data[0].fname,
                                        lname: data[0].lname,
                                        flatName: flatName
                                    })
                                })
                                .catch(err => {
                                    res.json({
                                        success: false,
                                        msg: err.message
                                    })
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
                db.query('SELECT * FROM users WHERE email = ? LIMIT 1', cols, (err, data) => {

                    if (err) {
                        res.json({
                            success: false,
                            msg: err
                        })
                        return false;
                    }

                    if (data && data.length === 1) {
                        this.getFlatNameByID(db, data[0].flatID)
                            .then(flatName => {
                                res.json({
                                    success: true,
                                    email: data[0].email,
                                    fname: data[0].fname,
                                    lname: data[0].lname,
                                    flatName: flatName
                                })
                            })
                            .catch(err => {
                                res.json({
                                    success: false,
                                    msg: err
                                })
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

    createFlat(db, params) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO flats VALUES (?, ?)', params, (err) => {
                if (err) {
                    reject(err)
                }
                resolve()
            })
        })
    }

    deleteFlat(db, params) {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM flats WHERE flatID = ?", params, (err) => {
                if (err) {
                    reject(err)
                }
                resolve()
            })
        })
    }

    createUser(db, params) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)', params, (err) => {
                if (err) {
                    reject(err)
                }
                resolve()
            })
        })
    }

    registerUser(app, db) {

        app.post('/registerUser', (req, res) => {
            let email = req.body.email.toLowerCase()
            let password = req.body.password
            let fname = req.body.firstName
            let lname = req.body.lastName
            let is_manager = req.body.isFlatManager ? 1 : 0
            let flatID = req.body.flatCode
            let flatName = req.body.flatName

            if (is_manager) {
                flatID = randomString()
                this.createFlat(db, [flatID, flatName])
                    .catch(err => {
                        res.json({
                            success: false,
                            msg: "Could not create flat: " + err.code
                        })
                    })
            }

            this.createUser(db, [email, fname, lname, bcrypt.hashSync(password, 9), is_manager, flatID])
                .then(() => {
                    req.session.email = email
                    if (!is_manager){
                        this.getFlatNameByID(db, flatID)
                            .then(result => {
                                res.json({
                                    success: true,
                                    email: email,
                                    fname: fname,
                                    lname: lname,
                                    is_manager: is_manager,
                                    flatName: result,
                                    flatID: flatID
                                })
                            })
                            .catch(err => {
                                res.json({
                                    success: false,
                                    msg: err
                                })
                            })
                    } else {
                        res.json({
                            success: true,
                            email: email,
                            fname: fname,
                            lname: lname,
                            is_manager: is_manager,
                            flatName: flatName,
                            flatID: flatID
                        })
                    }
                })
                .catch(err => {
                    if (is_manager) {
                        this.deleteFlat(db, [flatID])
                            .catch(err => {
                                res.json({
                                    success: false,
                                    msg: "Could not delete flat: " + err.message
                                })
                            })
                    }
                    let message = "An unknown error occured: " + err.message;
                    if (err.code === "ER_DUP_ENTRY"){
                        message = "User with that email already exists"
                    }
                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        message = "Invalid flat signup code"
                    }
                    res.json({
                        success: false,
                        msg: message
                    })
                })
        });
    }
}

module.exports = Router;