module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 7,
        ecmaFeatures: {
            'jsx': true,
            'modules': true
        },
        parser: 'babel-eslint'

    },
    env: {
        es6: true,
        node: true,
        jquery:true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/recommended',
        "plugin:vue/essential"
    ],
    plugins: ['vue'],
    globals: {
        document: false,
        navigator: false,
        window: false
    },

// "off" or 0 - 关闭这个规则校验
// "warn" or 1 - 开启这个规则校验，但只是提醒，不会退出
// "error" or 2 - 开启这个规则校验，并退出
    rules: {
        'vue/no-template-shadow': 0,
        'vue/no-v-html': 0,
        'vue/require-default-prop': 0,
        'no-unused-vars': 1,
        'vue/no-unused-vars': 1,
        'vue/max-attributes-per-line': ['error', {
            'singleline': {
                'max': 6
            },
            'multiline': {
                'max': 1
            }
        }],
        'vue/html-self-closing': 0
    }

}
