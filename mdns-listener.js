#!/usr/bin/env node --use_strict

const mdns = require('multicast-dns')()
const os = require('os');
const fs = require('fs');

// Config

const mdns_hosts = process.env.HOME + "/.mdns-hosts";


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


// Get our hostname

let hostname = os.hostname();

if(hostname.indexOf('.') >= 0) {
  hostname = hostname.split('.')[0];
}
hostname += '.local';

console.log('hostname:', hostname);


// Wait and respond to queries

mdns.on('query', function(query) {
  // console.log('query:', query);

  const questions = query.questions;

  if(questions) {
    questions.forEach(question => {
      const { name, type } = question;

      if(type === 'A' && hostnames.indexOf(name) >= 0) {
        console.log(name, ' => ', hostname, ' [CNAME]');
        mdns.respond([{ name: name, type:'CNAME', data: hostname, ttl: 120 }]); // Seconds
      }
    });
  }

});

mdns.respond([{ name: 'nena.local', type:'CNAME', data: hostname, ttl: 120 }]); // Seconds


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
