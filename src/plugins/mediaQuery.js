import { reactive } from "vue";

export default {
  install: (app) => {
    const mediaQuery = reactive({
      isSmall: false,
      isMedium: false,
      isLarge: false,
    });

    let small = window.matchMedia("(max-width: 767px)");
    let medium = window.matchMedia(
      "(min-width: 768px) and (max-width: 1023px)"
    );
    let large = window.matchMedia("(min-width: 1024px");

    const onMediaQueryChange = () => {
      if (small.matches) {
        mediaQuery.isSmall = true;
        mediaQuery.isMedium = false;
        mediaQuery.isLarge = false;
      } else if (medium.matches) {
        mediaQuery.isSmall = false;
        mediaQuery.isMedium = true;
        mediaQuery.isLarge = false;
      } else if (large.matches) {
        mediaQuery.isSmall = false;
        mediaQuery.isMedium = false;
        mediaQuery.isLarge = true;
      }
    };

    if (MediaQueryList) {
      small.addEventListener("change", onMediaQueryChange);
      medium.addEventListener("change", onMediaQueryChange);
      large.addEventListener("change", onMediaQueryChange);
    }

    onMediaQueryChange();

    app.provide("mediaQuery", mediaQuery);
  },
};
