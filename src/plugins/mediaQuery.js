import { reactive } from "vue";

export default {
  install: (app) => {
    // Reactive mediaQuery state
    const mediaQuery = reactive({
      isSmall: false,
      isMedium: false,
      isLarge: false,
    });

    // Check for window & MediaQueryList for safety (e.g. in SSR contexts)
    if (typeof window === "undefined" || !window.matchMedia) {
      console.warn("window or window.matchMedia is not available");
      return;
    }

    const small = window.matchMedia("(max-width: 767px)");
    const medium = window.matchMedia(
      "(min-width: 768px) and (max-width: 1023px)"
    );
    const large = window.matchMedia("(min-width: 1024px)");

    const updateMediaQueryState = () => {
      mediaQuery.isSmall = small.matches;
      mediaQuery.isMedium = medium.matches;
      mediaQuery.isLarge = large.matches;
    };

    // Event listener for media query changes
    const onMediaQueryChange = () => {
      updateMediaQueryState();
    };

    // Attach event listeners
    small.addEventListener("change", onMediaQueryChange);
    medium.addEventListener("change", onMediaQueryChange);
    large.addEventListener("change", onMediaQueryChange);

    // Initial state setup
    updateMediaQueryState();

    // Provide reactive mediaQuery state to the app
    app.provide("mediaQuery", mediaQuery);

    // Expose cleanup function for the event listeners
    app.config.globalProperties.$cleanupMediaQueryListeners = () => {
      small.removeEventListener("change", onMediaQueryChange);
      medium.removeEventListener("change", onMediaQueryChange);
      large.removeEventListener("change", onMediaQueryChange);
    };
  },
};
