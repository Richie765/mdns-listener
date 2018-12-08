#!/usr/bin/env node --use_strict

const mdns = require('multicast-dns')()

// Set process name

process.title = process.title = 'mdns-monitor';


mdns.on('query', function(query) {
  console.log('query:', query);

  const { questions } = query;

  if(questions) {
    questions.forEach(question => {
      const { name, type } = question;

      if (type ==='PTR') return;
      if (type ==='TXT') return;
      console.log(`question: ${ name } [${ type }]`);
    });
  }
  else {
    console.log('query:', query);
  }
});

mdns.on('response', function(response) {
  // console.log('response:', response);

  const { answers } = response;

  if(answers) {
    answers.forEach(answer => {
      const { name, type, data } = answer;

      if (type ==='PTR') return;
      if (type ==='TXT') return;
      console.log(`answer: ${ name } [${ type }] => ${ data }`);
    });
  }
  else {
    console.log('response:', response);
  }
});
