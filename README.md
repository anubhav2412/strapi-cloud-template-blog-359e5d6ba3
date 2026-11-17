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

The copy and images of the Caltrac for Professionals site (affiliate.caltrac.ai) live in this Strapi, next to caltrac.ai's `/nutrition` articles. They have their own single types and components. The web's types (`article`, `author`, `category`, `global`, `about`) and the `shared.*` components are neither used nor changed by them.

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

### Local development

Use Node 22, which matches `engines` and Strapi Cloud, and install with `npm ci` so `package-lock.json` stays as committed. With Homebrew's `node@22`:

```
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm ci
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run develop
```

### The pros seed

`scripts/seed-pros.js` fills the pros single types from `data/pros/`. It runs from `src/bootstrap.js` on every start, after the template's seed, and on demand:

```
npm run seed:pros
```

- It seeds each type once. It creates and publishes the type, then records it as seeded in Strapi's core store (key `core_pros-seed_seeded`). A type that is recorded, or that has an entry (draft or published), is skipped whole. Editors' changes are never overwritten, and a type an editor deletes stays deleted. A type that has an entry but no record yet is recorded, which the log line shows under `recorded`.
- To seed a type again from `data/pros`, delete its entry, then run:

  ```
  npm run seed:pros -- --reseed pros-blog-landing
  ```

  `--reseed` can be repeated. It creates a type only when the type has no entry. A type that still has one is skipped.
- A run holds a lock until it ends, so two runs at once cannot both create a type: on Postgres (Strapi Cloud) the second run waits; on SQLite it waits up to 5 seconds, then fails without writing anything. MySQL takes no lock.
- Media fields in the JSON hold an image's file name from `data/pros/manifest.json`. A media library file with that name and byte size is reused. Otherwise the image is uploaded from `data/pros/uploads/`, byte for byte, after its sha256 is checked against the manifest.
- The text keeps the `{{accessWording}}`, `{{hipaaClause}}` and `{{focus}}` tokens.
- It creates no permissions. The Public role is unchanged.
- Each run logs one line, for example:

  ```
  [pros-seed] {"created":[],"skipped":["pros-site","pros-home",...],"recorded":[],"uploaded":[],"reused":[]}
  ```

  An error is logged, the run's changes are rolled back, and Strapi still starts.

### Regenerating `data/pros`

`data/pros/` is written by the Caltrac-affiliate repo's generator, from the site's own copy. From a Caltrac-affiliate checkout that has `scripts/pros-strapi-export.mts` (`release/pros-site`), with that repo's Node:

```
node --experimental-strip-types scripts/pros-strapi-export.mts <path to this repo>/data/pros
```

Commit its output unedited. The seed creates each type only once, so new data reaches a type that is already seeded only when its entry is deleted and re-seeded with `--reseed`, or edited in the admin.

### API token for the site

The site reads the pros types with a read-only token. It is created in the admin and kept in the site's environment, never in this repo:

- Settings → API Tokens → Create new API Token, token type **Custom**.
- Permissions: `find` on each `pros-*` single type (single types have no `findOne`), and under Upload, `find` and `findOne`.
- The Public role is unchanged, so the pros types are not readable without the token.
- `find` also returns a type's draft when a request asks for `status=draft`. Without it, the response is the published version.

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
