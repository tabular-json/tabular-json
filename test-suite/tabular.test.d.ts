export interface TabularTest {
  input: unknown[]
  output: unknown[]
}

export interface TabularTestGroup {
  description: string
  function: string
  tests: TabularTest[]
}

export interface TabularTestSuite {
  source: string
  groups: TabularTestGroup[]
}
