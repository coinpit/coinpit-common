var affirm         = require('affirm.js')
var mangler        = require('mangler')
var BaseInstrument = require('./BaseInstrument')
var sinful         = require('sinful-math')

module.exports = function (config) {
  var instrument    = BaseInstrument(config)
  // vaidate for contractusdvalue
  affirm(!isNaN(config.contractusdvalue) && config.contractusdvalue >= 0, 'Invalid contractusdvalue ' + config.contractusdvalue)


  instrument.positionSide = { buy: 1, sell: -1 }
  var contractusdvalue = config.contractusdvalue * 1e8

  instrument.getNormalizedPrice = function (price) {
    if (typeof price !== 'number') return price
    return Math.round(contractusdvalue / price)
  }

  instrument.calculateMarginRequiredByOrder = function (order, bands, excludeExtraForCross) {
    if (order.orderType === "TGT")  return 0
    var quantity = toBeFilled(order)
    if (order.orderType === 'STP' && order.crossMargin && excludeExtraForCross) {
      return getMarginRequiredForInverseCross(order)
    }

    if (order.orderType === 'STP') {
      return Math.abs(sinful.sub(order.entryAmount, sinful.mul(quantity, order.normalizedMaxStop)))
    }
    if (order.marginPerQty) {
      return sinful.mul(order.marginPerQty, quantity)
    }
    affirm(bands && bands[config.symbol] && bands[config.symbol].min, "min not defined on bands: " + JSON.stringify(bands))
    var price = order.price || bands[config.symbol].min
    if (order.side === 'buy') price = Math.min(price, bands[config.symbol].min)
    var cushion             = getCushion(order)
    var stopPoints          = order.crossMargin ? config.crossMarginInitialStop : order.stopPrice
    var maxStopPoints       = sinful.add(stopPoints, cushion)
    var signedMaxStopPoints = sinful.mul(instrument.positionSide[order.side], maxStopPoints)
    var maxStopPrice        = sinful.sub(price, signedMaxStopPoints)
    return sinful.mul(quantity, Math.abs(sinful.sub(instrument.getNormalizedPrice(price), instrument.getNormalizedPrice(maxStopPrice))))
  }

  function getMarginRequiredForInverseCross(order) {
    var quantity           = toBeFilled(order)
    var stopSign           = order.side === 'sell' ? -1 : 1
    var cushion            = getCushion(order)
    var maxStopPoint       = sinful.add(config.crossMarginInitialStop, cushion)
    var signedMaxStopPoint = sinful.mul(stopSign, maxStopPoint)
    var stopPrice          = sinful.add(order.entryPrice, signedMaxStopPoint)
    var btcStopPrice       = instrument.getNormalizedPrice(stopPrice)
    return Math.abs(order.entryAmount - btcStopPrice * quantity)
  }

  return instrument
}
