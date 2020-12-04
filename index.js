const fs = require('fs');
const path = require('path');
const visit = require('unist-util-visit');

function codeImport(options = {
  strippedFilePattern: /\.+\/(.*\/)?private\//,
}) {
  return function transformer(tree, file) {

    visit(tree, 'import', (node, index, parent) => {

      const matches = /import {?\w+}? from (('|").+('|"));/.exec(node.value);
      if (matches) {

        // TODO better way than eval? JSON.parse doesn't handle single quotes.
        // We're evaluating the string literal that is the import target, including it's quotes, and any escape characters.
        const destination = eval(matches[1]);
        if (!options.strippedFilePattern.exec(destination)) {
          return;
        }
        parent.children.splice(index, 1);
        return [visit.SKIP, index]
      }
    });
  };
}

module.exports = codeImport;
