import type { TabularData } from './types'
import { isObject } from './objects.js'
import { isTabular } from './tabular.js'

export function noNestedArrays<T>(tabularData: TabularData<T>) {
  function recurseObject(object: Record<string, unknown>) {
    return Object.values(object).every((value) => {
      return Array.isArray(value) ? false : isObject(value) ? recurseObject(value) : true
    })
  }

  return tabularData.every(recurseObject)
}

export function noNestedTables<T>(tabularData: TabularData<T>) {
  function recurse(value: unknown) {
    return isTabular(value)
      ? false
      : Array.isArray(value)
        ? value.every(recurse)
        : isObject(value)
          ? Object.values(value).every(recurse)
          : true
  }

  return tabularData.every(recurse)
}

export function isHomogeneous<T>(tabularData: TabularData<T>) {
  const firstItem = tabularData[0]

  return tabularData.every((item) => deepEqualObjectKeys(item, firstItem))
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

  if (aKeys.length !== bKeys.length) {
    return false
  }

  return aKeys.every((key) => key in b && deepEqualKeys(a[key], b[key]))
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

export function noLongStrings<T>(tabularData: TabularData<T>, maxLength = 24) {
  function recurse(value: unknown) {
    return isObject(value)
      ? Object.values(value).every(recurse)
      : Array.isArray(value)
        ? value.every(recurse)
        : typeof value === 'string'
          ? value.length <= maxLength
          : true
  }

  return recurse(tabularData)
}

export function always<T>(_tabularData: TabularData<T>) {
  return true
}
