'use strict';

const { loadEnvFile, env } = require('node:process');
const { describe, it } = require("node:test");
const { load } = require("../lib/env.js");
const { Buffer } = require('node:buffer');
const assert = require('node:assert/strict');
loadEnvFile('.env');

describe('env - load', () => {
  it('simple', () => {
    // HTTP_PORT = 3000 (skipped, no prefix)
    // APP_HTTP_PORT = 3000 (skipped, no prefix)
    // APP:INT_PORT = 3000
    // APP:I_HTTP_PORT = 3000 (wrong type)
    // APP:I_HTTP_HTTP_PORT = 3000 (wrong type)
    // APP:INT_HTTP_HTTP_HTTP_PORT = 3000
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
    // $: INT_SIZE = 33
    // $: HEX_HEX = 0xDeadBeef
    // $: OCT_OCT_VALUE = 755
    // $: BINARY_ANSWER =00101010
    // $: FLOAT_DEEP_FLOAT_VALUE = 33.35123
    // $: BIG_BIGINT = 12456842348230948230948230942309489234832904823094
    // $: JSON_USER_ADDRESS = { "street": "abc 12", "city": "New York", "Country": "USA" }
    // $: BOOL_HTTP_DEBUG = true
    // $: BUFFER_SERVICE0_SECRET = unicode_secret_for_some_reason
    // $: BUFFER64_SERVICE1_SECRET = 40bBaUZ + q7c / WMv3GlnHHA ==
    // $: BUFFERHEX_SERVICE2_SECRET =018d49ff7f7cedf0edf17d90d224d6f9
    // $: BUFFER64URL_SERVICE3_SECRET = _3md6vtKJE2vBrfE7XX7rg
    // $: NULL_NULLABLE_1 = 1
    // $: UNDEFINED_NULLABLE_2 = 1
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
        nullable: { '1': null, '2': undefined },
        oct: { value: 493 }
      },
    );
  });

  it('invalid - empty', () => {
    assert.throws(() => load(), { message: "load prefix is required" });
    assert.throws(() => load(''), { message: "load prefix is required" });
    // %:INT=1
    assert.deepEqual(load('%'), {});
  });
});