export interface ParseTest {
  input: string
  output: unknown
}

export interface ParseTestException {
  input: string
  throws: string
}

export interface ParseTestEnum {
  input: string
  output_enum: 'negative_zero' | 'positive_infinity' | 'negative_infinity' | 'not_a_number'
}

export interface ParseTestGroup {
  category: string
  description: string
  tests: Array<ParseTest | ParseTestEnum | ParseTestException>
}

export interface ParseTestSuite {
  source: string
  groups: ParseTestGroup[]
}
