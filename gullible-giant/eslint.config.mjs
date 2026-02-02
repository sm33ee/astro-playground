import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

const reactFiles = ['**/*.{jsx,tsx}'];
const reactConfig = {
  ...react.configs.flat.recommended,
  settings: {
    react: {
      version: 'detect'
    }
  }
};

export default [
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  {
    files: ['**/*.cjs'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: reactFiles,
    ...reactConfig
  },
  {
    files: reactFiles,
    ...react.configs.flat['jsx-runtime']
  },
  {
    files: reactFiles,
    ...reactHooks.configs.flat.recommended
  },
  prettier
];
