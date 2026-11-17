'use strict';

/**
 * article router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// Without an API token, only the published version can be read (see
// src/policies/published-only-without-token.js).
const publishedOnlyWithoutToken = { policies: ['global::published-only-without-token'] };

module.exports = createCoreRouter('api::article.article', {
  config: {
    find: publishedOnlyWithoutToken,
    findOne: publishedOnlyWithoutToken,
  },
});
