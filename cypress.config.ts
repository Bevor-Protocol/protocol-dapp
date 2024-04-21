import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  // cypress doesn't yet support nextjs 14 for async components. Use e2e testing.
  // component: {
  //   devServer: {
  //     framework: "next",
  //     bundler: "webpack",
  //   },
  // }
});
