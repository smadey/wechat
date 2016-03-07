var express = require('express');
var wechat = require('wechat');

var config = require('./config');
var handler = require('./handler');

var app = express();

var port = config.port;

app.set('port', port);
app.use(express.query());
app.use('/msg',
  wechat({
    appid: config.appid,
    token: config.token,
    encodingAESKey: config.encodingAESKey
  }, handler)
)

app.listen(port, function () {
  console.log('Express server listening on port ' + port);
});

module.exports = app;
