#!/usr/bin/env node --use_strict

var mdns = require('multicast-dns')()
var dns = require('dns');
var os = require('os');
var fs = require('fs');

// Config

var mdns_hosts = process.env.HOME + "/.mdns-hosts";
let interval = 60;

// Get hostnames

let hosts = fs.readFileSync(mdns_hosts, { encoding: 'utf-8' });

// console.log(hosts);

let hostnames = hosts.split("\n")
  .map(name => name.replace(/\#.*/, '')) // Remove comments
  .map(name => name.trim()) // Trim lines
  .filter(name => name.length > 0);  // Remove empty lines

console.log("Serving hostnames:", hostnames.join(', '));

// Get our ip

let ip;

function getMyIp() {
  let hostname = os.hostname();

  dns.lookup(hostname, (err, addr, fam) => {
    if(ip !== addr) {
      console.log('addr: ', addr);
      ip = addr;
    }
  });
}

getMyIp();

setInterval(() => {
  getMyIp();
}, interval * 1000);

// Wait and respond to queries

mdns.on('query', function(query) {
  // console.log('got a query packet:', query)

  if (query.questions[0] && query.questions[0].type === 'A') {
    let name = query.questions[0].name;

    if(hostnames.indexOf(name) >= 0) {
      console.log(name, ' => ', ip);
      mdns.respond([{ name: name, type:'A', data: ip, ttl: 120 }]);
    }
  }
})

// Testing


// mdns.on('response', function(response) {
//   console.log('got a response packet:', response)
// })

// lets query for an A record
// mdns.query({
//   questions:[{
//     name: 'myhost.local',
//     type: 'A'
//   }]
// })
