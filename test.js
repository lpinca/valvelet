'use strict';

const test = require('tape');

const valvelet = require('.');

test('is exported as a function', (t) => {
  t.equal(typeof valvelet, 'function');
  t.end();
});

test('returns a function that returns a promise', (t) => {
  const limit = valvelet(() => 'foo', 1, 10);

  limit().then((value) => {
    t.equal(value, 'foo');
    t.end();
  });
});

test('calls the original function with the same context and arguments', (t) => {
  const limit = valvelet(function () {
    t.deepEqual(arguments, (function () { return arguments; })(1, 2));
    t.equal(this, 'foo');
  }, 1, 10);

  limit.call('foo', 1, 2).then(t.end);
});

test('allows to limit the queue size', (t) => {
  const limit = valvelet(() => {}, 1, 10, 2);

  limit();
  limit();
  limit();
  limit().then(() => {
    t.fail('Promise should not be fulfilled');
    t.end();
  }, (err) => {
    t.equal(err instanceof Error, true);
    t.equal(err.message, 'Queue is full');
    t.end();
  });
});

test('limits the execution rate of the original function', (t) => {
  const values = [1, 2, 3, 4, 5];
  const start = Date.now();
  const times = [];
  const limit = valvelet((arg) => {
    times.push(Date.now());
    return Promise.resolve(arg);
  }, 2, 100);

  Promise.all(values.map((i) => limit(i))).then((data) => {
    t.deepEqual(data, values);
    times.forEach((time, i) => {
      const delay = Math.floor(i / 2) * 100;
      const diff = time - start - delay;

      t.ok(diff >= 0 && diff < 20);
    });
    t.end();
  });
});
