'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { applyPublishedOnlyToReadRoutes, POLICY } = require('../src/pros-blog/read-routes');

// A router shaped like createCoreRouter's: its routes are built once, then kept.
const coreRouter = (uid, single = false) => {
  let routes;
  return {
    get routes() {
      routes ??= [
        { method: 'GET', handler: `${uid}.find`, config: {} },
        ...(single ? [] : [{ method: 'GET', handler: `${uid}.findOne`, config: {} }]),
        { method: single ? 'PUT' : 'POST', handler: `${uid}.${single ? 'update' : 'create'}`, config: {} },
        { method: 'DELETE', handler: `${uid}.delete`, config: {} },
      ];
      return routes;
    },
  };
};
const policiesOf = (router) => Object.fromEntries(router.routes.map((r) => [r.handler, r.config?.policies ?? []]));

test('find and findOne of collection and single types get the policy; writes do not', () => {
  const article = coreRouter('api::article.article');
  const global = coreRouter('api::global.global', true);
  const count = applyPublishedOnlyToReadRoutes({ apis: { article: { routes: { article } }, global: { routes: { global } } } });
  assert.equal(count, 3);
  assert.deepEqual(policiesOf(article), {
    'api::article.article.find': [POLICY],
    'api::article.article.findOne': [POLICY],
    'api::article.article.create': [],
    'api::article.article.delete': [],
  });
  assert.deepEqual(policiesOf(global), {
    'api::global.global.find': [POLICY],
    'api::global.global.update': [],
    'api::global.global.delete': [],
  });
});

test('a custom router keeps its own policies, and a second run adds nothing', () => {
  const custom = { routes: [{ method: 'GET', handler: 'article.find', config: { policies: ['global::other'] } }, { method: 'GET', handler: 'article.findMine' }] };
  const strapi = { apis: { article: { routes: { custom } } } };
  applyPublishedOnlyToReadRoutes(strapi);
  applyPublishedOnlyToReadRoutes(strapi);
  assert.deepEqual(custom.routes[0].config.policies, ['global::other', POLICY]);
  assert.equal(custom.routes[1].config, undefined);
});

test('a router given as a function gets the policy when Strapi builds it', () => {
  const routes = { factory: () => ({ routes: [{ method: 'GET', handler: 'api::about.about.find' }] }) };
  applyPublishedOnlyToReadRoutes({ apis: { about: { routes } } });
  const built = routes.factory({ strapi: {} });
  assert.deepEqual(built.routes[0].config.policies, [POLICY]);
});

test('a route whose handler is a function is left alone', () => {
  // Even one that would read as a find handler when turned into a string.
  const handler = Object.assign(() => {}, { toString: () => 'api::x.x.find' });
  const router = { routes: [{ method: 'GET', handler, config: {} }] };
  applyPublishedOnlyToReadRoutes({ apis: { x: { routes: { router } } } });
  assert.deepEqual(router.routes[0].config, {});
});
