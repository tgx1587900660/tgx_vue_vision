module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/essential', '@vue/standard'],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        // 缩进配置
        indent: ['error', 4, { SwitchCase: 1, flatTernaryExpressions: true }],
        // 函数名与括号中间空格要求
        'space-before-function-paren': 0
    }
}
