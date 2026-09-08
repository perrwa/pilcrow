import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['brand/', 'fonts/', 'node_modules/'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
  },
];
