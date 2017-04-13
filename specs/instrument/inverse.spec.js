var expect = require('expect.js')
var Inverse = require('../../instruments/inverse')
var instruments = require("../fixtures/instruments.json")
var orders = require("../fixtures/orders.json")

describe('Inverse type instrument ', function() {
  describe('Invalid config for instantiating inverse', function() {
    function testInvalidContract(config, message) {
      try {
        Inverse(config)
        throw new Error("shouldnt be here")
      } catch (e) {
        expect(e.message).to.match(message)
      }
    }

    it('should throw error is undefined config is passed', function() {
      testInvalidContract(undefined, /config is undefined/)
    })

    it('should throw error if reward is not a number', function() {
      testInvalidContract(instruments["NAN_REWARD"], /Invalid reward not a number/)
    })

    it('should throw error if reward is invalid', function() {
      testInvalidContract(instruments["INVALID_REWARD"], /Invalid reward 1/)
    })

    it('should throw error if commission and reward are using different format', function(){
      var config = instruments["INVALID_CONTRACT"]
      testInvalidContract(config, /Reward and commission should be either percentage or absolute values/)
      config.commission = 10
      config.reward = -0.005
      testInvalidContract(config, /Reward and commission should be either percentage or absolute values/)
    })

    it('should throw error if reward is greater than commission', function(){
      var config = instruments["INVALID_CONTRACT"]
      config.commission = 0.0005
      config.reward = -0.005
      testInvalidContract(config, /Reward more than commission/)
    })

    it('should throw error if stop cushion is invalid', function(){
      var config = instruments["INVALID_CONTRACT"]
      config.commission = 0.005
      config.reward = -0.0005
      config.stopcushion = 'something'
      testInvalidContract(config, /Invalid stopcushion something/)
      config.stopcushion = -1
      testInvalidContract(config, /Invalid stopcushion -1/)
    })

    it('should throw error if target price is invalid', function(){
      var config = JSON.parse(JSON.stringify(instruments["BTCUSD7H10"]))
      config.targetprice = 'something'
      testInvalidContract(config, /Invalid targetprice something/)
      config.targetprice = -1
      testInvalidContract(config, /Invalid targetprice -1/)
    })

    it('should throw error if crossMarginInitialStop is invalid', function(){
      var config = JSON.parse(JSON.stringify(instruments["BTCUSD7H10"]))
      config.crossMarginInitialStop = 'something'
      testInvalidContract(config, /Invalid crossMarginInitialStop something/)
      config.crossMarginInitialStop = -1
      testInvalidContract(config, /Invalid crossMarginInitialStop -1/)
    })

    it('should throw error if ticksize is invalid', function(){
      var config = JSON.parse(JSON.stringify(instruments["BTCUSD7H10"]))
      config.ticksize = 'something'
      testInvalidContract(config, /Invalid ticksize something/)
      config.ticksize = -1
      testInvalidContract(config, /Invalid ticksize -1/)
    })

    it('should throw error if ticksperpoint is invalid', function(){
      var config = JSON.parse(JSON.stringify(instruments["BTCUSD7H10"]))
      config.ticksperpoint = 'something'
      testInvalidContract(config, /Invalid ticksperpoint something/)
      config.ticksperpoint = -1
      testInvalidContract(config, /Invalid ticksperpoint -1/)
    })

    it('should throw error if bandUpperlimit is invalid', function(){
      var config = JSON.parse(JSON.stringify(instruments["BTCUSD7H10"]))
      config.bandUpperLimit = 'something'
      testInvalidContract(config, /Invalid bandUpperlimit something/)
      config.bandUpperLimit = -1
      testInvalidContract(config, /Invalid bandUpperlimit -1/)
    })

    it('should throw error if bandLowerLimit is invalid', function(){
      var config = JSON.parse(JSON.stringify(instruments["BTCUSD7H10"]))
      config.bandUpperlimit = 10
      config.bandLowerLimit = 'something'
      testInvalidContract(config, /Invalid bandLowerLimit something/)
      config.bandLowerLimit = -1
      testInvalidContract(config, /Invalid bandLowerLimit -1/)
    })

    it('should throw error if introducerReward is invalid', function(){
      var config = JSON.parse(JSON.stringify(instruments["BTCUSD7H10"]))
      config.introducerReward = 'something'
      testInvalidContract(config, /Invalid introducerReward something/)
      config.introducerReward = -1
      testInvalidContract(config, /Invalid introducerReward -1/)
    })

    it('should throw error if introducedReward is invalid', function(){
      var config = JSON.parse(JSON.stringify(instruments["BTCUSD7H10"]))
      config.introducedReward = 'something'
      testInvalidContract(config, /Invalid introducedReward something/)
      config.introducedReward = -1
      testInvalidContract(config, /Invalid introducedReward -1/)
    })

    it('should throw error if rewardsCalculationInterval is invalid', function(){
      var config = JSON.parse(JSON.stringify(instruments["BTCUSD7H10"]))
      config.rewardsCalculationInterval = 'something'
      testInvalidContract(config, /Invalid rewardsCalculationInterval something/)
      config.rewardsCalculationInterval = -1
      testInvalidContract(config, /Invalid rewardsCalculationInterval -1/)
    })

    it('should throw error if maxLeverage is invalid', function(){
      var config = JSON.parse(JSON.stringify(instruments["BTCUSD7H10"]))
      config.maxLeverage = 'something'
      testInvalidContract(config, /Invalid maxLeverage something/)
      config.maxLeverage = -1
      testInvalidContract(config, /Invalid maxLeverage -1/)
    })

    it('should throw error if uplDecimalPlaces is invalid', function(){
      var config = JSON.parse(JSON.stringify(instruments["BTCUSD7H10"]))
      config.uplDecimalPlaces = 'something'
      testInvalidContract(config, /Invalid uplDecimalPlaces something/)
      config.uplDecimalPlaces = -1
      testInvalidContract(config, /Invalid uplDecimalPlaces -1/)
    })

    it('should throw error if externalFeed is invalid', function(){
      var config = JSON.parse(JSON.stringify(instruments["BTCUSD7H10"]))
      config.externalFeed = undefined
      testInvalidContract(config, /ExternalFeed should be present/)
    })

    it('should throw error if contractusdvalue is invalid', function(){
      var config = JSON.parse(JSON.stringify(instruments["BTCUSD7H10"]))
      config.contractusdvalue = 'something'
      testInvalidContract(config, /Invalid contractusdvalue something/)
      config.contractusdvalue = -1
      testInvalidContract(config, /Invalid contractusdvalue -1/)
    })

  })

  describe('Calculate margin required by order', function() {

    it("should calculate CROSS MAX STOP margin required by cross stop order", function() {
      var order = orders.inverse.cross
      var inverse = Inverse(instruments[order.instrument])
      var value = inverse.calculateMarginRequiredByOrder(order)
      expect(value).to.be.eql(338305941)
    })

    it("should calculate CROSS MIN STOP margin required by cross stop order", function() {
      var order = orders.inverse.cross
      var inverse = Inverse(instruments[order.instrument])
      var value = inverse.calculateMarginRequiredByOrder(order, {}, true)
      expect(value).to.be.eql(6926683)
    })

    it("should return 0 margin required by a target order", function() {
      var order = orders.inverse.target
      var inverse = Inverse(instruments[order.instrument])
      var value = inverse.calculateMarginRequiredByOrder(order, {}, true)
      expect(value).to.be.eql(0)
    })

    it("should return margin required by a order having marginPerQty ", function() {
      var order = orders.inverse.limit
      var inverse = Inverse(instruments[order.instrument])
      var value = inverse.calculateMarginRequiredByOrder(order, {
        "min": 0,
        "max": 10
      }, true)
      expect(value).to.be.eql(14)
    })

    it("should throw error when no bands present", function() {
      var order = orders.inverse.buy2
      var inverse = Inverse(instruments[order.instrument])
      try {
        inverse.calculateMarginRequiredByOrder(order, {}, true)
        throw new Error("should not be here")
      } catch (error) {
        expect(error.message).to.match(/min not defined on bands:/);
      }
    })

    it("should return margin required by a order buy order with crossMargin", function() {
      var order = orders.inverse.buy2
      var bands = {
        "BTCUSD7F27": {
          "price": 100,
          "max": 700,
          "min": 501,
          "instrument": order.instrument
        }
      }
      var inverse = Inverse(instruments[order.instrument])
      var value = inverse.calculateMarginRequiredByOrder(order, bands, true)
      expect(value).to.be.eql(23140495)
    })

    it("should return margin required by a order buy with crossMargin using min of band", function() {
      var order = orders.inverse.buy2
      var bands = {
        "BTCUSD7F27": {
          "price": 100,
          "max": 700,
          "min": 400,
          "instrument": order.instrument
        }
      }
      var inverse = Inverse(instruments[order.instrument])
      var value = inverse.calculateMarginRequiredByOrder(order, bands, true)
      expect(value).to.be.eql(36458331)
    })

    it("should return margin required by a order with stop price", function() {
      var order = orders.inverse.buy3
      var bands = {
        "BTCUSD7F27": {
          "price": 100,
          "max": 700,
          "min": 510,
          "instrument": order.instrument
        }
      }
      var inverse = Inverse(instruments[order.instrument])
      var value = inverse.calculateMarginRequiredByOrder(order, bands, true)
      expect(value).to.be.eql(15746423)
    })

    it("should return 0 margin required if max stop is tighten beyond entry price for buy stop order.", function(){
      var order = orders.inverse.maxStopTightenBeyondEntryBuy
      var inverse = Inverse(instruments[order.instrument])
      var value = inverse.calculateMarginRequiredByOrder(order, {}, true)
      expect(value).to.be.eql(0)
    })

    it("should return 0 margin required if max stop is tighten beyond entry price for sell stop order.", function(){
      var order = orders.inverse.maxStopTightenBeyondEntrySell
      var inverse = Inverse(instruments[order.instrument])
      var value = inverse.calculateMarginRequiredByOrder(order, {}, true)
      expect(value).to.be.eql(0)
    })

  })


  describe('Calculate commission', function() {
    it('should get commission based on entry price and quantity', function() {
      var inverse = Inverse(instruments['BTCUSD7F27'])
      var commission = inverse.calculateCommissionOrReward('commission', 3, 750)
      expect(commission).to.be.eql(100000)
    })

    it('should get reward based on entry price and quantity', function() {
      var inverse = Inverse(instruments['REWARD_CONTRACT'])
      var reward = inverse.calculateCommissionOrReward('reward', 3, 750)
      expect(reward).to.be.eql(-100000000)
    })

    it('should get commission based on commision rate and quantity', function() {
      var inverse = Inverse(instruments['HIGH_COMMISION_CONTRACT'])
      var commission = inverse.calculateCommissionOrReward('commission', 3, 750)
      expect(commission).to.be.eql(6)
    })
  })

})
