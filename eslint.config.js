import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierRecommended, // Integra com o Prettier
  {
    ignores: ['dist/**', 'src/generated/**', 'prisma/generated/**'],
  },
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 1. Obrigar retornos de métodos
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',

      // 2. Liberar uso de `any`
      '@typescript-eslint/no-explicit-any': 'off',

      // 3. Regra estrita de nomenclatura (camelCase padrão, PascalCase para Types)
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'] },
        { selector: 'variable', modifiers: ['const'], format: ['camelCase', 'UPPER_CASE'] },
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'memberLike', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'require' },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'property', format: ['camelCase', 'UPPER_CASE'] },
      ],
    },
  },
);