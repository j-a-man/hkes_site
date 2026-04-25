import PortalLayout from '../../components/PortalLayout';
import { useState } from 'react';
import { Calendar as CalendarIcon, List, Plus } from 'lucide-react';

export default function PortalDeadlines() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState('All');

  const deadlines = [
    { id: 1, task: 'Create Lunar New Year Gala graphics', chair: 'Publicity', chairColor: 'purple', due: '2026-04-28', status: 'in-progress' },
    { id: 2, task: 'Submit event supply reimbursements', chair: 'Treasurer', chairColor: 'green', due: '2026-04-26', status: 'not-started' },
    { id: 3, task: 'Post Mid-Autumn Festival recap', chair: 'Outreach', chairColor: 'pink', due: '2026-05-01', status: 'on-track' },
    { id: 4, task: 'Book venue for Dragon Boat Festival', chair: 'VP', chairColor: 'orange', due: '2026-04-30', status: 'complete' },
    { id: 5, task: 'Send newsletter with event updates', chair: 'Outreach', chairColor: 'pink', due: '2026-04-29', status: 'in-progress' },
    { id: 6, task: 'Update member database', chair: 'Secretary', chairColor: 'blue', due: '2026-05-03', status: 'not-started' },
  ];

  const chairs = ['All', 'Publicity', 'Treasurer', 'Outreach', 'VP', 'Secretary'];

  const filteredDeadlines = filter === 'All'
    ? deadlines
    : deadlines.filter(d => d.chair === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Complete</span>;
      case 'in-progress':
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">In Progress</span>;
      case 'not-started':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">Not Started</span>;
      case 'on-track':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">On Track</span>;
      default:
        return null;
    }
  };

  const getChairColor = (color: string) => {
    const colors: { [key: string]: string } = {
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      pink: 'bg-pink-500',
      orange: 'bg-orange-500',
      blue: 'bg-blue-500',
      red: 'bg-[#DE2910]',
    };
    return colors[color] || 'bg-gray-500';
  };

  return (
    <PortalLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl mb-2">Deadlines Tracker</h1>
            <p className="text-[#555555]">Manage and track all upcoming deadlines</p>
          </div>
          <button className="bg-[#DE2910] text-white px-6 py-3 rounded-lg hover:bg-[#C32410] transition-colors flex items-center gap-2">
            <Plus size={20} />
            Add Deadline
          </button>
        </div>

        <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  view === 'list'
                    ? 'bg-[#DE2910] text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-[#1A1A1A] hover:bg-gray-200 dark:bg-white/10'
                }`}
              >
                <List size={20} />
                List View
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  view === 'calendar'
                    ? 'bg-[#DE2910] text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-[#1A1A1A] hover:bg-gray-200 dark:bg-white/10'
                }`}
              >
                <CalendarIcon size={20} />
                Calendar View
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {chairs.map((chair) => (
                <button
                  key={chair}
                  onClick={() => setFilter(chair)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    filter === chair
                      ? 'bg-[#DE2910] text-white'
                      : 'bg-gray-100 dark:bg-white/5 text-[#1A1A1A] hover:bg-gray-200 dark:bg-white/10'
                  }`}
                >
                  {chair}
                </button>
              ))}
            </div>
          </div>
        </div>

        {view === 'list' ? (
          <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#FFF8F6]">
                <tr>
                  <th className="text-left p-4">Task</th>
                  <th className="text-left p-4">Assigned Chair</th>
                  <th className="text-left p-4">Due Date</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeadlines.map((deadline) => (
                  <tr key={deadline.id} className="border-t border-border hover:bg-[#FFF8F6] transition-colors">
                    <td className="p-4">{deadline.task}</td>
                    <td className="p-4">
                      <span className={`${getChairColor(deadline.chairColor)} text-white px-3 py-1 rounded-full text-xs`}>
                        {deadline.chair}
                      </span>
                    </td>
                    <td className="p-4 text-[#555555]">{deadline.due}</td>
                    <td className="p-4">{getStatusBadge(deadline.status)}</td>
                    <td className="p-4">
                      <button className="text-[#DE2910] hover:underline text-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-[#555555] p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="text-center text-[#555555] py-12">
              Calendar view implementation with deadline markers
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
