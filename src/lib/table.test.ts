import { describe, expect, test } from 'vitest'
import suite from '../../test-suite/table.test.json'
import type { TableTestSuite } from '../../test-suite/table.test'
import {
  isTable,
  collectFields,
  noNestedTables,
  noNestedArrays,
  noLongStrings,
  isHomogeneous
} from './table.js'

const testsByCategory = Object.groupBy(suite.groups, (group) => group.function) as Record<
  string,
  TableTestSuite['groups']
>

const functions = {
  isTable,
  collectFields,
  noNestedTables,
  noNestedArrays,
  noLongStrings,
  isHomogeneous
}

for (const [category, testGroups] of Object.entries(testsByCategory)) {
  describe(category, () => {
    for (const group of testGroups) {
      describe(group.description, () => {
        for (const currentTest of group.tests) {
          const description = `${group.function}(${JSON.stringify(currentTest.input)}) == ${JSON.stringify(currentTest.output)}`
          const fn = functions[group.function]
          if (!fn) {
            throw new Error(`Unknown function "${group.function}"`)
          }

          test(description, () => {
            const { input, output } = currentTest

            expect(fn(input)).toEqual(output)
          })
        }
      })
    }
  })
}
