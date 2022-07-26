module.exports = {
  root: true,
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [ '@cenk1cenk2/eslint-config/vue-typescript' ],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/no-v-html': 'off',
    ' vue/multi-word-component-names': 'off',
    'max-len': 'off',
    'vue/multi-word-component-names': 'off'
  }
}
