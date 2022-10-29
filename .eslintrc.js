module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'eslint:recommended',
    'prettier',
  ],
  plugins: ['prettier', 'import'],
  // add your custom rules here
  rules: {
    'import/named': 'off',
    semi: ['error', 'always'],
    'object-curly-spacing': ['warn', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    quotes: ['warn', 'single'],
    'no-undef': 'off',
    'no-useless-escape': 'off',
    'import/order': [
      'warn',
      {
        pathGroups: [
          {
            pattern: '~/**',
            group: 'parent',
          },
        ],
      },
    ],
    'vue/no-v-html': 'off',
    'vue/no-lone-template': 'off',
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 2,
        },
      },
    ],
    'vue/singleline-html-element-content-newline': [
      'error',
      {
        ignores: ['span', 'a', 'pre', 'textarea', 'p', 'blockquote', 'label'],
      },
    ],
    'no-useless-constructor': 'off',
  },
};
