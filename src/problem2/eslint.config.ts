import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import pluginVitest from '@vitest/eslint-plugin';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  skipFormatting,

  // Semicolon rules configuration (after skipFormatting to override)
  {
    name: 'app/semicolon-rules',
    files: ['**/*.{ts,mts,tsx,vue,js,jsx}'],
    rules: {
      // Require semicolons at the end of statements
      'semi': ['error', 'always'],

      // Enforce spacing around semicolons
      'semi-spacing': ['error', { 'before': false, 'after': true }],

      // Disallow unnecessary semicolons
      'no-extra-semi': 'error',

      // Enforce semicolons at the end of statements (not beginning)
      'semi-style': ['error', 'last'],
    },
  },

  // UI components exception (allow single-word component names for UI library components)
  {
    name: 'app/ui-components-exception',
    files: ['src/components/ui/**/*.vue'],
    rules: {
      // Disable multi-word component names for UI library components
      'vue/multi-word-component-names': 'off',
    },
  },
);
