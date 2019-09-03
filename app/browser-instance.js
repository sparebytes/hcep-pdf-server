const debug = require('debug')('hcepPdfServer:browserInstance')
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

module.exports.getBrowserInstance = async () => {
  const puppeteer = require('puppeteer')
  const launchOptions = generateLaunchOptions()
  debug('launchOptions:', launchOptions)
  // launch browser and page only once
  const browser = await puppeteer.launch(launchOptions)
  const chromeVersion = await browser.version()
  debug('chromeVersion:', chromeVersion)
  browser.on('error', msg => {
    console.log('BROWSER ERROR', msg)
    throw msg
  })

  const usePage = async (callback) => {
    let page
    let context = null
    if (appConfig.useIncognitoBrowserContext) {
      context = await browser.createIncognitoBrowserContext()
      page = await context.newPage()
    }
    else {
      page = await browser.newPage()
    }
    page.on('error', msg => {
      throw msg
    })
  
    try {
      const result = await callback(page)
      return result
    }
    finally {
      if (context) {
        context.close()
      }
      else {
        page.close()
      }
    }
  }
  

  return {
    puppeteer,
    browser,
    usePage,
  }
}
