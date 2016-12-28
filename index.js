'use strict';

/**
 * Limit the execution rate of a function.
 *
 * @param {Function} fn The function to rate limit calls to
 * @param {Number} limit The maximum number of allowed calls per `interval`
 * @param {Number} interval The timespan where `limit` is calculated
 * @param {Number} size The maximum size of the queue
 * @return {Function}
 * @public
 */
function valvelet(fn, limit, interval, size) {
  const queue = [];
  let count = 0;

  size || (size = Math.pow(2, 32) - 1);

  function timeout() {
    count--;
    if (queue.length) shift();
  }

  function shift() {
    count++;
    const data = queue.shift();
    data[2](fn.apply(data[0], data[1]));
    setTimeout(timeout, interval);
  }

  return function limiter() {
    const args = arguments;

    return new Promise((resolve, reject) => {
      if (queue.length === size) return reject(new Error('Queue is full'));

      queue.push([this, args, resolve]);
      if (count < limit) shift();
    });
  };
}

module.exports = valvelet;
