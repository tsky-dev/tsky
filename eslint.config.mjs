import antfu from '@antfu/eslint-config';

export default antfu(
  {
    stylistic: {
      semi: true,
    },
  },
  {
    rules: {
      'perfectionist/sort-named-imports': 'off',
      'antfu/if-newline': 'off',
      'perfectionist/sort-exports': 'off',
    },
  },
);
