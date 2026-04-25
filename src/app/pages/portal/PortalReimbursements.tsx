import PortalLayout from '../../components/PortalLayout';
import { Upload, DollarSign } from 'lucide-react';

export default function PortalReimbursements() {
  const myReimbursements = [
    { id: 1, date: '2026-04-20', category: 'Event Supplies', amount: 125.50, vendor: 'Party City', status: 'Approved', event: 'Spring Kickoff' },
    { id: 2, date: '2026-04-15', category: 'Food & Beverage', amount: 245.00, vendor: 'Hong Kong Restaurant', status: 'Paid', event: 'Cultural Night' },
    { id: 3, date: '2026-04-10', category: 'Marketing Materials', amount: 85.00, vendor: 'FedEx Office', status: 'Pending', event: 'Lunar New Year' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Approved':
        return 'bg-blue-100 text-blue-700';
      case 'Paid':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200';
    }
  };

  return (
    <PortalLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Reimbursements</h1>
          <p className="text-[#555555]">Submit and track your reimbursement requests</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm mb-6">
              <h2 className="text-2xl mb-6">Submit a Reimbursement</h2>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm">Purchase Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">Category</label>
                    <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]">
                      <option>Event Supplies</option>
                      <option>Food & Beverage</option>
                      <option>Marketing Materials</option>
                      <option>Transportation</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm">Amount ($)</label>
                    <div className="relative">
                      <DollarSign size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" />
                      <input
                        type="number"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">Vendor/Store Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                      placeholder="e.g., Target, Amazon"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm">Description of Purchase</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                    placeholder="What did you purchase and why?"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm">Event This Relates To</label>
                  <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]">
                    <option>Lunar New Year Gala</option>
                    <option>Spring Kickoff</option>
                    <option>Dragon Boat Festival</option>
                    <option>Mid-Autumn Festival</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm">Receipt Upload</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-[#FFF8F6] transition-colors cursor-pointer">
                    <Upload size={32} className="mx-auto mb-2 text-[#555555]" />
                    <p className="text-[#555555] mb-1">Drag and drop your receipt here</p>
                    <p className="text-sm text-[#555555]">or click to browse</p>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm">Payment Method to Reimburse</label>
                  <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910] mb-3">
                    <option>Venmo</option>
                    <option>Zelle</option>
                    <option>Check</option>
                  </select>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                    placeholder="@username or account info"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#DE2910] text-white px-6 py-3 rounded-lg hover:bg-[#C32410] transition-colors"
                >
                  Submit Reimbursement
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#D4A843] to-[#FF9A5C] rounded-2xl p-6 text-white mb-6">
              <h3 className="text-white text-xl mb-3">My Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-white/80 text-sm mb-1">Total Reimbursed</p>
                  <p className="text-3xl">$455.50</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm mb-1">Pending Amount</p>
                  <p className="text-2xl">$85.00</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm mb-1">Total Requests</p>
                  <p className="text-2xl">3</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm">
              <h3 className="mb-4">Reimbursement Tips</h3>
              <ul className="space-y-2 text-sm text-[#555555]">
                <li className="flex items-start gap-2">
                  <span className="text-[#DE2910]">•</span>
                  <span>Submit within 30 days of purchase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DE2910]">•</span>
                  <span>Include clear, legible receipts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DE2910]">•</span>
                  <span>Get pre-approval for purchases over $200</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DE2910]">•</span>
                  <span>Processing takes 5-7 business days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-sm overflow-hidden mt-6">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl">My Reimbursement History</h2>
          </div>
          <table className="w-full">
            <thead className="bg-[#FFF8F6]">
              <tr>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Vendor</th>
                <th className="text-left p-4">Event</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {myReimbursements.map((reimb) => (
                <tr key={reimb.id} className="border-t border-border hover:bg-[#FFF8F6] transition-colors">
                  <td className="p-4 text-sm text-[#555555]">{reimb.date}</td>
                  <td className="p-4 text-sm text-[#555555]">{reimb.category}</td>
                  <td className="p-4">${reimb.amount.toFixed(2)}</td>
                  <td className="p-4 text-sm text-[#555555]">{reimb.vendor}</td>
                  <td className="p-4 text-sm text-[#555555]">{reimb.event}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(reimb.status)}`}>
                      {reimb.status}
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
