const debug = require('debug')('hcepPdfServer:getPdfOption')
const { appConfig } = require('../app-config')
const defaultPdfOptionKey = appConfig.defaultPdfOptionKey
const { defaultPdfOptionPresets } = require('./default-pdf-option-presets')
const { PdfOption } = require('./pdf-option')
const myPdfOptionPresetsFilePath = appConfig.defaultPdfOptionPresets

let pdfOptionPresets = defaultPdfOptionPresets
const loadMyPdfOptionPresets = () => {
  if (!myPdfOptionPresetsFilePath) {
    return null
  }
  debug('myPdfOptionPresetsFilePath:', myPdfOptionPresetsFilePath)
  const { myPdfOptionPresets } = require(myPdfOptionPresetsFilePath)
  return myPdfOptionPresets
}

const myPdfOptionPresets = loadMyPdfOptionPresets()
if (myPdfOptionPresets) {
  const mergeOptions = require('merge-options')
  pdfOptionPresets = mergeOptions(defaultPdfOptionPresets, myPdfOptionPresets)
  debug('pdfOptionPresets merged:', pdfOptionPresets)
}

const pdfOptionExists = key => {
  return (key in pdfOptionPresets)
}

const getPdfOption = key => {
  if (!key) {
    debug('use defaultPdfOption:', defaultPdfOptionKey)
    key = defaultPdfOptionKey
  } else if (!pdfOptionExists(key)) {
    debug('key', key, 'is not exists in pdfOptionPresets')
    key = defaultPdfOptionKey
  }
  debug('use pdfOption', key)
  return new PdfOption(pdfOptionPresets[key])
}

module.exports.loadMyPdfOptionPresets = loadMyPdfOptionPresets
module.exports.pdfOptionPresets = pdfOptionPresets
module.exports.pdfOptionExists = pdfOptionExists
module.exports.getPdfOption = getPdfOption
module.exports.defaultPdfOptionKey = defaultPdfOptionKey
