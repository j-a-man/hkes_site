// Defines every editable field on the public site, grouped by page/section.
// The Site Editor renders forms straight from this manifest; public pages use
// the same keys to read values out of `site_content`/collection tables.
// A field's `default` is what the public site shows while the field is empty,
// and the editor shows it as the input placeholder.

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'list';
  itemFields?: FieldDef[]; // only when type === 'list'
  default?: string | Record<string, string>[];
}

export interface SectionDef {
  key: string;
  label: string;
  fields: FieldDef[];
}

export interface PageDef {
  key: string;
  label: string;
  path: string;
  sections: SectionDef[];
}

export const SITE_PAGES: PageDef[] = [
  {
    key: 'home',
    label: 'Home',
    path: '/',
    sections: [
      {
        key: 'hero',
        label: 'Hero',
        fields: [
          { key: 'eyebrow', label: 'Eyebrow text', type: 'text', default: 'Binghamton University' },
          { key: 'heading_line1', label: 'Heading (line 1)', type: 'text', default: 'Where Binghamton meets' },
          { key: 'heading_line2', label: 'Heading (line 2, hand-lettered)', type: 'text', default: 'Hong Kong' },
          {
            key: 'body',
            label: 'Body paragraph',
            type: 'textarea',
            default:
              'HKES is a cultural and social student organization celebrating Hong Kong heritage, building community, and connecting students across cultures at Binghamton University.',
          },
          { key: 'primary_button_text', label: 'Primary button text', type: 'text', default: 'Explore events' },
          { key: 'secondary_button_text', label: 'Secondary button text', type: 'text', default: 'About us' },
          // Key name predates the redesign; this is the photo on the hero poster.
          { key: 'image_skyline_url', label: 'Hero photo', type: 'image', default: '/IMG_0357.JPG' },
          { key: 'caption_big_little', label: 'Hero photo caption', type: 'text', default: 'the HKES fam' },
        ],
      },
      {
        key: 'marquee',
        label: 'Scrolling banner',
        fields: [
          {
            key: 'items',
            label: 'Banner words',
            type: 'list',
            itemFields: [{ key: 'text', label: 'Text', type: 'text' }],
            default: [
              { text: '蛋撻 Egg Tarts' },
              { text: '絲襪奶茶 Milk Tea' },
              { text: '點心 Dim Sum' },
              { text: '麻雀 Mahjong' },
              { text: '菠蘿包 Pineapple Buns' },
              { text: '廣東話 Cantonese' },
              { text: '中秋節 Mid-Autumn' },
              { text: '農曆新年 Lunar New Year' },
            ],
          },
        ],
      },
      {
        key: 'events_preview',
        label: 'Upcoming events',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text', default: 'Next stops' },
          {
            key: 'subheading',
            label: 'Subheading',
            type: 'textarea',
            default: "Pull up, bring a friend. Everyone's welcome at HKES events, no membership needed.",
          },
          { key: 'button_text', label: 'Button text', type: 'text', default: 'All events' },
        ],
      },
      {
        key: 'stats',
        label: 'Stats row',
        fields: [
          {
            key: 'items',
            label: 'Stats',
            type: 'list',
            itemFields: [
              { key: 'value', label: 'Value', type: 'text' },
              { key: 'label', label: 'Label', type: 'text' },
            ],
            default: [
              { value: '500', label: 'Members' },
              { value: '20+', label: 'Events a year' },
              { value: '$10K+', label: 'Raised' },
            ],
          },
        ],
      },
      {
        key: 'gallery_preview',
        label: 'Gallery preview',
        fields: [
          { key: 'eyebrow', label: 'Eyebrow text', type: 'text', default: 'Moments together' },
          { key: 'heading', label: 'Heading', type: 'text', default: 'From the camera roll' },
          {
            key: 'subheading',
            label: 'Subheading',
            type: 'textarea',
            default: 'A peek at the galas, festivals, and hangouts that make HKES what it is.',
          },
          { key: 'button_text', label: 'Button text', type: 'text', default: 'View the gallery' },
        ],
      },
      {
        key: 'get_involved',
        label: 'Get involved',
        fields: [
          { key: 'eyebrow', label: 'Eyebrow text', type: 'text', default: 'Join us' },
          { key: 'heading', label: 'Heading', type: 'text', default: 'How to get involved' },
          {
            key: 'subheading',
            label: 'Subheading',
            type: 'textarea',
            default: "Everyone is welcome. Here's the easiest way to get plugged into HKES.",
          },
          {
            key: 'steps',
            label: 'Steps',
            type: 'list',
            itemFields: [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ],
            default: [
              { title: 'Follow along', description: 'Follow us on Instagram and TikTok to catch every new flyer and announcement.' },
              { title: 'Come to an event', description: 'No membership required. Come celebrate, eat, and meet the community.' },
              { title: 'Get involved', description: 'Ready for more? Reach out to volunteer, join the team, or run for E-Board.' },
            ],
          },
          { key: 'cta_heading', label: 'CTA heading', type: 'text', default: 'Ready to say hi?' },
          {
            key: 'cta_body',
            label: 'CTA body',
            type: 'textarea',
            default: "Come to our next event or drop us a message. We'd love to meet you.",
          },
          { key: 'instagram_button_text', label: 'Instagram button text', type: 'text', default: 'Follow on Instagram' },
          { key: 'contact_button_text', label: 'Contact button text', type: 'text', default: 'Contact us' },
        ],
      },
    ],
  },
  {
    key: 'events',
    label: 'Events',
    path: '/events',
    sections: [
      {
        key: 'hero',
        label: 'Hero',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text', default: 'Events' },
          {
            key: 'subheading',
            label: 'Subheading',
            type: 'textarea',
            default: "Festivals, food, and late-night hangouts. Here's where HKES is headed next.",
          },
        ],
      },
    ],
  },
  {
    key: 'fundraisers',
    label: 'Fundraisers',
    path: '/fundraisers',
    sections: [
      {
        key: 'hero',
        label: 'Hero',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text', default: 'Support HKES' },
          {
            key: 'subheading',
            label: 'Subheading',
            type: 'textarea',
            default: 'Every dollar keeps our cultural events, programming, and member resources going.',
          },
        ],
      },
      {
        key: 'support',
        label: 'Support button',
        fields: [
          { key: 'button_text', label: 'Button text', type: 'text', default: 'Ask how to give' },
          { key: 'button_url', label: 'Button link (leave empty to link to the Contact page)', type: 'text', default: '' },
        ],
      },
      {
        key: 'why_we_fundraise',
        label: 'Why we fundraise',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text', default: 'Why we fundraise' },
          {
            key: 'items',
            label: 'Reasons',
            type: 'list',
            itemFields: [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'gallery',
    label: 'Gallery',
    path: '/gallery',
    sections: [
      {
        key: 'hero',
        label: 'Hero',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text', default: 'Memories & recaps' },
          {
            key: 'subheading',
            label: 'Subheading',
            type: 'textarea',
            default: 'Galas, festivals, and everything in between, straight from the HKES camera roll.',
          },
        ],
      },
    ],
  },
  {
    key: 'about',
    label: 'About',
    path: '/about',
    sections: [
      {
        key: 'hero',
        label: 'Hero',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text', default: 'About HKES' },
          {
            key: 'subheading',
            label: 'Subheading',
            type: 'textarea',
            default: "Binghamton's Hong Kong Exchange Square, celebrating Hong Kong heritage and building community on campus.",
          },
        ],
      },
      {
        key: 'who_we_are',
        label: 'Who we are',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text', default: 'Who we are' },
          { key: 'body', label: 'Body', type: 'textarea' },
        ],
      },
      {
        key: 'what_we_value',
        label: 'What we value',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text', default: 'What we value' },
          {
            key: 'values',
            label: 'Values',
            type: 'list',
            itemFields: [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ],
          },
        ],
      },
      {
        key: 'team',
        label: 'E-Board',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text', default: 'Meet the E-Board' },
          {
            key: 'subheading',
            label: 'Subheading',
            type: 'textarea',
            default: 'The students behind every event, post, and gathering. Say hi at our next event!',
          },
        ],
      },
      {
        key: 'get_involved',
        label: 'Get involved',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text', default: 'Get involved' },
          {
            key: 'body',
            label: 'Body',
            type: 'textarea',
            default: 'Come to an event, follow along on social media, or reach out if you have questions about joining HKES.',
          },
          { key: 'explore_button_text', label: 'Explore button text', type: 'text', default: 'Explore events' },
          { key: 'contact_button_text', label: 'Contact button text', type: 'text', default: 'Contact us' },
        ],
      },
    ],
  },
  {
    key: 'contact',
    label: 'Contact',
    path: '/contact',
    sections: [
      {
        key: 'hero',
        label: 'Hero',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text', default: 'Get in touch' },
          { key: 'subheading', label: 'Subheading', type: 'text', default: "We'd love to hear from you." },
        ],
      },
      {
        key: 'info',
        label: 'Contact info',
        fields: [
          { key: 'instagram_handle', label: 'Instagram handle', type: 'text', default: '@binghkes' },
          { key: 'email', label: 'Email', type: 'text', default: 'hkes@binghamton.edu' },
          { key: 'location_name', label: 'Location name', type: 'text', default: 'Binghamton University' },
          { key: 'location_address', label: 'Location address', type: 'text', default: '4400 Vestal Pkwy E, Binghamton, NY 13902' },
        ],
      },
      {
        key: 'cta',
        label: 'Join CTA',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text', default: 'Interested in joining?' },
          {
            key: 'body',
            label: 'Body',
            type: 'textarea',
            default: 'Applications open each semester for new members and E-Board positions. Follow along for announcements!',
          },
          { key: 'button_text', label: 'Button text (links to Instagram)', type: 'text', default: 'Follow for announcements' },
        ],
      },
    ],
  },
  {
    key: 'global',
    label: 'Global (Footer & Social)',
    path: '/',
    sections: [
      {
        key: 'footer',
        label: 'Footer',
        fields: [
          {
            key: 'blurb',
            label: 'Footer blurb',
            type: 'textarea',
            default:
              'A cultural and social student organization celebrating Hong Kong heritage, building community, and connecting students across cultures at Binghamton University.',
          },
          { key: 'copyright', label: 'Copyright line', type: 'text', default: '© Binghamton Hong Kong Exchange Square' },
        ],
      },
      {
        key: 'social',
        label: 'Social links',
        fields: [
          { key: 'instagram_url', label: 'Instagram URL', type: 'text' },
          { key: 'tiktok_url', label: 'TikTok URL', type: 'text' },
          { key: 'linkedin_url', label: 'LinkedIn URL', type: 'text' },
        ],
      },
    ],
  },
];

