'use strict';

/**
 * Puts the published-only policy (src/policies/published-only-without-token.js)
 * on every find and findOne route of every API content type: the collection
 * types' find and findOne and the single types' find, from the core routers
 * and from any custom router alike. It runs once, from `register()` in
 * src/index.js, before Strapi registers the routes in `bootstrap()`.
 *
 * A router given as an object (createCoreRouter's, or a plain { routes })
 * is changed in place: createCoreRouter builds its routes once and keeps
 * them. A router given as a function is built only when the routes are
 * registered, so it is wrapped and its routes get the policy then.
 */

const POLICY = 'global::published-only-without-token';
const READ_HANDLER = /\.(find|findOne)$/;

const isReadRoute = (route) => typeof route?.handler === 'string' && READ_HANDLER.test(route.handler);

function addPolicy(router) {
  let count = 0;
  for (const route of router?.routes ?? []) {
    if (!isReadRoute(route)) continue;
    const policies = route.config?.policies ?? [];
    if (!policies.includes(POLICY)) {
      route.config = { ...route.config, policies: [...policies, POLICY] };
    }
    count += 1;
  }
  return count;
}

/**
 * @param {{ apis: Record<string, { routes?: Record<string, object | Function> }> }} strapi
 * @returns {number} the read routes of object routers that carry the policy;
 *   function routers get it later, when Strapi builds them
 */
function applyPublishedOnlyToReadRoutes(strapi) {
  let count = 0;
  for (const api of Object.values(strapi.apis)) {
    const routers = api.routes ?? {};
    for (const [name, router] of Object.entries(routers)) {
      if (typeof router === 'function') {
        routers[name] = (...args) => {
          const built = router(...args);
          addPolicy(built);
          return built;
        };
      } else {
        count += addPolicy(router);
      }
    }
  }
  return count;
}

module.exports = { applyPublishedOnlyToReadRoutes, POLICY };
