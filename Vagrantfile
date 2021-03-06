# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

    config.vm.box = "ubuntu/xenial64"

    config.vm.define "webserver" do |webserver|
        webserver.vm.hostname = "webserver"
        webserver.vm.network "forwarded_port", guest: 3000, host: 8080, host_ip: "127.0.0.1"
        webserver.vm.network "private_network", ip: "192.168.2.11"
        webserver.vm.synced_folder "./webserver", "/vagrant", owner: "vagrant", group: "vagrant", mount_options: ["dmode=775,fmode=777"]
        webserver.vm.provision "shell", privileged: false, inline: <<-SHELL
            # update
            sudo apt-get update

            # install node
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
            source ~/.nvm/nvm.sh
            nvm install --lts

            # install dependencies and run server
            cd /vagrant 
            npm install
            npm run build
            npm install -g forever
            forever start -o /vagrant/out.log -e /vagrant/error.log /vagrant/main.js
        SHELL
        webserver.vm.provision "restart", type: "shell", privileged: false, run: "never", inline: <<-SHELL
            cd /vagrant
            source ~/.nvm/nvm.sh
            npm run build
            forever restart  -o /vagrant/out.log -e /vagrant/error.log /vagrant/main.js
        SHELL
    end

    config.vm.define "dbserver" do |dbserver|
        dbserver.vm.hostname = "dbserver"
        dbserver.vm.network "private_network", ip: "192.168.2.12"
        dbserver.vm.synced_folder "./dbserver", "/vagrant", owner: "vagrant", group: "vagrant", mount_options: ["dmode=775,fmode=777"]
        dbserver.vm.provision "shell", inline: <<-SHELL
            # update
            sudo apt-get update

            # configure password
            export MYSQL_PWD='password'
            echo "mysql-server mysql-server/root_password password $MYSQL_PWD" | debconf-set-selections 
            echo "mysql-server mysql-server/root_password_again password $MYSQL_PWD" | debconf-set-selections

            # install mysql
            sudo apt-get -y install mysql-server

            # create database
            echo "CREATE DATABASE IF NOT EXISTS dbserver;" | mysql

            # create user and grant privileges
            echo "CREATE USER IF NOT EXISTS 'webuser'@'%' IDENTIFIED BY 'password';" | mysql
            echo "GRANT ALL PRIVILEGES ON dbserver.* TO 'webuser'@'%'" | mysql

            export MYSQL_PWD='password'

            # run setup script for database
            cat /vagrant/setup-database.sql | mysql -u webuser dbserver
        SHELL
        dbserver.vm.provision "shell", privileged: false, inline: <<-SHELL
            # install node
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
            source ~/.nvm/nvm.sh
            nvm install --lts

            kill -9 $(pgrep node) # to ensure port is not being used on provision again

            # install dependencies and run server
            cd /vagrant
            npm install
            npm install -g forever
            forever start -o /vagrant/out.log -e /vagrant/error.log /vagrant/server.js
        SHELL
        dbserver.vm.provision "restart", type: "shell", privileged: false, run: "never", inline: <<-SHELL
            cd /vagrant
            source ~/.nvm/nvm.sh
            forever restart -o /vagrant/out.log -e /vagrant/error.log /vagrant/server.js
        SHELL
    end

    config.vm.define "emailserver" do |emailserver|
        emailserver.vm.hostname = "emailserver"
        emailserver.vm.network "private_network", ip: "192.168.2.13"
        emailserver.vm.synced_folder "./emailserver", "/vagrant", owner: "vagrant", group: "vagrant", mount_options: ["dmode=775,fmode=777"]
        emailserver.vm.provision "shell", privileged: false, inline: <<-SHELL
            # update
            sudo apt-get update
            # set timezone
            sudo timedatectl set-timezone Pacific/Auckland

            # install node
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
            source ~/.nvm/nvm.sh
            nvm install --lts

            # install dependencies
            cd /vagrant
            npm install

            # set up cron job to run the script every day at 7AM
            echo "0 7 * * * /vagrant/sendEmails.js >> /vagrant/out.log 2>&1" >> crontab_temp
            crontab crontab_temp
            rm crontab_temp
        SHELL
    end
end
