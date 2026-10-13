import coreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...coreWebVitals,
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
  {
    rules: {
      /* The case media are hand-rolled <img> inside a fixed-ratio plate
         with an onError fallback to the gradient plate; the static case
         shots are already shipped and tuned. next/image migration is a
         tracked follow-up in PROD-PLAN, not a drive-by. */
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
