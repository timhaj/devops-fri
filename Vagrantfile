# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # Use Ubuntu 22.04 LTS
  config.vm.box = "ubuntu/jammy64"

  # Forward port 8080
  config.vm.network "forwarded_port", guest: 8080, host: 8080

  # Provision VM
  config.vm.provision "shell", inline: <<-SHELL
    # Update system and install prerequisites
    sudo apt-get update
    sudo apt-get install -y curl build-essential

    # Install Node.js LTS
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # Install global http-server
    sudo npm install -g http-server

    # Navigate to synced folder
    cd /vagrant

    # Install project dependencies
    npm install express cors web3 body-parser dotenv

    # Create systemd service for http-server
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

    # Reload systemd, enable and start service
    sudo systemctl daemon-reload
    sudo systemctl enable http-server
    sudo systemctl start http-server
  SHELL
end