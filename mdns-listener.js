#!/usr/bin/env node --use_strict

const mdns = require('multicast-dns')()
const dns = require('dns');
const os = require('os');
const fs = require('fs');

// Config

const mdns_hosts = process.env.HOME + "/.mdns-hosts";
const interval = 60;

// Set process name

process.title = process.title = 'mdns-listener';

// Get hostnames

const hosts = fs.readFileSync(mdns_hosts, { encoding: 'utf-8' });

// console.log(hosts);

const hostnames = hosts.split("\n")
  .map(name => name.replace(/\#.*/, '')) // Remove comments
  .map(name => name.trim()) // Trim lines
  .filter(name => name.length > 0);  // Remove empty lines

console.log("Serving hostnames:", hostnames.join(', '));

// Get our ip

var ip;

function getMyIp() {
  const hostname = os.hostname();

  dns.lookup(hostname, (err, addr, fam) => {
    if(ip !== addr) {
      console.log('addr: ', addr);
      ip = addr;
    }
  });
}

getMyIp();

setInterval(getMyIp, interval * 1000);

// Wait and respond to queries

mdns.on('query', function(query) {
  // console.log('got a query packet:', query)

  const questions = query.questions;

  if(questions) {
    questions.forEach(question => {
      const { name, type } = question;

      if(type === 'A' && hostnames.indexOf(name) >= 0) {
        console.log(name, ' => ', ip);
        mdns.respond([{ name: name, type:'A', data: ip, ttl: 120 }]); // Seconds
      }
    });
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
