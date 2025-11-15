import { readFileSync } from 'node:fs'
import { Bench } from 'tinybench'
import {
  stringify,
  noLongFields,
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
  .add('default (always) ', function () {
    const res = stringify(data)
    results.push(res)
  })
  .add('noNestedTables', function () {
    const res = stringify(data, { tableStrategy: noNestedTables })
    results.push(res)
  })
  .add('noNestedArrays', function () {
    const res = stringify(data, { tableStrategy: noNestedArrays })
    results.push(res)
  })
  .add('isHomogeneous', function () {
    const res = stringify(data, { tableStrategy: isHomogeneous })
    results.push(res)
  })
  .add('noLongFields', function () {
    const res = stringify(data, { tableStrategy: noLongFields })
    results.push(res)
  })

console.log('Table Strategy performance')
bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
