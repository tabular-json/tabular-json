import { readFileSync } from 'node:fs'
import { Bench } from 'tinybench'
import {
  always,
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

const bench = new Bench({ time: 100, iterations: 100 })
  .add('always', function () {
    stringify(data, { outputAsTable: always })
  })
  .add('noNestedTables', function () {
    stringify(data, { outputAsTable: noNestedTables })
  })
  .add('noNestedArrays', function () {
    stringify(data, { outputAsTable: noNestedArrays })
  })
  .add('isHomogeneous', function () {
    stringify(data, { outputAsTable: isHomogeneous })
  })
  .add('noLongStrings', function () {
    stringify(data, { outputAsTable: noLongStrings })
  })

console.log('Table Strategy performance')
bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
