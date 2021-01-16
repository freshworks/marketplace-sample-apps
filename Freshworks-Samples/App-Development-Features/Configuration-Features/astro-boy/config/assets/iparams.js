function checkSignature(sign) {
  var alienName = utils.get('omnitrix');
  return sign.toLowerCase() == 'azmuth' ? `Transformed into ${alienName}` : `Wrong signature`;
}
