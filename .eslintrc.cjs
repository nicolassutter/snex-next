require('@rushstack/eslint-patch/modern-module-resolution')

/* eslint-env node */
module.exports = {
  root: true,
  extends: ['eslint:recommended', 'alsacreations', 'plugin:react/recommended'],
  rules: {
    'multiline-comment-style': 'off',
    'prefer-template': 'error',
    'no-trailing-spaces': 'warn',
    'object-shorthand': 'warn',
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: false,
      },
    ],
    'comma-dangle': 'off',
    "brace-style'": 'off',
    'no-undef': 'off',
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'unicorn/prefer-type-error': 'off',
    'unicorn/error-message': 'off',
    '@typescript-eslint/brace-style': ['error', '1tbs'],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-undef': 'off',
    'space-before-function-paren': 'off',
  },
}
