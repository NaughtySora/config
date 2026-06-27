'use strict';

const { copy, register } = require('./lib/config.js');
const { load } = require('./lib/env.js');

module.exports = { copy, register, load };
