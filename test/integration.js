'use strict';

const { describe, it } = require("node:test");
const { register, copy, load } = require("../main");
const assert = require("node:assert/strict");

describe('integration env loader and config', () => {
  // loading solves manual mapping problem, 
  // but introduces "any" return type problem
  const config = register(load('$'));
  assert.equal(config.answer, 42);
  assert.throws(
    () => config.something,
    { message: 'key something doesn\'t exist' }
  );
  const test = copy(config, {
    answer: 43,
    deep: { key: 'value' },
    service0: {
      secret: Buffer.from('hello'),
    },
  });
  assert.deepEqual(test.service0.secret, Buffer.from('hello'));
  assert.equal(test.answer, 43);
  assert.equal(test.deep.key, 'value');
});