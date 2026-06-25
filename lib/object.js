'use strict';

const {
  iterator: { object: { entries } },
  reflection: { isPrimitive },
} = require("naughty-util");

const { getPrototypeOf, prototype } = Object;

const OBJECT_PROTOS = new Set([null, prototype]);

/**
 * @description
 * if object came from different realm, manually override prototype
 * ```js
 * const obj = {};
 * Object.setPrototype(obj, Object.prototype);
 * ```
 */
const is = entity =>
  typeof entity === "object" &&
  entity !== null &&
  OBJECT_PROTOS.has(getPrototypeOf(entity));

const merge = (target, source) => {
  if (isPrimitive(source) || isPrimitive(target)) return target;
  const stack = [[target, source]];
  while (stack.length > 0) {
    const node = stack.pop();
    const target = node[0];
    for (const { 0: key, 1: value } of entries(node[1])) {
      if (is(target[key]) && is(value)) stack.push([target[key], value]);
      else target[key] = value;
    }
  }
  return target;
};

module.exports = { is, merge };