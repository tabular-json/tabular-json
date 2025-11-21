# Tabular-JSON: JSON with tables

Tabular-JSON is:

- a replacement for CSV without its ambiguities and limitation to tabular data structures
- a replacement for JSON without its verbosity with tabular data

Learn more:

- Website: <https://tabular-json.org/>
- Playground: <https://tabular-json.org/playground>
- Background article: <https://jsoneditoronline.org/indepth/specification/tabular-json/>

Here is an example of Tabular-JSON:

```
{
  "name": "rob",
  "hobbies": [
    "swimming",
    "biking",
  ],
  "friends": ---
    "id", "name",  "address"."city", "address"."street"
    2,    "joe",   "New York",       "1st Ave"
    3,    "sarah", "Washington",     "18th Street NW"
  ---,
  "address": {
    "city": "New York",
    "street": "1st Ave",
  }
}
```

## JavaScript API

### Install

Install using npm:

```
npm install @tabular-json/tabular-json
```

### Use

```js
import { parse, stringify } from '@tabular-json/tabular-json'

const text = `{
  "id": 1,
  "name": "Brandon",
  "friends": ---
    "id", "name"
    2,    "Joe"
    3,    "Sarah"
  ---
}`

const data = parse(text)

data.friends.push({ id: 4, name: 'Alan' })

const updatedText = stringify(data, {
  indentation: 2,
  trailingCommas: false
})
// {
//   "id": 1,
//   "name": "Brandon",
//   "friends": ---
//     "id", "name"
//     2,    "Joe"
//     3,    "Sarah"
//     4,    "Alan"
//   ---
// }
```

### API

```ts
type parse = (text: string) => unknown

type stringify = (json: unknown, options?: StringifyOptions) => string

interface StringifyOptions {
  indentation?: number | string
  trailingCommas?: boolean
  outputAsTable?: <T>(tabularData: Tabular<T>) => boolean
}
```

The option `outputAsTable` is explained in detail in the section [Output as table](#output-as-table) below.

### Output as table

Data is tabular when it is an array containing at least one item, where every item is an object. Stringifying tabular data as a table normally results in the smallest output, but it is not always the most readable way. For example having nested tables inside a table is not very readable. Also, having a table containing a field like "comments" or "description" which contains long texts results in a very wide column, making the formatted table hard to read.

Depending on your use case, you can configure a strategy for when to output tabular data as a table. This can be done using the option `outputAsTable`. The function `outputAsTable` is invoked for all tabular data in the input json and returns true when the data should be stringified as a table.

The `tabular-json` library comes with a number of built-in utility functions that can be used with `outputAsTable`:

- `always(tabularData)`: always serialize tabular data as a table, also when the data contains nested arrays. This is the default value of option `outputAsTable`.
- `noNestedArrays(tabularData)`: serialize tabular data as a table when the data does not contain nested arrays.
- `noNestedTables(tabularData)`: serialize tabular data as a table when the data does not contain nested tables. Allows nested arrays when the contain primitive values like numbers or strings.
- `isHomogeneous(tabularData)`: serialize tabular data as a table when the structure is homogeneous, that is every item has the exact same keys and nested keys.
- `noLongStrings(tabularData [, maxLength])`: serialize tabular data as a table when the data does not contain long text fields

There an example:

```js
import { stringify, noLongStrings } from 'tabular-json'

const data = {
  careTakers: [
    { id: 1001, name: 'Joe' },
    { id: 1002, name: 'Sarah' }
  ],
  animals: [
    {
      animalId: 1,
      name: 'Elephant',
      description: 'Elephants are the largest living land animals.'
    },
    {
      animalId: 2,
      name: 'Giraffe',
      description: 'The giraffe is the tallest living terrestrial animal on Earth'
    }
  ]
}

// Use the default table strategy
console.log(stringify(data, { indentation: 2 }))
// {
//   "careTakers": ---
//     "id", "name"
//     1001, "Joe"
//     1002, "Sarah"
//   ---,
//   "animals": ---
//     "animalId", "name",     "description"
//     1,          "Elephant", "Elephants are the largest living land animals."
//     2,          "Giraffe",  "The giraffe is the tallest living terrestrial animal on Earth"
//   ---
// }

// Do not output tables containing long strings as table
const maxLength = 20
console.log(
  stringify(data, {
    indentation: 2,
    outputAsTable: (tabularData) => noLongStrings(tabularData, maxLength)
  })
)
// {
//   "careTakers": ---
//     "id", "name"
//     1001, "Joe"
//     1002, "Sarah"
//   ---,
//   "animals": [
//     {
//       "animalId": 1,
//       "name": "Elephant",
//       "description": "Elephants are the largest living land animals."
//     },
//     {
//       "animalId": 2,
//       "name": "Giraffe",
//       "description": "The giraffe is the tallest living terrestrial animal on Earth"
//     }
//   ]
// }
```

Besides using the build-in examples, You can implement your own function to determine when to output tabular data as a table. If you have multiple tables and only some of them must be serialized as table, you can for example write some logic to determine which table you're dealing with by looking at the fields of the first item of the array:

```js
function isAnimalTable(tabularData) {
  return 'animalId' in tabularData[0]
}

// Using the same data as in the previous example
console.log(
  stringify(data, {
    indentation: 2,
    outputAsTable: (tabularData) => !isAnimalTable(tabularData)
  })
)
// {
//   "careTakers": ---
//     "id", "name"
//     1001, "Joe"
//     1002, "Sarah"
//   ---,
//   "animals": [
//     {
//       "animalId": 1,
//       "name": "Elephant",
//       "description": "Elephants are the largest living land animals."
//     },
//     {
//       "animalId": 2,
//       "name": "Giraffe",
//       "description": "The giraffe is the tallest living terrestrial animal on Earth"
//     }
//   ]
// }
```

## Test Suite

There is a JSON based Test Suite available that can be used to ensure that implementations of Tabular-JSON match the official specification, see [Tabular-JSON Test Suite](/test-suite/README.md).
