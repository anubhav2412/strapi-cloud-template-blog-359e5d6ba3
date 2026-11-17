'use strict';

/**
 * pros-login service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::pros-login.pros-login');
