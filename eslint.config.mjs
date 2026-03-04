// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt([
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",

      // vue
      "vue/no-unused-components": "warn",
      "vue/no-unused-vars": "warn",
      "vue/multi-word-component-names": "warn",
      "vue/component-name-in-template-casing": ["warn", "kebab-case"],
      "vue/component-definition-name-casing": "off",
      "vue/max-attributes-per-line": [
        "error",
        {
          singleline: 2,
          multiline: 1,
        },
      ],
      "vue/html-indent": [
        "warn",
        2,
        {
          attribute: 1,
          baseIndent: 1,
          alignAttributesVertically: true,
          ignores: [],
        },
      ],
      "vue/define-macros-order": [
        "warn",
        {
          order: ["defineEmits", "defineSlots", "defineProps", "defineModel"],
        },
      ],
    },
  },
  {
    ignores: ["app/shared/components/ui/**/*.vue"],
  },
]);
