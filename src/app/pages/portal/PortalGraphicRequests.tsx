import PortalLayout from '../../components/PortalLayout';
import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function PortalGraphicRequests() {
  const [showForm, setShowForm] = useState(true);

  const graphicQueue = [
    { id: 1, requester: 'Sarah Li', eventName: 'Lunar New Year Gala', type: 'Social Media Post', platform: 'Instagram', dueDate: '2026-04-28', status: 'In Progress', priority: 'Urgent' },
    { id: 2, requester: 'Michael Tam', eventName: 'Dragon Boat Festival', type: 'Flyer', platform: 'Print', dueDate: '2026-05-01', status: 'Pending', priority: 'Normal' },
    { id: 3, requester: 'Emily Chen', eventName: 'Movie Night', type: 'Story', platform: 'Instagram', dueDate: '2026-04-30', status: 'Complete', priority: 'Normal' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Complete':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200';
    }
  };

  return (
    <PortalLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Graphic Requests</h1>
          <p className="text-[#555555]">Request graphics or manage the queue</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {showForm && (
              <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="text-2xl mb-6">Request a Graphic</h2>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm">Event/Post Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                        placeholder="e.g., Lunar New Year Gala"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm">Type of Graphic</label>
                      <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]">
                        <option>Social Media Post</option>
                        <option>Story</option>
                        <option>Flyer</option>
                        <option>Banner</option>
                        <option>Email Header</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">Platform(s) Needed For</label>
                    <div className="flex flex-wrap gap-2">
                      {['Instagram', 'Facebook', 'Email', 'Print'].map((platform) => (
                        <label key={platform} className="flex items-center gap-2 bg-[#FFF8F6] px-3 py-2 rounded-lg cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm">Event Date & Time</label>
                      <input
                        type="datetime-local"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm">Due Date Needed By</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">Description of Content/Vibe</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                      placeholder="Describe what you want in the graphic..."
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">Reference Images (Optional)</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-[#FFF8F6] transition-colors cursor-pointer">
                      <Upload size={32} className="mx-auto mb-2 text-[#555555]" />
                      <p className="text-[#555555]">Drag and drop or click to upload</p>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">Priority Level</label>
                    <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]">
                      <option>Normal</option>
                      <option>Urgent</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#DE2910] text-white px-6 py-3 rounded-lg hover:bg-[#C32410] transition-colors"
                  >
                    Submit Request
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#DE2910] to-[#FF6B6B] rounded-2xl p-6 text-white mb-6">
              <h3 className="text-white text-xl mb-3">Queue Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Pending</span>
                  <span className="text-2xl">1</span>
                </div>
                <div className="flex justify-between">
                  <span>In Progress</span>
                  <span className="text-2xl">1</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span className="text-2xl">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-sm overflow-hidden mt-6">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl">Current Queue</h2>
          </div>
          <table className="w-full">
            <thead className="bg-[#FFF8F6]">
              <tr>
                <th className="text-left p-4">Requester</th>
                <th className="text-left p-4">Event Name</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Platform</th>
                <th className="text-left p-4">Due Date</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Priority</th>
              </tr>
            </thead>
            <tbody>
              {graphicQueue.map((request) => (
                <tr key={request.id} className="border-t border-border hover:bg-[#FFF8F6] transition-colors">
                  <td className="p-4">{request.requester}</td>
                  <td className="p-4">{request.eventName}</td>
                  <td className="p-4 text-sm text-[#555555]">{request.type}</td>
                  <td className="p-4 text-sm text-[#555555]">{request.platform}</td>
                  <td className="p-4 text-sm text-[#555555]">{request.dueDate}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {request.priority === 'Urgent' ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">Urgent</span>
                    ) : (
                      <span className="bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
}
