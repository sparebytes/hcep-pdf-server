const debug = require('debug')('hcepPdfServer:hcPages')
const { appConfig } = require('./app-config')
const generateLaunchOptions = () => {
  const options = {
    args: ['--no-sandbox', '--disable-gpu']
  }
  if (appConfig.useChromium) {
    debug('use Chromium')
  } else {
    options['executablePath'] = appConfig.chromeBinary
    debug('use chromeBinary:', appConfig.chromeBinary)
  }
  return options
}
module.exports.hcPages = async (pagesNum) => {
  if (!pagesNum) {
    pagesNum = 1
  }
  const puppeteer = require('puppeteer')
  const launchOptions = generateLaunchOptions()
  debug('launchOptions:', launchOptions)
  // launch browser and page only once
  const browser = await puppeteer.launch(launchOptions)
  const chromeVersion = await browser.version()
  debug('chromeVersion:', chromeVersion)
  const pages = []
  browser.on('error', msg => {
    console.log("BROWSER ERROR", msg)
    throw msg
  })
  for(let i=0; i < pagesNum; i++){
    debug('page launched No.' + i)
    const page = await browser.newPage()
    page.on('error', msg => {
      throw msg
    })
    pages.push(page)
  }
  return pages
}
