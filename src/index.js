'use strict';
const bootstrap = require("./bootstrap");
const { createArticleSiteGuard } = require('./pros-blog/article-site-guard');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    // Keeps an article's blocks and category on the article's site (caltrac.ai
    // or the professionals blog), for the admin, the REST API and server code.
    strapi.documents.use(createArticleSiteGuard(strapi));
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap,
};
