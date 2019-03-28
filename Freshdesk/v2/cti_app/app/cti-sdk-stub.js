// ----------------------------
// NOTE: cti is a mock object, you must replace with the correct sdk from a CTI provider
// ----------------------------
window.cti = {
  call_callback: [],
  end_callback: [],

  onCallReceieve(callback) {
    this.call_callback.push(callback)
    return { onEnd: this.end_callback.callback.push }
  },

  _call(phone) {
    this.call_callback.map(cb => cb(phone))
  },

  call() {
    return { onEnd: this.end_callback.push }
  },

  _end(phone) {
    this.end_callback.map(cb => cb(phone))
  },
}
