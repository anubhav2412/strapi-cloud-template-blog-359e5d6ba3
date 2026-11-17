import type { Schema, Struct } from '@strapi/strapi';

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
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
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
