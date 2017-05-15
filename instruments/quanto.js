var affirm         = require("affirm.js")
var BaseInstrument = require('./BaseInstrument')
var sinful         = require('sinful-math.js')

module.exports = function (config) {
  var instrument          = BaseInstrument(config)
  instrument.positionSide = { buy: 1, sell: -1 }
  instrument.symbol       = config.symbol

  instrument.getNormalizedPrice = function (price) {
    return price
  }

  instrument.calculateMarginRequiredByOrder = function (order, bands, excludeExtraForCross) {
    var points = getMarginPointsUsedByOrder(order, excludeExtraForCross)
    return Math.ceil(sinful.mul(points, config.ticksperpoint, config.tickvalue))
  }

  function getMarginPointsUsedByOrder(order, excludeExtraForCross) {
    if (order.orderType === "TGT")  return 0
    var quantity = instrument.toBeFilled(order)
    var cushion  = instrument.getCushion(order)
    var maxStopPoints;
    if (order.orderType === "STP" && order.crossMargin && excludeExtraForCross) {
      maxStopPoints = sinful.add(config.crossMarginInitialStop, cushion);
      return sinful.mul(maxStopPoints, quantity)
    }
    if (order.orderType === "STP") {
      var entryAmount           = order.entryAmount || sinful.mul(order.executionPrice, quantity)
      var exitAmount            = sinful.mul(order.maxStop, quantity)
      var totalStopPoints       = sinful.sub(entryAmount, exitAmount)
      return Math.abs(totalStopPoints)
    }
    maxStopPoints = sinful.add(order.stopPrice, cushion)
    return sinful.mul(quantity, maxStopPoints)
  }

  return instrument
}
