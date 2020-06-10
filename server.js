var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/waitercaller', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
  });

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
