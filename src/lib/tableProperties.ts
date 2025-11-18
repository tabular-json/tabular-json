import type { TabularData } from './types'
import { isObject } from './objects.js'
import { isTabular } from './tabular.js'

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
  const firstItem = array[0]

  return array.every((item) => deepEqualObjectKeys(item, firstItem))
}

function deepEqualKeys(a: unknown, b: unknown): boolean {
  if (isObject(a)) {
    if (!isObject(b) || !deepEqualObjectKeys(a, b)) {
      return false
    }
  } else if (isObject(b)) {
    return false
  }

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || !deepEqualArrayKeys(a, b)) {
      return false
    }
  } else if (Array.isArray(b)) {
    return false
  }

  // primitive values
  return true
}

function deepEqualObjectKeys(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  if (aKeys.length !== bKeys.length || aKeys.some((key) => !(key in b))) {
    return false
  }

  for (const key of aKeys) {
    if (!deepEqualKeys(a[key], b[key])) {
      return false
    }
  }

  return true
}

function deepEqualArrayKeys(a: Array<unknown>, b: Array<unknown>): boolean {
  if (a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; i++) {
    if (!deepEqualKeys(a[i], b[i])) {
      return false
    }
  }

  return true
}

export function noLongStrings<T>(array: TabularData<T>, maxLength = 24) {
  function recurse(value: unknown) {
    return isObject(value)
      ? Object.values(value).every(recurse)
      : Array.isArray(value)
        ? value.every(recurse)
        : typeof value === 'string'
          ? value.length <= maxLength
          : true
  }

  return recurse(array)
}

export function always() {
  return true
}
