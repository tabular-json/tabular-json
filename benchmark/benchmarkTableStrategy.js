import { readFileSync } from 'node:fs'
import { Bench } from 'tinybench'
import {
  stringify,
  noLongStrings,
  isHomogeneous,
  noNestedArrays,
  noNestedTables
} from '../lib/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const data = JSON.parse(
  String(readFileSync(import.meta.dirname + '/../data/unece_country_overview.json'))
)

const results = []

const bench = new Bench({ time: 100, iterations: 50 })
  .add('always', function () {
    const res = stringify(data, { outputTable: () => true })
    results.push(res)
  })
  .add('noNestedTables', function () {
    const res = stringify(data, { outputTable: noNestedTables })
    results.push(res)
  })
  .add('noNestedArrays', function () {
    const res = stringify(data, { outputTable: noNestedArrays })
    results.push(res)
  })
  .add('isHomogeneous', function () {
    const res = stringify(data, { outputTable: isHomogeneous })
    results.push(res)
  })
  .add('noLongStrings', function () {
    const res = stringify(data, { outputTable: noLongStrings })
    results.push(res)
  })

console.log('Table Strategy performance')
bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
