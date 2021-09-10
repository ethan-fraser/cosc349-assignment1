# Webserver Documentation

## Contents
- [Overview](#overview)
- [Running the webserver locally](#running-the-webserver-locally)
- [Prototype](#prototype)
- [Components](#components)

---

## Overview
The purpose of the webserver is to provide a frontend interface for users to interact with the platform. It is built with React and uses Tailwind CSS for styling. 

## Running the webserver locally
The webserver can be run locally without running `vagrant up` with this command: `npm run start`. However it will not be connected to the database in dbserver hence there will be no functionality. You may want to run it locally if you want to do basic UI fixes.

## Prototype
Before coding the webserver frontend, a mockup was made on Figma. It is important to note that there are slight variations (eg different colours, different positioning of elements, different sizing etc) in this mockup compared to the final UI because improvements were made as the mockup was being coded.
- Click [here](https://www.figma.com/proto/dCuyr7IzSFl7IAJ5QDOpDg/349-Assignment-1?node-id=29%3A1382&scaling=scale-down&page-id=0%3A1&starting-point-node-id=29%3A923&show-proto-sidebar=1) to view the prototype for the UI
- Click [here](./Webserver%20UI.pdf) to view a PDF of the individual frames of the mockup

## Components

### Routes.js
_This is found in webserver/src._

This file is responsible for the routing of the webserver pages. It associates the various path names with the corresponding main page. If the user is logged in, the root path will bring the user to the dashboard. If not, it will bring the user to the login page.

### UserStore.js
_This is found in webserver/src/stores._

This file stores properties relevant to the user ie whether or not they are logged in, first name, last name, email, flat name, flat code, and whether or not they are a manager.

### Main Pages
_These are found in webserver/src/pages._

##### Login
This is the default page that http://192.168.2.11:3000/ directs to. It uses the Input Field and Submit Button utility components. As will be explained in the section for the Submit Button utility component, clicking on the Login button will make an API call to the database to check the user input against the database records. If there is a match, the user will be logged in.

##### Register
This page uses the Input Field and Submit Button utilty components. By default, the flat code input field will be displayed to add the user to an existing flat, however if it is a flat manager registering, clicking the checkbox will display the flat name input field. When the Next button is clicked, `doNext()` will be called which will send all the user input to the database and populate it with the new record.

##### Dashboard
This page is the highlight of the flatbills application. The top left of the dashboard displays a welcome message and the flat code while the top right of the dashboard displays a bill summary tab. The flat manager's dashboard also has an "Add a new bill" button as only the manager has this authority. The flat member's summary tab also has a pending status as its payments need to be verified by the flat manager before being marked as paid.

When no bill cards have been added yet, the bottom half of the dashboard will say "You have not added any bill cards." and will display an image. Otherwise, it will display the bill cards. The number of bill cards per row depends on the width of the screen. When the maximum width of the screen has been reached, the new bill cards will be added to the bottom row.

##### Bill Form
This page is a form for adding new bills. From the dashboard, clicking on the "Add a new bill" button will direct the user to this page. As mentioned in the Dashboard section, only the flat manager has this authority. The form asks for the bill name, bill amount, and due date. When the Done button is clicked, `doDone()` will be called which will send all the user input to the database and populate it with the new bill record. Clicking on the Cancel button directs the user back to the dashboard.

### Utility Components
_These are found in webserver/src/components._

##### Input Field
This is used in all the forms ie login page, register page, and bill form. When clicked, it will call `setInputValue()` which will replace the placeholder text with the user input.

##### Submit Button
This is used in all the forms ie login page, register page, and bill form. When clicked, it will call its corresponding function which will make some API calls. For example, for the Login button on the Login page, `doLogin()` will be called which will check the submitted email and password against the dbserver records to see if they exist. If they do, then the database will set the user to be logged in.

##### Bill Card
This is the main component used on the dashboard. It displays the name of the bill, the amount, the due date, the name of the person who needs to pay it, and the payment action/ status (payment actions are `pay` and `verify` which are buttons; payment statusses are `paid`, `pending`, `due`, and `overdue` which are regular text).
1. Flow of payment action/ status for __flat manager__ - When a bill card is first added, the default action is `pay`. Once the flat manager clicks `pay`, the status turns to `paid`. If a bill is overdue, the status is `overdue`.
2. Flow of payment action/ status for __flat member__ - When a bill card is first added, the default action is also `pay`. Once the flat member clicks `pay`, the status turns to `pending`. On the flat manager's dashboard, the flat member's bill status will change from the default `due` status to the `verify` action button. Once the flat manager has checked his/ her bank account to make sure the flat member has indeed paid the bill, the flat manager will click `verify`, which will change the bill status on both the flat manager and flat member's dashboards to `paid`. If a bill is overdue, the status is `overdue`.
