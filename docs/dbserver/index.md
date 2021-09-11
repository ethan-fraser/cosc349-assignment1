# DBServer Documentation

## Contents
- [Overview](#overview)
- [Database](#database)
- [Server](#server)
- [Routes](#routes)
    - [/login](#login)
    - [/logout](#logout)
    - [/isLoggedIn](#isloggedin)
    - [/registerUser](#registeruser)
    - [/billInfo](#billinfo)
    - [/createBill](#createbill)
    - [/updateBillStatus](#updatebillstatus)
    - [/getDueBills](#getduebills)
- [Making Changes](#making-changes)

---

## Overview
This VM handles the persistent data storage for the website. It is an Express.js powered API serving data from a MySQL database. By defualt, the server listens on port 3000 of the virtual machine.

**NB**: if you do not have the correct `.env` file in the root of the `dbserver` directory, the server will not run. Please contact one of the developers if you need this file.

## Database
The DBMS for the website is MySQL. The schemas can be found in [`setup-database.sql`](../../dbserver/setup-database.sql). (Note: the entity relationship diagram found in *planning.png* is out of date).

## Server
The server is an Express.js app being served on port 3000 of the VM. It maintains a connection to the database through the `mysql` Node package and also handles user sessions using the `express-session` package. (More information on these packages can be found in the npm repositories at https://www.npmjs.com/package/mysql and https://www.npmjs.com/package/express-session).

## Routes
The endpoints of the server are defined in `src/Router.js`, along with a number of utility functions.

All endpoints return a JSON object with a `success` field. On `success: true`, additional data may be included in the response body. On `success: false`, a `msg` field will be set with information about why the request failed.

#### /login
*Method: POST*

Logs in a user.

Requires `email` and `password` fields in the request body.

Returns`email`, `fname`, `lname`, `flatID`, `flatName` and `is_manager` fields on success.
#### /logout
*Method: POST*

Logs out the current logged in user.

Requires no information in the request body, but accesses the `email` field of the session data (`req.session.email`).

Returns no additional information on success.
#### /isLoggedIn
*Method: POST*

Checks whether there is active session data, and returns information about the user (`email`, `fname`, `lname`, `flatID`, `flatName` and `is_manager`) on success.
#### /registerUser
*Method: POST*

Creates a new entry in the *users* table.

Requires `email`, `password`, `firstName`, `lastName`, `isFlatManager`, `flatCode` and `flatName` fields in the request body.

Returns the same information as */login* and */isLoggedIn* on success.
#### /billInfo
*Method: POST*

Gets information about the bills associated with a user.

Requires `flatCode`, `isManager` and `firstName` fields in the request body.

Returns an array `billsInfo` that contains information for each bill about
- `billID` - Unique identifier
- `name` - Name of the bill (e.g. "Rent")
- `due` - Due date of the bill
- `amount` - Amount due. For flat managers this is the total amount, while for flat members it is the total amount divided by the number of members in their flat.
- `status` - Status of the bill (`due`, `pending`, `paid` or `overdue`) for the member or manager that made the request.
- `members` - Array of information specific to each member in the flat. This array will only be populated if `req.body.isManager` evaluates to true. Contains info about
    - `email`
    - `name` (of the member)
    - `amount`
    - `status`

#### /createBill
*Method: POST*

Creates a new entry in the *bills* and *bill_status* tables.

Requires `billName`, `billDate` and `billAmount` fields in the request body.

Returns `billID`, `billName`, `billDate` and `billAmount` on success.

#### /updateBillStatus
*Method: POST*

Updates the *bill_status* table for a specific bill and user.

Requires `billID`, `userEmail` and `newStatus` fields in the request body.

Returns `newStatus` on success.

#### /getDueBills
*Method: GET*

Gets information about bills that are due for every user in the database, for use in the EmailServer.

Returns a `dueBills` array on success, which is an array of JSON objects containing information for each user in the database, according to the following:
- `email`
- `firstName`
- `dueBills` - An array of JSON objects about the bills due for that user on the current day. Each object contains `name` and `amount` fields for that bill.

## Making Changes
Changes to the express, database and session configuration can be made in `server.js`. Changes to the API endpoints are made in `src/Router.js`. In the case that you are adding or removing an endpoint from the API, remember to add or remove the corresponding call in `Router`'s constructor.

Assuming the virtual machine is running, applying changes can be made by running `vagrant provision dbserver --provision-with restart`. Otherwise, the changes will be applied the next time you run `vagrant up [dbserver]`