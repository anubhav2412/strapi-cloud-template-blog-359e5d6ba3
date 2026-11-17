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
 * - `slug` on authors: an author created before the field existed has none, and
 *   the professionals blog links every author to /blog/author/<slug>. It gets
 *   one from its name, made unique the way the admin makes it ("jane-doe",
 *   then "jane-doe-1"). An author that has a slug keeps it.
 *
 * This is not a file in database/migrations because Strapi 5.47.1 runs those
 * before it syncs the schema (`schema.sync()` in @strapi/database calls
 * `migrations.up()`, then `syncSchema()`), so on the start that adds these
 * columns, a migration would run before they exist.
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
const AUTHOR_UID = 'api::author.author';

// A query on the table, in the database schema Strapi uses, inside the transaction.
const table = (strapi, trx, tableName) => strapi.db.getConnection(tableName).transacting(trx);

async function backfillSite(strapi, trx, uid) {
  const { tableName, attributes } = strapi.db.metadata.get(uid);
  const column = attributes.site.columnName;
  return table(strapi, trx, tableName).whereNull(column).update({ [column]: SITE_DEFAULT });
}

async function backfillAuthorSlugs(strapi, trx) {
  const { tableName, attributes } = strapi.db.metadata.get(AUTHOR_UID);
  const slugColumn = attributes.slug.columnName;
  const nameColumn = attributes.name.columnName;
  const rows = await table(strapi, trx, tableName)
    .select('id', nameColumn)
    .where((query) => query.whereNull(slugColumn).orWhere(slugColumn, ''))
    .orderBy('id');
  // The admin's own generator: it slugifies the name and checks the slugs
  // already taken, including the ones set earlier in this loop (same transaction).
  const uidService = strapi.plugin('content-manager').service('uid');
  for (const row of rows) {
    const slug = await uidService.generateUIDField({
      contentTypeUID: AUTHOR_UID,
      field: 'slug',
      data: { name: row[nameColumn] },
    });
    await table(strapi, trx, tableName).where('id', row.id).update({ [slugColumn]: slug });
  }
  return rows.length;
}

/**
 * Runs every backfill in one transaction and logs one line with the number of
 * rows each one changed, e.g.
 * [pros-blog-backfill] {"article":10,"category":5,"authorSlug":2}
 */
async function backfillProsBlog(strapi) {
  const result = {};
  await strapi.db.transaction(async ({ trx }) => {
    for (const [name, uid] of Object.entries(SITE_TYPES)) {
      result[name] = await backfillSite(strapi, trx, uid);
    }
    result.authorSlug = await backfillAuthorSlugs(strapi, trx);
  });
  strapi.log.info(`[pros-blog-backfill] ${JSON.stringify(result)}`);
  return result;
}

module.exports = { backfillProsBlog };
