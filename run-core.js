'use strict'
require('babel-register')
const fs = require('fs')
const Wechat = require('./src/wechat.js')
const qrcode = require('qrcode-terminal')
const schedule = require('node-schedule')

let bot
/**
 * 尝试获取本地登录数据，免扫码
 * 这里演示从本地文件中获取数据
 */
try {
  bot = new Wechat(require('./sync-data.json'))
} catch (e) {
  bot = new Wechat()
}
/**
 * 启动机器人
 */
if (bot.PROP.uin) {
  // 存在登录数据时，可以随时调用restart进行重启
  bot.restart()
} else {
  bot.start()
}
/**
 * uuid事件，参数为uuid，根据uuid生成二维码
 */
bot.on('uuid', uuid => {
  qrcode.generate('https://login.weixin.qq.com/l/' + uuid, {
    small: true
  })
  console.log('二维码链接：', 'https://login.weixin.qq.com/qrcode/' + uuid)
})
/**
 * 登录成功事件
 */
bot.on('login', () => {
  console.log('登录成功')
  // 保存数据，将数据序列化之后保存到任意位置
  fs.writeFileSync('./sync-data.json', JSON.stringify(bot.botData))
})
/**
 * 登出成功事件
 */
bot.on('logout', () => {
  console.log('登出成功')
  // 清除数据
  fs.unlinkSync('./sync-data.json')
})
/**
 * 如何发送消息
 */
bot.on('login', () => {
  const contacts = Object.values(bot.contacts)
  /**
   * 演示发送消息到文件传输助手
   * 通常回复消息时可以用 msg.FromUserName
   */
  let ToUserName = (contacts.find(contact => contact.OriginalNickName === '名侦探狄仁杰断案奇才') || {}).UserName
  /**
   * 开启定时器叫龟儿刷牙
   */
  schedule.scheduleJob('0 30 22 * * *', () => {
    /**
     * 发送文本消息，可以包含emoji(😒)和QQ表情([坏笑])
     */
    bot.sendMsg('龟儿刷牙拉', ToUserName)
      .catch(err => {
        bot.emit('error', err)
      })
  })
})
