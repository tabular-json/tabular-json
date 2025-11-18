import type { NestedObject, Path } from './types.d.ts'

// The utils are largely copied from:
// - https://github.com/josdejong/csv42

export function isObject<T>(value: unknown): value is Record<string, T> {
  return typeof value === 'object' && value !== null && value.constructor === Object // do not match on classes or Array
}

export function getIn(object: NestedObject, path: Path): unknown {
  let value: NestedObject | undefined = object
  let i = 0

  while (i < path.length && value !== undefined) {
    value = value?.[path[i]] as NestedObject | undefined
    i++
  }

  return value
}

export function setIn(object: NestedObject, path: Path, value: unknown): NestedObject {
  let nested = object
  const iLast = path.length - 1
  let i = 0

  while (i < iLast) {
    const part = path[i]

    if (nested[part] === undefined) {
      if (typeof path[i + 1] === 'number') {
        nested[part] = []
      } else {
        nested[part] = {}
      }
    }

    nested = nested[part] as NestedObject
    i++
  }

  nested[path[iLast]] = value

  return object
}

export function isDeepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => isDeepEqual(item, b[index]))
  }

  if (isObject(a) && isObject(b)) {
    const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])]
    return keys.every((key) => isDeepEqual(a[key], b[key]))
  }

  return false
}
