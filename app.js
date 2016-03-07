import express from 'express'
import wechat from 'wechat'

import {
  port,
  appid,
  token,
  encodingAESKey
} from './config'

let app = express()

const REG_QUERY = /^cx:(.+)/

app.set('port', port)
app.use(express.query())
app.use('/msg',
  wechat({appid, token, encodingAESKey}, (req, res, next) => {
    let msg = req.weixin
    let match

    console.log(req)

    if (match = query(msg, REG_QUERY)) {
      res.reply(`您查询的“${match}”的库存为：0`)
    } else {
      next()
    }
  })
)

app.listen(port, () => {
  console.log('Express server listening on port ' + port)
})

module.exports = app;
