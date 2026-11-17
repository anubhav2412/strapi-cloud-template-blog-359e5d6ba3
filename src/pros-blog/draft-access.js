'use strict';

/**
 * Who may ask the content API for something other than the published version.
 *
 * The Public role can `find` articles and categories, and Strapi 5 lets any
 * caller with `find` ask for drafts with `?status=draft`. A request without an
 * API token may only read published content: it may leave `status` out or set
 * it to `published`, and any other value is refused. A request with an API
 * token (the sites' read-only tokens, the backend's import token) is unchanged.
 */

// The strategy name Strapi gives a request authenticated with an API token.
const API_TOKEN_STRATEGY = 'content-api-token';
const PUBLISHED = 'published';

const hasApiToken = (auth) => auth?.strategy?.name === API_TOKEN_STRATEGY;

/**
 * @param {object} request
 * @param {{ strategy?: { name?: string } } | undefined} request.auth Strapi's ctx.state.auth
 * @param {Record<string, unknown> | undefined} request.query the parsed query string
 * @returns {boolean} true when the request must be refused
 */
function refusesStatus({ auth, query }) {
  if (hasApiToken(auth) || query == null || !Object.prototype.hasOwnProperty.call(query, 'status')) {
    return false;
  }
  return query.status !== PUBLISHED;
}

module.exports = { refusesStatus };
