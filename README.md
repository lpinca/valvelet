# valvelet

[![Version npm][npm-valvelet-badge]][npm-valvelet]
[![Build Status][travis-valvelet-badge]][travis-valvelet]
[![Coverage Status][coverage-valvelet-badge]][coverage-valvelet]

This is a small utility to limit the execution rate of a function. It is useful
for scenarios such as REST APIs consumption where the amount of requests per
unit of time should not exceed a given threshold.

This module is very similar to [`node-function-rate-limit`][function-rate-limit].
The difference is that `valvelet` works seamlessly with promise-returning
functions.

## Install

```
npm install --save valvelet
```

## API

The module exports a single function that takes three arguments.

### valvelet(fn, limit, interval[, size])

Returns a function which should be called instead of `fn`. The function returned
by `valvelet` returns a promise which resolves to the value returned by `fn`.

**Arguments**

- `fn` - The function to rate limit calls to.
- `limit` - The maximum number of allowed calls per `interval`.
- `interval` - The timespan where `limit` is calculated.
- `size` - The maximum size of the internal queue. Defaults to 2^32 - 1 which is
  the maximum array size in JavaScript.

When the internal queue is at capacity, the function returned by valvelet
returns a promise that is rejected.

**Example**

```js
const valvelet = require('valvelet');

const get = valvelet(function request(i) {
  return Promise.resolve(`${i} - ${new Date().toISOString()}`);
}, 2, 1000);

function log(data) {
  console.log(data);
}

for (let i = 0; i < 10; i++) {
  get(i).then(log);
}

/*
0 - 2016-06-02T20:07:33.843Z
1 - 2016-06-02T20:07:33.844Z
2 - 2016-06-02T20:07:34.846Z
3 - 2016-06-02T20:07:34.846Z
4 - 2016-06-02T20:07:35.846Z
5 - 2016-06-02T20:07:35.846Z
6 - 2016-06-02T20:07:36.848Z
7 - 2016-06-02T20:07:36.848Z
8 - 2016-06-02T20:07:37.851Z
9 - 2016-06-02T20:07:37.851Z
*/
```

## License

[MIT](LICENSE)

[npm-valvelet-badge]: https://img.shields.io/npm/v/valvelet.svg
[npm-valvelet]: https://www.npmjs.com/package/valvelet
[travis-valvelet-badge]: https://img.shields.io/travis/lpinca/valvelet/master.svg
[travis-valvelet]: https://travis-ci.org/lpinca/valvelet
[coverage-valvelet-badge]: https://img.shields.io/coveralls/lpinca/valvelet/master.svg
[coverage-valvelet]: https://coveralls.io/r/lpinca/valvelet?branch=master
[function-rate-limit]: https://github.com/wankdanker/node-function-rate-limit
