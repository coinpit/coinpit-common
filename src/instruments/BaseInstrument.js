var affirm = require('affirm.js')

module.exports = function (config) {
  var base = {}
  affirm(config, 'config is undefined')
  base.config = config
  affirm(!isNaN(base.config.reward) && base.config.reward <= 0, 'Invalid reward ' + base.config.reward)
  affirm(!isNaN(base.config.commission) && base.config.commission > 0, 'Invalid commission ' + base.config.commission)
  affirm((base.config.commission <= 1 && base.config.reward >= -1) ||
    (base.config.commission > 1 && (base.config.reward < -1 || base.config.reward === 0)), 'Reward and commission should be either percentage or absolute values')
  affirm(base.config.commission > Math.abs(base.config.reward), 'Reward more than commission')
  affirm(!isNaN(base.config.stopcushion) && base.config.stopcushion >= 0, 'Invalid stopcushion ' + base.config.stopcushion)
  affirm(!isNaN(base.config.targetprice) && base.config.targetprice >= 0, 'Invalid targetprice ' + base.config.targetprice)
  affirm(!isNaN(base.config.ticksize) && base.config.ticksize >= 0, 'Invalid ticksize ' + base.config.ticksize)
  affirm(!isNaN(base.config.crossMarginInitialStop) && base.config.crossMarginInitialStop >= 0, 'Invalid crossMarginInitialStop ' + base.config.crossMarginInitialStop)
  affirm(!isNaN(base.config.ticksperpoint) && base.config.ticksperpoint >= 0, 'Invalid ticksperpoint ' + base.config.ticksperpoint)
  affirm(!isNaN(base.config.bandUpperLimit) && base.config.bandUpperLimit >= 0, 'Invalid bandUpperlimit ' + base.config.bandUpperLimit)
  affirm(!isNaN(base.config.bandLowerLimit) && base.config.bandLowerLimit >= 0, 'Invalid bandLowerLimit ' + base.config.bandLowerLimit)
  affirm(!isNaN(base.config.introducerReward) && base.config.introducerReward >= 0, 'Invalid introducerReward ' + base.config.introducerReward)
  affirm(!isNaN(base.config.introducedReward) && base.config.introducedReward >= 0, 'Invalid introducedReward ' + base.config.introducedReward)
  affirm(!isNaN(base.config.rewardsCalculationInterval) && base.config.rewardsCalculationInterval >= 0, 'Invalid rewardsCalculationInterval ' + base.config.rewardsCalculationInterval)
  affirm(!isNaN(base.config.maxLeverage) && base.config.maxLeverage >= 0, 'Invalid maxLeverage ' + base.config.maxLeverage)
  affirm(!isNaN(base.config.uplDecimalPlaces) && base.config.uplDecimalPlaces >= 0, 'Invalid uplDecimalPlaces ' + base.config.uplDecimalPlaces)
  affirm(base.config.externalFeed, 'ExternalFeed should be present')

  base.isExpired = function () {
    return base.config.status === 'expired'
  }

  base.calculateCommissionOrReward = function(commissionOrReward, quantity, price) {
    affirm(commissionOrReward === 'commission' || commissionOrReward === 'reward', "commission or reward expected")
    var commissionRate = base.config[commissionOrReward]
    return commissionRate > -1 && commissionRate <= 1 ? Math.round(base.getNormalizedPrice(price) * quantity * commissionRate) : quantity * commissionRate;
  }

  base.getCushion = function(order) {
    return order.cushion || config.stopcushion
  }

  base.toBeFilled = function(order) {
    return order.quantity - (order.filled || 0) - (order.cancelled || 0)
  }

  return base
}
