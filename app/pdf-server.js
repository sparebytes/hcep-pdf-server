const { expressApp } = require('./express-app')
const { appConfig } = require('./app-config')
const LAUNCH_HC_PAGES_NUM = appConfig.launchHcPagesNum
console.error('LAUNCH_HC_PAGES_NUM', LAUNCH_HC_PAGES_NUM)
process.on('unhandledRejection', function(e){
  console.error('unhandledRejection. process.exit', e)
  process.exit()
})

const main = async () => {
  const { getBrowserInstance } = require('./browser-instance')
  const browserInstance = await getBrowserInstance()
  expressApp(browserInstance)
}
main()
