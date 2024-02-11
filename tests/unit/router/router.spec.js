import HomeView from "@/views/HomeView.vue";
import router from "@/router";

// Mocking dynamic imports
jest.mock("@/views/DevelopmentView.vue", () => jest.fn());
jest.mock("@/views/ProjectsView.vue", () => jest.fn());
jest.mock("@/views/MusicView.vue", () => jest.fn());

describe("Vue Router", () => {

  it("should have a route for home with HomeView component", () => {
    const homeRoute = router.options.routes.find(route => route.name === "home");
    expect(homeRoute).toBeDefined();
    expect(homeRoute.name).toBe("home");
    expect(homeRoute.component).toBe(HomeView);
  });

  it("should have a route for development", () => {
    const developmentRoute = router.options.routes.find(route => route.name === "Web development");
    expect(developmentRoute).toBeDefined();
    expect(developmentRoute.name).toBe("Web development");
  });

  it("should have a route for projects", () => {
    const projectsRoute = router.options.routes.find(route => route.name === "Projects");
    expect(projectsRoute).toBeDefined();
    expect(projectsRoute.name).toBe("Projects");
  });

  it("should have a route for music", () => {
    const musicRoute = router.options.routes.find(route => route.name === "Music");
    expect(musicRoute).toBeDefined();
    expect(musicRoute.name).toBe("Music");
  });
});
