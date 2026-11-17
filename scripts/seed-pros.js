'use strict';

/**
 * Seeds the Caltrac for Professionals single types from data/pros, then the
 * professionals blog's category and its sample article.
 *
 * Each pros single type is seeded once: it is created from
 * data/pros/<type>.json and published, then recorded as seeded in Strapi's core
 * store. A type that is recorded, or that has a document (draft or published),
 * is skipped whole, so an editor's changes are never overwritten and a type an
 * editor deleted stays deleted. A type that has a document but no record yet is
 * recorded. `npm run seed:pros -- --reseed <type>` seeds a recorded type again
 * when it has no document.
 *
 * The blog's two items follow the same rules under their own keys in the same
 * record: `blog-category`, the "Professionals" category (data/pros/blog-category.json),
 * and `blog-sample`, an article that uses every block (data/pros/blog-sample.json).
 * Each counts as present when a category or article with its slug exists. The
 * sample is created as a draft and never published; it goes in the
 * professionals category when one with that slug exists.
 *
 * Media fields in the JSON hold an upload's file name from data/pros/manifest.json.
 * Each name resolves to a media library file: an existing file with that name and
 * byte size is reused, otherwise the file is uploaded from data/pros/uploads once.
 *
 * The text keeps the tokens {{accessWording}}, {{hipaaClause}} and {{focus}} as
 * they are; the site substitutes them.
 *
 * Runs from src/bootstrap.js on every start, and on demand: npm run seed:pros
 */

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'pros');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

const SINGLE_TYPES = [
  'pros-site',
  'pros-home',
  'pros-how-it-works',
  'pros-faq',
  'pros-for-personal-trainers',
  'pros-for-dietitians',
  'pros-for-nutritionists',
  'pros-how-your-clients-connect',
  'pros-login',
  'pros-blog-landing',
];

const CATEGORY_UID = 'api::category.category';
const ARTICLE_UID = 'api::article.article';

// Everything the seed creates, in order: the pros single types (any document
// counts as present), then the blog's category and its sample article (a
// document with the item's slug counts as present). The sample comes after the
// category it goes in.
const SEED_ITEMS = [
  ...SINGLE_TYPES.map((type) => ({ key: type, uid: `api::${type}.${type}`, status: 'published' })),
  { key: 'blog-category', uid: CATEGORY_UID, bySlug: true },
  { key: 'blog-sample', uid: ARTICLE_UID, bySlug: true, status: 'draft', inBlogCategory: true },
];
const SEED_KEYS = SEED_ITEMS.map((item) => item.key);

const FILE_UID = 'plugin::upload.file';

// The core store entry listing the items already seeded (key core_pros-seed_seeded).
const SEEDED = { type: 'core', name: 'pros-seed', key: 'seeded' };

const readJson = (fileName) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, fileName), 'utf8'));

/**
 * Returns a copy of `data` with every media value passed through `map`,
 * following the model's attributes into nested components and dynamic zones.
 */
function mapMedia(strapi, attributes, data, map) {
  const out = {};
  for (const [key, value] of Object.entries(data)) {
    const attribute = attributes[key];
    if (!attribute) {
      throw new Error(`"${key}" is not a field of the schema`);
    }
    if (attribute.type === 'media') {
      out[key] = attribute.multiple ? value.map(map) : map(value);
    } else if (attribute.type === 'component') {
      const componentAttributes = strapi.components[attribute.component].attributes;
      const mapOne = (item) => mapMedia(strapi, componentAttributes, item, map);
      out[key] = attribute.repeatable ? value.map(mapOne) : mapOne(value);
    } else if (attribute.type === 'dynamiczone') {
      out[key] = value.map(({ __component, ...item }) => {
        const component = strapi.components[__component];
        if (!component || !attribute.components.includes(__component)) {
          throw new Error(`"${__component}" is not a component of "${key}"`);
        }
        return { __component, ...mapMedia(strapi, component.attributes, item, map) };
      });
    } else {
      out[key] = value;
    }
  }
  return out;
}

