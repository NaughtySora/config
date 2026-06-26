'use strict';

const { iterator } = require("naughty-util");
const { env } = require("node:process");

const ESCAPE = /[.*+?^${}()|[\]\\]/g;

const escape = string => string.replace(ESCAPE, '\\$&');

const regex = prefix =>
  `^(?<prefix>${escape(prefix)})(?::(?<type>[A-Za-z0-9]+))\
?_(?<key>[A-Za-z_][A-Za-z0-9_]*)$`;

const parsers = {
  int: value => parseInt(value, 10),
  hex: value => parseInt(value, 16),
  oct: value => parseInt(value, 8),
  binary: value => parseInt(value, 2),
  float: parseFloat,
  big: BigInt,
  json: JSON.parse,
  bool: Boolean,
  buffer: Buffer.from,
  buffer64: value => Buffer.from(value, "base64"),
  bufferhex: value => Buffer.from(value, "hex"),
  buffer64url: value => Buffer.from(value, "base64url"),
  null: () => null,
  undefined: () => undefined,
};

const parse = (key, value) => {
  if (!Reflect.has(parsers, key)) return value;
  return parsers[key](value);
};

const load = prefix => {
  if (!prefix) throw new Error('load prefix is required');
  const out = {};
  const reg = new RegExp(regex(prefix));
  for (const entry of iterator.object.entries(env)) {
    const matched = entry[0].match(reg);
    if (!matched) continue;
    const groups = matched.groups;
    const parts = groups.key.trim().toLowerCase().split('_');
    let target = out;
    for (let i = 0; i < parts.length - 1; i++) {
      target = target[parts[i]] ??= {};
    }
    target[parts[parts.length - 1]] = groups.type ?
      parse(groups.type.toLowerCase(), entry[1]) :
      entry[1];
  }
  return out;
};

module.exports = { load };
