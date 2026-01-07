# Development

## Install

```
npm install
```

## Develop

```
npm run dev
```

## Test

```
npm run test:ci
```

## Publish

1. Run unit tests via `npm run test:ci`
2. Describe the changes in the file `CHANGELOG.md`
3. Update version number in `package.json`
4. Update the version numbers in all test-suite files.
5. Run `npm install` to update the version number in `package-lock.json`
6. Add a git tag:

   ```
   git tag v1.2.4
   git push --tags
   ```

7. Publish on npm via `npm publish`
