'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { siteProblems, publishProblems } = require('../src/pros-blog/site-rules');

const caltracCategory = { name: 'Nutrition', site: 'caltrac' };
const prosCategory = { name: 'Professionals', site: 'professionals' };
const paths = (problems) => problems.map((problem) => problem.path.join('.'));

test('a caltrac article with only shared blocks in a caltrac category is valid', () => {
  const problems = siteProblems({
    site: 'caltrac',
    blocks: ['shared.rich-text', 'shared.media', 'shared.quote', 'shared.slider'],
    category: caltracCategory,
  });
  assert.deepEqual(problems, []);
});

test('a professionals article with blog and shared blocks in a professionals category is valid', () => {
  const problems = siteProblems({
    site: 'professionals',
    blocks: ['blog.image', 'blog.faq', 'shared.rich-text'],
    category: prosCategory,
  });
  assert.deepEqual(problems, []);
});

test('a caltrac article with a blog block is rejected on its blocks, each block named once', () => {
  const problems = siteProblems({
    site: 'caltrac',
    blocks: ['shared.rich-text', 'blog.callout', 'blog.image', 'blog.callout'],
    category: caltracCategory,
  });
  assert.deepEqual(paths(problems), ['blocks']);
  assert.match(problems[0].message, /\(blog\.callout, blog\.image\)/);
  assert.match(problems[0].message, /set Site to "professionals"/);
});

test('a missing site counts as caltrac', () => {
  assert.deepEqual(paths(siteProblems({ site: null, blocks: ['blog.video'], category: null })), ['blocks']);
  assert.deepEqual(paths(siteProblems({ site: undefined, blocks: [], category: prosCategory })), ['category']);
});

test('a professionals article in a caltrac category is rejected on its category', () => {
  const problems = siteProblems({ site: 'professionals', blocks: ['blog.image'], category: caltracCategory });
  assert.deepEqual(paths(problems), ['category']);
  assert.match(problems[0].message, /"Nutrition" is on the "caltrac" site/);
  assert.match(problems[0].message, /Site is "professionals"/);
});

test('a caltrac article in a professionals category is rejected on its category', () => {
  const problems = siteProblems({ site: 'caltrac', blocks: ['shared.quote'], category: prosCategory });
  assert.deepEqual(paths(problems), ['category']);
});

test('a category without a site counts as caltrac', () => {
  const category = { name: 'Old', site: null };
  assert.deepEqual(siteProblems({ site: 'caltrac', blocks: [], category }), []);
  assert.deepEqual(paths(siteProblems({ site: 'professionals', blocks: [], category })), ['category']);
});

test('an article without a category is checked on its blocks only', () => {
  assert.deepEqual(siteProblems({ site: 'professionals', blocks: ['blog.table'], category: null }), []);
  assert.deepEqual(siteProblems({ site: 'caltrac', blocks: [], category: undefined }), []);
});

test('both rules are reported together', () => {
  const problems = siteProblems({ site: 'caltrac', blocks: ['blog.cta'], category: prosCategory });
  assert.deepEqual(paths(problems), ['blocks', 'category']);
});

test('a category without a name is still named in the message', () => {
  const problems = siteProblems({ site: 'professionals', blocks: [], category: { name: null, site: 'caltrac' } });
  assert.match(problems[0].message, /^The article's category is on the "caltrac" site/);
});

test('a professionals article without a published date may not be published', () => {
  for (const publishedDate of [null, undefined, '']) {
    const problems = publishProblems({ site: 'professionals', publishedDate });
    assert.deepEqual(paths(problems), ['publishedDate'], String(publishedDate));
    assert.match(problems[0].message, /^Set "Published date" before publishing a professionals article\./);
  }
});

test('a professionals article with a published date may be published', () => {
  assert.deepEqual(publishProblems({ site: 'professionals', publishedDate: '2026-11-17' }), []);
});

test('a caltrac article, or one without a site, needs no published date', () => {
  assert.deepEqual(publishProblems({ site: 'caltrac', publishedDate: null }), []);
  assert.deepEqual(publishProblems({ site: null, publishedDate: null }), []);
});
