const base85 = require("ascii85");
const buffer = require("buffer").Buffer;

exports = {
  /**
   * To encode the given string in base85 algorithm
   *
   * @param {String} str - String to encode.
   **/
  encode: function (str) {
    const hex = buffer.from(str.replace(/\-/g, ""), "hex");
    return base85.encode(hex).toString();
  },

  /**
   * To decode the encoded string in base85 algorithm
   *
   * NOTE: This method is not used anywhere in the app. This is included here to showcase how the encoded conversation_id can be decoded with the same algorithm.
   *
   * @param {String} str - encoded string.
   **/
  decode: function (str) {
    const uuid = buffer.from(base85.decode(str)).toString("hex");
    return `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(
      12,
      16
    )}-${uuid.substring(16, 20)}-${uuid.substring(20)}`;
  },
};
