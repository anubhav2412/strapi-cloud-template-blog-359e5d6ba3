'use strict';

/**
 * Fills the professionals blog's new fields on rows that predate them. It runs
 * from src/bootstrap.js on every start, after Strapi has synced the schema, and
 * changes only rows that still need it, so after the first start it changes
 * nothing.
 *
 * - `site` on articles and categories: rows created before the field existed
 *   hold null (the schema's default applies to new rows only). They become
 *   'caltrac', drafts and published versions alike. A row that has a site is
 *   never touched.
 *
 * This is not a file in database/migrations because Strapi 5.47.1 runs those
 * before it syncs the schema (`schema.sync()` in @strapi/database calls
 * `migrations.up()`, then `syncSchema()`), so on the start that adds `site`,
 * a migration would run before the column exists.
 *
 * Rows are updated with plain SQL updates: `updatedAt` stays as it was (the
 * admin's "Modified" status and the sites' `lastmod` read it), no lifecycle
 * runs and no webhook fires.
 */

const SITE_DEFAULT = 'caltrac';
const SITE_TYPES = {
  article: 'api::article.article',
  category: 'api::category.category',
};

// A query on the table, in the database schema Strapi uses, inside the transaction.
const table = (strapi, trx, tableName) => strapi.db.getConnection(tableName).transacting(trx);

async function backfillSite(strapi, trx, uid) {
  const { tableName, attributes } = strapi.db.metadata.get(uid);
  const column = attributes.site.columnName;
  return table(strapi, trx, tableName).whereNull(column).update({ [column]: SITE_DEFAULT });
}

/**
 * Runs every backfill in one transaction and logs one line with the number of
 * rows each one changed, e.g. [pros-blog-backfill] {"article":10,"category":5}
 */
async function backfillProsBlog(strapi) {
  const result = {};
  await strapi.db.transaction(async ({ trx }) => {
    for (const [name, uid] of Object.entries(SITE_TYPES)) {
      result[name] = await backfillSite(strapi, trx, uid);
    }
  });
  strapi.log.info(`[pros-blog-backfill] ${JSON.stringify(result)}`);
  return result;
}

module.exports = { backfillProsBlog };
