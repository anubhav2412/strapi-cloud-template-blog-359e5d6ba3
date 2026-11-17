'use strict';

/**
 * Seeds the Caltrac for Professionals single types from data/pros.
 *
 * Each pros single type that has no document yet (neither draft nor published)
 * is created from data/pros/<type>.json and published. A type that already has
 * a document is skipped whole, so an editor's changes are never overwritten and
 * every later run is a no-op.
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

const FILE_UID = 'plugin::upload.file';

const readJson = (fileName) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, fileName), 'utf8'));

/**
 * Returns a copy of `data` with every media value passed through `map`,
 * following the model's attributes into nested components.
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

async function seed(strapi) {
  const result = { created: [], skipped: [], uploaded: [], reused: [] };
  try {
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

    for (const type of SINGLE_TYPES) {
      const uid = `api::${type}.${type}`;
      const model = strapi.contentTypes[uid];
      if (!model) {
        throw new Error(`${uid} is not a content type`);
      }
      // Any row, draft or published, means the type has a document already.
      if ((await strapi.db.query(uid).count()) > 0) {
        result.skipped.push(type);
        continue;
      }

      const data = readJson(`${type}.json`);
      const names = [];
      mapMedia(strapi, model.attributes, data, (name) => {
        names.push(name);
        return name;
      });
      for (const name of names) {
        await resolveFile(name);
      }

      await strapi.documents(uid).create({
        data: mapMedia(strapi, model.attributes, data, (name) => fileIds.get(name)),
        status: 'published',
      });
      result.created.push(type);
    }
  } catch (error) {
    strapi.log.error(`[pros-seed] ${JSON.stringify({ ...result, error: error.message })}`);
    throw error;
  }
  strapi.log.info(`[pros-seed] ${JSON.stringify(result)}`);
  return result;
}

// The seed runs at most once per process: loading Strapi runs src/bootstrap.js,
// which seeds, so the standalone run below gets that same run's outcome.
let run;

function seedPros(strapi) {
  run ??= seed(strapi);
  return run;
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  try {
    await seedPros(app);
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
