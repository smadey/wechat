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
    content: '提交“测试:n”返回第n条中文测试结果，如“测试：2”返回第2条中文测试结果',
    reg: /^测试(?:[：:])(\d+)/,
    handler: function (text, context) {
      return '这是第' + text + '条测试结果';
    }
  },
  {
    title: 'test',
    content: '提交“test:n”返回第n条英文测试结果，如“test:3”返回第3条英文测试结果',
    reg: /^test(?:[：:])(\d+)/,
    handler: function (text, context) {
      return 'This the ' + text + 'th test result';
    }
  }
];

function match(str, reg) {
  var result = str.match(reg)

  if (result) {
    return result[1];
  }

  return null;
}

function middleware(req, res) {
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
          res.reply(text.handler(query, msg));
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
}

module.exports = middleware;

// middleware({
//   weixin: {
//     MsgType: 'text',
//     Event: 'subscribe',
//     FromUserName: '我',
//     Content: 'test：1'
//   }
// }, {
//   reply: function(d) {
//     console.log(d)
//   }
// })

