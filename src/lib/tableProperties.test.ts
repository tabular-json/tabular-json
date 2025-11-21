import { expect, test } from 'vitest'
import { always, isHomogeneous, noLongStrings, noNestedArrays, noNestedTables } from './tableProperties.ts'

test('should test whether a table does not contain nested arrays', () => {
  expect(noNestedArrays([{}])).toBe(true),
  expect(noNestedArrays([{ x: 3 }])).toBe(true),
  expect(noNestedArrays([{ nested: { x: 3 } }])).toBe(true),
  expect(noNestedArrays([{}, { x: 3 }])).toBe(true),
  expect(noNestedArrays([{}, { scores: [4, 5] }])).toBe(false),
  expect(noNestedArrays([{ scores: [{ value: 2 }] }])).toBe(false),
  expect(noNestedArrays([{}, { scores: [{ value: 2 }] }])).toBe(false),
  expect(noNestedArrays([{}, { nested: { scores: [{ value: 2 }] } }])).toBe(false),
  expect(noNestedArrays([{}, { nested: { scores: [2, 3] } }])).toBe(false)
})

test('should test whether a table does not contain nested tables', () => {
  expect(noNestedTables([{}])).toBe(true),
  expect(noNestedTables([{ x: 3 }])).toBe(true),
  expect(noNestedTables([{ nested: { x: 3 } }])).toBe(true),
  expect(noNestedTables([{}, { x: 3 }])).toBe(true),
  expect(noNestedTables([{}, { scores: [4, 5] }])).toBe(true),
  expect(noNestedTables([{ scores: [{ value: 2 }] }])).toBe(false),
  expect(noNestedTables([{}, { scores: [{ value: 2 }] }])).toBe(false),
  expect(noNestedTables([{}, { nested: { scores: [{ value: 2 }] } }])).toBe(false),
  expect(noNestedTables([{}, { nested: { scores: [2, 3] } }])).toBe(true)
})

test('should test whether a table contains homogeneous data', () => {
  expect(isHomogeneous([{}, {}, {}])).toBe(true),
  expect(isHomogeneous([{ a: 2 }, { a: 3 }, { a: 4 }])).toBe(true),
  expect(isHomogeneous([{ a: 2 }, { b: 3 }])).toBe(false),
  expect(isHomogeneous([{ a: 2 }, { a: 3 }, { b: 4 }])).toBe(false),
  expect(isHomogeneous([{ a: 2 }, { b: null }])).toBe(false),
  expect(isHomogeneous([{ nested: { a: 2 } }, { nested: { a: 2 } }])).toBe(true),
  expect(isHomogeneous([{ nested: { a: 2 } }, { nested: {} }])).toBe(false),
  expect(isHomogeneous([{ nested: {} }, { nested: { a: 2 } }])).toBe(false),
  expect(isHomogeneous([{}, { nested: { a: 2 } }])).toBe(false),
  expect(isHomogeneous([{ nested: { a: 2 } }, {}])).toBe(false),
  // @ts-ignore
  expect(isHomogeneous([{ nested: { a: 2 } }, { nested: true}])).toBe(false),
  expect(isHomogeneous([{ arr: [{ a: 2 }] }, { arr: [{ a: 3 }] }])).toBe(true),
  expect(isHomogeneous([{ arr: [1, 2] }, { arr: [3, 4] }])).toBe(true),
  expect(isHomogeneous([{ arr: [1, 2] }, { arr: [3, 4, 5] }])).toBe(false),
  expect(isHomogeneous([{ arr: [{ a: 2 }] }, { arr: [{ b: 3 }] }])).toBe(false),
  expect(isHomogeneous([{ arr: [{ b: 2 }] }, { arr: [{ a: 0, b: 3 }] }])).toBe(false)
})

test('should test whether a table does not contain long string values', () => {
  expect(noLongStrings([{}, {}])).toBe(true),
  expect(noLongStrings([{ value: 2 }, { value: 3 }])).toBe(true),
  expect(noLongStrings([{ comment: 'bla' }])).toBe(true),
  expect(noLongStrings([{ comment: '123456789012345678901234567890' }])).toBe(false),
  expect(noLongStrings([{}, {}, { comment: '123456789012345678901234567890' }])).toBe(false),
  expect(noLongStrings([{ nested: { comment: '123456789012345678901234567890' } }])).toBe(false)
})

test('should test function always', () => {
  expect(always([{}])).toBe(true)
})

test('should test whether a table does not contain values with long strings with a custom maxSize', () => {
  expect(noLongStrings([{ comment: 'hello world' }])).toBe(true)
  expect(noLongStrings([{ comment: 'hello world' }], 4)).toBe(false)
  expect(noLongStrings([{ comment: '1234' }], 4)).toBe(true)
  expect(noLongStrings([{ comment: '12345' }], 4)).toBe(false)
})
