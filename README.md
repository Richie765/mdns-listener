# mDNS Listener

Simple mDNS Listener to add .local hostnames to your machine

This script is tested on Linux and macOS. It should work on Windows as well.


## Configuration
Create a file named `/etc/hosts.mdns`, place hostnames ending with `.local` on separate lines like so:

```
myhost1.local
myhost2.local
```

Whenever you change this file, you should restart the service.


## Installation

```bash
git clone https://github.com/Richie765/mdns-listener
cd mdns-listener
npm install
```


## Running manually

Just run
```bash
node mdns-listener.js
```

## Automatic startup on boot (Linux, systemd)
```bash
cp mdns-listener.service-sample mdns-listener.service

# edit mdns-listener.service to mathch the paths on your system

sudo cp mdns-listener.service /etc/systemd/system

systemctl enable mdns-listener
systemctl start mdns-listener
journalctl -u mdns-listener.service
```



## Automatic startup on login (macOS)

```bash
cp mdns-listener.plist-sample mdns-listener.plist

# edit mdns-listener.plist to match the paths on your system

cp mdns-listener.plist ~/Library/LaunchAgents/

launchctl load ~/Library/LaunchAgents/mdns-listener.plist
```

Logfiles are available in
* /tmp/mdns-listener-error.log
* /tmp/mdns-listener.log


## Version History
1.0
* Initial version

1.1
* Fixed bug where certain requests wouldn't be answered (especially if they came from iOS)
* Respond with CNAME instead of A (works better when you have multiple interfaces)
* Changed path to hosts file to /etc/hosts.mdns
* Added Windows compatability (not tested) - will read hosts.mdns from current directory
* Added monitor.js, used for debugging and testing
* Added Linux systemd auto start on boot