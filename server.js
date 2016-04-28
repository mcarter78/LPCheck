var express = require('express');
var app = express();
var port = process.env.PORT || 1337;

app.use(express.static(__dirname + '/dist'));

app.get('/', function(req, res) {
  res.send('hello world');
});

app.listen(port, function() {
  console.log('app listening on port:', port);
});
