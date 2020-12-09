const codeImport = require('./index.js');

const unified = require('unified');
const remarkParse = require('remark-parse');
const remarkStringify = require('remark-stringify');
const remarkMdx = require('remark-mdx');
const createCompiler = require('@mdx-js/mdx').createCompiler;

test('Normal imports are not modified', () => {
  expect(
    createCompiler({ remarkPlugins: [codeImport] }).processSync({
      contents: `---
id: some-id
title: Nice Looking Title
---

import a from 'b';

import useBaseUrl from '@docusaurus/useBaseUrl';`,
      path: __dirname + '/TestFile.java',
    }).contents
  ).toMatchInlineSnapshot(`
    "import a from 'b';
    import useBaseUrl from '@docusaurus/useBaseUrl';


    const layoutProps = {
      
    };
    const MDXLayout = \\"wrapper\\"
    export default function MDXContent({
      components,
      ...props
    }) {
      return <MDXLayout {...layoutProps} {...props} components={components} mdxType=\\"MDXLayout\\">
        <hr></hr>
        <p>{\`id: some-id\`}</p>
        <h2>{\`title: Nice Looking Title\`}</h2>


        </MDXLayout>;
    }

    ;
    MDXContent.isMDXComponent = true;"
  `);
});

test('Multiple imports without empty lines are modified correctly', () => {
  expect(
    createCompiler({ remarkPlugins: [codeImport] }).processSync({
      contents: `import a from 'b';
import c from './file.mdx';
import d from './private/file.mdx';
import e from './notprivate/file.md';
import f from '../private/file.md';`,
      path: __dirname + '/TestFile.java',
    }).contents
  ).toMatchInlineSnapshot(`
    "import a from 'b';
    import c from './file.mdx';
    import e from './notprivate/file.md';


    const layoutProps = {
      
    };
    const MDXLayout = \\"wrapper\\"
    export default function MDXContent({
      components,
      ...props
    }) {
      return <MDXLayout {...layoutProps} {...props} components={components} mdxType=\\"MDXLayout\\">

        </MDXLayout>;
    }

    ;
    MDXContent.isMDXComponent = true;"
  `);
});

test('Matching relative imports are removed with default config', () => {
  expect(
    createCompiler({ remarkPlugins: [codeImport] }).processSync({
      contents: `import a from 'b';

import c from './file.mdx';

import d from './private/file.mdx';

import e from './notprivate/file.md';`,
      path: __dirname + '/TestFile.java',
    }).contents
  ).toMatchInlineSnapshot(`
    "import a from 'b';
    import c from './file.mdx';
    import e from './notprivate/file.md';


    const layoutProps = {
      
    };
    const MDXLayout = \\"wrapper\\"
    export default function MDXContent({
      components,
      ...props
    }) {
      return <MDXLayout {...layoutProps} {...props} components={components} mdxType=\\"MDXLayout\\">



        </MDXLayout>;
    }

    ;
    MDXContent.isMDXComponent = true;"
  `);
});

test('Matching relative imports are removed with custom config', () => {
  expect(
    createCompiler({
      remarkPlugins: [
        [codeImport, { strippedFilePattern: /\.+\/(.*\/)?fb\// }],
      ],
    }).processSync({
      contents: `import a from 'b';

import c from './file.mdx';

import d from './fb/file.mdx';`,
      path: __dirname + '/TestFile.java',
    }).contents
  ).toMatchInlineSnapshot(`
    "import a from 'b';
    import c from './file.mdx';


    const layoutProps = {
      
    };
    const MDXLayout = \\"wrapper\\"
    export default function MDXContent({
      components,
      ...props
    }) {
      return <MDXLayout {...layoutProps} {...props} components={components} mdxType=\\"MDXLayout\\">


        </MDXLayout>;
    }

    ;
    MDXContent.isMDXComponent = true;"
  `);
});

test('Parses MDX import correctly', () => {
  expect(
    createCompiler({ remarkPlugins: [codeImport] }).parse(
      `import a from 'b';

import c from 'd';`
    )
  ).toMatchInlineSnapshot(`
    Object {
      "children": Array [
        Object {
          "position": Position {
            "end": Object {
              "column": 19,
              "line": 1,
              "offset": 18,
            },
            "indent": Array [],
            "start": Object {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "import",
          "value": "import a from 'b';",
        },
        Object {
          "position": Position {
            "end": Object {
              "column": 19,
              "line": 3,
              "offset": 38,
            },
            "indent": Array [],
            "start": Object {
              "column": 1,
              "line": 3,
              "offset": 20,
            },
          },
          "type": "import",
          "value": "import c from 'd';",
        },
      ],
      "position": Object {
        "end": Object {
          "column": 19,
          "line": 3,
          "offset": 38,
        },
        "start": Object {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
      },
      "type": "root",
    }
  `);
});
