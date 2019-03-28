window.cti = {
  call_callback: [],
  end_callback: [],

  onCallReceieve(callback) {
    this.call_callback.push(callback)
    return {
      onEnd: callback => {
        this.end_callback.push(callback)
      }
    }
  },

  _call(phone) {
    this.call_callback.map(cb => cb(phone))
  },

  call(phone) {
    return {
      onEnd: callback => {
        this.end_callback.push(callback)
      }
    }
  },

  _end(phone) {
    this.end_callback.map(cb => cb(phone))
  },
}