export type SectionContent = Record<string, any>;

function isEmpty(value: unknown) {
  return value == null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0);
}

// Merges a stored section with its manifest defaults so public pages never
// render blank holes for fields nobody has filled in yet.
export function sectionContent(pageKey: string, sectionKey: string, stored: SectionContent | undefined): SectionContent {
  const section = SITE_PAGES.find((p) => p.key === pageKey)?.sections.find((s) => s.key === sectionKey);
  const merged: SectionContent = { ...(stored ?? {}) };
  for (const field of section?.fields ?? []) {
    if (field.default !== undefined && isEmpty(merged[field.key])) merged[field.key] = field.default;
  }
  return merged;
}

export interface CollectionFieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'number' | 'image' | 'select' | 'checkbox';
  options?: string[];
}

export interface CollectionDef {
  key: string; // matches the Supabase table name
  label: string;
  pageKey: string; // which SITE_PAGES entry this groups under in the editor
  fields: CollectionFieldDef[];
}

export const SITE_COLLECTIONS: CollectionDef[] = [
  {
    key: 'events',
    label: 'Events',
    pageKey: 'events',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'category', label: 'Category', type: 'select', options: ['Cultural', 'Social', 'Fundraiser', 'Workshop'] },
      { key: 'event_date', label: 'Date', type: 'date' },
      { key: 'event_time', label: 'Time', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'status', label: 'Status (events move to Past automatically once their date passes)', type: 'select', options: ['upcoming', 'past'] },
    ],
  },
  {
    key: 'gallery_photos',
    label: 'Gallery Photos',
    pageKey: 'gallery',
    fields: [
      { key: 'url', label: 'Photo', type: 'image' },
      { key: 'event_name', label: 'Event name', type: 'text' },
      { key: 'photo_date', label: 'Date', type: 'date' },
      { key: 'type', label: 'Type', type: 'select', options: ['Cultural', 'Social', 'Fundraiser'] },
      { key: 'year', label: 'Year', type: 'number' },
      { key: 'featured_on_home', label: 'Show on Home preview', type: 'checkbox' },
    ],
  },
  {
    key: 'fundraisers',
    label: 'Fundraisers',
    pageKey: 'fundraisers',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'description', label: 'Description (active only)', type: 'textarea' },
      { key: 'goal_amount', label: 'Goal amount', type: 'number' },
      { key: 'raised_amount', label: 'Raised amount', type: 'number' },
      { key: 'days_remaining', label: 'Days remaining (active only)', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['active', 'past'] },
      { key: 'year', label: 'Year (past only)', type: 'number' },
      { key: 'recap', label: 'Recap (past only)', type: 'textarea' },
    ],
  },
  {
    key: 'featured_recaps',
    label: 'Featured Recaps',
    pageKey: 'gallery',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'image_url', label: 'Image', type: 'image' },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { key: 'photo_count', label: 'Photo count', type: 'number' },
      { key: 'recap_date', label: 'Date', type: 'date' },
    ],
  },
];
