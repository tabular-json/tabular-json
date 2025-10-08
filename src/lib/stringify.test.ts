import { describe, expect, test } from 'vitest'
import { stringify } from './stringify.js'
import suite from '../../test-suite/stringify.test.json'
import type { StringifyTestEnum, StringifyTestSuite } from '../../test-suite/stringify.test'

function isTestEnum(test: unknown): test is StringifyTestEnum {
  return !!test && typeof (test as Record<string, unknown>)['input_enum'] === 'string'
}

const testsByCategory = Object.groupBy(suite.groups, (group) => group.category) as Record<
  string,
  StringifyTestSuite['groups']
>

for (const [category, testGroups] of Object.entries(testsByCategory)) {
  describe(category, () => {
    for (const group of testGroups) {
      describe(group.description, () => {
        for (const currentTest of group.tests) {
          if (isTestEnum(currentTest)) {
            const description = `input_enum = ${JSON.stringify(currentTest.input_enum)}`

            test(description, () => {
              const { input_enum, output } = currentTest

              switch (input_enum) {
                case 'negative_zero':
                  expect(stringify(-0, group.options)).toEqual(output)
                  break

                case 'positive_infinity':
                  expect(stringify(Infinity, group.options)).toEqual(output)
                  break

                case 'negative_infinity':
                  expect(stringify(-Infinity, group.options)).toEqual(output)
                  break

                case 'not_a_number':
                  expect(stringify(NaN, group.options)).toEqual(output)
                  break

                default:
                  throw new Error(`Unknown input_enum value "${input_enum}"`)
              }
            })
          } else {
            const description = `input = ${JSON.stringify(currentTest.input)}`

            test(description, () => {
              const { input, output } = currentTest

              expect(stringify(input, group.options)).toEqual(output)
            })
          }
        }
      })
    }
  })
}

test('should handle unsupported data types in stringify', function () {
  expect(stringify(undefined)).toEqual('')
  expect(stringify(function () {})).toEqual('')
  expect(stringify(Symbol('test'))).toEqual('')

  expect(
    stringify([
      2,
      'str',
      null,
      undefined,
      true,
      function () {
        console.log('test')
      }
    ])
  ).toEqual('[2,"str",null,null,true,null]')

  expect(
    stringify({
      a: 2,
      b: 'str',
      c: null,
      d: undefined,
      e: function () {
        console.log('test')
      }
    })
  ).toEqual('{"a":2,"b":"str","c":null}')

  expect(stringify({ '\\\\d': 1 })).toEqual('{"\\\\\\\\d":1}')

  expect(
    stringify({
      a: 2,
      toJSON: function () {
        return 'foo'
      }
    })
  ).toEqual('"foo"')

  expect(stringify({ fn: () => {} }, { indentation: 2 })).toEqual('{}')

  // TODO: Symbol
  // TODO: ignore non-enumerable properties
})
