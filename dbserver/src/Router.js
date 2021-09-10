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
        this.billInfo(app, db);
        this.createBill(app, db);
        this.updateBillStatus(app, db);
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
                                        flatName: flatName,
                                        flatID: data[0].flatID,
                                        is_manager: data[0].is_manager ? true : false
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
                                    flatName: flatName,
                                    flatID: data[0].flatID,
                                    is_manager: data[0].is_manager ? true : false
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

    addBillStatusesForNewUser(db, userEmail, flatID) {
        return new Promise((resolve, reject) => {
            this.getBillsByFlatID(db, [flatID])
                .then(bills => {
                    bills.forEach(bill => {
                        db.query('INSERT INTO bill_status VALUES (null, ?, ?, "due")', [bill.billID, userEmail], (err) => {
                            if (err) {
                                reject(err)
                            }
                        })
                    })
                    resolve()
                })
                .catch(err => {
                    reject(err)
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
                        this.addBillStatusesForNewUser(db, email, flatID)
                            .then(() => {
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

    getBillsByFlatID(db, params) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM bills WHERE flatID = ?', params, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    }

    getBillByBillID(db, params) {
        return new Promise((resolve, reject) => {
            db.query('SELECT name, DATE_FORMAT(due, "%d %M %Y") date, amount FROM bills WHERE billID = ?', params, (err, data) => {
                if (err) {
                    reject(err)
                }
                if (data && data.length === 1) {
                    resolve(data[0])
                }
            })
        })
    }

    getMembersAndBillStatusesByFlatIDAndBillID(db, params) {
        return new Promise((resolve, reject) => {
            db.query('SELECT email, fname, status FROM users INNER JOIN bill_status ON users.email=bill_status.userEmail WHERE flatID = ? AND billID = ?', params, (err, data) => {
                if (err) {
                    reject(err)
                }
                if (data && data.length > 0){
                    resolve(data)
                } else {
                    reject("No bill status information")
                }
            })
        })
    }

    getBillInfo(db, billID, flatID, is_manager, userFName) {
        return new Promise((resolve, reject) => {
            this.getMembersAndBillStatusesByFlatIDAndBillID(db, [flatID, billID])
                .then(members => {
                    this.getBillByBillID(db, [billID])
                        .then(bill => {
                            let status = members.find(member => { return member.fname === userFName}).status
                            if (is_manager) {
                                let membersInfo = []
                                members.forEach(member => {
                                    membersInfo.push({
                                        email: member.email,
                                        name: member.fname,
                                        amount: +((bill.amount / members.length).toFixed(2)),
                                        status: member.status
                                    })
                                })
                                resolve({
                                    billID: billID,
                                    name: bill.name,
                                    due: bill.date,
                                    amount: bill.amount,
                                    members: membersInfo,
                                    status: status
                                })
                            } else {
                                resolve({
                                    billID: billID,
                                    name: bill.name,
                                    due: bill.date,
                                    amount: +((bill.amount / members.length).toFixed(2)),
                                    members: [],
                                    status: status
                                })
                            }
                        })
                        .catch(err => {
                            reject(err)
                        })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    getAllBillsInfo(db, flatID, is_manager, userFName) {
        return new Promise((resolve, reject) => {
            this.getBillsByFlatID(db, [flatID])
                .then(bills => {
                    let allBillsInfo = []
                    let forEachPromise = new Promise((res, rej) => {
                        bills.forEach(bill => {
                            this.getBillInfo(db, bill.billID, flatID, is_manager, userFName)
                                .then(billInfo => { 
                                    allBillsInfo.push(billInfo)
                                    if (allBillsInfo.length === bills.length) {
                                        res()
                                    }
                                })
                                .catch(err => {
                                    rej(err)
                                })
                        })
                    })
                    forEachPromise.then(() => {
                        resolve(allBillsInfo)
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    billInfo(app, db) {
        app.post('/billInfo', (req, res) => {
            let flatID = req.body.flatCode
            let is_manager = req.body.isManager
            let userFName = req.body.firstName

            this.getAllBillsInfo(db, flatID, is_manager, userFName)
                .then(billsInfo => {
                    res.json({
                        success: true,
                        billsInfo: billsInfo
                    })
                })
                .catch(err => {
                    res.json({
                        success: false,
                        msg: "Could not get bill info: " + err
                    })
                })
        })
    }

    getMemberEmailsByFlatID(db, params) {
        return new Promise((resolve, reject) => {
            db.query('SELECT email FROM users WHERE flatID = ?', params, (err, data) => {
                if (err) {
                    reject(err)
                }
                if (data && data.length > 0) {
                    resolve(data)
                } else {
                    reject("No member information")
                }
            })
        })
    }

    getFlatIDByUserEmail(db, params) {
        return new Promise((resolve, reject) => {
            db.query('SELECT flatID FROM users WHERE email = ? LIMIT 1', params, (err, data) => {
                if (err) {
                    reject(err)
                }
                if (data && data.length === 1) {
                    resolve(data[0].flatID)
                } else {
                    reject("Could not get flatID")
                }
            })
        })
    }

    createBill(db, params) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO bills VALUES (null, ?, ?, ?, ?)', params, (err) => {
                if (err) {
                    reject(err)
                }
                db.query('SELECT LAST_INSERT_ID()', (err, data) => {
                    if (err) {
                        reject(err)
                    }
                    if (data && data.length === 1) {
                        resolve(data[0]["LAST_INSERT_ID()"])
                    } else {
                        reject("Could not get last insert ID")
                    }
                })
            })
        })
    }

    createStatusesForNewBill(db, billID, flatID) {
        return new Promise((resolve, reject) => {
            this.getMemberEmailsByFlatID(db, [flatID])
                .then(userEmails => {
                    userEmails.forEach(userEmail => {
                        db.query('INSERT INTO bill_status VALUES (null, ?, ?, "due")', [billID, userEmail.email], (err) => {
                            if (err) {
                                reject(err)
                            }
                        })
                    })
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    createBill(app, db) {
        app.post('/createBill', (req, res) => {
            let params = [
                req.body.billName,
                req.body.billDate,
                req.body.billAmount
            ]
            let userEmail = req.session.email
            this.getFlatIDByUserEmail(db, [userEmail])
                .then(flatID => {
                    params.push(flatID)
                    this.createBill(db, params)
                        .then(billID => {
                            this.createStatusesForNewBill(db, billID, flatID)
                                .then(() => {
                                    res.json({
                                        success: true,
                                        billName: params[0],
                                        billDate: params[1],
                                        billAmount: params[2],
                                        billID: billID
                                    })
                                })
                                .catch(err => {
                                    res.json({
                                        success: false,
                                        msg: "Could not create statuses: " + err
                                    })
                                })
                        })
                        .catch(err => {
                            res.json({
                                success: false,
                                msg: "Could not create bill: " + err.message
                            })
                        })
                })
                .catch(err => {
                    res.json({
                        success: false,
                        msg: "Could not get flatID"
                    })
                })
        })
    }

    updateBillStatusByBillIDAndUserEmail(db, params) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE bill_status SET status = ? WHERE billID = ? AND userEmail = ?', params, (err) => {
                if (err) {
                    reject(err)
                }
                resolve()
            })
        })
    }

    updateBillStatus(app, db) {
        app.post('/updateBillStatus', (req, res) => {
            let billID = req.body.billID
            let userEmail = req.body.userEmail
            let newStatus = req.body.newStatus

            this.updateBillStatusByBillIDAndUserEmail(db, [newStatus, billID, userEmail])
                .then(() => {
                    res.json({
                        success: true,
                        newStatus: newStatus
                    })
                })
                .catch(err => {
                    res.json({
                        success: false,
                        msg: "Could not update bill: " + err
                    })
                })
        })
    }
}

module.exports = Router;