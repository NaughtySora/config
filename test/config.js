'use strict';

const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
const { register, copy } = require('../main');

// some limitations with this approach
// toString and other properties will lose their object context
// i don't want to add this binding and conditions for proxy getter
// dropping proxy is also seems not reasonable
// i will leave it like this till i really need those methods, 
// or its really uncomfortable to use

describe('config', () => {
  it('register', () => {
    const valid = {
      a: ['string', 1, true],
      b: [1, 2, 3],
      c: Buffer.from('abc'),
      d: 1,
      e: 'string',
      f: true,
      g: false,
      a1: {
        a: ['string', 1, true],
        b: [1, 2, 3],
        c: Buffer.from('abc'),
        d: 1,
        e: 'string',
        f: true,
        g: false,
        a2: [{
          a: ['string', 1, true],
          b: [1, 2, 3],
          c: Buffer.from('abc'),
          d: 1,
          e: 'string',
          f: true,
          g: false,
        }],
      },
    };
    const config = register(valid);
    assert.equal(valid.a[0], config.a[0]);
    assert.equal(valid.a[1], config.a[1]);
    assert.equal(valid.a[2], config.a[2]);
    assert.deepEqual(valid.c, config.c);
    assert.deepEqual(valid.d, config.d);
    assert.deepEqual(valid.a1.f, config.a1.f);
    assert.deepEqual(valid.a1.a2[0].c, config.a1.a2[0].c);
    assert.throws(() => config.z, { message: 'key z doesn\'t exist' });
    assert.throws(() => config.a1.a2[1], { message: 'key 1 doesn\'t exist' });
  });

  it('copy', () => {
    const config0 = register({
      http: {
        port: 3000,
        debug: true,
      },
      storage: {
        pg: {
          port: 5432,
          database: 'admin',
          password: 'admin',
          username: 'admin',
        }
      },
    });
    const config1 = copy(config0, {
      http: [3000, true],
      storage: {
        redis: {
          port: 6379,
        },
      },
    });
    assert.ok(Array.isArray(config1.http));
    assert.equal(config1.http[0], 3000);
    assert.equal(config1.http[1], true);
    assert.throws(() => config1.http[2], { message: 'key 2 doesn\'t exist' });
  });
});