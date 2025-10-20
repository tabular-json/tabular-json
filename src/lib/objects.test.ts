import { describe, test, expect } from 'vitest'
import { getIn, isObject, setIn } from './objects.js'

class CustomClass {
  name: string

  constructor(name: string) {
    this.name = name
  }
}
const customClass = new CustomClass('foo')

test('isObject', () => {
  expect(isObject({})).toBe(true)
  expect(isObject(null)).toBe(false)
  expect(isObject('text')).toBe(false)
  expect(isObject(42)).toBe(false)
  expect(isObject([])).toBe(false)
  expect(isObject(new Date())).toBe(false)
  expect(isObject(customClass)).toBe(false)
})

test('getIn', () => {
  expect(getIn({ name: 'Joe' }, ['name'])).toEqual('Joe')
  expect(getIn({ name: 'Joe' }, ['foo'])).toEqual(undefined)
  expect(getIn({ nested: { name: 'Joe' } }, ['nested', 'name'])).toEqual('Joe')
  expect(getIn({ nested: { array: ['a', 'b'] } }, ['nested', 'array', '1'])).toEqual('b')
  expect(getIn({ nested: { array: ['a', 'b'] } }, ['nested', 'foo', 'bar'])).toEqual(undefined)
  expect(getIn({ nested: null }, ['nested', 'foo', 'bar'])).toEqual(undefined)
  expect(getIn({ nested: undefined }, ['nested', 'foo', 'bar'])).toEqual(undefined)
  expect(getIn({ nested: 123 }, ['nested', 'foo', 'bar'])).toEqual(undefined)
  expect(getIn({ nested: true }, ['nested', 'foo', 'bar'])).toEqual(undefined)
})

describe('setIn', () => {
  test('set a nested property', () => {
    expect(setIn({}, ['name'], 'Joe')).toEqual({ name: 'Joe' })
    expect(setIn({}, ['address', 'city'], 'Rotterdam')).toEqual({
      address: { city: 'Rotterdam' }
    })
  })

  test('set a nested property with numeric index', () => {
    expect(setIn({}, ['values', 0], 42)).toEqual({ values: [42] })
  })
})
