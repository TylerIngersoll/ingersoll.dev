import { shallowMount } from "@vue/test-utils";
import HomeViewVue from "@/views/HomeView.vue";

const Article = {
  name: "Article",
  props: ["article", "index"],
  template: "<div>{{ article.title }}</div>",
};

describe("HomeView.vue", () => {

  it("does not render .home container when content.home is undefined", () => {
    const wrapper = shallowMount(HomeViewVue, {
      props: {
        content: {},
      },
      global: {
        components: {
          Article,
        },
      },
    });

    expect(wrapper.find(".home").exists()).toBe(false);
  });

  it("renders Article components when content.home is provided", () => {
    const articles = [
      { title: "Article 1" },
      { title: "Article 2" },
    ];

    const wrapper = shallowMount(HomeViewVue, {
      props: {
        content: {
          home: articles,
        },
      },
      global: {
        components: {
          Article,
        },
      },
    });

    const articleComponents = wrapper.findAllComponents(Article);

    expect(wrapper.find(".home").exists()).toBe(true);
    expect(articleComponents).toHaveLength(articles.length);

    for (let i = 0; i < articles.length; i++) {
      expect(articleComponents[i].props().article).toEqual(articles[i]);
      expect(articleComponents[i].props().index).toBe(i);
    }
  });
});
