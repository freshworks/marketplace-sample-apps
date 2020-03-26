const ascii85 = require('ascii85')
const buffer = require('buffer').Buffer

exports = {
  /**
   * To encode the given string in base85 algorithm
   *
   * @param {String} str - String to encode.
   **/
  encode: function (str) {
    const hex = buffer.from(str.replace(/\-/g, ''), 'hex');
    return ascii85.encode(hex).toString();
  },

  /**
   * To decode the encoded string in base85 algorithm
   *
   * @param {String} str - encoded string.
   **/
  decode: function (str) {
    return buffer.from(ascii85.decode(str)).toString('hex');
  }
}
