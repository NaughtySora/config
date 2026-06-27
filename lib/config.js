'use strict';

const {
  iterator: { object: { entries } },
  reflection: { isPrimitive, },
} = require("naughty-util");
const { merge, is } = require('./object.js');

const repository = new WeakMap();

const register = (data) => {
  if (!is(data)) throw new TypeError('Can\'t register non object value');
  let initialized = false;
  const handlers = {
    get(target, key, receiver) {
      if (!Reflect.has(target, key) && initialized) {
        throw new Error(`key ${key} doesn't exist`);
      }
      return target[key];
    },
  };
  return (() => {
    const vessel = new Proxy({}, handlers);
    repository.set(vessel, data);
    const stack = [[vessel, data]];
    const objects = new Set([vessel]);
    while (stack.length > 0) {
      const entry = stack.pop();
      for (const { 0: key, 1: value } of entries(entry[1])) {
        const vessel = is(value) ? {} : Array.isArray(value) ? [] : null;
        if (vessel !== null) {
          entry[0][key] ??= new Proxy(vessel, handlers);
          objects.add(vessel);
          stack.push([vessel, value]);
        } else {
          if (isPrimitive(value)) {
            entry[0][key] = value;
          } else if (Buffer.isBuffer(value)) {
            entry[0][key] = Buffer.from(value);
          } else {
            throw new TypeError(`Unsupported config value type of key ${key}`);
          }
        }
      }
    }
    for (const object of objects) Object.freeze(object);
    initialized = true;
    return vessel;
  })();
};

const copy = (config, source) => {
  const root = repository.get(config);
  if (root === undefined) {
    throw new Error('Config can\'t be copied');
  }
  return register(merge(merge({}, root), source));
};

module.exports = { register, copy };