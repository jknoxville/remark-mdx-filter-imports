# `remark-mdx-filter-imports`

Strip mdx imports that match a given pattern.
Sometimes you want to build subsets of your code base, perhaps with some private files stripped.

This plugin allows you to define a file pattern for matching files, and then remove any imports of those files, allowing the build to succeed.

## Installation

```sh
yarn add remark-mdx-filter-imports
```

## Setup

See [**Using plugins**](https://github.com/remarkjs/remark/blob/master/doc/plugins.md#using-plugins) in the official documentation.

## Usage

```js
const {createCompiler} = require('@mdx-js/mdx');
const filterImports = require('remark-mdx-filter-impoorts');

const config = {
  strippedFilePattern: /\/my-private-dir\//
};
createCompiler({remarkPlugins: [[filterImports, config]]})
  .parse(...);
```

Transforms:

````js
import a from 'b';
import c from './private/d';
````

into:

````js
import a from 'b';
````

## Options

- `strippedFilePattern`: By default, the plugin strips local imports (using `./` and `../`) of files inside any `private/` directory (at any nested level). Overriding this with a regex lets you customise which import targets are stripped.

## Testing

After installing dependencies with `yarn`, the tests can be run with: `yarn test`
