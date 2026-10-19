import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default tseslint.config(
  // Global ignores
  {
    ignores: ['dist/', 'node_modules/', 'dev/'],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Vue 3 recommended rules (includes vue-eslint-parser)
  ...pluginVue.configs['flat/recommended'],

  // Browser + Node globals (document, setTimeout, console, etc.)
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Vue files: use typescript-eslint parser inside <script> blocks
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  // Project-specific rule overrides
  {
    rules: {
      // Keep lenient — catch bugs, not style
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Vue-specific
      'vue/no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',

      // Disable opinionated template formatting rules — no formatter configured
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-closing-bracket-newline': 'off',
    },
  },
)
