#!/bin/bash

if [ $1 = "webserver" ];
then
function webserver_setup() {
    sudo kill -9 $(pgrep node)
    source $HOME/.nvm/nvm.sh
    cd /vagrant
    npm install
    #npm run build
    npm run start #-prod
    echo "webserver running"
}
vagrant ssh webserver -c "$(typeset -f); webserver_setup"
else
function dbserver_setup() {
    sudo kill -9 $(pgrep node)
    source $HOME/.nvm/nvm.sh
    cd /vagrant
    npm install
    npm run start
    echo "dbserver running"
}
vagrant ssh dbserver -c "$(typeset -f); dbserver_setup"
fi