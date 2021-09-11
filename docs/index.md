# Project Documentation

## Contents
- [Running the Project](#running-the-project)
    - [Requirements](#requirements)
    - [Running the Servers](#running-the-servers)
    - [Restarting the Servers](#restarting-the-servers)
    - [Shutting down the servers](#shutting-down-the-servers)
- [Components](#components)
    - [Vagrantfile](#vagrantfile)
    - [Webserver](#webserver)
    - [DBServer](#dbserver)
    - [EmailServer](#emailserver)

---

## Running the Project
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
- *Firefox*\
    For now, Flatbills is only compatible with the Firefox browser. Download [here](https://www.mozilla.org/en-GB/firefox/browsers/) for all operating systems.

### Running the Servers
- *Clone the repository*\
    `git clone https://github.com/ethan-fraser/cosc349-assignment1.git`
- *cd into the resulting directory*\
    `cd cosc349-assignment1`
- *Bring the VMs up*\
    `vagrant up`
- Navigate to http://192.168.2.11:3000/
### Restarting the Servers
Once you have made changes to the source and you want to update the servers, run the following command:
`vagrant provision <server_name> --provision-with restart`
### Shutting down the Servers
You can shut down all of the servers with the command `vagrant destroy`. If you want to shut down just one of the servers you can specify the name, e.g. `vagrant destroy webserver`. After doing this, the machine's state will be completely lost, and you will need to `vagrant up` the machine again.
## Components

### Vagrantfile
The Vagrantfile manages the creation and provisioning of each of the servers. For more information, see [here](./vagrantfile.md).

### Webserver
The webserver hosts the front end of the website. It is a React.js project being served using Express.js. For more information on the webserver, see [here](./webserver/index.md)

### DBServer
The dbserver runs the MySQL database and the Express.js API that the webserver uses to interface with it. For more information on the dbserver, see [here](./dbserver/index.md).

### EmailServer
The emailserver uses cron to run a Node.js script once daily to send email notifications to users about the bills they have due on that day. For more information on the emailserver, see [here](./emailserver/index.md)
