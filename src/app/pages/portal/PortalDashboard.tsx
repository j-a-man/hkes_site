import PortalLayout from '../../components/PortalLayout';
import { Calendar, Clock, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

export default function PortalDashboard() {
  const upcomingDeadlines = [
    { id: 1, task: 'Create graphics for Lunar New Year Gala', chair: 'Publicity', due: '2026-04-28', status: 'in-progress', urgency: 'yellow' },
    { id: 2, task: 'Submit reimbursement for event supplies', chair: 'Treasurer', due: '2026-04-26', status: 'not-started', urgency: 'red' },
    { id: 3, task: 'Post Mid-Autumn Festival recap', chair: 'Outreach', due: '2026-05-01', status: 'on-track', urgency: 'green' },
  ];

  const pendingRequests = [
    { type: 'Graphic', count: 3 },
    { type: 'Post', count: 2 },
    { type: 'Reimbursement', count: 1 },
  ];

  const announcements = [
    { id: 1, author: 'Sarah Li (President)', message: 'Great work on the Spring Kickoff everyone! Let\'s keep the momentum going.', date: 'Apr 20' },
    { id: 2, author: 'Michael Tam (VP)', message: 'Reminder: E-Board meeting this Thursday at 7 PM.', date: 'Apr 18' },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <PortalLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Welcome back, Alex 👋</h1>
          <p className="text-[#555555]">Here's what's happening with HKES</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="text-[#DE2910]" size={24} />
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="text-3xl mb-1">5</p>
            <p className="text-[#555555] text-sm">Upcoming Events</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="text-[#DE2910]" size={24} />
            </div>
            <p className="text-3xl mb-1">3</p>
            <p className="text-[#555555] text-sm">Pending Tasks</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="text-[#DE2910]" size={24} />
            </div>
            <p className="text-3xl mb-1">6</p>
            <p className="text-[#555555] text-sm">Active Requests</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Clock className="text-[#DE2910]" size={24} />
            </div>
            <p className="text-3xl mb-1">2</p>
            <p className="text-[#555555] text-sm">Due This Week</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl mb-4">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-start gap-3 p-3 bg-[#FFF8F6] rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getUrgencyColor(deadline.urgency)}`}></div>
                  <div className="flex-1">
                    <p className="mb-1">{deadline.task}</p>
                    <div className="flex items-center gap-3 text-sm text-[#555555]">
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                        {deadline.chair}
                      </span>
                      <span>Due: {deadline.due}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl mb-4">Pending Requests</h2>
            <div className="space-y-4">
              {pendingRequests.map((request, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#FFF8F6] rounded-lg">
                  <span>{request.type} Requests</span>
                  <span className="bg-[#DE2910] text-white px-3 py-1 rounded-full text-sm">
                    {request.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl mb-4">Announcements</h2>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border-l-4 border-[#DE2910] pl-4 py-2">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm">{announcement.author}</p>
                  <span className="text-xs text-[#555555]">{announcement.date}</span>
                </div>
                <p className="text-[#555555]">{announcement.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#DE2910] to-[#FF6B6B] rounded-2xl p-6 text-white">
          <h2 className="text-2xl text-white mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors px-4 py-3 rounded-lg text-sm">
              Request Graphic
            </button>
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors px-4 py-3 rounded-lg text-sm">
              Submit Post
            </button>
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors px-4 py-3 rounded-lg text-sm">
              File Reimbursement
            </button>
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors px-4 py-3 rounded-lg text-sm">
              View Calendar
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
