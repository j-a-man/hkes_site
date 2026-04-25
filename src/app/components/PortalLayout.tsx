import { Link, useLocation } from 'react-router';
import { LayoutDashboard, CheckSquare, Image, Send, DollarSign, Users, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface PortalLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userRole?: string;
}

export default function PortalLayout({ children, userName = 'Jaylin Man', userRole = 'Publicity Chair' }: PortalLayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/portal/dashboard', icon: LayoutDashboard },
    { name: 'Deadlines', path: '/portal/deadlines', icon: CheckSquare },
    { name: 'Graphic Requests', path: '/portal/graphics', icon: Image },
    { name: 'Post Requests', path: '/portal/posts', icon: Send },
    { name: 'Reimbursements', path: '/portal/reimbursements', icon: DollarSign },
    { name: 'Members', path: '/portal/members', icon: Users },
  ];

  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'Publicity Chair': 'bg-purple-500',
      'President': 'bg-[#fa4e5b]',
      'Vice President': 'bg-orange-500',
      'Treasurer': 'bg-green-500',
      'Secretary': 'bg-blue-500',
      'Outreach Chair': 'bg-[#ff7a65]',
    };
    return colors[role] || 'bg-gray-500';
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <img
            src="/merchlogo_designs_(1).png"
            alt="HKES Logo"
            className="h-12 w-auto drop-shadow-md"
          />
          <button
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-10 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ffbba1] to-[#fa4e5b] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold tracking-wider">{userName.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">{userName}</p>
              <p className={`text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block ${getRoleBadgeColor(userRole)} text-white font-semibold tracking-wider uppercase`}>
                {userRole}
              </p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium ${isActive
                    ? 'bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white shadow-[0_4px_15px_rgba(250,78,91,0.3)] translate-x-1'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/10">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-[#fa4e5b] rounded-xl transition-colors font-medium"
        >
          <LogOut size={20} />
          <span>Exit Portal</span>
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-['Poppins']">

      {/* Mobile Header Overlay to show Hamburger */}
      <div className="lg:hidden fixed top-0 w-full h-16 bg-white/90 backdrop-blur-md z-40 border-b border-gray-100 flex items-center px-4 shadow-sm">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-[#fa4e5b] hover:bg-red-50 rounded-lg transition-colors"
        >
          <Menu size={28} />
        </button>
        <span className="ml-4 font-bold text-gray-800 tracking-wider">HKES PORTAL</span>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[45] transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-[#1a1b1e] text-white flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen lg:ml-72 pt-16 lg:pt-0 bg-[#FFF8F6]">
        <div className="max-w-6xl mx-auto p-4 sm:p-8 lg:p-12 w-full h-full min-h-screen flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
