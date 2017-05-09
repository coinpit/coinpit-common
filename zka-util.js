var affirm = require('affirm.js')
var nacl   = require('tweetnacl')

module.exports = function (userId, apiKeyName, secretKey) {
  var util = {}
  affirm(userId, 'Need userId to generate authorization token')
  affirm(apiKeyName, 'apiKeyName undefined')
  affirm(secretKey, 'secretKey undefined')
  var secret = Buffer.from(secretKey, 'hex')
  var keyPair   = nacl.sign.keyPair.fromSecretKey(new Buffer(secret, 'hex'))

  util.getAuthorization = function (method, uri, body, nonce) {
    affirm(method, 'method undefined')
    affirm(uri, 'uri undefined')
    nonce = nonce || Date.now()
    var message   = JSON.stringify({ method: method, uri: uri, body: body, nonce: nonce })
    var signature = util.sign(message)
    return "SIGN " + userId + "." + apiKeyName + ":" + signature
  }

  util.sign = function (message) {
    message = message instanceof Buffer ? message : Buffer.from(message, 'utf8')
    var signature = nacl.sign.detached(message, keyPair.secretKey)
    return Buffer.from(signature).toString("base64")
  }


  return util
}