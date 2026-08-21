const roleBadgeColors: { [key: string]: string } = {
  President: 'bg-[#DE2910] text-white',
  'Vice President': 'bg-orange-500 text-white',
  Secretary: 'bg-blue-500 text-white',
  Treasurer: 'bg-green-500 text-white',
  'Publicity Chair': 'bg-purple-500 text-white',
  'Outreach Chair': 'bg-pink-500 text-white',
  Historian: 'bg-indigo-500 text-white',
  Member: 'bg-gray-500 text-white',
};

const avatarColors: { [key: string]: string } = {
  President: 'bg-[#DE2910]',
  'Vice President': 'bg-orange-500',
  Secretary: 'bg-blue-500',
  Treasurer: 'bg-green-500',
  'Publicity Chair': 'bg-purple-500',
  'Outreach Chair': 'bg-pink-500',
  Historian: 'bg-indigo-500',
  Member: 'bg-gray-500',
};

export function getRoleBadgeColor(title: string): string {
  return roleBadgeColors[title] || 'bg-gray-500 text-white';
}

export function getAvatarColor(title: string): string {
  return avatarColors[title] || 'bg-gray-500';
}

export function initials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}
