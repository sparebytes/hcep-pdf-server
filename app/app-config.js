const config = require('config')

const envMapping =  {
  port: 'HCEP_PORT',
  chromeBinary: 'HCEP_CHROME_BINARY',
  useChromium: 'HCEP_USE_CHROMIUM',
  launchHcPagesNum: 'LAUNCH_HC_PAGES_NUM',
  appTimeoutMsec: 'HCEP_APP_TIMEOUT_MSEC',
  pageTimeoutMsec: 'HCEP_PAGE_TIMEOUT_MSEC',
  defaultMargin: 'HCEP_DEFAULT_MARGIN',
  defaultPdfOptionKey: 'HCEP_DEFAULT_PDF_OPTION_KEY',
  maxRequestSize: 'HCEP_MAX_REQUEST_SIZE',
  myPdfOptionPresetsFilePath: 'HCEP_MY_PDF_OPTION_PRESETS_FILE_PATH',
  testServerUrl: 'HCEP_TEST_SERVER_URL',
  testTargetUrl: 'HCEP_TEST_TAREGT_URL',
}

const appConfig = {
  port: configGetType('port', 'integer', false),
  chromeBinary: configGetType('chromeBinary', 'string', false),
  useChromium: configGetType('useChromium', 'boolean', false),
  launchHcPagesNum: configGetType('launchHcPagesNum', 'integer', false),
  appTimeoutMsec: configGetType('appTimeoutMsec', 'integer', false),
  pageTimeoutMsec: configGetType('pageTimeoutMsec', 'integer', false),
  defaultMargin: configGetType('defaultMargin', 'string', false),
  defaultPdfOptionKey: configGetType('defaultPdfOptionKey', 'string', false),
  maxRequestSize: configGetType('maxRequestSize', 'string', false),
  myPdfOptionPresetsFilePath: configGetType('myPdfOptionPresetsFilePath', 'string', true),
  testServerUrl: configGetType('testServerUrl', 'string', false),
  testTargetUrl: configGetType('testTargetUrl', 'string', false),
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
  }
  return value
}