module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["universe", "plugin:react/recommended", "prettier"],
  plugins: ["react", "classname-cn"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    quotes: ["error", "double"],
    "no-multiple-empty-lines": ["error", { max: 1 }],
    "no-mixed-spaces-and-tabs": 0,
    "jsx-quotes": ["error", "prefer-double"],
    "linebreak-style": ["error", "unix"],
    "react/prop-types": 0,
    "react/react-in-jsx-scope": "off",
    "react/function-component-definition": [
      "error",
      { namedComponents: "arrow-function", unnamedComponents: "arrow-function" },
    ],
    "react/no-multi-comp": ["error", { ignoreStateless: false }],
    "classname-cn/use-cn-for-classname": "error",
    "import/order": "off",
    "sort-imports": "off",
  },
  overrides: [
    {
      files: ["components/ui/**/*.{js,jsx,ts,tsx}"],
      rules: {
        "react/no-multi-comp": "off",
      },
    },
  ],
};
