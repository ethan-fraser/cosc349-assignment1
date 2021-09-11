# EmailServer Documentation

## Contents
- [Overview](#overview)
- [Making Changes](#making-changes)

---

## Overview
This VM handles the email notification system for the website. It consists of a Node.js script that is run once daily through the use of [cron](https://en.wikipedia.org/wiki/Cron). The script uses the nodemailer package to send emails, and axios to communicate with the DBServer. (Refer to https://nodemailer.com/about/ and https://axios-http.com/docs/intro for full documentation on these packages).

A request is made to the DBServer API's `/getDueBills` endpoint, which responds with information about users and the bills that are stored under their name which are due on the current date. The script loops through the response data and fills out an HTML template with their data, before sending them an email with the generated HTML as the body.

The original idea was to have this VM set up as an SMTP server to distribute email notifications, but due to time limitations and the complexity of setting up such a server, we were not able to do this.

**NB**: if you do not have the correct `.env` file in the root of the `emailserver` directory, the script will fail. Please contact one of the developers if you need this file.

## Making Changes
The entirety of the functionality for this VM is contained in `sendEmails.js`. Making changes to the HTML template requires editing the template string in this file. Refer to the [axios](https://axios-http.com/docs/intro) and [nodemailer](https://nodemailer.com/about/) documentation for information about how to alter the logic of the script.

Unlike the WebServer and DBServer, there is no `restart` provisioner for this VM. Once changes have been made to the source code, run `vagrant provision emailserver` to have them take effect (assuming the VM is already up).