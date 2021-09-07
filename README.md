# COSC349 Cloud Computing Architecture (2021 Sem 2)

Project name: Flatbills

Group members: Ethan Fraser and Magdeline Huang

For full documentation, see the [docs](./docs/index.md) directory.

## Project Description 📃
Flatbills is a platform for flats to manage their bill payments. There are two types of users - flat managers and flat members.
1. Flat managers - Users who are responsible for managing the flat members' payments of their bill portions.
2. Flat members - Regular users who just pay their bill portions.

This project runs on 3 virtual machines:
1. 192.168.2.11 - This hosts webserver which is a web interface for users to interact with the platform.
2. 192.168.2.12 - This hosts dbserver which is a database that stores all the records of the users.
3. xxx - This hosts the email server which sends email notifications to users on the due date of the bill payments.

The tech stack varies for both webserver and dbserver:
1. webserver - It is a React.js project being served using Express.js. It uses Tailwind CSS for styling. For more information, see [here](./webserver/index.md).
2. dbserver - It runs the MySQL database and the Express.js API that the webserver uses to interface with it. For more information, see [here](./dbserver/index.md).\
They both use Node.js

- [ ] Design of application\
- [ ] How they interact

## Project Demo 💡

### Screenshots

### Screen recording

## Running the Project 🏃

### Requirements
- *VirtualBox (v6.1.x)*\
https://www.virtualbox.org/wiki/Downloads
- *Vagrant (v2.2.x)*
    - **MacOS**\
    `brew install vagrant`
    - **Linux**\
    Download and install from https://www.vagrantup.com/downloads, or install with your distro's package manager.
    - **Windows**\
    Download and install from https://www.vagrantup.com/downloads.
- *Enable virtualisation on your computer*
    - **MacOS** and **Linux**\
    Should have virtualisation enabled by default
    - **Windows**\
    Does not have virtualisation enabled by default. To enable, see [here](https://www.youtube.com/watch?v=MOuTxfzCvMY)

### Running the servers
- *Clone the repository*\
    `git clone https://github.com/ethan-fraser/cosc349-assignment1.git`
- *cd into the resulting directory*\
    `cd cosc349-assignment1`
- *Bring the VMs up*\
    `vagrant up`
- Navigate to http://192.168.2.11:3000/ (192.168.2.11 is the IP address of the webserver and 3000 is React's default port number)

### Restarting the servers
Once you have made changes to the source and you want to update the servers, run the following command:
`vagrant provision <server_name> --provision-with restart`
