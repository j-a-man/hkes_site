import { createBrowserRouter, redirect } from "react-router";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import RequirePortalAuth from "./components/portal/RequirePortalAuth";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Fundraisers from "./pages/Fundraisers";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import QrEntry from "./pages/QrEntry";
import PortalLogin from "./pages/portal/PortalLogin";
import PortalResetPassword from "./pages/portal/PortalResetPassword";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalDeadlines from "./pages/portal/PortalDeadlines";
import PortalGraphicRequests from "./pages/portal/PortalGraphicRequests";
import PortalPostRequests from "./pages/portal/PortalPostRequests";
import PortalReimbursements from "./pages/portal/PortalReimbursements";
import PortalMembers from "./pages/portal/PortalMembers";
import PortalAnnouncements from "./pages/portal/PortalAnnouncements";
import PortalSiteEditor from "./pages/portal/PortalSiteEditor";
import PortalQrCampaigns from "./pages/portal/PortalQrCampaigns";
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
  getProfiles,
  getAllSiteContent,
  getQrCampaigns,
  getQrCampaignBySlug,
} from "./lib/queries";

export const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: Layout,
    ErrorBoundary: ErrorBoundary,
    loader: async () => ({ globalContent: await getSiteContent("global") }),
    children: [
      {
        index: true,
        Component: Home,
        loader: async () => {
          const [content, eboard, photos] = await Promise.all([
            getSiteContent("home"),
            getEboardProfiles(),
            getGalleryPhotos(),
          ]);
          return { content, eboard, photos: photos.filter((p) => p.featured_on_home) };
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
          const [content, photos, recaps] = await Promise.all([
            getSiteContent("gallery"),
            getGalleryPhotos(),
            getFeaturedRecaps(),
          ]);
          return { content, photos, recaps };
        },
      },
      {
        path: "about",
        Component: About,
        loader: async () => ({ content: await getSiteContent("about") }),
      },
      {
        path: "contact",
        Component: Contact,
        loader: async () => ({ content: await getSiteContent("contact") }),
      },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/qr/:slug",
    Component: QrEntry,
    ErrorBoundary: ErrorBoundary,
    loader: async ({ params }) => ({ campaign: await getQrCampaignBySlug(params.slug!) }),
  },
  {
    path: "/portal",
    ErrorBoundary: ErrorBoundary,
    children: [
      {
        index: true,
        Component: PortalLogin,
        loader: async () => {
          const { data } = await supabase.auth.getSession();
          if (data.session) throw redirect("/portal/dashboard");
          return null;
        },
      },
      { path: "reset-password", Component: PortalResetPassword },
      {
        loader: requireSession,
        Component: RequirePortalAuth,
        children: [
          {
            path: "dashboard",
            Component: PortalDashboard,
            loader: async () => {
              const [deadlines, graphics, posts, reimbursements, announcements] = await Promise.all([
                getDeadlines(),
                getGraphicRequests(),
                getPostRequests(),
                getReimbursements(),
                getAnnouncements(),
              ]);
              return { deadlines, graphics, posts, reimbursements, announcements: announcements.slice(0, 3) };
            },
          },
          {
            path: "deadlines",
            Component: PortalDeadlines,
            loader: async () => ({ deadlines: await getDeadlines() }),
          },
          {
            path: "graphics",
            Component: PortalGraphicRequests,
            loader: async () => ({ requests: await getGraphicRequests() }),
          },
          {
            path: "posts",
            Component: PortalPostRequests,
            loader: async () => ({ requests: await getPostRequests() }),
          },
          {
            path: "reimbursements",
            Component: PortalReimbursements,
            loader: async () => ({ reimbursements: await getReimbursements() }),
          },
          {
            path: "members",
            Component: PortalMembers,
            loader: async () => ({ members: await getProfiles() }),
          },
          {
            path: "announcements",
            Component: PortalAnnouncements,
            loader: async () => ({ announcements: await getAnnouncements() }),
          },
          {
            path: "qr-campaigns",
            Component: PortalQrCampaigns,
            loader: async () => ({ campaigns: await getQrCampaigns() }),
          },
          {
            path: "site-editor",
            Component: PortalSiteEditor,
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
      { path: "*", Component: NotFound },
    ],
  },
]);
