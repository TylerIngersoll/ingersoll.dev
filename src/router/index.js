import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/development",
    name: "Web development",
    component: () =>
      import(
        /* webpackChunkName: "development" */ "../views/DevelopmentView.vue"
      ),
  },
  {
    path: "/projects",
    name: "Projects",
    component: () =>
      import(/* webpackChunkName: "projects" */ "../views/ProjectsView.vue"),
  },
  {
    path: "/music",
    name: "Music",
    component: () =>
      import(/* webpackChunkName: "music" */ "../views/MusicView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
