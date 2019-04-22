module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren': 'off',
    'semi-spacing': [
      0,
      {
        before: false,
        after: false
      }
    ],
    semi: 0,
    'comma-dangle': [
      0
    ],
    'vue/require-v-for-key': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/name-property-casing': 'off',
    'no-duplicate-imports': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
