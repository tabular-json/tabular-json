export interface TableTest {
  input: unknown[]
  output: unknown[]
}

export interface TableTestGroup {
  description: string
  function: string
  tests: TableTest[]
}

export interface TableTestSuite {
  source: string
  groups: TableTestGroup[]
}
