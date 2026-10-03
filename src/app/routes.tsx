import type { ComponentType } from "react";
import { createBrowserRouter, redirect } from "react-router";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Fundraisers from "./pages/Fundraisers";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import QrEntry from "./pages/QrEntry";
import { supabase } from "./lib/supabase";
import { requireSession } from "./lib/auth";
import {
  getSiteContent,
  getEvents,
  getFundraisers,
  getGalleryPhotos,
  getFeaturedRecaps,
  getEboardProfiles,
  getAnnouncements,
  getDeadlines,
  getGraphicRequests,
  getPostRequests,
  getReimbursements,
  getStatuses,
  getProfiles,
  getAllSiteContent,
  getQrCampaigns,
  getQrCampaignBySlug,
  getQrCampaignById,
  getQrCampaignEntries,
  getQrEntryStats,
} from "./lib/queries";

// Portal screens are split into their own chunks, so public visitors never
// download them (or the QR code and toast libraries they use).
const lazyPage = (load: () => Promise<{ default: ComponentType }>) => async () => ({ Component: (await load()).default });

// Shown while the first page's data loads, so the screen is paper, not blank white.
function PageFallback() {
  return <div className="min-h-screen bg-hk-paper" />;
}

export const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: Layout,
    ErrorBoundary,
    HydrateFallback: PageFallback,
    loader: async () => {
      const [globalContent, contactContent] = await Promise.all([getSiteContent("global"), getSiteContent("contact")]);
      return { globalContent, contactContent };
    },
    children: [
      {
        index: true,
        Component: Home,
        loader: async () => {
          const [content, events, photos] = await Promise.all([getSiteContent("home"), getEvents(), getGalleryPhotos()]);
          return { content, events, photos: photos.filter((p) => p.featured_on_home) };
        },
      },
      {
        path: "events",
        Component: Events,
        loader: async () => {
          const [content, events] = await Promise.all([getSiteContent("events"), getEvents()]);
          return { content, events };
        },
      },
      {
        path: "fundraisers",
        Component: Fundraisers,
        loader: async () => {
          const [content, fundraisers] = await Promise.all([getSiteContent("fundraisers"), getFundraisers()]);
          return { content, fundraisers };
        },
      },
      {
        path: "gallery",
        Component: Gallery,
        loader: async () => {
          const [content, photos, recaps] = await Promise.all([getSiteContent("gallery"), getGalleryPhotos(), getFeaturedRecaps()]);
          return { content, photos, recaps };
        },
      },
      {
        path: "about",
        Component: About,
        loader: async () => {
          const [content, eboard] = await Promise.all([getSiteContent("about"), getEboardProfiles()]);
          return { content, eboard };
        },
      },
      // Reads its content from the root loader, which already fetches it for the footer.
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/qr/:slug",
    Component: QrEntry,
    ErrorBoundary,
    HydrateFallback: PageFallback,
    loader: async ({ params }) => ({ campaign: await getQrCampaignBySlug(params.slug!) }),
  },
  {
    path: "/portal",
    ErrorBoundary,
    HydrateFallback: PageFallback,
    children: [
      {
        index: true,
        lazy: lazyPage(() => import("./pages/portal/PortalLogin")),
        loader: async () => {
          const { data } = await supabase.auth.getSession();
          if (data.session) throw redirect("/portal/dashboard");
          return null;
        },
      },
      { path: "reset-password", lazy: lazyPage(() => import("./pages/portal/PortalResetPassword")) },
      {
        loader: requireSession,
        lazy: lazyPage(() => import("./components/portal/RequirePortalAuth")),
        children: [
          {
            lazy: lazyPage(() => import("./components/PortalLayout")),
            children: [
              {
                path: "dashboard",
                lazy: lazyPage(() => import("./pages/portal/PortalDashboard")),
                loader: async () => {
                  const [deadlines, graphics, posts, reimbursements, announcements, events] = await Promise.all([
                    getDeadlines(),
                    getStatuses("graphic_requests"),
                    getStatuses("post_requests"),
                    getStatuses("reimbursements"),
                    getAnnouncements(),
                    getEvents(),
                  ]);
                  return { deadlines, graphics, posts, reimbursements, announcements: announcements.slice(0, 3), events };
                },
              },
              {
                path: "deadlines",
                lazy: lazyPage(() => import("./pages/portal/PortalDeadlines")),
                loader: async () => ({ deadlines: await getDeadlines() }),
              },
              {
                path: "graphics",
                lazy: lazyPage(() => import("./pages/portal/PortalGraphicRequests")),
                loader: async () => ({ requests: await getGraphicRequests() }),
              },
              {
                path: "posts",
                lazy: lazyPage(() => import("./pages/portal/PortalPostRequests")),
                loader: async () => ({ requests: await getPostRequests() }),
              },
              {
                path: "reimbursements",
                lazy: lazyPage(() => import("./pages/portal/PortalReimbursements")),
                loader: async () => ({ reimbursements: await getReimbursements() }),
              },
              {
                path: "members",
                lazy: lazyPage(() => import("./pages/portal/PortalMembers")),
                loader: async () => ({ members: await getProfiles() }),
              },
              {
                path: "announcements",
                lazy: lazyPage(() => import("./pages/portal/PortalAnnouncements")),
                loader: async () => ({ announcements: await getAnnouncements() }),
              },
              {
                path: "qr-campaigns",
                lazy: lazyPage(() => import("./pages/portal/PortalQrCampaigns")),
                loader: async () => {
                  const [campaigns, stats] = await Promise.all([getQrCampaigns(), getQrEntryStats()]);
                  return { campaigns, stats };
                },
              },
              {
                path: "qr-campaigns/:id",
                lazy: lazyPage(() => import("./pages/portal/PortalQrCampaignDetail")),
                loader: async ({ params }) => {
                  const [campaign, entries] = await Promise.all([getQrCampaignById(params.id!), getQrCampaignEntries(params.id!)]);
                  return { campaign, entries: campaign ? entries : [] };
                },
              },
              {
                path: "site-editor",
                lazy: lazyPage(() => import("./pages/portal/PortalSiteEditor")),
                loader: async () => {
                  const [content, events, photos, fundraisers, recaps] = await Promise.all([
                    getAllSiteContent(),
                    getEvents(),
                    getGalleryPhotos(),
                    getFundraisers(),
                    getFeaturedRecaps(),
                  ]);
                  return { content, collections: { events, gallery_photos: photos, fundraisers, featured_recaps: recaps } };
                },
              },
            ],
          },
        ],
      },
      { path: "*", Component: NotFound },
    ],
  },
]);
