// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  root: true,
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.js', '.jsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.eslint.json',
      },
      [path.resolve('./tools/ts-resolver')]: {},
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'import',
    'react',
    '@typescript-eslint',
    'header',
  ],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'airbnb',
    'airbnb/hooks',
  ],
  rules: {
    'import/extensions': ['error', 'never'],
    'no-undef': ['off'],
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx', '.js', '.jsx'] }],
    'max-len': ['error', {
      code: 120,
      tabWidth: 2,
      ignoreComments: true,
    }],
    'header/header': ['error', 'tools/header.js'],
    // see https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js#L338
    // and https://github.com/airbnb/javascript/issues/1271
    // for the discussion on the below.
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        // eslint-disable-next-line max-len
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'no-plusplus': ['off'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'object-curly-newline': ['error', {
      ObjectExpression: { consistent: true },
      ObjectPattern: { multiline: true },
      ImportDeclaration: { multiline: true, minProperties: 5 },
      ExportDeclaration: { multiline: true, minProperties: 3 },
    }],
    'no-continue': ['off'],
    'no-param-reassign': ['error', { props: false }],
    'import/no-deprecated': ['warn'],
    'newline-per-chained-call': ['warn', { ignoreChainWithDepth: 3 }],

    'no-use-before-define': ['off'],
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-useless-constructor': ['off'],
    '@typescript-eslint/no-useless-constructor': ['error'],
    'no-unused-vars': ['off'],
    '@typescript-eslint/no-unused-vars': ['error', {
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_',
    }],
    'no-empty-function': ['off'],
    '@typescript-eslint/no-empty-function': ['error'],
  },
  overrides: [
    {
      files: ['src/frontend/scribbles/**/*.metanotes.*'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        'react/react-in-jsx-scope': ['off'],
        'no-undef': ['error'],
      },
      globals: {
        core: 'readonly',
        components: 'readonly',
        React: 'readonly',
      },
    },
    {
      files: ['tools/*.js', '*.test.ts', 'test-*.ts'],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      },
    },
  ],
};
