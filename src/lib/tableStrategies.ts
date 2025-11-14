import type { TabularArray } from './types'
import { isObject } from './objects.js'
import { isTabular } from './tabular.js'

export function always() {
  return true
}

export function noNestedTables<T>(array: TabularArray<T>) {
  function recurse(value: Record<string, unknown>) {
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

export function noNestedArrays<T>(array: TabularArray<T>) {
  function recurseObject(object: Record<string, unknown>) {
    return Object.values(object).every((value) => {
      return Array.isArray(value) ? false : isObject(value) ? recurseObject(value) : true
    })
  }

  return array.every(recurseObject)
}

export function isHomogeneous<T>(array: TabularArray<T>) {
  function equalKeys(a: Record<string, T>, b: Record<string, T>): boolean {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)

    return aKeys.length === bKeys.length && aKeys.every((key) => key in b)
  }

  const firstItem = array[0]

  return array.every((item) => equalKeys(item, firstItem))
}

export function hasShortFields<T>(array: TabularArray<T>, maxLength = 24) {
  return array.every((item) => {
    return Object.values(item).every((value) => {
      return typeof value !== 'string' || value.length < maxLength
    })
  })
}
