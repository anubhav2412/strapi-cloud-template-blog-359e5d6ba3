import type { Schema, Struct } from '@strapi/strapi';

export interface BlogCallout extends Struct.ComponentSchema {
  collectionName: 'components_blog_callouts';
  info: {
    description: 'A highlighted tip, note or warning';
    displayName: 'Callout';
    icon: 'information';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    kind: Schema.Attribute.Enumeration<['tip', 'note', 'warning']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'note'>;
    title: Schema.Attribute.String;
  };
}

export interface BlogCta extends Struct.ComponentSchema {
  collectionName: 'components_blog_ctas';
  info: {
    description: 'A button: Apply, the app store badges, or a link';
    displayName: 'Call to action';
    icon: 'cursor';
  };
  attributes: {
    campaign: Schema.Attribute.String;
    href: Schema.Attribute.String;
    kind: Schema.Attribute.Enumeration<['apply', 'install', 'link']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'apply'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlogFaq extends Struct.ComponentSchema {
  collectionName: 'components_blog_faqs';
  info: {
    description: "Questions and answers; they also go in the page's FAQPage structured data";
    displayName: 'FAQ';
    icon: 'discuss';
  };
  attributes: {
    items: Schema.Attribute.Component<'blog.faq-pair', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface BlogFaqPair extends Struct.ComponentSchema {
  collectionName: 'components_blog_faq_pairs';
  info: {
    description: 'A question and its answer';
    displayName: 'Question';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlogGallery extends Struct.ComponentSchema {
  collectionName: 'components_blog_galleries';
  info: {
    description: 'Several images shown as a grid or a carousel';
    displayName: 'Gallery';
    icon: 'layout';
  };
  attributes: {
    items: Schema.Attribute.Component<'blog.gallery-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    layout: Schema.Attribute.Enumeration<['grid', 'carousel']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'grid'>;
  };
}

export interface BlogGalleryItem extends Struct.ComponentSchema {
  collectionName: 'components_blog_gallery_items';
  info: {
    description: 'An image in a gallery, with its alt text for this use';
    displayName: 'Gallery item';
    icon: 'picture';
  };
  attributes: {
    alt: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface BlogImage extends Struct.ComponentSchema {
  collectionName: 'components_blog_images';
  info: {
    description: 'One image with its alt text for this use; an empty alt marks it decorative';
    displayName: 'Image';
    icon: 'picture';
  };
  attributes: {
    alt: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    credit: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<['inline', 'wide', 'full']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'inline'>;
  };
}

export interface BlogImageText extends Struct.ComponentSchema {
  collectionName: 'components_blog_image_texts';
  info: {
    description: 'An image beside a text, the image on the left or the right';
    displayName: 'Image and text';
    icon: 'landscape';
  };
  attributes: {
    alt: Schema.Attribute.String;
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    side: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'left'>;
  };
}

export interface BlogLink extends Struct.ComponentSchema {
  collectionName: 'components_blog_links';
  info: {
    description: 'A label and a URL';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlogTable extends Struct.ComponentSchema {
  collectionName: 'components_blog_tables';
  info: {
    description: 'A table written as CSV';
    displayName: 'Table';
    icon: 'stack';
  };
  attributes: {
    caption: Schema.Attribute.String;
    csv: Schema.Attribute.Text & Schema.Attribute.Required;
    headerRow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface BlogTakeaway extends Struct.ComponentSchema {
  collectionName: 'components_blog_takeaway_items';
  info: {
    description: 'One key takeaway';
    displayName: 'Takeaway';
    icon: 'arrowRight';
  };
  attributes: {
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface BlogTakeaways extends Struct.ComponentSchema {
  collectionName: 'components_blog_takeaways';
  info: {
    description: "A short list of the article's key points";
    displayName: 'Key takeaways';
    icon: 'bulletList';
  };
  attributes: {
    items: Schema.Attribute.Component<'blog.takeaway', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Key takeaways'>;
  };
}

export interface BlogVideo extends Struct.ComponentSchema {
  collectionName: 'components_blog_videos';
  info: {
    description: 'A YouTube or Vimeo video, by its URL';
    displayName: 'Video';
    icon: 'play';
  };
  attributes: {
    caption: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProsCta extends Struct.ComponentSchema {
  collectionName: 'components_pros_ctas';
  info: {
    description: 'An Apply button and the campaign its link carries';
    displayName: 'Apply button';
    icon: 'cursor';
  };
  attributes: {
    campaign: Schema.Attribute.Enumeration<
      [
        'header',
        'home-hero',
        'home-closing',
        'how-it-works-closing',
        'faq-closing',
        'login',
        'trainers-hero',
        'trainers-closing',
        'dietitians-hero',
        'dietitians-closing',
        'nutritionists-hero',
        'nutritionists-closing',
        'blog-coming-soon',
      ]
    > &
      Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProsFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_pros_faq_items';
  info: {
    displayName: 'FAQ item';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
    storeBadges: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    structuredData: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface ProsFaqList extends Struct.ComponentSchema {
  collectionName: 'components_pros_faq_lists';
  info: {
    displayName: 'FAQ list';
    icon: 'discuss';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'pros.faq-item', true> &
      Schema.Attribute.Required;
  };
}

export interface ProsFeature extends Struct.ComponentSchema {
  collectionName: 'components_pros_features';
  info: {
    displayName: 'Feature';
    icon: 'star';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<['estimates', 'choose', 'comment']>;
    link: Schema.Attribute.Component<'pros.link', false>;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProsFeatureList extends Struct.ComponentSchema {
  collectionName: 'components_pros_feature_lists';
  info: {
    displayName: 'Feature list';
    icon: 'bulletList';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'pros.feature', true> &
      Schema.Attribute.Required;
  };
}

export interface ProsHero extends Struct.ComponentSchema {
  collectionName: 'components_pros_heroes';
  info: {
    displayName: 'Hero';
    icon: 'landscape';
  };
  attributes: {
    apply: Schema.Attribute.Component<'pros.cta', false> &
      Schema.Attribute.Required;
    howItWorks: Schema.Attribute.Component<'pros.link', false>;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    signIn: Schema.Attribute.Component<'pros.link', false>;
  };
}

export interface ProsImage extends Struct.ComponentSchema {
  collectionName: 'components_pros_images';
  info: {
    description: 'An image with its alt text for this use; an empty alt marks it decorative';
    displayName: 'Image';
    icon: 'picture';
  };
  attributes: {
    alt: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface ProsKeyFact extends Struct.ComponentSchema {
  collectionName: 'components_pros_key_facts';
  info: {
    displayName: 'Key fact';
    icon: 'information';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProsLink extends Struct.ComponentSchema {
  collectionName: 'components_pros_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProsProofVideo extends Struct.ComponentSchema {
  collectionName: 'components_pros_proof_videos';
  info: {
    displayName: 'Proof video';
    icon: 'play';
  };
  attributes: {
    captions: Schema.Attribute.Media<'files'>;
    captionsLabel: Schema.Attribute.String;
    label: Schema.Attribute.String;
    poster: Schema.Attribute.Media<'images'>;
    video: Schema.Attribute.Media<'videos'>;
  };
}

export interface ProsSection extends Struct.ComponentSchema {
  collectionName: 'components_pros_sections';
  info: {
    displayName: 'Section';
    icon: 'layout';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    heading: Schema.Attribute.String;
    link: Schema.Attribute.Component<'pros.link', false>;
  };
}

export interface ProsSeo extends Struct.ComponentSchema {
  collectionName: 'components_pros_seos';
  info: {
    description: "A page's title, description, h1 and sitemap settings";
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    breadcrumb: Schema.Attribute.String;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    h1: Schema.Attribute.String & Schema.Attribute.Required;
    indexable: Schema.Attribute.Boolean & Schema.Attribute.Required;
    ogTitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updated: Schema.Attribute.Date;
  };
}

export interface ProsStep extends Struct.ComponentSchema {
  collectionName: 'components_pros_steps';
  info: {
    displayName: 'Step';
    icon: 'arrowRight';
  };
  attributes: {
    heading: Schema.Attribute.String;
    storeBadges: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface ProsStepList extends Struct.ComponentSchema {
  collectionName: 'components_pros_step_lists';
  info: {
    displayName: 'Step list';
    icon: 'stack';
  };
  attributes: {
    heading: Schema.Attribute.String;
    steps: Schema.Attribute.Component<'pros.step', true> &
      Schema.Attribute.Required;
  };
}

export interface ProsStoreBadge extends Struct.ComponentSchema {
  collectionName: 'components_pros_store_badges';
  info: {
    displayName: 'Store badge';
    icon: 'store';
  };
  attributes: {
    alt: Schema.Attribute.String & Schema.Attribute.Required;
    badgeUrl: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    listingUrl: Schema.Attribute.String & Schema.Attribute.Required;
    store: Schema.Attribute.Enumeration<['ios', 'android']> &
      Schema.Attribute.Required;
    width: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String;
    noindex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blog.callout': BlogCallout;
      'blog.cta': BlogCta;
      'blog.faq': BlogFaq;
      'blog.faq-pair': BlogFaqPair;
      'blog.gallery': BlogGallery;
      'blog.gallery-item': BlogGalleryItem;
      'blog.image': BlogImage;
      'blog.image-text': BlogImageText;
      'blog.link': BlogLink;
      'blog.table': BlogTable;
      'blog.takeaway': BlogTakeaway;
      'blog.takeaways': BlogTakeaways;
      'blog.video': BlogVideo;
      'pros.cta': ProsCta;
      'pros.faq-item': ProsFaqItem;
      'pros.faq-list': ProsFaqList;
      'pros.feature': ProsFeature;
      'pros.feature-list': ProsFeatureList;
      'pros.hero': ProsHero;
      'pros.image': ProsImage;
      'pros.key-fact': ProsKeyFact;
      'pros.link': ProsLink;
      'pros.proof-video': ProsProofVideo;
      'pros.section': ProsSection;
      'pros.seo': ProsSeo;
      'pros.step': ProsStep;
      'pros.step-list': ProsStepList;
      'pros.store-badge': ProsStoreBadge;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
