import type { StringifyOptions } from '../src/lib'

export interface StringifyTest {
  input: unknown
  output: string
}

export interface StringifyTestEnum {
  input_enum: 'negative_zero' | 'positive_infinity' | 'negative_infinity' | 'not_a_number'
  output: string
}

export interface StringifyTestGroup {
  category: string
  description: string
  options?: StringifyOptions
  tests: Array<StringifyTest | StringifyTestEnum>
}

export interface StringifyTestSuite {
  source: string
  groups: StringifyTestGroup[]
}
