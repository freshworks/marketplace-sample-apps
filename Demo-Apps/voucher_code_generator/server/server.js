const voucherCodeGenerator = require("voucher-code-generator");

exports = {
  generateVoucher: function () {
    let voucher = voucherCodeGenerator.generate({
      length: 8,
      count: 1,
    });
    renderData(null, voucher);
  },
};
