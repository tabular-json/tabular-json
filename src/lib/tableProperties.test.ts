import { expect, test } from 'vitest'
import { isHomogeneous, noLongStrings, noNestedArrays, noNestedTables } from './tableProperties.ts'
import type { TabularData } from './types'

test.each([
  { input: [{}], output: true },
  { input: [{ x: 3 }], output: true },
  { input: [{ nested: { x: 3 } }], output: true },
  { input: [{}, { x: 3 }], output: true },
  { input: [{}, { scores: [4, 5] }], output: false },
  { input: [{ scores: [{ value: 2 }] }], output: false },
  { input: [{}, { scores: [{ value: 2 }] }], output: false },
  {
    input: [{}, { nested: { scores: [{ value: 2 }] } }],
    output: false
  },
  { input: [{}, { nested: { scores: [2, 3] } }], output: false }
])(
  'should test whether a table does not contain nested arrays',
  ({ input, output }: { input: TabularData<unknown>; output: boolean }) => {
    expect(noNestedArrays(input)).toBe(output)
  }
)

test.each([
  { input: [{}], output: true },
  { input: [{ x: 3 }], output: true },
  { input: [{ nested: { x: 3 } }], output: true },
  { input: [{}, { x: 3 }], output: true },
  { input: [{}, { scores: [4, 5] }], output: true },
  { input: [{ scores: [{ value: 2 }] }], output: false },
  { input: [{}, { scores: [{ value: 2 }] }], output: false },
  {
    input: [{}, { nested: { scores: [{ value: 2 }] } }],
    output: false
  },
  { input: [{}, { nested: { scores: [2, 3] } }], output: true }
])(
  'should test whether a table does not contain nested tables',
  ({ input, output }: { input: TabularData<unknown>; output: boolean }) => {
    expect(noNestedTables(input)).toBe(output)
  }
)

test.each([
  { input: [{}, {}, {}], output: true },
  { input: [{ a: 2 }, { a: 3 }, { a: 4 }], output: true },
  { input: [{ a: 2 }, { b: 3 }], output: false },
  { input: [{ a: 2 }, { a: 3 }, { b: 4 }], output: false },
  { input: [{ a: 2 }, { b: null }], output: false }
])(
  'should test whether a table contains homogeneous data',
  ({ input, output }: { input: TabularData<unknown>; output: boolean }) => {
    expect(isHomogeneous(input)).toBe(output)
  }
)

test.each([
  { input: [{}, {}], output: true },
  { input: [{ value: 2 }, { value: 3 }], output: true },
  { input: [{ comment: 'bla' }], output: true },
  { input: [{ comment: '123456789012345678901234567890' }], output: false },
  { input: [{}, {}, { comment: '123456789012345678901234567890' }], output: false },
  {
    input: [{ nested: { comment: '123456789012345678901234567890' } }],
    output: false
  }
])(
  'should test whether a table contains homogeneous data',
  ({ input, output }: { input: TabularData<unknown>; output: boolean }) => {
    expect(noLongStrings(input)).toBe(output)
  }
)

test('should test whether a table does not contain values with long strings with a custom maxSize', () => {
  expect(noLongStrings([{ comment: 'hello world' }])).toBe(true)
  expect(noLongStrings([{ comment: 'hello world' }], 4)).toBe(false)
})
