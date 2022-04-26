module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    parser: "@typescript-eslint/parser",
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:nuxt/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    // sometimes necessary to cast types
    '@typescript-eslint/no-explicit-any': 'off',
    // this is sometimes necessary when using
    // non-typescript external modules
    '@typescript-eslint/ban-ts-comment': 'warn',
    semi: [2, 'never'],
  },
}
