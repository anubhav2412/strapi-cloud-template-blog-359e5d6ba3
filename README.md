# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## Caltrac for Professionals content

The copy and images of the Caltrac for Professionals site (affiliate.caltrac.ai) live in this Strapi, next to caltrac.ai's `/nutrition` articles. They have their own single types and components. The site's blog, the professionals blog, shares caltrac.ai's `article`, `category` and `author` types: each article and category has a `site`, and the blog's blocks are the `blog.*` components (see [The professionals blog](#the-professionals-blog)). The web's other types (`global`, `about`) are neither used nor changed by the site.

### Content model

Ten single types, each with draft and publish. The site reads the published version. Each type maps to one fixed page, whose path is in the site's code.

| Single type | Page | Holds |
| --- | --- | --- |
| `pros-site` | every page | Names, emails and URLs; the Apply link's UTM source and medium; the wordmark and its qualifier ("for Professionals"); the logo; the header and footer links; the store badges; the Organization contact type; the key facts; the shared sections (focus, client control, four steps, scope); the proof screenshots and video; the closing block; and the two sentences that live once (`hipaaClause`, `accessWording`) |
| `pros-home` | `/` | SEO, hero, what you can do, who it's for, how a meal gets logged, common questions |
| `pros-how-it-works` | `/how-it-works` | SEO, intro, the steps, what a professional can and cannot do, how clients connect |
| `pros-faq` | `/faq` | SEO, the FAQ sections |
| `pros-for-personal-trainers` | `/for-personal-trainers` | SEO, hero, benefits, getting clients, a week, FAQ |
| `pros-for-dietitians` | `/for-dietitians` | SEO, hero, fits, review, estimates and their screenshot, privacy, FAQ |
| `pros-for-nutritionists` | `/for-nutritionists` | SEO, hero, time saved, conversations, FAQ |
| `pros-how-your-clients-connect` | `/how-your-clients-connect` | SEO, the page's sections, steps, FAQ, the install heading |
| `pros-login` | `/login` | SEO and the copy around the sign-in card |
| `pros-blog-landing` | `/blog` | SEO, the coming-soon line, Apply button, mascot |

The components, in the `pros` category:

| Component | Use |
| --- | --- |
| `pros.seo` | Title, description, h1, Open Graph title, `indexable`, `updated` date, breadcrumb label |
| `pros.link` | A label and an href |
| `pros.cta` | An Apply button: its label and its `campaign` |
| `pros.hero` | Intro, Apply button, optional How it works and Sign in links |
| `pros.feature`, `pros.feature-list` | A titled item with text, optional icon and link; a heading with its items |
| `pros.step`, `pros.step-list` | A step's optional heading and its text; a list of steps with an optional heading |
| `pros.faq-item`, `pros.faq-list` | A question and its answer; a heading with its questions |
| `pros.section` | Optional heading, a body, optional link |
| `pros.image` | An image with its alt text and optional caption for this one use |
| `pros.key-fact` | A label and a value |
| `pros.store-badge` | An App Store or Google Play badge: image, alt, size, listing and badge URLs |
| `pros.proof-video` | Video, poster, captions file and labels; empty until a video exists |

- **Rich text** fields (FAQ answers, section bodies, `descriptor`, `applyPage`, `sendPage`) hold Markdown: a link is `[words](href)`, and paragraphs are separated by a blank line.
- **Alt text** is set per use on `pros.image`, not on the media library file. An empty alt marks the image decorative (the logo).
- **`storeBadges`** on a step or an FAQ item shows the store badges with it (default off). **`structuredData`** on an FAQ item puts it in the page's FAQPage structured data (default on).
- **`campaign`** on an Apply button, and **`closingCampaign`** for a page's closing Apply button, is the `utm_campaign` the Apply link carries.

#### Sentences that live once

Three sentences are stored once and used in several places. A text that uses one holds a token in its place, and the site replaces the token with the field's text. Edit the sentence in its field, and leave the tokens as they are.

| Token | Field | Used in |
| --- | --- | --- |
| `{{accessWording}}` | `pros-site.accessWording` | the "What you see" key fact, the client control section, two FAQ answers ("What can I see about my clients?", "What does access cover?") and Home's first "What you can do" item |
| `{{hipaaClause}}` | `pros-site.hipaaClause` | the FAQ's and the dietitians' "Is Caltrac HIPAA compliant?" answers and the dietitians' privacy section |
| `{{focus}}` | `pros-site.focus.body` | the FAQ answer to "What does Caltrac for Professionals focus on?" |

#### What stays in the site's code

- The Terms and Privacy pages: their copy, route copy and mascots (legal text, not marketing).
- Page paths and route keys, the robots private paths and AI bot list, and where the store badges sit on each page.
- How the Apply link, the dates and the structured data are built.
- The accessibility labels: "Skip to content", "Menu", "Main", "Footer", "Breadcrumb".
- The llms.txt section headings: "Product", "Get the app", "Caltrac".
- The portal pages: the sign-in card on `/login` and the not-found page.

### The professionals blog

The blog at affiliate.caltrac.ai/blog is written here, in **Content Manager → Article**, by the SEO and marketing team. caltrac.ai's `/nutrition` articles live in the same type. The `site` field says which site an article belongs to.

#### Site

- **`site`** is on every article and category: `caltrac` (caltrac.ai) or `professionals` (the blog). New articles and categories start as `caltrac`. For the blog, **always set Site to `professionals` first.**
- An article's category must be on the same site. The blog's category is **Professionals**.
- Articles and categories that existed before the field was added were given `caltrac` when Strapi started (see [Backfill](#backfill)).
- Saving or publishing an article that breaks a rule is refused, with one of these messages:
  - `Site is "caltrac", and caltrac.ai can't show the blog blocks (blog.callout, …). For the professionals blog, set Site to "professionals". For caltrac.ai, remove those blocks.`
  - `The category "…" is on the "caltrac" site, and this article's Site is "professionals". Pick a category of the "professionals" site, or change Site.`

  The check runs in `src/pros-blog/` on create, update, publish, duplicate and discard-changes, from the admin, the REST API and server code alike. It reads the article as it would be saved, so an edit that leaves out the site, the blocks or the category is checked against what is stored.

#### Writing an article

1. Content Manager → Article → Create new entry. Set **Site** to `professionals` and **Category** to Professionals.
2. Fill in the title (the slug follows it), the description (up to 160 characters), the cover, the author and, if one checked it, **Reviewed by**.
3. Add the blocks (below). **Related articles** are optional hand-picked articles; the site fills up to three with the category's newest.
4. Fill in **Seo** (below).
5. **Save** keeps a draft. A draft is never on the site. Have it checked, then **Publish**. Publishing calls the site's webhook, which updates the site.
6. To take an article down, **Unpublish** it. Never delete: unpublishing keeps the draft, so nothing is lost, the same as the pros types.

The draft **Sample article — do not publish** (`sample-article-do-not-publish`) uses every block with sample text and images, and its Seo has Noindex on. Use it as a reference, and never publish it.

#### Blocks

The blog uses the `blog.*` blocks. caltrac.ai can't show them, so they are refused on a `caltrac` article. The four `shared.*` blocks work on both sites; on the blog, prefer Image and Gallery to Media and Slider, since only the blog's blocks carry alt text for their use.

| Block | What it is for | How it shows, and its limits |
| --- | --- | --- |
| Rich text (`shared.rich-text`) | The body text | Markdown: headings, bold, italic, links, lists. Level 2 and 3 headings (`##`, `###`) make the table of contents. Raw HTML is not shown. |
| Image (`blog.image`) | One picture | Alt text, optional caption and credit. Layout: `inline` (the text's width), `wide` or `full`. |
| Gallery (`blog.gallery`) | Several pictures | At least one item, each with its alt text and an optional caption. Layout: `grid` or `carousel`. |
| Image and text (`blog.image-text`) | A picture beside a short text | Alt text; the image on the `left` or `right`; the text is Markdown. |
| Callout (`blog.callout`) | One point to stand out | Kind: `tip`, `note` or `warning`; optional title; Markdown text. |
| Key takeaways (`blog.takeaways`) | The article's main points, near the top | Title (default "Key takeaways") and at least one point. |
| FAQ (`blog.faq`) | Questions readers ask | At least one question, each with a Markdown answer. The questions also go in the page's FAQ structured data. |
| Video (`blog.video`) | A YouTube or Vimeo video | The video's URL; a title, read out by screen readers; an optional caption. The page shows a picture and a play button, and loads the player only when the reader clicks. Any other host shows nothing. |
| Call to action (`blog.cta`) | A button | Kind `apply`: the Apply link, with `campaign` as its `utm_campaign`. Kind `install`: the App Store and Google Play badges. Kind `link`: a link to `href`, which only this kind uses. |
| Table (`blog.table`) | Rows and columns | The table as CSV, one row per line, cells split by commas; put a cell that holds a comma in double quotes. **Header row** (on by default) makes the first row the column headings. Optional caption. |
| Quote (`shared.quote`) | A sentence set apart | Title (who said it) and text. |
| Media, Slider (`shared.media`, `shared.slider`) | A file; several pictures | caltrac.ai's blocks; no alt text for the use. |

#### Images

- Sizes: cover 1600 × 900; `wide` and `full` images 1600 px wide; `inline` images 1200 px wide; gallery images 1200 px wide; author photo 400 × 400.
- Formats: JPEG for photos, PNG for screenshots and graphics. The blog blocks' image fields take images only.
- **Alt text** is written per use, in the block's Alt field, not on the media library file. Describe what is in the picture, for someone who can't see it. Leave it empty only for a decorative picture that adds nothing to the text.

#### Seo

- **Meta title:** up to 60 characters. **Meta description:** up to 160.
- **Share image:** the picture shown when the article is shared. Empty, the cover is used.
- **Canonical URL:** only for an article first published elsewhere; it holds that page's address. Empty for everything written for the blog.
- **Noindex:** on keeps the article out of search engines. Off by default.

#### Authors

Content Manager → Author: name, **slug** (from the name; the author's page is /blog/author/<slug>), **role**, **credentials**, **bio** (Markdown), **links** (each a label and a URL) and the avatar, which is the author's photo. **Email** is private: the API never returns it.

#### Backfill

`src/pros-blog/backfill.js` runs from `src/bootstrap.js` on every start, after the template's seed and before the pros seed, and fills only what is still empty: `site` becomes `caltrac` on every article and category row (drafts and published versions) that has none, and an author without a slug gets one from the name, made unique the way the admin makes it. Rows that have a value are never touched, and `updatedAt` stays as it was. Each start logs one line, for example:

```
[pros-blog-backfill] {"article":0,"category":0,"authorSlug":0}
```

It runs at start-up rather than as a file in `database/migrations/`, because Strapi runs those before it adds new columns. An error is logged, and Strapi still starts.

### Local development

Use Node 22, which matches `engines` and Strapi Cloud, and install with `npm ci` so `package-lock.json` stays as committed. With Homebrew's `node@22`:

```
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm ci
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run develop
```

`npm test` runs the unit tests in `tests/` with Node's test runner.

### The pros seed

`scripts/seed-pros.js` fills the pros single types from `data/pros/`, then creates the blog's category and its sample article. It runs from `src/bootstrap.js` on every start, after the template's seed, and on demand:

```
npm run seed:pros
```

- It seeds each type once. It creates and publishes the type, then records it as seeded in Strapi's core store (key `core_pros-seed_seeded`). A type that is recorded, or that has an entry (draft or published), is skipped whole. Editors' changes are never overwritten, and a type an editor deletes stays deleted. A type that has an entry but no record yet is recorded, which the log line shows under `recorded`.
- To take a page's content out of the way, unpublish its entry rather than delete it. Unpublishing keeps the draft, so nothing is lost.
- On Strapi Cloud a deleted pros type stays deleted: the seed record skips it on every start, and Cloud has no shell to re-seed it. Restore it by entering its content again in the admin, from the affiliate site's snapshot: `src/content/pros/<type>.json` in the Caltrac-affiliate repo. The snapshot is the published content as of the site's last release, refreshed by `npm run pros:snapshot`. `data/pros/<type>.json` here is only the day-one content.
- Locally (SQLite, where you have a shell), a type can be seeded again from `data/pros`: delete its entry, then run:

  ```
  npm run seed:pros -- --reseed pros-blog-landing
  ```

  `--reseed` can be repeated. It creates a type only when the type has no entry. A type that still has one is skipped.
- The blog's items follow the same rules, under their own keys in the same record:
  - `blog-category`: the category Professionals (`slug` professionals, `site` professionals), from `data/pros/blog-category.json`.
  - `blog-sample`: the article **Sample article — do not publish** (`slug` sample-article-do-not-publish, `site` professionals), from `data/pros/blog-sample.json`. It is created as a **draft only** and is never published. It goes in the Professionals category when a professionals category with that slug exists.

  Each counts as present when a category or article with its slug exists. Both can be seeded again locally, for example `npm run seed:pros -- --reseed blog-sample`.
- A run holds a lock until it ends, so two runs at once cannot both create a type: on Postgres (Strapi Cloud) the second run waits; on SQLite it waits up to 5 seconds, then fails without writing anything. MySQL takes no lock.
- Media fields in the JSON, including those in an article's blocks, hold an image's file name from `data/pros/manifest.json`. A media library file with that name and byte size is reused. Otherwise the image is uploaded from `data/pros/uploads/`, byte for byte, after its sha256 is checked against the manifest. The sample article uses only the pros images, which the pros seed has already uploaded.
- The text keeps the `{{accessWording}}`, `{{hipaaClause}}` and `{{focus}}` tokens.
- It creates no permissions. The Public role is unchanged.
- Each run logs one line, for example:

  ```
  [pros-seed] {"created":[],"skipped":["pros-site","pros-home",...,"blog-category","blog-sample"],"recorded":[],"uploaded":[],"reused":[]}
  ```

  An error is logged, the run's changes are rolled back, and Strapi still starts.

### `data/pros` is the day-one seed

`data/pros/` holds the content the pros types were seeded with on day one, taken from the affiliate site's copy at that time, and the blog's category and sample article. It seeded each one once. It is not regenerated, and it is not edited.

Once the site is live, the published content in this Strapi is the source of truth: content changes are made in the admin. The affiliate site keeps a committed fallback snapshot of that published content. It is refreshed with `npm run pros:snapshot` in the Caltrac-affiliate repo, run with `STRAPI_API_URL` and a read-only `STRAPI_PROS_TOKEN`.

### API token for the site

The site reads the pros types with a read-only token. It is created in the admin and kept in the site's environment, never in this repo:

- Settings → API Tokens → Create new API Token, token type **Custom**.
- Permissions: `find` on each `pros-*` single type (single types have no `findOne`); for the blog, `find` and `findOne` on Article, Category and Author; and under Upload, `find` and `findOne`.
- The Public role is unchanged, so the pros types are not readable without the token.
- `find` also returns a type's draft when a request asks for `status=draft`. Without it, the response is the published version.
- Drafts need an API token. The Public role reads articles and categories, but a request without a token is served the published version only: a `status` other than `published` (`?status=draft`, for example) gets a 403 (`src/policies/published-only-without-token.js`). Requests with a token, the sites' and the backend's, are unchanged.

### Webhook for the site

Settings → Webhooks → Create new webhook, a second one next to caltrac.ai's:

- Name: `Caltrac for Professionals`
- URL: `https://affiliate.caltrac.ai/api/revalidate`
- Header: `x-revalidate-secret`, set to the site's revalidation secret
- Events: Entry publish, unpublish and update; Media update

The route and the secret are part of the site. Both webhooks fire on every edit, so a pros edit also revalidates caltrac.ai's cache, and the reverse. That is harmless.

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
