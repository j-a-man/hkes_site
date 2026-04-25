import PortalLayout from '../../components/PortalLayout';

export default function PortalPostRequests() {
  const postQueue = [
    { id: 1, requester: 'Sarah Li', platform: 'Instagram', type: 'Event Promo', caption: 'Join us for Lunar New Year Gala...', publishDate: '2026-04-27', status: 'Pending' },
    { id: 2, requester: 'Michael Tam', platform: 'Facebook', type: 'Fundraiser', caption: 'Support our Spring Cultural Fund...', publishDate: '2026-04-28', status: 'Scheduled' },
    { id: 3, requester: 'Emily Chen', platform: 'Email List', type: 'Recap', caption: 'Spring Kickoff was amazing!...', publishDate: '2026-04-25', status: 'Published' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'Published':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200';
    }
  };

  return (
    <PortalLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Post Requests</h1>
          <p className="text-[#555555]">Request outreach posts or manage the queue</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm mb-6">
              <h2 className="text-2xl mb-6">Request a Post / Outreach</h2>

              <form className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm">Platform(s)</label>
                  <div className="flex flex-wrap gap-2">
                    {['Instagram', 'Facebook', 'GroupMe', 'Email List', 'LinkedIn'].map((platform) => (
                      <label key={platform} className="flex items-center gap-2 bg-[#FFF8F6] px-3 py-2 rounded-lg cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm">Type of Post</label>
                  <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]">
                    <option>Event Promo</option>
                    <option>Fundraiser</option>
                    <option>Recap</option>
                    <option>Announcement</option>
                    <option>Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm">Post Copy/Caption</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                    placeholder="Write your post caption here..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm">Graphic Attached?</label>
                    <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]">
                      <option>Yes - Upload below</option>
                      <option>No - Request from Publicity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">Requested Publish Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm">Link to Include (Optional)</label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm">Target Audience Notes</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                    placeholder="Any specific targeting or audience notes..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#DE2910] text-white px-6 py-3 rounded-lg hover:bg-[#C32410] transition-colors"
                >
                  Submit Post Request
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FF9A5C] rounded-2xl p-6 text-white mb-6">
              <h3 className="text-white text-xl mb-3">Post Queue Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Pending Review</span>
                  <span className="text-2xl">1</span>
                </div>
                <div className="flex justify-between">
                  <span>Scheduled</span>
                  <span className="text-2xl">1</span>
                </div>
                <div className="flex justify-between">
                  <span>Published</span>
                  <span className="text-2xl">1</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm">
              <h3 className="mb-4">Outreach Tips</h3>
              <ul className="space-y-2 text-sm text-[#555555]">
                <li className="flex items-start gap-2">
                  <span className="text-[#DE2910]">•</span>
                  <span>Post at least 3 days before events</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DE2910]">•</span>
                  <span>Include clear call-to-action</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DE2910]">•</span>
                  <span>Use relevant hashtags</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DE2910]">•</span>
                  <span>Tag partner organizations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-sm overflow-hidden mt-6">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl">Current Post Queue</h2>
          </div>
          <table className="w-full">
            <thead className="bg-[#FFF8F6]">
              <tr>
                <th className="text-left p-4">Requester</th>
                <th className="text-left p-4">Platform</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Caption Preview</th>
                <th className="text-left p-4">Publish Date</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {postQueue.map((post) => (
                <tr key={post.id} className="border-t border-border hover:bg-[#FFF8F6] transition-colors">
                  <td className="p-4">{post.requester}</td>
                  <td className="p-4 text-sm text-[#555555]">{post.platform}</td>
                  <td className="p-4 text-sm text-[#555555]">{post.type}</td>
                  <td className="p-4 text-sm text-[#555555] max-w-xs truncate">{post.caption}</td>
                  <td className="p-4 text-sm text-[#555555]">{post.publishDate}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
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
