require('babel-register')
const { Wechaty } = require('wechaty')
const qrcode = require('qrcode-terminal')
const schedule = require('node-schedule')

const bot = Wechaty.instance({ profile: 'no-ane' })
bot
  .on('scan', url => {
    qrcode.generate(url, {
      small: true
    })
  })
  .on('login',  async user => {
    console.log(`User ${user} logined`)
    scheduleJob()
  })
  .start()


async function sendRoom (content) {
  let contact = await bot.Room.find({topic: '名侦探狄仁杰断案奇才'})
  await contact.say(content)
}

async function scheduleJob () {
  /**
   * 开启定时器叫龟儿刷牙
   */
  schedule.scheduleJob('0 30 22 * * *', async () => {
    /**
     * 发送文本消息，可以包含emoji(😒)和QQ表情([坏笑])
     */
    try {
      await sendRoom('龟儿刷牙拉')
    } catch (err) { console.log('error', err) }
  })
}
