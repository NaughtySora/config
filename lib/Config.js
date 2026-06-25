'use strict';

const {
  iterator: { object: { entries } },
  reflection: { isPrimitive, },
} = require("naughty-util");
const { merge, is } = require('./object.js');

const factories = [
  () => ({}),
  () => [],
];

class Config {
  #initialized = false;

  constructor(body) {
    return this.#register(body);
  }

  #register(body) {
    const vessel = this.#proxify({});
    Config.#repository.set(vessel, body);
    const stack = [[vessel, body]];
    const objects = new Set([vessel]);
    while (stack.length > 0) {
      const entry = stack.pop();
      for (const { 0: key, 1: value } of entries(entry[1])) {
        const type = is(value) ? 0 : Array.isArray(value) ? 1 : 2;
        if (type < 2) {
          const vessel = entry[0][key] ??= this.#proxify(factories[type]());
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
    this.#initialized = true;
    return vessel;
  }

  #proxify(object) {
    return new Proxy(object, { get: this.#get.bind(this) });
  }

  #get(target, key, receiver) {
    if (key === "toJSON") return target[key];
    if (!Reflect.has(target, key) && this.#initialized) {
      throw new Error(`key ${key} doesn't exist`);
    }
    return target[key];
  }

  static copy(target, source) {
    const root = Config.#repository.get(target);
    if (root === undefined) {
      throw new Error('Target can\'t be copied');
    }
    return new Config(merge(root, source));
  }

  static #repository = new WeakMap();
}

module.exports = {
  Config,
};
