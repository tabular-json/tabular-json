export { parse } from './parse.js'
export { stringify, type StringifyOptions } from './stringify.js'
export { isTabular } from './tabular.js'
export {
  always,
  noNestedArrays,
  noNestedTables,
  isHomogeneous,
  noLongStrings
} from './tableProperties.js'

export type { TabularData, OutputAsTable, NonEmptyArray } from './types.d.ts'
