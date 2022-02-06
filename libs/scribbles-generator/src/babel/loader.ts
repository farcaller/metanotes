import { Visitor } from '@babel/traverse';
import { types } from '@babel/core';

const TAG = '@scribbles//';
const SCRIBBLES = '@metanotes/scribbles-pack/generated';

function resolveScribble(t, node: types.ImportDeclaration) {
  const path = node.source.value.slice(TAG.length);
  const target = `${SCRIBBLES}/${path}`;
  return t.importDeclaration(node.specifiers, t.stringLiteral(target));
}

module.exports = function ({ types: t }) {
  const visitor: Visitor = {
    ImportDeclaration: {
      exit(path) {
        const { node } = path;

        if (node.source.value.startsWith(TAG)) {
          path.replaceWith(resolveScribble(t, node));
        }
      },
    },
  };
  return { visitor };
};
