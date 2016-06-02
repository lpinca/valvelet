'use strict';

/**
 * Limit the execution rate of a function.
 *
 * @param {Function} fn The function to rate limit calls to
 * @param {Number} limit The maximum number of allowed calls per `interval`
 * @param {Number} interval The timespan where `limit` is calculated
 * @return {Function}
 * @public
 */
function valvelet(fn, limit, interval) {
  const queue = [];
  let count = 0;

  function timeout() {
    count--;
    if (queue.length) shift();
  }

  function shift() {
    count++;
    setTimeout(timeout, interval);
    const data = queue.shift();
    data[2](fn.apply(data[0], data[1]));
  }

  return function limiter() {
    const args = arguments;

    return new Promise((resolve) => {
      queue.push([this, args, resolve]);
      if (count < limit) shift();
    });
  };
}

module.exports = valvelet;
