import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Fundraisers from "./pages/Fundraisers";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import PortalLogin from "./pages/portal/PortalLogin";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalDeadlines from "./pages/portal/PortalDeadlines";
import PortalGraphicRequests from "./pages/portal/PortalGraphicRequests";
import PortalPostRequests from "./pages/portal/PortalPostRequests";
import PortalReimbursements from "./pages/portal/PortalReimbursements";
import PortalMembers from "./pages/portal/PortalMembers";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "events", Component: Events },
      { path: "fundraisers", Component: Fundraisers },
      { path: "gallery", Component: Gallery },
      { path: "blog", Component: Blog },
      { path: "contact", Component: Contact },
    ],
  },
  {
    path: "/portal",
    children: [
      { index: true, Component: PortalLogin },
      { path: "dashboard", Component: PortalDashboard },
      { path: "deadlines", Component: PortalDeadlines },
      { path: "graphics", Component: PortalGraphicRequests },
      { path: "posts", Component: PortalPostRequests },
      { path: "reimbursements", Component: PortalReimbursements },
      { path: "members", Component: PortalMembers },
    ],
  },
]);
