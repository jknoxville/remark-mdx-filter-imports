const fs = require('fs');
const path = require('path');
const visit = require('unist-util-visit');
const {parse}  = require('@babel/parser');
const generate = require('@babel/generator').default;

function codeImport(options = {
  strippedFilePattern: /\.+\/(.*\/)?private\//,
}) {
  return function transformer(tree, file) {

    visit(tree, 'import', (node, index, parent) => {

      // A single import node can contain multiple actual import statements.
      // So we have to parse the value again to deal with each one.
      const ast = parse(node.value, {sourceType: 'module'});

      ast.program.body = ast.program.body.filter(node => {
        if (node.type !== 'ImportDeclaration') {
          return false;
        }

        const matches = options.strippedFilePattern.exec(node.source.value);
        return !Boolean(matches);
      });

      if (ast.program.body.length > 0) {
        // There are some valid import statements in this node, convert it to code, and replace the value with this code.
        node.value = generate(ast).code;
      } else {
        // All imports in this node have been removed, so remove the entire node from it's parent
        parent.children.splice(index, 1);
        return [visit.SKIP, index];
      }
    });
  };
}

module.exports = codeImport;
