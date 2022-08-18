module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    'no-var': 'error', // 禁止使用 var
    indent: 'off', // 缩进2格
    'no-mixed-spaces-and-tabs': 'error', // 不能空格与tab混用
    'vue/html-closing-bracket-newline': 'off', // 不强制换行
    'vue/singleline-html-element-content-newline': 'off', // 不强制换行
    'vue/multi-word-component-names': 'off', // 不强制给组件命名
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 3 },
      multiline: { max: 1 }
    }], // vue template模板元素第一行最多3个属性, 大于三个需要换行且一行一个
    'vue/html-indent': 'off',
    'prefer-const': 'off' // 禁止未使用变量强制使用const 因为ref使用的是obj.value方式操作变量
  }
}
