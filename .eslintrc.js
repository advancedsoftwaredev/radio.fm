const packages = [];
const paths = ['@src', '@app', '@api', '@scss', '@integration'];
// including css in images as well, because it's rare enough
const imgExtensions = ['png', 'jpg', 'jpeg', 'svg', 'css', 'scss'];
const fullPhrases = ['@testHelpers', '@integration', '\\.\\.'];

const imgExtensionRegex = `\\.(${imgExtensions.join('|')})$`;
const imageRegex = `(.+${imgExtensionRegex})`;
const packageRegex = `(${packages.join('|')})\\/.+`;
const pathsRegex = `(${paths.join('|')})\\/.+`;
const relativeRegex = '(\\.)+\\/';
const fullPhraseRegex = `((${fullPhrases.join('|')})$)`;

const allRegex = `(${[packageRegex, relativeRegex, packageRegex, imageRegex, fullPhraseRegex]
  .map((r) => `(${r})`)
  .join('|')})`;

module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
  },
  plugins: [
    'react',
    'react-hooks',
    'prettier',
    '@typescript-eslint',
    'unused-imports',
    'simple-import-sort',
    'import',
    'jest',
  ],
  ignorePatterns: ['src/app/sk-scripts.js', '.eslintrc.js'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['*.json'],
      extends: ['plugin:json/recommended'],
      plugins: ['json'],
      rules: {
        'json/*': ['error', 'allowComments'],
        'prettier/prettier': ['warn', { parser: 'json' }],
      },
    },
    {
      files: ['*.yaml', '*.yml'],
      extends: ['plugin:yaml/recommended'],
      plugins: ['yaml'],
      rules: {
        'prettier/prettier': ['warn', { parser: 'yaml' }],
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:storybook/recommended',
        'prettier/react',
      ],
      rules: {
        indent: 'off',
        quotes: 'off',
        curly: 'error',
        semi: ['warn', 'always'],
        'linebreak-style': ['warn', 'unix'],
        'prettier/prettier': 'warn',
        'jest/require-top-level-describe': 'warn',
        'jest/no-identical-title': 'error',
        'jest/no-focused-tests': 'error',
        'jest/no-conditional-expect': 'warn',
        'jest/prefer-to-have-length': 'warn',
        'jest/prefer-todo': 'warn',
        'jest/require-top-level-describe': 'warn',
        'jest/no-identical-title': 'error',
        'jest/no-focused-tests': 'error',
        'jest/no-conditional-expect': 'warn',
        'jest/prefer-to-have-length': 'warn',
        'jest/prefer-todo': 'warn',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-no-duplicate-props': 'error',
        'react/jsx-boolean-value': ['error', 'always'],
        'react/jsx-curly-brace-presence': ['error', 'never'],
        'react/no-unescaped-entities': 'off',
        'react/display-name': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
        'typescript/no-type-alias': 'off',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/consistent-type-imports': 'warn',
        'import/newline-after-import': 'warn',
        'unused-imports/no-unused-imports': 'warn',
        'simple-import-sort/imports': [
          'warn',
          {
            groups: [
              [`^(?!${allRegex})`],
              [`^${packageRegex}(?<!(${imgExtensionRegex}))`],
              [`^((${relativeRegex})|(${fullPhraseRegex})|(${pathsRegex}))(?<!(${imgExtensionRegex}))`],
              [`^${imageRegex}`],
            ],
          },
        ],
        'object-shorthand': 'error',
        'sort-imports': 'off',
        'import/order': 'off',
        'no-fallthrough': 'error',
        'no-constant-condition': 'off',
        'no-case-declarations': 'off',
        'no-empty-pattern': 'off',
        'no-restricted-properties': [
          'warn',
          { object: 'describe', property: 'only', message: "Don't focus tests" },
          { object: 'it', property: 'only', message: "Don't focus tests" },
          { property: 'bind', message: "Don't o.f.bind(o, ...), use () => o.f(...)" },
          {
            object: 'ReactDOM',
            property: 'findDOMNode',
            message: "Don't use ReactDOM.findDOMNode() as it is deprecated",
          },
          {
            object: 'navigator',
            property: 'userAgent',
            message: "Don't use userAgent directly",
          },
        ],
      },
    },
    {
      files: ['*.stories.tsx'],
      rules: {
        'no-restricted-properties': 'off',
        'react/jsx-no-bind': 'off',
      },
    },
    {
      files: ['*.test.tsx'],
      rules: {
        'react/jsx-no-bind':'off',
      },
    },
  ],
  rules: {},
  extends: ["plugin:storybook/recommended"],
};