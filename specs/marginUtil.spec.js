var expect      = require('expect.js')
var marginUtil = require("../marginUtil")
var instruments = require("../instruments")
var fixtures    = require("./fixtures/marginUtil.spec.json")
var sinon       = require('sinon')

describe('account util', function () {
  before(function () {
    instruments.init(require('./fixtures/instruments.json'))
  })

  after(function () {
    instruments.reset()
  })

  it('should calculate margin required by commission', function () {
    var positions = {
      "BTC1"      : { "userid": "miqHcgxszTkcaQggGoK4MYDPekTeutihMA", "instrument": "BTC1", "averagePrice": 899.1, "quantity": -10, "entryAmount": 556080745, "commission": 0 },
      "BTCUSD7F27": { "userid": "miqHcgxszTkcaQggGoK4MYDPekTeutihMA", "instrument": "BTCUSD7F27", "averagePrice": 898.8, "quantity": 10, "entryAmount": -556266345, "commission": 0 }
    }

    var margin = marginUtil.getCommissionForOpenPositions(positions)
    expect(margin).to.be.eql(378149)
  })

  it("should calculate margin required for max cross stop ", function () {
    var marginAvailable = getMarginRequired(fixtures.negativeBalance)
    expect(marginAvailable).to.eql(fixtures.negativeBalance.availableMargin)

  })

  it("should use commission from position ", function () {
    var orders        = {}
    var profitAndLoss = { pnl: -200 }
    var positions     = {}
    var margin        = 5000
    var bands         = {}
    sinon.stub(marginUtil, "getMarginUsedByOrders").returns(100)
    sinon.stub(marginUtil, "getCommissionForOpenPositions").returns(50)
    var availableMargin = marginUtil.computeAvailableMargin(orders, profitAndLoss, positions, margin, bands)
    marginUtil.getMarginUsedByOrders.restore()
    marginUtil.getCommissionForOpenPositions.restore()
    expect(availableMargin).to.be.eql(4650)
  })

  function getMarginRequired(test) {
    var orders        = test.orders
    var profitAndLoss = test.profitAndLoss
    var positions     = test.positions
    var margin        = test.margin
    var bands         = {}
    return marginUtil.getMaxCrossStopMargin(orders, profitAndLoss, positions, margin, bands)
  }

})