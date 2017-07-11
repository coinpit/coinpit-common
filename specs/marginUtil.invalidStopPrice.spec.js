var expect      = require("expect.js")
var marginUtil  = require("../marginUtil")
var fixtures    = require("./fixtures/marginUtil.invalidStopPrice.spec.json")
var instruments = require("../instruments")

describe("Invalid stop orders", function () {
  before(function () {
    instruments.init(fixtures.instruments)
  })

  after(function () {
    instruments.reset()
  })

  it("should throw an error when stop price is 0", function () {
    var test = fixtures.zeroPrice
    expect(function(){
      marginUtil.getMaxCrossStopMargin(test.orders, test.pnl, test.positions, test.margin, fixtures.bands)
    }).to.throwException(function (e) {
      expect(e.message).to.match(/Max stop must be positive/g)
    })
  })
  it("should throw an error when stop price is null", function () {
    var test = fixtures.nullPrice
    expect(function(){
      marginUtil.getMaxCrossStopMargin(test.orders, test.pnl, test.positions, test.margin, fixtures.bands)
    }).to.throwException(function (e) {
      expect(e.message).to.match(/Max stop must be positive/g)
    })
  })
})