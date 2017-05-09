var expect     = require('expect.js')
var ZKA = require('../ZKA-util')
var fixtures   = require('./fixtures/ZKA-util.spec.json')

describe('ZKA-util', function () {

  it('should create header for authentication using api key', function () {
    var test       = fixtures.getAuthorization
    var zka = ZKA(test.apikey.userid, test.apikey.name, test.apikey.secretKey)
    var authHeader = zka.getAuthorization(test.method, test.uri, test.body, test.nonce)
    expect(authHeader).to.eql(test.result)
  })

})