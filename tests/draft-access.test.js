'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { refusesStatus } = require('../src/pros-blog/draft-access');

// What Strapi puts in ctx.state.auth for each kind of caller.
const publicRole = { strategy: { name: 'users-permissions' }, credentials: null };
const signedInUser = { strategy: { name: 'users-permissions' }, credentials: { id: 1 } };
const apiToken = { strategy: { name: 'content-api-token' }, credentials: { id: 1, type: 'read-only' } };

test('without an API token, asking for drafts is refused', () => {
  assert.equal(refusesStatus({ auth: publicRole, query: { status: 'draft' } }), true);
  assert.equal(refusesStatus({ auth: signedInUser, query: { status: 'draft' } }), true);
  assert.equal(refusesStatus({ auth: undefined, query: { status: 'draft' } }), true);
});

test('without an API token, any status other than published is refused', () => {
  for (const status of ['', 'Published', 'all', ['published', 'draft'], ['published']]) {
    assert.equal(refusesStatus({ auth: publicRole, query: { status } }), true, JSON.stringify(status));
  }
});

test('without an API token, published content is served, asked for or by default', () => {
  assert.equal(refusesStatus({ auth: publicRole, query: { status: 'published' } }), false);
  assert.equal(refusesStatus({ auth: publicRole, query: { filters: { slug: { $eq: 'a' } } } }), false);
  assert.equal(refusesStatus({ auth: publicRole, query: {} }), false);
  assert.equal(refusesStatus({ auth: publicRole, query: undefined }), false);
});

test('with an API token, drafts are served as before', () => {
  assert.equal(refusesStatus({ auth: apiToken, query: { status: 'draft' } }), false);
  assert.equal(refusesStatus({ auth: apiToken, query: { status: 'published' } }), false);
  assert.equal(refusesStatus({ auth: apiToken, query: {} }), false);
});
