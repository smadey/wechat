var express = require('express');
var wechat = require('wechat');

var config = require('./config');

var app = express();

var port = config.port;
var wechatConfig = {
  appid: config.appid,
  token: config.token,
  encodingAESKey: config.encodingAESKey
};
var REG_QUERY = /^cx:(.+)/;

app.set('port', port);
app.use(express.query());
app.use('/msg',
  wechat(wechatConfig, function(req, res, next) {
    var msg = req.weixin;
    var match

    console.log(req);

    if (match = query(msg, REG_QUERY)) {
      res.reply('您查询的“' + match + '”的库存为：0');
    } else {
      next();
    }
  })
)

app.listen(port, function () {
  console.log('Express server listening on port ' + port);
})

module.exports = app;

function query(str, reg) {
  var result = str.match(reg)

  if (result) {
    return result[1];
  }

  return null;
}
