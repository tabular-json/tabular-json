import type { Field, OutputAsTable, Path, ValueGetter } from './types.d.ts'
import { getIn, isObject } from './objects.js'
import { collectFields, isTabular } from './tabular.js'
import { always } from './tableProperties.js'

// The code of stringify is largely copied from:
// - https://github.com/josdejong/lossless-json
// - https://github.com/josdejong/csv42

export interface StringifyOptions {
  indentation?: number | string
  trailingCommas?: boolean
  outputAsTable?: OutputAsTable
}

export function stringify(json: unknown, options?: StringifyOptions): string {
  const globalIndentation = resolveIndentation(options?.indentation)
  const outputAsTable = options?.outputAsTable ?? always

  return stringifyValue(json, '', !!globalIndentation)

  function stringifyValue(value: unknown, indent: string, doIndent: boolean): string {
    // number
    if (typeof value === 'number') {
      if (isNaN(value)) {
        return 'nan'
      }

      if (value === Infinity) {
        return 'inf'
      }

      if (value === -Infinity) {
        return '-inf'
      }

      return JSON.stringify(value)
    }

    // boolean, null
    if (value === true || value === false || value === null) {
      return JSON.stringify(value)
    }

    // string
    if (typeof value === 'string') {
      return stringifyStringValue(value)
    }

    // BigInt
    if (typeof value === 'bigint') {
      return value.toString()
    }

    // Table
    if (isTabular(value) && outputAsTable(value)) {
      return stringifyTable(value, indent)
    }

    // Array (test after Table!)
    if (Array.isArray(value)) {
      return stringifyArray(value, indent, doIndent)
    }

    // Object
    if (isObject(value)) {
      return stringifyObject(value as Record<string, unknown>, indent, doIndent)
    }

    return ''
  }

  function stringifyArray(array: Array<unknown>, indent: string, doIndent: boolean): string {
    if (array.length === 0) {
      return '[]'
    }

    const childIndent = doIndent ? indent + globalIndentation : indent
    let str = doIndent ? '[\n' : '['

    for (let i = 0; i < array.length; i++) {
      const item = array[i]

      if (doIndent) {
        str += childIndent
      }

      if (typeof item !== 'undefined' && typeof item !== 'function') {
        str += stringifyValue(item, childIndent, doIndent)
      } else {
        str += 'null'
      }

      if (i < array.length - 1) {
        str += doIndent ? ',\n' : ','
      } else if (options?.trailingCommas) {
        str += ','
      }
    }

    str += doIndent ? '\n' + indent + ']' : ']'
    return str
  }

  function stringifyTable(array: Array<unknown>, indent: string): string {
    const isRoot = array === json
    const childIndent = globalIndentation && !isRoot ? indent + globalIndentation : indent
    const colSeparator = globalIndentation ? ', ' : ','

    const fields = getFields(array)

    let str = isRoot ? '' : '---\n'

    // We pass doIndent=false so nested objects/arrays are not formatted over multiple lines.
    // Nested tables though are always indented (when globalIndentation is set).
    const header = fields.map((field) => field.name)
    const rows = array.map((item) =>
      fields.map((field) => stringifyValue(field.getValue(item), childIndent, false))
    )

    if (globalIndentation) {
      const widths = calculateColumnWidths(header, rows)

      str += childIndent + formatRow(header, widths)
      rows.forEach((row) => (str += childIndent + formatRow(row, widths)))
    } else {
      str += childIndent + header.join(colSeparator) + '\n'
      rows.forEach((row) => (str += childIndent + row.join(colSeparator) + '\n'))
    }

    str += isRoot ? '' : indent + '---'

    return str
  }

  function formatRow(row: string[], widths: number[]) {
    return row
      .map((field, f) => (f < widths.length - 1 ? (field + ',').padEnd(widths[f]) : field + '\n'))
      .join('')
  }

  function stringifyObject(
    object: Record<string, unknown>,
    indent: string,
    doIndent: boolean
  ): string {
    if (typeof object.toJSON === 'function') {
      return stringify(object.toJSON(), options)
    }

    const entries = Object.entries(object).filter(([_key, value]) => includeProperty(value))

    if (entries.length === 0) {
      return '{}'
    }

    const childIndent = doIndent ? indent + globalIndentation : indent
    let str = doIndent ? '{\n' : '{'

    entries.forEach(([key, value], index) => {
      const keyStr = stringifyStringValue(key)
      str += doIndent ? childIndent + keyStr + ': ' : keyStr + ':'

      str += stringifyValue(value, childIndent, doIndent)

      if (index < entries.length - 1) {
        str += doIndent ? ',\n' : ','
      } else if (options?.trailingCommas) {
        str += ','
      }
    })

    str += doIndent ? '\n' + indent + '}' : '}'
    return str
  }

  /**
   * Test whether to include a property in a stringified object or not.
   */
  function includeProperty(value: unknown): boolean {
    return typeof value !== 'undefined' && typeof value !== 'function' && typeof value !== 'symbol'
  }
}

/**
 * Resolve a JSON stringify space:
 * replace a number with a string containing that number of spaces
 */
function resolveIndentation(indentation: number | string | undefined): string | undefined {
  if (typeof indentation === 'number') {
    return ' '.repeat(indentation)
  }

  if (typeof indentation === 'string' && indentation !== '') {
    return indentation
  }

  return undefined
}

function getFields(records: Array<unknown>): Field<unknown>[] {
  return collectFields(records).map((path) => ({
    name: stringifyField(path),
    getValue: createGetValue(path)
  }))
}

function createGetValue<T>(path: Path): ValueGetter<T> {
  if (path.length === 1) {
    const key = path[0]
    return (item) => (item as Record<string, unknown>)[key]
  }

  return (item) => getIn(item as Record<string, unknown>, path)
}

function stringifyStringValue(value: string): string {
  return JSON.stringify(value)
}

function stringifyField(path: Path): string {
  return path.map((key) => stringifyStringValue(String(key))).join('.')
}

function calculateColumnWidths(header: string[], rows: string[][]): number[] {
  return rows
    .reduce(
      (widths, row) => {
        return row.map((field, i) => Math.max(widths[i], field.length))
      },
      header.map((field) => field.length)
    )
    .map((width) => width + 2)
  // Note: we add 1 space to account for the comma,
  // and another to ensure there is at least 1 space between the columns
}
