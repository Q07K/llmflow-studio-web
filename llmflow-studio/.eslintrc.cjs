module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  rules: {
    // Enforce order of component top-level elements according to Vue.js style guide
    'vue/component-tags-order': [
      'error',
      {
        order: ['template', 'script', 'style'],
      },
    ],
    // Vue code style
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 3,
        multiline: 1,
      },
    ],
  },
}
