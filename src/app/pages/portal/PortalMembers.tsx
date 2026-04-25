import PortalLayout from '../../components/PortalLayout';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function PortalMembers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const members = [
    { id: 1, name: 'Katherine Chan', role: 'President', email: 'sli@binghamton.edu', joined: 'Fall 2024', avatar: 'SL' },
    { id: 2, name: 'Dylan Gravina', role: 'Vice President', email: 'mtam@binghamton.edu', joined: 'Fall 2024', avatar: 'MT' },
    { id: 3, name: 'Sharon Lin', role: 'Secretary', email: 'echen@binghamton.edu', joined: 'Spring 2025', avatar: 'EC' },
    { id: 4, name: 'Niki Lam', role: 'Publicity Chair', email: 'achen@binghamton.edu', joined: 'Fall 2024', avatar: 'AC' },
    { id: 5, name: 'Audrey Lee', role: 'Outreach Chair', email: 'dwong@binghamton.edu', joined: 'Spring 2025', avatar: 'DW' },
    { id: 6, name: 'Rain Guan', role: 'Treasurer', email: 'jliu@binghamton.edu', joined: 'Fall 2024', avatar: 'JL' },
    { id: 7, name: 'Jaylin Man', role: 'Historian', email: 'kzhang@binghamton.edu', joined: 'Spring 2025', avatar: 'KZ' },
    { id: 8, name: 'TBD', role: 'Member', email: 'ang@binghamton.edu', joined: 'Fall 2025', avatar: 'AN' },
  ];

  const roles = ['All', 'President', 'Vice President', 'Secretary', 'Treasurer', 'Publicity Chair', 'Outreach Chair', 'Historian', 'Member'];

  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'President': 'bg-[#DE2910] text-white',
      'Vice President': 'bg-orange-500 text-white',
      'Secretary': 'bg-blue-500 text-white',
      'Treasurer': 'bg-green-500 text-white',
      'Publicity Chair': 'bg-purple-500 text-white',
      'Outreach Chair': 'bg-pink-500 text-white',
      'Historian': 'bg-indigo-500 text-white',
      'Member': 'bg-gray-500 text-white',
    };
    return colors[role] || 'bg-gray-500 text-white';
  };

  const getAvatarColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'President': 'bg-[#DE2910]',
      'Vice President': 'bg-orange-500',
      'Secretary': 'bg-blue-500',
      'Treasurer': 'bg-green-500',
      'Publicity Chair': 'bg-purple-500',
      'Outreach Chair': 'bg-pink-500',
      'Historian': 'bg-indigo-500',
      'Member': 'bg-gray-500',
    };
    return colors[role] || 'bg-gray-500';
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <PortalLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Members Directory</h1>
          <p className="text-[#555555]">View and connect with all HKES members</p>
        </div>

        <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search members..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 ${getAvatarColor(member.role)} rounded-full flex items-center justify-center text-white text-2xl mb-4`}>
                  {member.avatar}
                </div>

                <h3 className="text-xl mb-2">{member.name}</h3>

                <span className={`px-3 py-1 rounded-full text-xs mb-3 ${getRoleBadgeColor(member.role)}`}>
                  {member.role}
                </span>

                <p className="text-sm text-[#555555] mb-1">{member.email}</p>
                <p className="text-xs text-[#555555]">Joined {member.joined}</p>

                <div className="flex gap-2 mt-4 w-full">
                  <a
                    href={`mailto:${member.email}`}
                    className="flex-1 bg-[#DE2910] text-white px-4 py-2 rounded-lg hover:bg-[#C32410] transition-colors text-sm text-center"
                  >
                    Email
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-12 shadow-sm text-center">
            <p className="text-[#555555]">No members found matching your search.</p>
          </div>
        )}

        <div className="mt-8 bg-gradient-to-r from-[#DE2910] to-[#FF6B6B] rounded-2xl p-6 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl mb-1">500+</p>
              <p className="text-white/90 text-sm">Total Members</p>
            </div>
            <div>
              <p className="text-3xl mb-1">8</p>
              <p className="text-white/90 text-sm">E-Board Members</p>
            </div>
            <div>
              <p className="text-3xl mb-1">150+</p>
              <p className="text-white/90 text-sm">Active This Semester</p>
            </div>
            <div>
              <p className="text-3xl mb-1">25+</p>
              <p className="text-white/90 text-sm">New Members</p>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
