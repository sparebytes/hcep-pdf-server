const config = require('config')

const envMapping =  {
  port: 'HCEP_PORT',
  chromeBinary: 'HCEP_CHROME_BINARY',
  useChromium: 'HCEP_USE_CHROMIUM',
  useIncognitoBrowserContext: 'HCEP_USE_INCOGNITO_BROWSER_CONTEXT',
  launchHcPagesNum: 'LAUNCH_HC_PAGES_NUM',
  appTimeoutMsec: 'HCEP_APP_TIMEOUT_MSEC',
  pageTimeoutMsec: 'HCEP_PAGE_TIMEOUT_MSEC',
  defaultMargin: 'HCEP_DEFAULT_MARGIN',
  defaultPdfOptionKey: 'HCEP_DEFAULT_PDF_OPTION_KEY',
  defaultDisplayHeaderFooter: 'HCEP_DEFAULT_DISPLAY_HEADER_FOOTER',
  defaultExtractHeaderSelector: 'HCEP_DEFAULT_EXTRACT_HEADER_SELECTOR',
  defaultExtractFooterSelector: 'HCEP_DEFAULT_EXTRACT_FOOTER_SELECTOR',
  defaultExtractStylesToHeaderFooter: 'HCEP_DEFAULT_EXTRACT_STYLES_TO_HEADER_FOOTER',
  maxRequestSize: 'HCEP_MAX_REQUEST_SIZE',
  testServerUrl: 'HCEP_TEST_SERVER_URL',
  testTargetUrl: 'HCEP_TEST_TAREGT_URL',
  myPdfOptionPresetsFilePath: 'HCEP_MY_PDF_OPTION_PRESETS_FILE_PATH',
  pdfOptionPresets: 'HCEP_MY_PDF_OPTION_PRESETS',
}

const appConfig = {
  port: configGetType('port', 'integer', false),
  chromeBinary: configGetType('chromeBinary', 'string', false),
  useChromium: configGetType('useChromium', 'boolean', false),
  useIncognitoBrowserContext: configGetType('useIncognitoBrowserContext', 'boolean', false),
  launchHcPagesNum: configGetType('launchHcPagesNum', 'integer', false),
  appTimeoutMsec: configGetType('appTimeoutMsec', 'integer', false),
  pageTimeoutMsec: configGetType('pageTimeoutMsec', 'integer', false),
  defaultMargin: configGetType('defaultMargin', 'string', false),
  defaultPdfOptionKey: configGetType('defaultPdfOptionKey', 'string', false),
  defaultDisplayHeaderFooter: configGetType('defaultDisplayHeaderFooter', 'boolean', false),
  defaultExtractHeaderSelector: configGetType('defaultExtractHeaderSelector', 'string', true),
  defaultExtractFooterSelector: configGetType('defaultExtractFooterSelector', 'string', true),
  defaultExtractStylesToHeaderFooter: configGetType('defaultExtractStylesToHeaderFooter', 'boolean', false),
  maxRequestSize: configGetType('maxRequestSize', 'string', false),
  testServerUrl: configGetType('testServerUrl', 'string', false),
  testTargetUrl: configGetType('testTargetUrl', 'string', false),
  myPdfOptionPresetsFilePath: configGetType('myPdfOptionPresetsFilePath', 'string', true),
  pdfOptionPresets: configGetType('pdfOptionPresets', 'json', true),
}

module.exports = exports = {
  appConfig: appConfig
}

function configGetType(key, type, nullable) {
  let value = config.has(key) ? config.get(key) : null
  if (value == null && nullable) {
    return null
  }

  const envKey = envMapping[key]
  switch (type) {
    
  case 'string':
    if (typeof value !== 'string') {
      throw new Error(`Expected ${envKey} to be of type ${type}`)
    }
    break

  case 'number':
    if (typeof value === 'string') {
      value = Number.parseFloat(value)
    }
    if (typeof value !== 'number') {
      throw new Error(`Expected ${envKey} to be of type ${type}`)
    }
    if (value == null || Number.isNaN(value)) {
      throw new Error(`${envKey} is an invalid number`)
    }
    break

  case 'integer':
    if (typeof value === 'string') {
      value = Number.parseInt(value)
    }
    if (typeof value !== 'number') {
      throw new Error(`Expected ${envKey} to be of type ${type}`)
    }
    if (value == null || Number.isNaN(value)) {
      throw new Error(`${envKey} is an invalid integer`)
    }
    break

  case 'boolean':
    if (value === true || value === 'true' || value === '1') {
      value = true
    }
    else if (value === false || value === 'false' || value === '0') {
      value = false
    }

    if (typeof value !== 'boolean') {
      throw new Error(`Expected ${envKey} to be of type ${type}`)
    }
    break

  case 'json':
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value)
      }
      catch (ex) {
        throw new Error(`Unable to parse JSON from ${envKey}`)
      }
    }
    break
  }
  return value
}