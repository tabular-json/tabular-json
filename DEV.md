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
2. Update version number in `package.json`
3. Run `npm install` to update the version number in `package-lock.json`
4. Add a git tag:

    ```
    git tag v1.2.4
    git push --tags
    ```
5. Publish on npm via `npm publish`
