# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"

  config.vm.network "forwarded_port", guest: 8080, host: 8080  
  config.vm.network "forwarded_port", guest: 3000, host: 3000  

  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    sudo apt-get install -y curl build-essential

    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs

    sudo npm install -g http-server

    cd /vagrant

    npm install express cors web3 body-parser dotenv

    sudo bash -c 'cat > /etc/systemd/system/http-server.service <<EOF
[Unit]
Description=HTTP Server for Node.js Public Directory
After=network.target

[Service]
Type=simple
WorkingDirectory=/vagrant/public
ExecStart=/usr/bin/http-server -p 8080
Restart=always
User=vagrant
Environment=PATH=/usr/bin:/usr/local/bin

[Install]
WantedBy=multi-user.target
EOF'

    sudo systemctl daemon-reload
    sudo systemctl enable http-server
    sudo systemctl start http-server

    sudo bash -c 'cat > /etc/systemd/system/backend-server.service <<EOF
[Unit]
Description=Node.js Backend Server
After=network.target

[Service]
Type=simple
WorkingDirectory=/vagrant
ExecStart=/usr/bin/node /vagrant/backend-server.js
Restart=always
User=vagrant
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=development

[Install]
WantedBy=multi-user.target
EOF'

    sudo systemctl daemon-reload
    sudo systemctl enable backend-server
    sudo systemctl start backend-server
  SHELL
end