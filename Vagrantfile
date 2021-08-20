# -*- mode: ruby -*-
# vi: set ft=ruby :

# A Vagrantfile to set up two VMs, a webserver and a database server,
# connected together using an internal network with manually-assigned
# IP addresses for the VMs.

Vagrant.configure("2") do |config|

    config.vm.box = "ubuntu/xenial64"

    config.vm.define "webserver" do |webserver|
      webserver.vm.hostname = "webserver"
      webserver.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"
      webserver.vm.network "private_network", ip: "192.168.2.11"
      webserver.vm.synced_folder "./webserver", "/vagrant", owner: "vagrant", group: "vagrant", mount_options: ["dmode=775,fmode=777"]
      webserver.vm.provision "shell", inline: <<-SHELL
        # update and copy files
        sudo apt-get update

        # install node
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
        source ~/.nvm/nvm.sh
        nvm install --lts
    
        # install dependencies and run frontend server
        cd /vagrant
        npm install
        npm start
      SHELL
    end
  
    config.vm.define "dbserver" do |dbserver|
      dbserver.vm.hostname = "dbserver"
      dbserver.vm.network "private_network", ip: "192.168.2.12"
      dbserver.vm.synced_folder "./dbserver", "/vagrant", owner: "vagrant", group: "vagrant", mount_options: ["dmode=775,fmode=777"]
      dbserver.vm.provision "shell", inline: <<-SHELL
        # update and copy files
        apt-get update
        
        # configure password
        export MYSQL_PWD='insecure_mysqlroot_pw'
        echo "mysql-server mysql-server/root_password password $MYSQL_PWD" | debconf-set-selections 
        echo "mysql-server mysql-server/root_password_again password $MYSQL_PWD" | debconf-set-selections

        # install mysql
        apt-get -y install mysql-server

        # create database
        echo "CREATE DATABASE IF NOT EXISTS dbserver;" | mysql

        # create user and grant privileges
        echo "CREATE USER IF NOT EXISTS 'webuser'@'%' IDENTIFIED BY 'password';" | mysql
        echo "GRANT ALL PRIVILEGES ON dbserver.* TO 'webuser'@'%'" | mysql
        
        export MYSQL_PWD='password'

        # run setup script for database
        cat /vagrant/setup-database.sql | mysql -u webuser dbserver

        # install node
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
        source ~/.nvm/nvm.sh
        nvm install --lts

        # install dependencies and run api server
        cd /vagrant
        npm install
        npm start
        
      SHELL
    end
  
  end
  