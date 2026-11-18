'use strict';

const { errors } = require('@strapi/utils');
const { siteProblems, publishProblems } = require('./site-rules');

const ARTICLE_UID = 'api::article.article';

/**
 * The document service actions that write an article's site, blocks or
 * category. Each one leaves the result in the draft: `create`, `update`
 * and `clone` write it; `publish` copies the draft to the published version,
 * so the draft is what gets published; `discardDraft` replaces the draft with
 * the published version. `delete` and `unpublish` only remove versions.
 */
const GUARDED_ACTIONS = new Set(['create', 'update', 'publish', 'clone', 'discardDraft']);

const documentIdOf = ({ action, params }, result) =>
  action === 'create' || action === 'clone' ? result?.documentId : params.documentId;

/**
 * Whether the action publishes: `publish`, or `create` and `update` with
 * status 'published' (they publish the draft they wrote). The admin's Publish
 * button saves with `update` and then calls `publish`, and its bulk publish
 * calls `publish` for each document. `clone` makes a draft, and
 * `discardDraft` copies the published version, which was checked when it was
 * published.
 */
const publishes = ({ action, params }) =>
  action === 'publish' || ((action === 'create' || action === 'update') && params.status === 'published');

/**
 * A document service middleware that rejects an article whose site, blocks
 * and category break the rules in ./site-rules, and a publish that breaks its
 * publish rules, from the admin, the REST API and server code alike.
 *
 * It runs the action inside a transaction, then reads the article's draft as
 * the action left it and checks that. Reading the stored result means an
 * update that leaves out the site, the blocks or the category is checked
 * against the stored values, and every way of setting a relation (documentId,
 * id, connect, disconnect, set) counts exactly as Strapi applied it. A broken
 * rule throws a ValidationError, which rolls the action back before anything
 * is committed or any webhook fires. The admin shows the message and marks
 * the blocks or the category field.
 *
 * When the action runs inside a caller's own transaction (the admin's bulk
 * publish does this), the error rolls back the caller's transaction, as any
 * error inside it does.
 */
function createArticleSiteGuard(strapi) {
  const checkDrafts = async (documentId, publishing) => {
    if (!documentId) return;
    const drafts = await strapi.db.query(ARTICLE_UID).findMany({
      where: { documentId, publishedAt: null },
      select: ['id', 'site', 'publishedDate'],
      populate: { category: { select: ['name', 'site'] }, blocks: true },
    });
    for (const draft of drafts) {
      const problems = siteProblems({
        site: draft.site,
        blocks: (draft.blocks ?? []).map((block) => block.__component),
        category: draft.category,
      });
      if (publishing) {
        problems.push(...publishProblems(draft));
      }
      if (problems.length > 0) {
        throw new errors.ValidationError(problems.map((problem) => problem.message).join(' '), {
          errors: problems.map(({ path, message }) => ({ path, message, name: 'ValidationError' })),
        });
      }
    }
  };

  return async (context, next) => {
    if (context.uid !== ARTICLE_UID || !GUARDED_ACTIONS.has(context.action)) {
      return next();
    }
    return strapi.db.transaction(async () => {
      const result = await next();
      await checkDrafts(documentIdOf(context, result), publishes(context));
      return result;
    });
  };
}

module.exports = { createArticleSiteGuard };
