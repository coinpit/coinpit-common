var affirm      = require('affirm.js')
var mangler     = require('mangler')
var instruments = require('./instruments')

module.exports = (function () {
  var marginUtil = {}

  // marginUtil.computeAvailableMarginCoverageIfCrossShifted = function (orders, profitAndLoss, availableMargin, bands) {
  marginUtil.getMinCrossStopMargin = function (orders, profitAndLoss, positions, availableMargin, bands) {
    return marginUtil.computeAvailableMargin(orders, profitAndLoss, positions, availableMargin, bands, true)
  }

  // marginUtil.computeAvailableMarginCoverage = function (orders, profitAndLoss,positions, availableMargin, bands) {
  marginUtil.getMaxCrossStopMargin = function (orders, profitAndLoss, positions, availableMargin, bands) {
    return marginUtil.computeAvailableMargin(orders, profitAndLoss, positions, availableMargin, bands, false)
  }

  //orders, profitAndLoss, availableMargin, bands, ifCrossTightenToMax, positions
  marginUtil.computeAvailableMargin = function (orders, profitAndLoss, positions, availableMargin, bands, isMinCrossStop) {
    affirm(orders, 'Orders not present')
    affirm(!profitAndLoss || (typeof profitAndLoss.pnl === 'number'), 'invalid Profit and loss ' + JSON.stringify(profitAndLoss))
    affirm(!isNaN(availableMargin) && availableMargin >= 0, 'Invalid margin balance ' + availableMargin)
    affirm(Object.keys(bands), 'Invalid marketBuys')
    availableMargin -= marginUtil.getMarginUsedByOrders(orders, bands, isMinCrossStop)
    availableMargin += profitAndLoss && profitAndLoss.pnl || 0
    availableMargin -= marginUtil.getCommissionForOpenPositions(positions)
    return availableMargin
  }

  marginUtil.getMarginUsedByOrders = function(orders, bands, isMinCrossStop){
    var marginUsedByOrders = 0
    Object.keys(orders).forEach(function (symbol) {
      var instrument = instruments.get(symbol)
      if (!instrument) return console.log("########### marginUtil.computeAvailableMargin", symbol, Object.keys(orders), instruments.symbols())

      Object.keys(orders[symbol]).forEach(function (uuid) {
        var order = orders[symbol][uuid]
        marginUsedByOrders += instrument.calculateMarginRequiredByOrder(order, bands, isMinCrossStop)
      })
    })
    return marginUsedByOrders
  }

  marginUtil.getCommissionForOpenPositions = function (positions) {
    if (!positions) return 0
    var commission = 0
    Object.keys(positions).forEach(function (symbol) {
      instruments.affirmSymbol(symbol)
      var position   = positions[symbol]
      var instrument = instruments.get(symbol)
      commission += instrument.calculateCommissionOrReward('commission', Math.abs(position.quantity), Math.abs(position.averagePrice))
    })
    return Math.round(commission)
  }

  return marginUtil
})()