// Strapi stores a file's size in KB rounded to two decimals (bytesToKbytes in
// @strapi/utils), so sizes match when they round to the same 10 bytes.
const sameSize = (storedKb, bytes) => Math.round(Number(storedKb) * 100) === Math.round(bytes / 10);

async function findReusableFile(strapi, entry) {
  const files = await strapi.db.query(FILE_UID).findMany({ where: { name: entry.name } });
  return files.find((file) => sameSize(file.size, entry.bytes)) ?? null;
}

/**
 * Uploads one file byte for byte. The upload service's `upload()` would apply
 * the media library's size optimization, which re-encodes PNG and JPEG files
 * and so changes the bytes manifest.json pins. This runs the same steps
 * without it: file info, dimensions, thumbnail and responsive formats, the
 * provider upload, then the file record.
 */
async function uploadFile(strapi, entry) {
  const filePath = path.join(UPLOADS_DIR, entry.name);
  const bytes = fs.readFileSync(filePath);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  if (sha256 !== entry.sha256 || bytes.length !== entry.bytes) {
    throw new Error(
      `${entry.name} does not match manifest.json (sha256 ${sha256}, ${bytes.length} bytes); refusing to upload it`
    );
  }

  const upload = strapi.plugin('upload');
  const images = upload.service('image-manipulation');
  const provider = upload.service('provider');
  const tmpWorkingDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'pros-seed-'));
  try {
    const file = await upload
      .service('upload')
      .formatFileInfo(
        { filename: entry.name, type: entry.mime, size: entry.bytes },
        { name: entry.name },
        { tmpWorkingDirectory }
      );
    file.filepath = filePath;
    file.getStream = () => fs.createReadStream(filePath);
    await provider.checkFileSize(file);

    const formats = [];
    if (await images.isImage(file)) {
      Object.assign(file, await images.getDimensions(file));
      if (await images.isResizableImage(file)) {
        const thumbnail = await images.generateThumbnail(file);
        if (thumbnail) formats.push({ key: 'thumbnail', file: thumbnail });
        formats.push(...(await images.generateResponsiveFormats(file)).filter(Boolean));
      }
    }

    await provider.upload(file);
    for (const format of formats) {
      await provider.upload(format.file);
      file.formats = { ...file.formats, [format.key]: format.file };
    }

    return await strapi.db.query(FILE_UID).create({
      data: { ...file, provider: strapi.config.get('plugin::upload').provider },
    });
  } finally {
    fs.rmSync(tmpWorkingDirectory, { recursive: true, force: true });
  }
}

/**
 * Holds every other seed run back until this run's transaction ends, so two
 * processes seeding at once (two containers starting during a deploy, or
 * `npm run seed:pros` while the server starts) cannot both create a type: the
 * second run reads the record and the documents only after the first has
 * committed them.
 *
 * - Postgres: a transaction-level advisory lock; the second run waits for it.
 * - SQLite: its single write lock, taken by a write that changes nothing. The
 *   second run waits up to SQLite's busy timeout (5 s by default), then fails
 *   without writing anything; the next start seeds whatever is still missing.
 * - MySQL takes no lock here: this project runs SQLite locally and Postgres on
 *   Strapi Cloud. Concurrent runs on MySQL could still both create a type.
 */
async function lockSeedRuns(strapi, trx) {
  const { client } = strapi.db.dialect;
  if (client === 'postgres') {
    await trx.raw('SELECT pg_advisory_xact_lock(hashtext(?))', ['pros-seed']);
  } else if (client === 'sqlite') {
    const { tableName } = strapi.db.metadata.get('strapi::core-store');
    await trx.raw('UPDATE ?? SET ?? = ?? WHERE 1 = 0', [tableName, 'value', 'value']);
  }
}

