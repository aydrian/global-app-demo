import { flatRoutes } from "remix-flat-routes";

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true
  },
  ignoredRouteFiles: ["**/.*"],
  postcss: true,
  // publicPath: "/build/",
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes);
  },
  // serverBuildPath: "build/index.js",
  serverDependenciesToBundle: ["remix-i18next"],
  serverModuleFormat: "esm",
  tailwind: true
};
