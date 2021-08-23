# Vagrantfile Documentation

## Contents
- [Overview](#overview)
- [Webserver Configuration](#webserver-configuration)
- [DBServer Configuration](#dbserver-configuration)
- [Making Changes](#making-changes)

---

## Overview
The Vagrantfile in the root of the project directory manages the virtual machines that run each of the two (will be three) servers. The main parts of the script are as follows:
    
1. `config.vm.box = "ubuntu/xenial64"` defines the box to use as the base OS for each of the servers. We use Ubuntu 16.04 LTS (Xenial Xerus), as reccomended in the 349 labs.
2. `config.vm.define "webserver" do |webserver|` is the configuration for the webserver VM.
3. `config.vm.define "dbserver" do |dbserver|` is the configuration for the database server VM.

## Webserver Configuration
> For detailed information about the webserver, see its documentation, [here](./webserver/index.md)

The webserver is configured
- to be accessed on the private network address 192.168.2.11
- to forward its port 3000 to the host machine's port 8080. The webserver runs on port 3000, so this allows the site to be accessed from the host machine via http://localhost:8080 as well as the default http://192.168.2.11:3000 when running. This functionality can later be used to allow public access to the site by forwarding to port 80 of an AWS EC2 machine for instance.
- to allow the host's `./webserver` directory be accessed at `/vagrant` on the guest machine.

The webserver has two provision scripts. The first one handles package updates and the installation of Node.js, and is run just once at the time of the VM's inception. The second script builds the project files and runs the server. It is run on creation of the VM, but can be used again once the server is running to rebuild and restart the server, without tearing down the whole virtual machine. This is done by running\
`vagrant provision webserver --provision-with restart`

## DBServer Configuration
> For detailed information about the dbserver, see its documentation, [here](./dbserver/index.md)

The database server is configured
- to be accessed on the private network address 192.168.2.12
- to allow the host's `./dbserver` directory be accessed at `/vagrant` on the guest machine.

The dbserver has three provision scripts. The first of these handles package updates, and installs and configures MySQL. The second handles the installation of Node.js. These two are separate because MySQL needs to be installed and configured with root permissions, while Node.js reccomends installation by a non-root user. For this reason there is the `privileged: false` parameter on the second script but not the first. Each of these scripts is run only once at the time of the VM's inception. The third provision script runs the server. It is run once when the machine is created, but can be manually invoked at a later point in order to restart the server without tearing down the whole machine. This is done by running\
`vagrant provision dbserver --provision-with restart`

## Making Changes
The Vagrantfile is a Ruby script. If you wish to change some functionality of the Vagrantfile, it can be edited in place and the changes will be employed next time you run `vagrant up`.

For more information about the capabilities and usage of the Vagrantfile and provisioning scripts, see https://www.vagrantup.com/docs/vagrantfile and https://www.vagrantup.com/docs/provisioning.