const fetch = require('node-fetch');
const http = require('http');

const server = http.createServer((req, res) => {
  let body = '';

  req.on('data', function(data) {
    body += data;
  });

  req.on('end', function() {
    let parsed_body = JSON.parse(body);

    if (parsed_body.auth_token !== process.env.AUTH_KEY) {
      res.writeHeader(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({'success': false}));
    }

    let post_body = {
      profile: {
        status_emoji: parsed_body.icon,
        status_expiration: 0
      }
    };

    fetch('https://slack.com/api/users.profile.set', {
      method: 'post',
      body: JSON.stringify(post_body),
      headers: {
        'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
        'Content-type': 'application/json; charset=utf-8'
      }
    })
    .then(response => response.json())
    .then(response => {
      res.writeHeader(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({'success': true}));
    })
    .catch(err => {
      res.writeHeader(500, { "Content-Type": "application/json" });
      res.end(err);
    });
  });
});

server.listen();