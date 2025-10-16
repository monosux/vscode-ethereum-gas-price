// eslint.config.cjs
const globals = require('globals');

module.exports = [
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'out/**', 'dist/**', '.vscode-test/**'],

    languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'commonjs',
        globals: {
            ...globals.node,
            ...globals.mocha,
      },
    },

    rules: {
        'no-const-assign': 'warn',
        'no-this-before-super': 'warn',
        'no-undef': 'warn',
        'no-unreachable': 'warn',
        'no-unused-vars': 'warn',
        'constructor-super': 'warn',
        'valid-typeof': 'warn',
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always']
    },
  },
];