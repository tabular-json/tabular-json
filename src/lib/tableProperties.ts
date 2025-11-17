import type { TabularData } from './types'
import { isObject } from './objects.ts'
import { isTabular } from './tabular.ts'

export function noNestedArrays<T>(array: TabularData<T>) {
  function recurseObject(object: Record<string, unknown>) {
    return Object.values(object).every((value) => {
      return Array.isArray(value) ? false : isObject(value) ? recurseObject(value) : true
    })
  }

  return array.every(recurseObject)
}

export function noNestedTables<T>(array: TabularData<T>) {
  function recurse(value: unknown) {
    return isTabular(value)
      ? false
      : Array.isArray(value)
        ? value.every(recurse)
        : isObject(value)
          ? Object.values(value).every(recurse)
          : true
  }

  return array.every(recurse)
}

export function isHomogeneous<T>(array: TabularData<T>) {
  // FIXME: change equalKeys into deepEqualKeys
  function equalKeys(a: Record<string, T>, b: Record<string, T>): boolean {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)

    return aKeys.length === bKeys.length && aKeys.every((key) => key in b)
  }

  const firstItem = array[0]

  return array.every((item) => equalKeys(item, firstItem))
}

export function noLongStrings<T>(array: TabularData<T>, maxLength = 24) {
  function recurse(value: unknown) {
    return Array.isArray(value)
      ? value.every(recurse)
      : isObject(value)
        ? Object.values(value).every(recurse)
        : typeof value === 'string'
          ? value.length < maxLength
          : true
  }

  return recurse(array)
}

export function always() {
  return true
}
