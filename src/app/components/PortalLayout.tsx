import { Link, useLocation } from 'react-router';
import { LayoutDashboard, CheckSquare, Image, Send, DollarSign, Users, Settings, LogOut } from 'lucide-react';

interface PortalLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userRole?: string;
}

export default function PortalLayout({ children, userName = 'Alex Chen', userRole = 'Publicity Chair' }: PortalLayoutProps) {
  const location = useLocation();

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
      'President': 'bg-[#DE2910]',
      'Vice President': 'bg-orange-500',
      'Treasurer': 'bg-green-500',
      'Secretary': 'bg-blue-500',
      'Outreach Chair': 'bg-pink-500',
    };
    return colors[role] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-[#1A1A1A] text-white flex-shrink-0">
        <div className="p-6">
          <img
            src="/src/imports/merchlogo_designs_(1).png"
            alt="HKES Logo"
            className="h-12 w-12 mb-6"
          />

          <div className="mb-8">
            <div className="w-16 h-16 bg-[#DE2910] rounded-full mb-3 flex items-center justify-center">
              <span className="text-white text-2xl">{userName.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <p className="text-white mb-1">{userName}</p>
            <p className={`text-xs px-2 py-1 rounded-full inline-block ${getRoleBadgeColor(userRole)} text-white`}>
              {userRole}
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#DE2910] text-white'
                      : 'text-gray-400 hover:bg-[#2A2A2A] hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-6 border-t border-[#333333]">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#2A2A2A] hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 bg-[#FFF8F6] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
