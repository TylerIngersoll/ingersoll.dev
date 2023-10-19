import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";
import { computed, nextTick } from "vue";
import { useContentStore } from "@/store";

jest.mock("contentful", () => ({
  createClient: jest.fn().mockReturnValue({
    getEntry: jest.fn().mockResolvedValue({
      fields: {
        siteContent: {
          content: "mocked content from contentful",
        },
      },
    }),
  }),
}));

jest.mock("@/data/content.json", () => ({
  content: "mocked content from local json",
}));

const mockStore = {
  content: {
    meta: {},
    navigation: {},
    footer: {},
  },
  loadContent: jest.fn(),
};

jest.mock("@/store", () => ({
  useContentStore: jest.fn(() => mockStore),
}));

const componentStubs = ["Header", "MobileNav", "Navigation", "RouterView", "Footer"];

const defaultMountOptions = {
  global: {
    provide: {
      mediaQuery: { isSmall: false },
    },
    stubs: componentStubs,
  },
};

function mountAppWithOption(options = {}) {
  return shallowMount(App, { ...defaultMountOptions, ...options });
}

describe("App.vue", () => {
  let wrapper;

  beforeEach(() => {
    useContentStore.mockReturnValue(mockStore);
    wrapper = mountAppWithOption();
  });

  it("renders Header component", () => {
    expect(wrapper.findComponent({ name: "Header" }).exists()).toBe(true);
  });

  it("renders Navigation component when mediaQuery.isSmall is false", () => {
    expect(wrapper.findComponent({ name: "Navigation" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "MobileNav" }).exists()).toBe(false);
  });

  it("renders MobileNav component when mediaQuery.isSmall is true", async () => {
    wrapper = mountAppWithOption({
      global: {
        provide: {
          mediaQuery: { isSmall: true },
				},
				stubs: componentStubs,
      },
    });
    await nextTick();
    expect(wrapper.findComponent({ name: "MobileNav" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "Navigation" }).exists()).toBe(false);
  });

  it("renders Footer component", () => {
    expect(wrapper.findComponent({ name: "Footer" }).exists()).toBe(true);
  });

  it("computes content from store", () => {
    const contentValue = { footer: {}, meta: {}, navigation: {} };
    useContentStore.mockReturnValue({
      content: computed(() => contentValue),
    });
    expect(wrapper.vm.content).toEqual(contentValue);
  });

  it("handles mobile nav click", async () => {
    wrapper = mountAppWithOption({
      global: {
        provide: {
          mediaQuery: { isSmall: true },
				},
				stubs: componentStubs,
      },
    });

    const mobileNavComponent = wrapper.findComponent({ name: "MobileNav" });
    mobileNavComponent.vm.$emit("MobileNavClicked", true);
    await nextTick();
    expect(wrapper.vm.mobileNav.isOpen).toBe(true);
  });

  it("loads content on mount", async () => {
    const loadContent = jest.fn();
    useContentStore.mockReturnValue({
      loadContent,
    });
    mountAppWithOption();
    await nextTick();
    expect(loadContent).toHaveBeenCalled();
  });
});
