import stylistic from "@stylistic/eslint-plugin";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt([
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      // base
      "no-unused-vars": "warn",
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",

      // stylistic
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
      "@stylistic/semi": ["warn", "always"],
      "@stylistic/no-extra-semi": "off",
      "@stylistic/max-len": [
        "error",
        {
          code: 120,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
        },
      ],
      "@stylistic/no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
      "@stylistic/object-curly-spacing": [
        "error",
        "always",
        {
          emptyObjects: "never",
        },
      ],

      // vue
      "vue/no-unused-components": "warn",
      "vue/no-unused-vars": "warn",
      "vue/multi-word-component-names": "warn",
      "vue/component-name-in-template-casing": [
        "warn",
        "kebab-case",
        // Exclude Shadcn components
        {
          ignores: ["Button", "Input", "Label", "Card", "Toaster"],
        },
      ],
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
      "vue/html-self-closing": "off",
    },
  },
  {
    ignores: ["app/shared/components/ui/**/*.vue", "app/shared/types/supabase/*.ts"],
  },
]);
