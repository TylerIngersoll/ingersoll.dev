import { defineStore } from "pinia";
const contentful = require("contentful");

export const useContentStore = defineStore("content", {
  state: () => ({ content: [] }),
  actions: {
    loadContent() {
      const useLocalJson = () => {
        const jsonData = require("@/data/content.json");
        this.content = jsonData.content;
      };

      const client = contentful.createClient({
        space: process.env.VUE_APP_CONTENTFUL_SPACE,
        environment: process.env.VUE_APP_CONTENTFUL_ENVIRONMENT,
        accessToken: process.env.VUE_APP_CONTENTFUL_ACCESS_TOKEN,
      });

      if (process.env.NODE_ENV === "production") {
        client
          .getEntry(process.env.VUE_APP_CONTENTFUL_ENTRY)
          .then((entry) => (this.content = entry.fields.siteContent.content))
          .catch(() => {
            useLocalJson();
          });
      } else {
        useLocalJson();
      }
    },
  },
});
