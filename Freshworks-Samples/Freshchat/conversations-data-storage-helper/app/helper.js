window.Buffer = buffer.Buffer;
window.base85 = new ascii85.Ascii85;

function encode(str) {
  const hex = Buffer.from(str.replace(/\-/g, ''), 'hex');
  return base85.encode(hex).toString();
};

function decode(str) {
  const uuid = Buffer.from(base85.decode(str)).toString('hex');
  return `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20)}`;
}
