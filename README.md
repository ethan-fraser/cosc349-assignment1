# COSC349 Cloud Computing Architecture (2021 Sem 2)

For full documentation, see the [docs](./docs/index.md) directory.

## Running the project 🏃

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

### Running the servers
- *Clone the repository*\
    `git clone https://github.com/ethan-fraser/cosc349-assignment1.git`
- *cd into the resulting directory*\
    `cd cosc349-assignment1`
- *Bring the VMs up*\
    For now, you will need to bring up each server in a separate terminal window. We'll address this later.
    ```shell
    # terminal 1
    vagrant up webserver

    # terminal 2
    vagrant up dbserver
    ```
- Navigate to http://192.168.2.11:3000/ (192.168.2.11 is the IP address of the webserver and 3000 is React's default port number)

### Restarting the servers
Once you have made changes to the source and you want to update the servers, run the following command:
`vagrant provision <server_name> --provision-with restart`

## Webserver Prototype 🎨
Click on this [link](https://www.figma.com/proto/dCuyr7IzSFl7IAJ5QDOpDg/349-Assignment-1?node-id=29%3A1382&scaling=scale-down&page-id=0%3A1&starting-point-node-id=29%3A923&show-proto-sidebar=1) to view the UI for the webserver.

## Assignment Info 📝

### Submission Information
Due date: Monday, 6th September 2021, at 11:59 PM  
Weight: This assignment is worth 20% of the mark for the paper

### Description
For this assignment, you should design and develop an application whose deployment relies on virtualisation. Your application should operate through coordination of at least **three** different virtual machines (VMs). One of your VMs should be responsible for **data storage** that is important to your application.

However, this assignment is not focused on the functionality of your application: the assignment is focused on how you **build** your application, and in particular how you **facilitate other developers** potentially modifying, (re)building and running your application. Your use of virtualisation should allow a developer to build and run your application even if they check out your project’s git repository on a different host operating system from yours.
