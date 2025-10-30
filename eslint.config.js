import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      prettierConfig,
    ],
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'max-depth': ['warn', 1], // if文の中にif文がある場合に警告
      'prefer-const': 'warn', // 再代入されないlet変数に警告
      'no-else-return': 'warn', // returnの後のelseに警告

      // コード品質・可読性
      'eqeqeq': 'warn', // ===と!==の使用を推奨
      'no-var': 'warn', // var使用を禁止
      'complexity': ['warn', 10], // 関数の複雑度を10以下に制限

      // TypeScript特有
      '@typescript-eslint/no-unused-vars': 'warn', // 未使用変数を警告
      '@typescript-eslint/no-explicit-any': 'warn', // any型の使用を警告
      '@typescript-eslint/no-non-null-assertion': 'warn', // ! 演算子の使用を警告
      '@typescript-eslint/prefer-optional-chain': 'warn', // ?. の使用を推奨
      '@typescript-eslint/prefer-nullish-coalescing': 'warn', // ?? の使用を推奨

      // パフォーマンス
      'no-await-in-loop': 'warn', // ループ内のawaitを警告
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
