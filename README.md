# mDNS Listener

Simple mDNS Listener to add .local hostnames to your machine

This script is tested on macOS.


## Configuration
Create a file named `~/.mdns-hosts`, place hostnames ending with `.local` on separate lines like so:

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


## Autmatic startup on login (macOS)

```bash
cp mdns-listener.plist-sample mdns-listener.plist

# edit mdns-listener.plist to match the paths on your system

cp mdns-listener.plist ~/Library/LaunchAgents/

launchctl load ~/Library/LaunchAgents/mdns-listener.plist
```

Logfiles are available in
* /tmp/mdns-listener-error.log
* /tmp/mdns-listener.log


## Package formats

Some notes that may be useful when changing the script.

QUERY from macOS
```javascript
{ id: 0,
  type: 'query',
  flags: 0,
  questions:
   [ { name: 'myhost.local', type: 'A', class: 1 },
     { name: 'myhost.local', type: 'AAAA', class: 1 } ],
  answers: [],
  authorities: [],
  additionals: [] }
```

RESPONSE from macOS
```javascript
{ id: 0,
  type: 'response',
  flags: 1024,
  questions: [],
  answers:
   [ { name: 'myhost.local',
       type: 'AAAA',
       class: 1,
       ttl: 120,
       flush: true,
       data: 'fe80::xxxx:xxxx:xxxx:xxxx' },
     { name: 'myhost.local',
       type: 'A',
       class: 1,
       ttl: 120,
       flush: true,
       data: '192.168.0.10' } ],
  authorities: [],
  additionals:
   [ { name: 'myhost.local',
       type: 'NSEC',
       class: 1,
       ttl: 120,
       flush: true,
       data: <Buffer ....> } ] }
```

RESPONSE from this script
```javascript
{ id: 0,
  type: 'response',
  flags: 0,
  questions: [],
  answers:
   [ { name: 'myhost.local',
       type: 'A',
       class: 1,
       ttl: 0,
       flush: false,
       data: '192.168.0.10' } ],
  authorities: [],
  additionals: [] }
```
