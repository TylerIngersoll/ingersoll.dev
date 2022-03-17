import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import mediaQueryPlugin from "./plugins/mediaQuery";
import { Header, MobileNav, Navigation, Footer, Article } from "@/components";

createApp(App)
  .use(createPinia())
  .use(router)
  .use(mediaQueryPlugin)
  .component("Header", Header)
  .component("MobileNav", MobileNav)
  .component("Navigation", Navigation)
  .component("Footer", Footer)
  .component("Article", Article)
  .mount("#app");
