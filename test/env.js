'use strict';

const { loadEnvFile, env } = require('node:process');
const { describe, it } = require("node:test");
const { load } = require("../lib/env.js");
const assert = require('node:assert/strict');
const { reflection } = require('naughty-util');
loadEnvFile('.env');

describe.only('env', () => {
  it('load', () => {
    // 0. HTTP_PORT=3000 (skipped) no prefix
    // 1. APP:INT_PORT=3000 (ok, to int)
    // 2. APP_HTTP_PORT=3000 (ok, no parsing)
    // 3. APP:I_HTTP_PORT=3000 (ok, invalid parser key)
    // 4. APP:I_HTTP_HTTP_PORT=3000 (ok, invalid parser key)
    // 5. APP:INT_HTTP_HTTP_HTTP_PORT=3000 (ok, to int)
    const envs = load('APP');
    assert.deepEqual(envs,
      {
        http: {
          http: {
            http: {
              port: 3000 // 5.
            },
            port: '3000' // 4.
          },
          port: '3000' // 2. 3.
        },
        port: 3000 // 1.
      });
  });
});