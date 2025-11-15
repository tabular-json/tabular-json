# Tabular-JSON Test Suite

This test suite contains the reference tests for the Tabular-JSON data format in a language agnostic JSON format. These tests can be used to implement Tabular-jSON in a new programming language or environment.

The test-suite contains the following sections:

- [`parse.test.json`](./parse.test.json) tests verifying the parser that parses text containing Tabular-JSON data.
- [`stringify.test.json`](./stringify.test.json) tests converting the data into text in the Tabular-JSON format.
- [`table.test.json`](./table.test.json) tests related to determining whether an array contains tabular data, determining properties of the table, and collecting the fields (the table columns) from an array with tabular data.

The test suites are accompanied by a `.d.ts` file containing the TypeScript models of the test suites, and a `.schema.json` file containing a JSON schema file matching the test suites. These can be of help when implementing a model for the test suites in a new language.
