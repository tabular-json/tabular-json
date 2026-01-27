---
title: 'Tabular-JSON: implementations'
description: 'An overview of Tabular-JSON libraries available in different programming languages'
---

# Implementations

This page gives an overview of the Tabular-JSON libraries that are available in various programming languages.

## JavaScript/TypeScript

Documentation: https://www.npmjs.com/package/@tabular-json/tabular-json

Install via npm:

```
npm install @tabular-json/tabular-json
```

Usage:

```ts
import { parse, stringify } from '@tabular-json/tabular-json'

const text = `{
  "id": 1,
  "name": "Brandon",
  "friends": ###
    "id", "name"
    2,    "Joe"
    3,    "Sarah"
  ---
}`

const data = parse(text)

data.friends.push({ id: 4, name: 'Alan' })

const updatedText = stringify(data, { indentation: 2, trailingCommas: false })
// {
//   "id": 1,
//   "name": "Brandon",
//   "friends": ###
//     "id", "name"
//     2,    "Joe"
//     3,    "Sarah"
//     4,    "Alan"
//   ---
// }
```

## Python

Documentation: https://github.com/tabular-json/tabular-json-python

Install via PyPi:

```
pip install tabularjson
```

Usage:

```python
from tabularjson import parse, stringify, StringifyOptions

text = """{
    "id": 1,
    "name": "Brandon",
    "friends": ###
    "id", "name"
        2,    "Joe"
        3,    "Sarah"
    ---
}
"""

data = parse(text)
print(data)
# {
#     'id': 1,
#     'name': 'Brandon',
#     'friends': [
#         {'id': 2, 'name': 'Joe'},
#         {'id': 3, 'name': 'Sarah'}
#     ]
# }

data["friends"].append({"id": 4, "name": "Alan"})

options: StringifyOptions = {"indentation": 4, "trailingCommas": False}
updatedText = stringify(data, options)
print(updatedText)
# {
#     "id": 1,
#     "name": "Brandon",
#     "friends": ###
#         "id", "name"
#         2,    "Joe"
#         3,    "Sarah"
#         4,    "Alan"
#     ---
# }
```

## How to implement support in a new language

The [reference implementation in TypeScript](https://github.com/tabular-json/tabular-json/tree/main/src/lib) can be used to port support for Tabular-JSON in new programming languages. Also, the [ANTLR grammer of Tabular-JSON](/specification) can be used to generate a Tabular-JSON parser for the following languages: Java, C#, Python, JavaScript, TypeScript, Go, C++, Swift, PHP, DART.

There is a JSON based Test Suite available that can be used to ensure that implementations of Tabular-JSON match the official specification, see [Tabular-JSON Test Suite](https://github.com/tabular-json/tabular-json/tree/main/test-suite/README.md).
