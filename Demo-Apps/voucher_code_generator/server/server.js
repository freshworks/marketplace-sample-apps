exports = {
  generateVoucher: function () {
    const voucher = Math.random().toString(36).slice(2);
    renderData(null, voucher);
  },
};
