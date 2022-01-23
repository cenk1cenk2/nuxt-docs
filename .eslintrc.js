module.exports = {
  root: true,
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [ '@nuxtjs', 'plugin:jest/recommended', '@cenk1cenk2/eslint-config/index', '@cenk1cenk2/eslint-config/typescript' ],
  rules: {
    'vue/singleline-html-element-content-newline': 0,
    'vue/multiline-html-element-content-newline': 0,
    'vue/html-self-closing': 0,
    'vue/no-v-html': 0,
    'max-len': 0,
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@root/**',
            group: 'parent'
          }
        ],
        pathGroupsExcludedImportTypes: [ 'builtin' ],
        groups: [
          [ 'builtin', 'external' ],
          [ 'index', 'parent', 'sibling' ]
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ]
  }
}
