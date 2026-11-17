'use strict';

const { errors } = require('@strapi/utils');
const { refusesStatus } = require('../pros-blog/draft-access');

/**
 * Refuses, with 403, a content API request without an API token that asks for
 * anything but the published version (?status=draft, or any status other
 * than `published`). src/pros-blog/read-routes.js puts it on every API
 * content type's find and findOne routes.
 */
module.exports = (policyContext) => {
  if (refusesStatus({ auth: policyContext.state.auth, query: policyContext.request.query })) {
    throw new errors.PolicyError(
      'Only published content can be read without an API token. Leave out "status", or set it to "published".'
    );
  }
  return true;
};
