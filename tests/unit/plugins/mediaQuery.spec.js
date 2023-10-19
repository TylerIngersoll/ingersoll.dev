import { createApp  } from "vue";
import MediaQueryPlugin from "@/plugins/mediaQuery";

describe("MediaQueryPlugin", () => {
  let mockSmall;
  let mockMedium;
  let mockLarge;
  let changeListeners;

  beforeEach(() => {
    changeListeners = [];

    mockSmall = {
      matches: false,
      addEventListener: jest.fn((event, callback) => {
        changeListeners.push(callback);
      }),
      removeEventListener: jest.fn(),
    };

    mockMedium = {
      ...mockSmall,
    };

    mockLarge = {
      ...mockSmall,
    };

    window.matchMedia = jest.fn().mockImplementation((query) => {
      if (query.includes("767px")) {
        return mockSmall;
      } else if (query.includes("768px") && query.includes("1023px")) {
        return mockMedium;
      } else {
        return mockLarge;
      }
    });
  });

  const setupPlugin = () => {
    const app = createApp({
      template: "<div></div>",
    });
    app.use(MediaQueryPlugin);
    return app;
  };

  it("sets the correct initial mediaQuery values", () => {
    mockSmall.matches = true;

    const app = setupPlugin();
    const mediaQuery = app._context.provides.mediaQuery;

    expect(mediaQuery.isSmall).toBe(true);
    expect(mediaQuery.isMedium).toBe(false);
    expect(mediaQuery.isLarge).toBe(false);
  });

  const testMediaChange = (mock, expectedState) => {
    mock.matches = true;
    changeListeners.forEach((listener) => listener());
    const app = setupPlugin();
    const mediaQuery = app._context.provides.mediaQuery;
    expect(mediaQuery).toEqual(expectedState);
  };

  it("reacts to small media query changes", () => {
    testMediaChange(mockSmall, { isSmall: true, isMedium: false, isLarge: false });
  });

  it("reacts to medium media query changes", () => {
    testMediaChange(mockMedium, { isSmall: false, isMedium: true, isLarge: false });
  });

  it("reacts to large media query changes", () => {
    testMediaChange(mockLarge, { isSmall: false, isMedium: false, isLarge: true });
  });

  it("cleans up event listeners", () => {
    const app = setupPlugin();
    app.mount(document.createElement('div'));
    app.config.globalProperties.$cleanupMediaQueryListeners();
    expect(mockSmall.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    expect(mockMedium.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    expect(mockLarge.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
