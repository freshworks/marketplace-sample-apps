window.Buffer = buffer.Buffer;
window.base85 = new ascii85.Ascii85;

function encode(str) {
  const hex = Buffer.from(str.replace(/\-/g, ''), 'hex');
  return base85.encode(hex).toString();
};

function decode(str) {
  return Buffer.from(base85.decode(str)).toString('hex');
}
