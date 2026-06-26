'use strict';

const { loadEnvFile, env } = require('node:process');
const { describe, it } = require("node:test");
const { load } = require("../lib/env.js");
const { Buffer } = require('node:buffer');
const assert = require('node:assert/strict');
loadEnvFile('.env');

describe('env - load', () => {
  it('simple', () => {
    assert.deepEqual(load('APP'),
      {
        http: {
          http: {
            http: {
              port: 3000
            },
            port: '3000'
          },
          port: '3000'
        },
        port: 3000
      });
  });

  it('with types', () => {
    assert.deepEqual(load('$'),
      {
        bigint: 12456842348230948230948230942309489234832904823094n,
        answer: 42,
        http: { debug: true },
        service2: { secret: Buffer.from('018d49ff7f7cedf0edf17d90d224d6f9', 'hex') },
        service1: { secret: Buffer.from('40bBaUZ+q7c/WMv3GlnHHA==', 'base64') },
        service0: {
          secret: Buffer.from('unicode_secret_for_some_reason', 'utf-8'),
        },
        service3: {
          secret: Buffer.from('_3md6vtKJE2vBrfE7XX7rg', 'base64url'),
        },
        deep: { float: { value: 33.35123 } },
        hex: 3735928559,
        size: 33,
        user: { address: { street: 'abc 12', city: 'New York', Country: 'USA' } },
        nullabla: { '1': null, '2': undefined },
        oct: { value: 493 }
      },
    );
  });
});