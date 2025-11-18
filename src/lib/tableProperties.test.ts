import { describe, expect, test } from 'vitest'
import { isHomogeneous, noLongStrings, noNestedArrays, noNestedTables } from './tableProperties.ts'
import type { TabularData } from './types'

describe('should test whether a table does not contain nested arrays', () => {
  const tests: Array<{ input: TabularData<unknown>; output: boolean }> = [
    { input: [{}], output: true },
    { input: [{ x: 3 }], output: true },
    { input: [{ nested: { x: 3 } }], output: true },
    { input: [{}, { x: 3 }], output: true },
    { input: [{}, { scores: [4, 5] }], output: false },
    { input: [{ scores: [{ value: 2 }] }], output: false },
    { input: [{}, { scores: [{ value: 2 }] }], output: false },
    { input: [{}, { nested: { scores: [{ value: 2 }] } }], output: false },
    { input: [{}, { nested: { scores: [2, 3] } }], output: false }
  ]

  for (let { input, output } of tests) {
    test(`noNestedArrays(${JSON.stringify(input)}) == ${output}`, () => {
      expect(noNestedArrays(input)).toBe(output)
    })
  }
})

describe('should test whether a table does not contain nested tables', () => {
  const tests: Array<{ input: TabularData<unknown>; output: boolean }> = [
    { input: [{}], output: true },
    { input: [{ x: 3 }], output: true },
    { input: [{ nested: { x: 3 } }], output: true },
    { input: [{}, { x: 3 }], output: true },
    { input: [{}, { scores: [4, 5] }], output: true },
    { input: [{ scores: [{ value: 2 }] }], output: false },
    { input: [{}, { scores: [{ value: 2 }] }], output: false },
    { input: [{}, { nested: { scores: [{ value: 2 }] } }], output: false },
    { input: [{}, { nested: { scores: [2, 3] } }], output: true }
  ]

  for (let { input, output } of tests) {
    test(`noNestedTables(${JSON.stringify(input)}) == ${output}`, () => {
      expect(noNestedTables(input)).toBe(output)
    })
  }
})

describe('should test whether a table contains homogeneous data', () => {
  const tests: Array<{ input: TabularData<unknown>; output: boolean }> = [
    { input: [{}, {}, {}], output: true },
    { input: [{ a: 2 }, { a: 3 }, { a: 4 }], output: true },
    { input: [{ a: 2 }, { b: 3 }], output: false },
    { input: [{ a: 2 }, { a: 3 }, { b: 4 }], output: false },
    { input: [{ a: 2 }, { b: null }], output: false },
    { input: [{ nested: { a: 2 } }, { nested: { a: 2 } }], output: true },
    { input: [{ nested: { a: 2 } }, { nested: {} }], output: false },
    { input: [{ nested: {} }, { nested: { a: 2 } }], output: false },
    { input: [{}, { nested: { a: 2 } }], output: false },
    { input: [{ nested: { a: 2 } }, {}], output: false },
    { input: [{ nested: { a: 2 } }, { nested: true }], output: false },
    { input: [{ arr: [{ a: 2 }] }, { arr: [{ a: 3 }] }], output: true },
    { input: [{ arr: [1, 2] }, { arr: [3, 4] }], output: true },
    { input: [{ arr: [1, 2] }, { arr: [3, 4, 5] }], output: false },
    { input: [{ arr: [{ a: 2 }] }, { arr: [{ b: 3 }] }], output: false },
    { input: [{ arr: [{ b: 2 }] }, { arr: [{ a: 0, b: 3 }] }], output: false }
  ]

  for (let { input, output } of tests) {
    test(`isHomogeneous(${JSON.stringify(input)}) == ${output}`, () => {
      expect(isHomogeneous(input)).toBe(output)
    })
  }
})

describe('should test whether a table does not contain long string values', () => {
  const tests: Array<{ input: TabularData<unknown>; output: boolean }> = [
    { input: [{}, {}], output: true },
    { input: [{ value: 2 }, { value: 3 }], output: true },
    { input: [{ comment: 'bla' }], output: true },
    { input: [{ comment: '123456789012345678901234567890' }], output: false },
    { input: [{}, {}, { comment: '123456789012345678901234567890' }], output: false },
    { input: [{ nested: { comment: '123456789012345678901234567890' } }], output: false }
  ]

  for (let { input, output } of tests) {
    test(`noLongStrings(${JSON.stringify(input)}) == ${output}`, () => {
      expect(noLongStrings(input)).toBe(output)
    })
  }
})

test('should test whether a table does not contain values with long strings with a custom maxSize', () => {
  expect(noLongStrings([{ comment: 'hello world' }])).toBe(true)
  expect(noLongStrings([{ comment: 'hello world' }], 4)).toBe(false)
  expect(noLongStrings([{ comment: '1234' }], 4)).toBe(true)
  expect(noLongStrings([{ comment: '12345' }], 4)).toBe(false)
})