async function seed(strapi, { reseed = [] } = {}) {
  const result = { created: [], skipped: [], recorded: [], uploaded: [], reused: [] };
  let current = null;
  try {
    // One transaction per run: lockSeedRuns holds for all of it, and a
    // failure leaves the documents, the file records and the record as they
    // were. Files already sent to the upload provider stay there.
    await strapi.db.transaction(async ({ trx }) => {
      await lockSeedRuns(strapi, trx);

      const store = strapi.store({ type: SEEDED.type, name: SEEDED.name });
      const seeded = new Set((await store.get({ key: SEEDED.key })) ?? []);
      const manifest = new Map(readJson('manifest.json').map((entry) => [entry.name, entry]));
      const fileIds = new Map();

      const resolveFile = async (name) => {
        if (fileIds.has(name)) return;
        const entry = manifest.get(name);
        if (!entry) {
          throw new Error(`${name} is not in manifest.json`);
        }
        const existing = await findReusableFile(strapi, entry);
        if (existing) {
          result.reused.push(name);
          fileIds.set(name, existing.id);
        } else {
          const uploaded = await uploadFile(strapi, entry);
          result.uploaded.push(name);
          fileIds.set(name, uploaded.id);
        }
      };

      for (const { key, uid, bySlug, status, inBlogCategory } of SEED_ITEMS) {
        current = key;
        const model = strapi.contentTypes[uid];
        if (!model) {
          throw new Error(`${uid} is not a content type`);
        }
        const data = readJson(`${key}.json`);
        // Any row, draft or published, means the item has a document.
        const where = bySlug ? { slug: data.slug } : {};
        const hasDocument = (await strapi.db.query(uid).count({ where })) > 0;
        if (hasDocument || (seeded.has(key) && !reseed.includes(key))) {
          if (!seeded.has(key)) {
            seeded.add(key);
            result.recorded.push(key);
          }
          result.skipped.push(key);
          continue;
        }

        const names = [];
        mapMedia(strapi, model.attributes, data, (name) => {
          names.push(name);
          return name;
        });
        for (const name of names) {
          await resolveFile(name);
        }

        const documentData = mapMedia(strapi, model.attributes, data, (name) => fileIds.get(name));
        if (inBlogCategory) {
          // Only a category of the professionals site: the article guard rejects any other.
          const category = await strapi.db.query(CATEGORY_UID).findOne({
            where: { slug: readJson('blog-category.json').slug, site: data.site },
            select: ['documentId'],
          });
          if (category) {
            documentData.category = category.documentId;
          }
        }

        await strapi.documents(uid).create({ data: documentData, status });
        seeded.add(key);
        result.created.push(key);
      }
      current = null;

      if (result.created.length || result.recorded.length) {
        await store.set({ key: SEEDED.key, value: [...seeded] });
      }
    });
  } catch (error) {
    strapi.log.error(
      `[pros-seed] ${JSON.stringify({ type: current, error: error.message, rolledBack: true })}`
    );
    throw error;
  }
  strapi.log.info(`[pros-seed] ${JSON.stringify(result)}`);
  return result;
}

// True when this file runs as `npm run seed:pros`. Loading Strapi runs
// src/bootstrap.js, whose call then leaves the seed to main(), so the script
// runs the seed once, with its own options.
let runAsScript = false;

/** The bootstrap's entry point. */
function seedPros(strapi) {
  return runAsScript ? null : seed(strapi);
}

function parseArgs(args) {
  const reseed = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] !== '--reseed' || !SEED_KEYS.includes(args[i + 1])) {
      throw new Error(
        `Usage: npm run seed:pros [-- --reseed <item> ...], an item being one of ${SEED_KEYS.join(', ')}`
      );
    }
    reseed.push(args[i + 1]);
    i++;
  }
  return { reseed };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  runAsScript = true;

  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  try {
    await seed(app, options);
  } finally {
    await app.destroy();
  }
}

if (require.main === module) {
  main().then(
    () => process.exit(0),
    (error) => {
      console.error(error);
      process.exit(1);
    }
  );
}

module.exports = { seedPros };
