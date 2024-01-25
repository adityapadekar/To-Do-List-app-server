module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: "eslint:recommended",
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        "no-console": 1,
        indent: ["error", 4],
        "linebreak-style": ["error", "windows"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
    },
};
// "no-console": 1,
// indent: ["error", 4],
// "linebreak-style": ["error", "wondows"],
// quotes: ["error", "double"],
// semi: ["error", "always"],
