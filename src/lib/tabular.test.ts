import { describe, expect, test } from 'vitest'
import suite from '../../test-suite/tabular.test.json'
import type { TabularTestSuite } from '../../test-suite/tabular.test'
import { collectFields, isTabular } from './tabular.ts'

const testsByCategory = Object.groupBy(suite.groups, (group) => group.function) as Record<
  string,
  TabularTestSuite['groups']
>

const functions = {
  isTabular,
  collectFields
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
