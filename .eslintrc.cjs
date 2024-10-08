module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  // npm i eslint-plugin-vue -D【Vue 官方的 ESLint 插件；内部依赖了 vue-eslint-parser 解析器】
  // npm i  @vue/eslint-config-typescript -D【Vue 维护的插件；内部依赖了 @typescript-eslint/parser 和 @typescript-eslint/eslint-plugin】
  // npm i @vue/eslint-config-prettier -D【Vue 维护的插件；内部依赖了 eslint-plugin-prettier】

  extends: [
    "plugin:vue/vue3-essential", // eslint-plugin-vue
    "eslint:recommended", // eslint 自带规则集
    "@vue/typescript/recommended", // @vue/eslint-config-typescript
    "@vue/prettier", // @vue/eslint-config-prettier
    "@vue/eslint-config-typescript" // @vue/eslint-config-typescript 整合 Vue 和 TS 的规则
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser", // @typescript-eslint/parser 解析器，告诉 ESLint 如何解析 TypeScript 代码
    ecmaVersion: 2020,
    sourceType: "module",
    jsxPragma: "React",
    ecmaFeatures: {
      jsx: true,
      tsx: true
    }
  },
  rules: {
    // TS
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-debugger": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }
    ],
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }
    ],
    // Vue
    "vue/no-v-html": "off",
    "vue/require-default-prop": "off",
    "vue/require-explicit-emits": "off",
    "vue/multi-word-component-names": "off",
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "always",
          component: "always"
        },
        svg: "always",
        math: "always"
      }
    ],
    // Prettier
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto"
      }
    ]
  }
}
