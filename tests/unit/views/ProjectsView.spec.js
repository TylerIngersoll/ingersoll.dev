import { mount } from "@vue/test-utils";
import ProjectsViewVue from "@/views/ProjectsView.vue";

describe("ProjectsView.vue", () => {
  let wrapper;

  const articles = [
    { title: "UntappdBeers", component: "UntappdBeers" },
    { title: "Project 2" },
  ];

  const commonStubs = {
    Article: {
      name: "Article",
      template: '<div class="article"><slot /></div>',
      props: ["article", "index"],
    },
    UntappdBeers: {
      name: "UntappdBeers",
      props: ["sort", "limit", "icons"],
      template: "<div></div>",
    },
  };

  const commonProvide = {
    mediaQuery: { isSmall: false },
  };

  beforeEach(async () => {
    wrapper = mount(ProjectsViewVue, {
      props: {
        content: {
          projects: articles,
        },
      },
      global: {
        provide: commonProvide,
        stubs: commonStubs,
      },
    });

    await wrapper.vm.$nextTick();
  });

  it("does not render .projects container when content.projects is undefined", async () => {
    wrapper = mount(ProjectsViewVue, {
      props: {
        content: {},
      },
      global: {
        provide: commonProvide,
        stubs: {
          Article: commonStubs.Article,
        },
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".projects").exists()).toBe(false);
  });

  it("renders Article components when content.projects is provided", () => {
    const articleComponents = wrapper.findAllComponents({ name: "Article" });

    expect(wrapper.find(".article").exists()).toBe(true);
    expect(articleComponents).toHaveLength(articles.length);

    for (let i = 0; i < articles.length; i++) {
      const articleProps = articleComponents[i].props();
      expect(articleProps.article).toBeDefined();
      expect(articleProps.article).toEqual(articles[i]);
      expect(articleProps.index).toBe(i);
    }
  });
});
