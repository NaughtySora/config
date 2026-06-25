# Config
a strict, immutable, runtime-validated data tree with fail-fast property access

## Motivation and intent
- as someone said, "libraries, frameworks and repositories, first-hand resolve 
problems of the creators of those technologies".
- I faced some issues during developing and decided to reflect and make config that will
help me.
- Config focuses on my own preferences in abstractions and reflects my way of thinking
1. Simplicity in use.
2. Strictness instead of permissiveness.
3. SoC.
4. Smallest abstraction overhead.
5. JS first, TS as documentation and auto-complete tool.

Config will evolve time to time during usage on different projects and tech stacks.
I don't expect first take to be perfect fit even for myself.
I want to show usage with different environments and touch specific sides of development,
from ts like business logic and currently wide-used tech stack and pure js system development.

## Schema, validation and types
When i first wanted to create a config, i was look to some sort of simple schema validation.
But it leads to many duplications and gives just faster fail model.
I moved from:
```
data + schema -> config() -> check() -> fail | void
```
To:
more light version, less strict but more centralized.
```
data -> config -> access -> fail | data
```
Why?
As i was saying, when we deal with business code,
usually it means "strong" typing, illusion of control and strictness.
I can't changed it, i can only deal(cope) with it.
Cause if we introduce schema, types, data.
it leads to
1. parse | map | transform data from env.
```js
const config = {
  http: {
    port: parseInt(process.env.HTTP_CODE, 10),
  },
};
```
2. type it
```ts
  interface Config {
    http: {
      port: number;
    };
  }
  const config = {
    http: {
      port: parseInt(process.env.HTTP_CODE, 10),
    },
  } satisfies Config;
```
3. create schema
```js
const json = {
  "$schema": "https://json-schema.org",
  "title": "Config",
  "type": "object",
  "properties": {
    "http": {
      "type": "object",
      "properties": {
        "port": {
          "type": "integer",
          "minimum": 1,
          "maximum": 65535
        }
      },
      "required": ["port"],
      "additionalProperties": false
    }
  },
  "required": ["http"],
  "additionalProperties": false
};
```
4. create config instance
```js
export default new Config(json, data);
```
Now after all that, every new variable, requires:
1. env
2. mapping, parsing, transforming
3. adding to schema
4. adding to types
5. if you use config in tests, you need it there too, also need the way to create config for testing, usually dev .env acceptable for testing, but needs some overriding.

I want to reduce overhead and complexity but leave strictness, fast-access.

## Tedious hand env remapping
Another thing i want to solve later.
My idea is to create a contract:
```
schema:
[prefix:type?]_[...obj?]_[key]=[value]
.env:
APP:I_HTTP_PORT=3000
js:
{
  http: {
    port: parseInt(env.APP:I_HTTP_PORT, 10),
  },
};
APP - prefix, means parse this variable
:I - optional data type, S is default, means string, I - integer
obj - nesting
key - key properly
value
```
