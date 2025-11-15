import type { NestedObject, Path, Table } from './types.d.ts'
import { isObject } from './objects.js'

export function isTable<T>(value: unknown): value is Table<T> {
  return Array.isArray(value) && value.length > 0 && value.every(isObject)
}

export function noNestedArrays<T>(array: Table<T>) {
  function recurseObject(object: Record<string, unknown>) {
    return Object.values(object).every((value) => {
      return Array.isArray(value) ? false : isObject(value) ? recurseObject(value) : true
    })
  }

  return array.every(recurseObject)
}

export function noNestedTables<T>(array: Table<T>) {
  function recurse(value: unknown) {
    return isTable(value)
      ? false
      : Array.isArray(value)
        ? value.every(recurse)
        : isObject(value)
          ? Object.values(value).every(recurse)
          : true
  }

  return array.every(recurse)
}

export function isHomogeneous<T>(array: Table<T>) {
  // FIXME: change equalKeys into deepEqualKeys
  function equalKeys(a: Record<string, T>, b: Record<string, T>): boolean {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)

    return aKeys.length === bKeys.length && aKeys.every((key) => key in b)
  }

  const firstItem = array[0]

  return array.every((item) => equalKeys(item, firstItem))
}

export function noLongStrings<T>(array: Table<T>, maxLength = 24) {
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

export function always () {
  return true
}

const leaf = Symbol()

type MergedObject = {
  [key: string]: MergedObject
  [leaf]?: boolean | null
}

export function collectFields<T>(array: T[]): Path[] {
  const merged: MergedObject = {}
  array.forEach((item) => {
    if (isObject(item)) {
      _mergeObject(item as NestedObject, merged)
    } else {
      _mergeValue(item, merged)
    }
  })

  const paths: Path[] = []
  _collectPaths(merged, [], paths)

  return paths
}

// internal function for collectNestedPaths
// mutates the argument `merged`
function _mergeObject(object: NestedObject, merged: MergedObject): void {
  for (const key in object) {
    const value = object[key]
    const valueMerged =
      merged[key] || (merged[key] = (Array.isArray(value) ? [] : {}) as MergedObject)

    if (isObject(value)) {
      _mergeObject(value as NestedObject, valueMerged as MergedObject)
    } else {
      _mergeValue(value, valueMerged)
    }
  }
}

// internal function for collectNestedPaths
// mutates the argument `merged`
function _mergeValue(value: unknown, merged: MergedObject) {
  if (merged[leaf] === undefined) {
    merged[leaf] = value === null || value === undefined ? null : true
  }
}

// internal function for collectNestedPaths
// mutates the argument `paths`
function _collectPaths(merged: MergedObject, parentPath: Path, paths: Path[]): void {
  if (merged[leaf] === true || (merged[leaf] === null && isEmpty(merged))) {
    paths.push(parentPath)
  } else if (Array.isArray(merged)) {
    merged.forEach((item, index) => _collectPaths(item, parentPath.concat(index), paths))
  } else if (isObject(merged)) {
    for (const key in merged) {
      _collectPaths(merged[key], parentPath.concat(key), paths)
    }
  }
}

function isEmpty(object: NestedObject): boolean {
  return Object.keys(object).length === 0
}
