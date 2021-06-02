function mysettimeOut(fn, time) {
  let timer = null;

  function settime() {
    fn();
    timer = setTimeout(interval, time);
  }
  settime();
  mysettimeOut.cancel = () => {
    clearTimeout(timer);
  };
}

function setinterval(fn, time) {
  const timer = setInterval(() => {
    clearInterval(timer);
    fn();
  }, time);
}

class emit {
  constructor() {
    this.events = {};
  }
  on(type, callback) {
    if (this.events[type]) {
      this.events[type].push(callback);
    } else {
      this.events[type] = [callback];
    }
  }
  emit(type, ...rest) {
    this.events[type] &&
      this.events[type].forEach((fn) => {
        fn.apply(this, rest);
      });
  }
  off(type, callback) {
    if (!this.events[type]) return;
    this.events[type] = this.events[type].filters((item) => {
      return item !== callback;
    });
  }
  once(type, callback) {
    function fn() {
      callback();
      this.off(type, fn);
    }
    this.on(type, fn);
  }
}

function falten(arr) {
  if (!arr.length) return;
  arr.reduce((pre, cur) => {
    Array.isArray(cur) ? [...pre, falten(cur)] : [...pre, cur];
  });
}
