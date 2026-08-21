import { supabase } from './supabase';
import type { Profile } from './auth';

export interface SiteContentSection {
  page_key: string;
  section_key: string;
  content: Record<string, any>;
}

export interface EventRow {
  id: string;
  name: string;
  category: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  status: 'upcoming' | 'past';
  sort_order: number;
}

export interface GalleryPhotoRow {
  id: string;
  url: string;
  event_name: string;
  photo_date: string | null;
  type: string;
  year: number;
  featured_on_home: boolean;
  sort_order: number;
}

export interface FundraiserRow {
  id: string;
  name: string;
  description: string | null;
  goal_amount: number | null;
  raised_amount: number;
  days_remaining: number | null;
  status: 'active' | 'past';
  year: number | null;
  recap: string | null;
  sort_order: number;
}

export interface FeaturedRecapRow {
  id: string;
  title: string;
  image_url: string | null;
  excerpt: string | null;
  photo_count: number | null;
  recap_date: string | null;
  sort_order: number;
}

export interface AnnouncementRow {
  id: string;
  author_id: string | null;
  title: string;
  message: string;
  pinned: boolean;
  created_at: string;
  profiles?: { full_name: string; title: string } | null;
}

export interface DeadlineRow {
  id: string;
  task: string;
  description: string | null;
  assigned_chair: string;
  due_date: string;
  status: 'not-started' | 'in-progress' | 'on-track' | 'complete';
  created_by: string | null;
  created_at: string;
}

export interface GraphicRequestRow {
  id: string;
  requested_by: string | null;
  event_name: string;
  graphic_type: string;
  platforms: string[];
  event_datetime: string | null;
  due_date: string;
  description: string | null;
  reference_image_url: string | null;
  priority: 'Normal' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Complete';
  created_at: string;
  profiles?: { full_name: string } | null;
}

export interface PostRequestRow {
  id: string;
  requested_by: string | null;
  platforms: string[];
  post_type: string;
  caption: string;
  has_graphic: boolean;
  graphic_url: string | null;
  publish_date: string;
  link_url: string | null;
  audience_notes: string | null;
  status: 'Pending' | 'Scheduled' | 'Published';
  created_at: string;
  profiles?: { full_name: string } | null;
}

export interface ReimbursementRow {
  id: string;
  requested_by: string | null;
  purchase_date: string;
  category: string;
  amount: number;
  vendor: string;
  description: string | null;
  event_name: string | null;
  receipt_url: string | null;
  payment_method: string;
  payment_account: string | null;
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
  reviewed_by: string | null;
  created_at: string;
  profiles?: { full_name: string } | null;
}

export interface QrQuestion {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
}

export interface QrCampaignRow {
  id: string;
  slug: string;
  name: string;
  destination_url: string;
  questions: QrQuestion[];
  active: boolean;
  created_by: string | null;
  created_at: string;
  entries?: { count: number }[];
}

export interface QrCampaignEntryRow {
  id: string;
  campaign_id: string;
  answers: Record<string, string | boolean>;
  verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}

function orThrow<T>({ data, error }: { data: T | null; error: any }): T {
  if (error) throw error;
  return data as T;
}

export async function getSiteContent(pageKey: string): Promise<Record<string, Record<string, any>>> {
  const res = await supabase.from('site_content').select('section_key, content').eq('page_key', pageKey);
  const rows = orThrow(res) as { section_key: string; content: Record<string, any> }[];
  const map: Record<string, Record<string, any>> = {};
  for (const row of rows) map[row.section_key] = row.content;
  return map;
}

export async function getAllSiteContent(): Promise<SiteContentSection[]> {
  const res = await supabase.from('site_content').select('page_key, section_key, content').order('page_key');
  return orThrow(res) as SiteContentSection[];
}

export async function getEvents(): Promise<EventRow[]> {
  const res = await supabase.from('events').select('*').order('sort_order');
  return orThrow(res) as EventRow[];
}

export async function getGalleryPhotos(): Promise<GalleryPhotoRow[]> {
  const res = await supabase.from('gallery_photos').select('*').order('sort_order');
  return orThrow(res) as GalleryPhotoRow[];
}

export async function getFundraisers(): Promise<FundraiserRow[]> {
  const res = await supabase.from('fundraisers').select('*').order('sort_order');
  return orThrow(res) as FundraiserRow[];
}

export async function getFeaturedRecaps(): Promise<FeaturedRecapRow[]> {
  const res = await supabase.from('featured_recaps').select('*').order('sort_order');
  return orThrow(res) as FeaturedRecapRow[];
}

export async function getEboardProfiles(): Promise<Pick<Profile, 'id' | 'full_name' | 'title' | 'avatar_url'>[]> {
  // Ordered by full_name (not created_at) — anon only has column-level SELECT on the
  // public-safe fields, and PostgREST requires SELECT on any column referenced by ORDER BY.
  const res = await supabase
    .from('profiles')
    .select('id, full_name, title, avatar_url')
    .neq('title', 'Member')
    .order('full_name');
  return orThrow(res) as any;
}

export async function getProfiles(): Promise<Profile[]> {
  const res = await supabase.from('profiles').select('*').order('full_name');
  return orThrow(res) as Profile[];
}

export async function getAnnouncements(): Promise<AnnouncementRow[]> {
  const res = await supabase
    .from('announcements')
    .select('*, profiles:author_id(full_name, title)')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });
  return orThrow(res) as any;
}

export async function getDeadlines(): Promise<DeadlineRow[]> {
  const res = await supabase.from('deadlines').select('*').order('due_date');
  return orThrow(res) as DeadlineRow[];
}

export async function getGraphicRequests(): Promise<GraphicRequestRow[]> {
  const res = await supabase
    .from('graphic_requests')
    .select('*, profiles:requested_by(full_name)')
    .order('created_at', { ascending: false });
  return orThrow(res) as any;
}

export async function getPostRequests(): Promise<PostRequestRow[]> {
  const res = await supabase
    .from('post_requests')
    .select('*, profiles:requested_by(full_name)')
    .order('created_at', { ascending: false });
  return orThrow(res) as any;
}

export async function getReimbursements(): Promise<ReimbursementRow[]> {
  const res = await supabase
    .from('reimbursements')
    .select('*, profiles:requested_by(full_name)')
    .order('created_at', { ascending: false });
  return orThrow(res) as any;
}

export async function getQrCampaigns(): Promise<QrCampaignRow[]> {
  const res = await supabase
    .from('qr_campaigns')
    .select('*, entries:qr_campaign_entries(count)')
    .order('created_at', { ascending: false });
  return orThrow(res) as any;
}

export async function getQrCampaignBySlug(slug: string): Promise<QrCampaignRow | null> {
  const res = await supabase.from('qr_campaigns').select('*').eq('slug', slug).eq('active', true).maybeSingle();
  if (res.error) throw res.error;
  return res.data as QrCampaignRow | null;
}

export async function getQrCampaignEntries(campaignId: string): Promise<QrCampaignEntryRow[]> {
  const res = await supabase
    .from('qr_campaign_entries')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false });
  return orThrow(res) as QrCampaignEntryRow[];
}
