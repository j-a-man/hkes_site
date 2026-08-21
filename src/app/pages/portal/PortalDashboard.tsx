import { useLoaderData, Link } from 'react-router';
import StatCard from '../../components/portal/StatCard';
import Reveal from '../../components/Reveal';
import { motion, useReducedMotion } from 'motion/react';
import { Calendar, Clock, AlertCircle, CheckCircle, TrendingUp, Image, Send, DollarSign, CalendarDays, CheckSquare, Megaphone } from 'lucide-react';
import { staggerContainer } from '../../lib/motion';
import { useAuth } from '../../lib/auth';
import type { DeadlineRow, GraphicRequestRow, PostRequestRow, ReimbursementRow, AnnouncementRow } from '../../lib/queries';

interface LoaderData {
  deadlines: DeadlineRow[];
  graphics: GraphicRequestRow[];
  posts: PostRequestRow[];
  reimbursements: ReimbursementRow[];
  announcements: AnnouncementRow[];
}

export default function PortalDashboard() {
  const { deadlines, graphics, posts, reimbursements, announcements } = useLoaderData() as LoaderData;
  const { profile } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const openDeadlines = deadlines.filter((d) => d.status !== 'complete');
  const upcomingDeadlines = [...openDeadlines]
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 3);

  const oneWeekOut = new Date();
  oneWeekOut.setDate(oneWeekOut.getDate() + 7);
  const dueThisWeek = openDeadlines.filter((d) => new Date(d.due_date) <= oneWeekOut).length;

  const pendingRequests = [
    { type: 'Graphic', icon: Image, count: graphics.filter((g) => g.status === 'Pending').length, path: '/portal/graphics' },
    { type: 'Post', icon: Send, count: posts.filter((p) => p.status === 'Pending').length, path: '/portal/posts' },
    { type: 'Reimbursement', icon: DollarSign, count: reimbursements.filter((r) => r.status === 'Pending').length, path: '/portal/reimbursements' },
  ];
  const activeRequests = pendingRequests.reduce((sum, r) => sum + r.count, 0);

  const quickActions = [
    { label: 'Request Graphic', icon: Image, path: '/portal/graphics' },
    { label: 'Submit Post', icon: Send, path: '/portal/posts' },
    { label: 'File Reimbursement', icon: DollarSign, path: '/portal/reimbursements' },
    { label: 'View Deadlines', icon: CalendarDays, path: '/portal/deadlines' },
  ];

  const getUrgencyColor = (status: string) => {
    switch (status) {
      case 'not-started': return 'bg-red-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'on-track': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const firstName = profile?.full_name?.split(' ')[0] ?? '';
  const initials = profile?.full_name ? profile.full_name.split(' ').map((n) => n[0]).join('') : '';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
      <div>
        <Reveal className="bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] rounded-2xl p-6 sm:p-8 text-white mb-8 flex items-center justify-between gap-4 overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-white/80 text-sm mb-1">{today}</p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Welcome back, {firstName} 👋</h1>
            <p className="text-white/85">Here's what's happening with HKES</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold shrink-0 relative z-10">
            {initials}
          </div>
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute right-16 -bottom-16 w-40 h-40 rounded-full bg-white/10" />
        </Reveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'visible'}
          variants={staggerContainer}
        >
          <div className="relative">
            <StatCard icon={Calendar} value={5} label="Upcoming Events" gradient="from-[#ffbba1] to-[#fa4e5b]" />
            <TrendingUp className="absolute top-6 right-6 text-green-500" size={18} />
          </div>
          <StatCard icon={CheckCircle} value={openDeadlines.length} label="Pending Tasks" gradient="from-[#ff7a65] to-[#ff9a5c]" />
          <StatCard icon={AlertCircle} value={activeRequests} label="Active Requests" gradient="from-[#fa4e5b] to-[#ff6b6b]" />
          <StatCard icon={Clock} value={dueThisWeek} label="Due This Week" gradient="from-[#ffc47d] to-[#ff9a5c]" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffbba1] to-[#fa4e5b] flex items-center justify-center shrink-0">
                <CheckSquare size={18} className="text-white" />
              </div>
              <h2 className="text-2xl">Upcoming Deadlines</h2>
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.length === 0 && <p className="text-sm text-[#555555] dark:text-gray-400">Nothing due — you're all caught up.</p>}
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-start gap-3 p-3 bg-[#FFF8F6] dark:bg-white/5 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getUrgencyColor(deadline.status)}`}></div>
                  <div className="flex-1">
                    <p className="mb-1">{deadline.task}</p>
                    <div className="flex items-center gap-3 text-sm text-[#555555] dark:text-gray-400">
                      <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded text-xs">
                        {deadline.assigned_chair}
                      </span>
                      <span>Due: {deadline.due_date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff7a65] to-[#ff9a5c] flex items-center justify-center shrink-0">
                <AlertCircle size={18} className="text-white" />
              </div>
              <h2 className="text-2xl">Pending Requests</h2>
            </div>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <Link
                  key={request.type}
                  to={request.path}
                  className="flex items-center justify-between p-3 bg-[#FFF8F6] dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm">
                      <request.icon size={14} className="text-[#fa4e5b]" />
                    </span>
                    {request.type} Requests
                  </span>
                  <span className="bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-3 py-1 rounded-full text-sm">
                    {request.count}
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffc47d] to-[#ff9a5c] flex items-center justify-center shrink-0">
              <Megaphone size={18} className="text-white" />
            </div>
            <h2 className="text-2xl">Announcements</h2>
          </div>
          <div className="space-y-4">
            {announcements.length === 0 && <p className="text-sm text-[#555555] dark:text-gray-400">No announcements yet.</p>}
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border-l-4 border-[#fa4e5b] pl-4 py-2">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm">{announcement.profiles?.full_name ?? 'HKES'}{announcement.profiles?.title ? ` (${announcement.profiles.title})` : ''}</p>
                  <span className="text-xs text-[#555555] dark:text-gray-400">{new Date(announcement.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-[#555555] dark:text-gray-400">{announcement.message}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="bg-gradient-to-r from-[#DE2910] to-[#FF6B6B] rounded-2xl p-6 text-white">
          <h2 className="text-2xl text-white mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.path}>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors px-4 py-3 rounded-lg text-sm flex flex-col items-center gap-2"
                >
                  <action.icon size={18} />
                  {action.label}
                </motion.div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
  );
}
