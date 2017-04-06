var expect      = require('expect.js')
var Quanto      = require('../../instruments/quanto')
var instruments = require("../fixtures/instruments.json")
var orders      = require("../fixtures/orders.json")

describe('quanto instruments', function () {

  it('should get commission based on entry price and quantity', function () {
    var quanto     = Quanto(instruments.BTC1)
    var commission = quanto.calculateCommissionOrReward('commission', 3, 750)
    expect(commission).to.be.eql(30000)
  })

  it('should get reward based on entry price and quantity when reward is negative and less than 1', function () {
    var quanto = Quanto(instruments.BTC1)
    var reward = quanto.calculateCommissionOrReward('reward', 3, 750)
    expect(reward).to.be.eql(-7500)
  })

  it('should calculate margin for new limit order', function () {
    var quanto = Quanto(instruments.BTC1)
    var margin = quanto.calculateMarginRequiredByOrder({ "orderType": "LMT", "price": 700, "side": "buy", stopPrice: 6, "quantity": 2 })
    expect(margin).to.be.eql(1400000)
  })

  it('should calculate margin for Stop order order', function () {
    var quanto = Quanto(instruments.BTC1)
    var order = {
      "uuid":                 "6c58b7c0-09df-11e7-a8d8-043931e0e112",
      "userid":               "moVB8e8oWX1oKjaaesdimAGqJHxjih8kjU",
      "side":                 "sell",
      "quantity":             1,
      "filled":               0,
      "cancelled":            0,
      "price":                1255.1,
      "normalizedPrice":      1255.1,
      "averagePrice":         0,
      "entryTime":            1489624085820794,
      "eventTime":            1489624085820794,
      "status":               "open",
      "entryOrder":           {
        "6bb63638-09df-11e7-b8ab-142f3db2a1d7": 1
      },
      "orderType":            "STP",
      "stopPrice":            4,
      "targetPrice":          9,
      "instrument":           "BTC1",
      "commission":           20000,
      "reward":               -2500,
      "cushion":              1,
      "reservedTicks":        2,
      "entryPrice":           1259.1,
      "normalizedEntryPrice": 1259.1,
      "entryAmount":          1259.1,
      "crossMargin":          false,
      "maxStop":              1254.5,
      "normalizedMaxStop":    1254.5,
      "oco":                  "6c58b7c1-09df-11e7-9074-13170c9b6a8a"
    }
    var margin = quanto.calculateMarginRequiredByOrder(order)
    expect(margin).to.be.eql(460000)
  })
})