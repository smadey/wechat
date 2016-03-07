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

// 事件消息解析规则
var events = [
  {
    type: 'subscribe',
    handler: function (username, context) {
      var textTips = texts.map(function (d, i) { // 用户订阅
        return (i + 1) + '.' + d.title + '\n' + d.content;
      }).join('\n\n');

      return '感谢您关注公众号！\n我们将为您提供以下服务\n\n' + textTips;
    }
  },
  {
    type: 'unsub',
    handler: function (username, context) { // 用户取消订阅
    }
  }
];

// 文本消息解析规则
var texts = [
  {
    title: '测试',
    content: '提交“测试：n”返回第n条中文测试结果，如“测试：2”返回第2条中文测试结果',
    reg: /^测试：(.+)/,
    handler: function (text) {
      return '这是第' + text + '条测试结果';
    }
  },
  {
    title: 'test',
    content: '提交“test:n”返回第n条英文测试结果，如“test:3”返回第3条英文测试结果',
    reg: /^test:(.+)/,
    handler: function (text) {
      return 'This the ' + text + 'th test result';
    }
  }
];

app.set('port', port);
app.use(express.query());
app.use('/msg',
  wechat(wechatConfig, function(req, res) {
    var msg = req.weixin;
    var i;
    var n;

    switch (msg.MsgType) {
      case 'event':
        // 解析用户触发事件
        console.log('用户“' + msg.FromUserName + '”触发了“' + msg.Event + '”事件');

        var evt;

        for (i = 0, n = events.length; i < n; i++) {
          evt = events[i];

          if (msg.Event === evt.type) {
            res.reply(evt.handler(msg.FromUserName, msg));
            break;
          }
        }

        break;

      case 'text':
        // 解析用户文本输入
        console.log('用户“' + msg.FromUserName + '”输入了“' + msg.Content + '”');

        var text;
        var query;

        for (i = 0, n = texts.length; i < n; i++) {
          text = texts[i];

          if (query = match(msg.Content, text.reg)) {
            res.reply(text.handler(query));
            text = null;
            break;
          }
        }

        if (text) {
          var textTips = texts.map(function (d, i) {
            return (i + 1) + '.' + d.title + '\n' + d.content;
          }).join('\n');

          res.reply('仅支持以下功能：\n' + textTips + '\n\n请重新输入！');
        }

        break;

      default:
        res.reply('当前版本只支持文本查询功能！更多更能，敬请期待。。。');
    }
  })
)

app.listen(port, function () {
  console.log('Express server listening on port ' + port);
});

module.exports = app;

function match(str, reg) {
  var result = str.match(reg)

  if (result) {
    return result[1];
  }

  return null;
}
