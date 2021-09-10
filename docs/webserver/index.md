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

### UserStore.js
_This is found in webserver/src/stores._

### Main Pages
_These are found in webserver/src/pages._

##### Login
This is the default page that http://192.168.2.11:3000/ directs to. It uses the Input Field and Submit Button utility components. As will be explained in the section for the Submit Button utility component, an API call will be made to the database to check the user input against the database records. If there is a match, the user will be logged in.

##### Register
This page uses the Input Field and Submit Button utilty components. By default, the flat code input field will be displayed to add the user to an existing flat, however if it is a flat manager registering, clicking the checkbox will display the flat name input field. When the Next button is pressed, `doNext()` will be called which will send all the user input to the database and populate it with the new record.

##### Dashboard
This page is the highlight of the flatbills application. It is where the bulk of activity happens. The top left of the dashboard displays a welcome message and the flat code while the top right of the dashboard displays a bill summary tab. The flat manager's dashboard also has an "Add a new bill" button as only the manager has this authority. The flat member's summary tab also has a pending status as its payments need to be verified by the flat manager before being marked as paid.\

When there are no bill cards added, the 

##### Service Form

### Utility Components
_These are found in webserver/src/components._

##### Input Field
This is used in all the forms ie login page, register page, and service form. When clicked, it will call `setInputValue()` which will replace the placeholder text with the user input.

##### Submit Button
This is used in all the forms ie login page, register page, and service form. When clicked, it will call its corresponding function which will make some API calls. For example, for the Login button on the Login page, `doLogin()` will be called which will check the submitted email and password against the dbserver records to see if they exist. If they do, then the database will set the user to be logged in.

##### Bill Card
This is the main component used on the dashboard. It displays the name of the bill, the amount, the due date, the name of the person who needs to pay it, and the payment status ie `pay`, `paid`, `pending`, `verify`, and `due`.
1. Flow of bill statusses for flat manager - When a bill card is first added, the default status is `pay`. Once the flat manager clicks `pay`, the status turns to `paid`.
2. Flow of bill statusses for flat member - When a bill card is first added, the default status is also `pay`. Once the flat member clicks `pay`, the status turns to `pending`. On the flat manager's dashboard, the flat member's bill status will change from the default `due` to `verify`. Once the flat manager has checked his/ her bank account to make sure the flat member has indeed paid the bill, the flat manager will click `verify`, which will change the bill status on both the flat manager and flat member's dashboards to `paid`.
