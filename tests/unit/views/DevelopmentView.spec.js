import { shallowMount } from "@vue/test-utils";
import DevelopmentViewVue from "@/views/DevelopmentView.vue";

const Article = {
  name: "Article",
  props: ["article", "index"],
  template: "<div>{{ article.title }}</div>",
};

describe("DevelopmentViewVue.vue", () => {

  it("does not render .development container when content.development is undefined", () => {
    const wrapper = shallowMount(DevelopmentViewVue, {
      props: {
        content: {},
      },
      global: {
        components: {
          Article,
        },
      },
    });

    expect(wrapper.find(".development").exists()).toBe(false);
  });

  it("renders Article components when content.development is provided", () => {
    const articles = [
      { title: "Article 1" },
      { title: "Article 2" },
    ];

    const wrapper = shallowMount(DevelopmentViewVue, {
      props: {
        content: {
          development: articles,
        },
      },
      global: {
        components: {
          Article,
        },
      },
    });

    const articleComponents = wrapper.findAllComponents(Article);

    expect(wrapper.find(".development").exists()).toBe(true);
    expect(articleComponents).toHaveLength(articles.length);

    for (let i = 0; i < articles.length; i++) {
      expect(articleComponents[i].props().article).toEqual(articles[i]);
      expect(articleComponents[i].props().index).toBe(i);
    }
  });
});
