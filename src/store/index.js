import { defineStore } from "pinia";
import { createClient } from "contentful";

export const useContentStore = defineStore("content", {
  state: () => ({ content: [] }),

  actions: {
    async loadContent() {
      if (process.env.NODE_ENV === "production") {
        try {
          const client = this.createContentfulClient();
          const entry = await client.getEntry(
            process.env.VUE_APP_CONTENTFUL_ENTRY
          );
          this.content = entry.fields.siteContent.content;
        } catch (error) {
          console.error("Failed to fetch content from Contentful:", error);
          await this.useLocalJson();
        }
      } else {
        await this.useLocalJson();
      }
    },

    createContentfulClient() {
      if (
        !process.env.VUE_APP_CONTENTFUL_SPACE ||
        !process.env.VUE_APP_CONTENTFUL_ENVIRONMENT ||
        !process.env.VUE_APP_CONTENTFUL_ACCESS_TOKEN
      ) {
        throw new Error(
          "Missing Contentful configuration in environment variables"
        );
      }

      return createClient({
        space: process.env.VUE_APP_CONTENTFUL_SPACE,
        environment: process.env.VUE_APP_CONTENTFUL_ENVIRONMENT,
        accessToken: process.env.VUE_APP_CONTENTFUL_ACCESS_TOKEN,
      });
    },

    async useLocalJson() {
      const jsonData = await import("@/data/content.json");
      this.content = jsonData.content;
    },
  },
});
