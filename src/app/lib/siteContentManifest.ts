// Defines every editable field on the public site, grouped by page/section.
// The Site Editor renders forms straight from this manifest; public pages use
// the same keys to read values out of `site_content`/collection tables.

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'list';
  itemFields?: FieldDef[]; // only when type === 'list'
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
          { key: 'eyebrow', label: 'Eyebrow text', type: 'text' },
          { key: 'heading_line1', label: 'Heading (line 1)', type: 'text' },
          { key: 'heading_line2', label: 'Heading (line 2, outlined)', type: 'text' },
          { key: 'body', label: 'Body paragraph', type: 'textarea' },
          { key: 'primary_button_text', label: 'Primary button text', type: 'text' },
          { key: 'secondary_button_text', label: 'Secondary button text', type: 'text' },
          { key: 'image_skyline_url', label: 'Skyline image', type: 'image' },
          { key: 'image_streets_url', label: 'Streets image', type: 'image' },
          { key: 'image_dimsum_url', label: 'Dim sum image', type: 'image' },
          { key: 'caption_big_little', label: 'Skyline caption', type: 'text' },
          { key: 'caption_culture', label: 'Streets caption', type: 'text' },
          { key: 'caption_people', label: 'Dim sum caption', type: 'text' },
          { key: 'watermark_logo_url', label: 'Watermark logo image', type: 'image' },
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
          },
        ],
      },
      {
        key: 'eboard',
        label: 'E-Board intro',
        fields: [
          { key: 'eyebrow', label: 'Eyebrow text', type: 'text' },
          { key: 'heading', label: 'Heading', type: 'text' },
          { key: 'subheading', label: 'Subheading', type: 'textarea' },
        ],
      },
      {
        key: 'gallery_preview',
        label: 'Gallery preview',
        fields: [
          { key: 'eyebrow', label: 'Eyebrow text', type: 'text' },
          { key: 'heading', label: 'Heading', type: 'text' },
          { key: 'subheading', label: 'Subheading', type: 'textarea' },
          { key: 'button_text', label: 'Button text', type: 'text' },
        ],
      },
      {
        key: 'get_involved',
        label: 'Get involved',
        fields: [
          { key: 'eyebrow', label: 'Eyebrow text', type: 'text' },
          { key: 'heading', label: 'Heading', type: 'text' },
          { key: 'subheading', label: 'Subheading', type: 'textarea' },
          {
            key: 'steps',
            label: 'Steps',
            type: 'list',
            itemFields: [
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ],
          },
          { key: 'cta_heading', label: 'CTA heading', type: 'text' },
          { key: 'cta_body', label: 'CTA body', type: 'textarea' },
          { key: 'instagram_button_text', label: 'Instagram button text', type: 'text' },
          { key: 'contact_button_text', label: 'Contact button text', type: 'text' },
        ],
      },
    ],
  },
  {
    key: 'events',
    label: 'Events',
    path: '/events',
    sections: [{ key: 'hero', label: 'Hero', fields: [{ key: 'heading', label: 'Heading', type: 'text' }] }],
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
          { key: 'heading', label: 'Heading', type: 'text' },
          { key: 'subheading', label: 'Subheading', type: 'textarea' },
        ],
      },
      {
        key: 'why_we_fundraise',
        label: 'Why we fundraise',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text' },
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
    sections: [{ key: 'hero', label: 'Hero', fields: [{ key: 'heading', label: 'Heading', type: 'text' }] }],
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
          { key: 'heading', label: 'Heading', type: 'text' },
          { key: 'subheading', label: 'Subheading', type: 'textarea' },
        ],
      },
      {
        key: 'who_we_are',
        label: 'Who we are',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text' },
          { key: 'body', label: 'Body', type: 'textarea' },
        ],
      },
      {
        key: 'what_we_value',
        label: 'What we value',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text' },
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
        key: 'get_involved',
        label: 'Get involved',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text' },
          { key: 'body', label: 'Body', type: 'textarea' },
          { key: 'explore_button_text', label: 'Explore button text', type: 'text' },
          { key: 'contact_button_text', label: 'Contact button text', type: 'text' },
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
          { key: 'heading', label: 'Heading', type: 'text' },
          { key: 'subheading', label: 'Subheading', type: 'text' },
        ],
      },
      {
        key: 'info',
        label: 'Contact info',
        fields: [
          { key: 'instagram_handle', label: 'Instagram handle', type: 'text' },
          { key: 'email', label: 'Email', type: 'text' },
          { key: 'location_name', label: 'Location name', type: 'text' },
          { key: 'location_address', label: 'Location address', type: 'text' },
        ],
      },
      {
        key: 'cta',
        label: 'Join CTA',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text' },
          { key: 'body', label: 'Body', type: 'textarea' },
          { key: 'button_text', label: 'Button text', type: 'text' },
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
          { key: 'blurb', label: 'Footer blurb', type: 'textarea' },
          { key: 'copyright', label: 'Copyright line', type: 'text' },
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
      { key: 'status', label: 'Status', type: 'select', options: ['upcoming', 'past'] },
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
