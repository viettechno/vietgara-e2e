import js from '@eslint/js'
import playwright from 'eslint-plugin-playwright'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['playwright-report/**', 'test-results/**', 'src/api/schema.d.ts', 'src/api/openapi.json'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ['eslint.config.js'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['tests/**/*.ts'],
    plugins: { playwright },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/expect-expect': 'off', // page-object assertions run inside helper methods, not always inline
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
)
