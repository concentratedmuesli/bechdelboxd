import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("starting-page", "starting-page/starting-page.tsx"),
  route("results", "results.tsx"),
] satisfies RouteConfig;
