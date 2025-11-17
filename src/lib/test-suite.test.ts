import { describe, expect, test } from 'vitest'
import parseTestSuite from '../../test-suite/parse.test.json'
import parseSchema from '../../test-suite/parse.test.schema.json'
import stringifyTestSuite from '../../test-suite/stringify.test.json'
import stringifySchema from '../../test-suite/stringify.test.schema.json'
import tabularTestSuite from '../../test-suite/tabular.test.json'
import tabularSchema from '../../test-suite/tabular.test.schema.json'
import Ajv from 'ajv'

describe('test-suite', () => {
  test('should validate the parse test-suite against its JSON schema', () => {
    const ajv = new Ajv({ allErrors: false })
    const valid = ajv.validate(parseSchema, parseTestSuite)

    expect(ajv.errors).toEqual(null)
    expect(valid).toEqual(true)
  })

  test('should validate the stringify test-suite against its JSON schema', () => {
    const ajv = new Ajv({ allErrors: false })
    const valid = ajv.validate(stringifySchema, stringifyTestSuite)

    expect(ajv.errors).toEqual(null)
    expect(valid).toEqual(true)
  })

  test('should validate the table test-suite against its JSON schema', () => {
    const ajv = new Ajv({ allErrors: false })
    const valid = ajv.validate(tabularSchema, tabularTestSuite)

    expect(ajv.errors).toEqual(null)
    expect(valid).toEqual(true)
  })
})
