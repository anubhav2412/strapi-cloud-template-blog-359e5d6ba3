'use strict';

/**
 * The rules that keep an article and its category on one site.
 *
 * - caltrac.ai renders only the shared.* blocks, so an article whose site is
 *   caltrac may not hold a blog.* block.
 * - An article's category must be on the article's site, so the category pages
 *   of one site never list the other site's articles.
 *
 * A missing site counts as caltrac, the field's default and what the site had
 * before the field existed.
 */

const SITES = { caltrac: 'caltrac', professionals: 'professionals' };
const DEFAULT_SITE = SITES.caltrac;
const BLOG_BLOCK_PREFIX = 'blog.';

const siteOf = (value) => value ?? DEFAULT_SITE;

/**
 * @param {object} article
 * @param {string | null | undefined} article.site
 * @param {string[]} article.blocks the component of each block, e.g. 'blog.image'
 * @param {{ name?: string | null, site?: string | null } | null | undefined} article.category
 * @returns {{ path: string[], message: string }[]} one item per broken rule; empty when the article is valid
 */
function siteProblems({ site, blocks, category }) {
  const articleSite = siteOf(site);
  const problems = [];

  if (articleSite === SITES.caltrac) {
    const blogBlocks = [...new Set(blocks.filter((component) => component.startsWith(BLOG_BLOCK_PREFIX)))];
    if (blogBlocks.length > 0) {
      problems.push({
        path: ['blocks'],
        message:
          `Site is "caltrac", and caltrac.ai can't show the blog blocks (${blogBlocks.join(', ')}). ` +
          'For the professionals blog, set Site to "professionals". For caltrac.ai, remove those blocks.',
      });
    }
  }

  if (category) {
    const categorySite = siteOf(category.site);
    if (categorySite !== articleSite) {
      const subject = category.name ? `The category "${category.name}"` : "The article's category";
      problems.push({
        path: ['category'],
        message:
          `${subject} is on the "${categorySite}" site, and this article's Site is "${articleSite}". ` +
          `Pick a category of the "${articleSite}" site, or change Site.`,
      });
    }
  }

  return problems;
}

module.exports = { siteProblems };
