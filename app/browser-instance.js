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

  const createPageContext = async () => {
    let context, page
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
    return { page, context }
  }

  const awaitingPageContextDefferds = []
  const availablePageContexts = []
  
  const readyNextPageContext = async () => {
    const pageContext = await createPageContext()
    pushNextPageContext(pageContext)
  }

  const pushNextPageContext = pageContext => {
    const awaitingPageContextDeferred = awaitingPageContextDefferds.shift()
    if (awaitingPageContextDeferred != null) {
      awaitingPageContextDeferred.resolve(pageContext)
    } else {
      availablePageContexts.push(pageContext)
    }
  }

  if (appConfig.launchHcPagesNum > 0) {
    for (let i = 0; i < appConfig.launchHcPagesNum; i++) {
      readyNextPageContext()
    }
  }
  else {
    throw new Error('LAUNCH_HC_PAGES_NUM must be greater than 0')
  }

  const usePage = async (callback) => {
    let pageContext = availablePageContexts.shift()

    if (pageContext == null) {
      pageContext = await new Promise((resolve, reject) => awaitingPageContextDefferds.push({resolve, reject}))
    }

    const { page, context } = pageContext

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
      readyNextPageContext()
    }
  }

  return {
    puppeteer,
    browser,
    usePage,
  }
}
