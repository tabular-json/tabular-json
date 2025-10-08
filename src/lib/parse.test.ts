import { describe, expect, test } from 'vitest'
import { parse } from './parse.ts'
import type { ParseTestEnum, ParseTestException, ParseTestSuite } from '../../test-suite/parse.test'
import suite from '../../test-suite/parse.test.json' with { type: 'json' }

function isTestException(test: unknown): test is ParseTestException {
  return !!test && typeof (test as Record<string, unknown>).throws === 'string'
}

function isTestEnum(test: unknown): test is ParseTestEnum {
  return !!test && typeof (test as Record<string, unknown>)['output_enum'] === 'string'
}

const testsByCategory = Object.groupBy(suite.groups, (group) => group.category) as Record<
  string,
  ParseTestSuite['groups']
>

for (const [category, testGroups] of Object.entries(testsByCategory)) {
  describe(category, () => {
    for (const group of testGroups) {
      describe(group.description, () => {
        for (const currentTest of group.tests) {
          const description = `input = '${currentTest.input}'`

          if (isTestException(currentTest)) {
            test(description, () => {
              const { input, throws } = currentTest

              expect(() => parse(input)).toThrow(throws)
            })
          } else if (isTestEnum(currentTest)) {
            test(description, () => {
              const { input, output_enum } = currentTest

              switch (output_enum) {
                case 'negative_zero':
                  expect(parse(input)).toEqual(-0)
                  break

                case 'positive_infinity':
                  expect(parse(input)).toEqual(Infinity)
                  break

                case 'negative_infinity':
                  expect(parse(input)).toEqual(-Infinity)
                  break

                case 'not_a_number':
                  expect(parse(input)).toBeNaN()
                  break

                default:
                  throw new Error(`Unknown output_enum value "${output_enum}"`)
              }
            })
          } else {
            test(description, () => {
              const { input, output } = currentTest

              expect(parse(input)).toEqual(output)
            })
          }
        }
      })
    }
  })
}
