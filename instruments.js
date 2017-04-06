var affirm = require('affirm.js')
var _      = require('lodash')

module.exports = (function () {
  var instruments = {}
  var contracts   = {}
  var symbols     = []
  var configs     = {}
  instruments.type        = {
    inverse: require("./instruments/inverse"),
    quanto : require("./instruments/quanto")
  }

  instruments.init = function (configs) {
    affirm(configs, 'Invalid configs')
    var symbols = Object.keys(configs)
    affirm(symbols && Array.isArray(symbols), 'Invalid configs')
    for (var i = 0; i < symbols.length; i++) {
      var symbol = symbols[i];
      var config = configs[symbol]
      instruments.add(config)
    }
  }

  instruments.expire = function(symbol) {
    affirm(symbol, 'Invalid symbol ' + symbol)
    affirm(configs[symbol], 'Config missing for symbol: ' + symbol + ". All Configs:" + Object.keys(configs))
    configs[symbol].status = 'expired'
  }

  instruments.add = function (config) {
    affirm(config.type === 'inverse' || config.type === 'quanto', 'Invalid instrument type')
    if (contracts[config.symbol]) return console.log(config.symbol, 'is already present')
    contracts[config.symbol] = instruments.type[config.type](config)
    symbols.push(config.symbol)
    configs[config.symbol] = config
  }

  instruments.get = function (symbol) {
    affirm(symbol, 'Invalid symbol')
    return contracts[symbol]
  }

  instruments.getConfigs = function () {
    return configs
  }

  instruments.getConfig = function (symbol) {
    instruments.affirmSymbol(symbol)
    return configs[symbol]
  }

  instruments.symbols = function () {
    return symbols
  }

  instruments.affirmSymbol = function (symbol) {
    affirm(configs[symbol], 'Invalid symbol:' + symbol, 422)
  }


  instruments.affirmActiveSymbol = function(symbol){
    instruments.affirmSymbol(symbol)
    affirm(! instruments.get(symbol).isExpired(), "Instrument " + symbol + " has expired.")
  }

  instruments.remove       = function (symbol) {
    affirm(symbol, 'Invalid symbol')
    delete contracts[symbol]
    delete configs[symbol]
    _.remove(symbols, function (ele) {
      return ele === symbol
    })
  }

  instruments.reset = function(){
    _.clone(symbols).forEach(instruments.remove)
  }
  return instruments
})()
