import { Search } from 'lucide-react';

export default function Blog() {
  const featuredPost = {
    id: 1,
    category: 'Recap',
    title: 'Spring Semester Kickoff: A Night to Remember',
    author: 'Emily Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    date: 'Apr 15, 2026',
    readTime: '5 min',
    excerpt: 'As the spring semester began, HKES brought together over 200 students for an unforgettable welcome back celebration filled with games, food, and community.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=500&fit=crop'
  };

  const posts = [
    {
      id: 2,
      category: 'Culture',
      title: 'The History of Hong Kong Dim Sum Culture',
      author: 'David Wong',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      date: 'Apr 10, 2026',
      readTime: '8 min',
      excerpt: 'Explore the rich history and traditions behind Hong Kong\'s beloved dim sum culture.',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      category: 'Announcement',
      title: 'Applications Open for Fall 2026 E-Board',
      author: 'Sarah Li',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      date: 'Apr 5, 2026',
      readTime: '3 min',
      excerpt: 'Interested in leadership? Learn about open E-Board positions and how to apply.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      category: 'Culture',
      title: 'Understanding the Significance of the Bauhinia Flower',
      author: 'Michael Tam',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      date: 'Apr 1, 2026',
      readTime: '6 min',
      excerpt: 'The story behind Hong Kong\'s iconic emblem and what it represents.',
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      category: 'Recap',
      title: 'Dragon Boat Festival Highlights',
      author: 'Emily Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      date: 'Mar 28, 2026',
      readTime: '5 min',
      excerpt: 'Relive the excitement of our annual Dragon Boat Festival celebration.',
      image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      category: 'Culture',
      title: 'Cantonese Opera: An Ancient Art Form',
      author: 'David Wong',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      date: 'Mar 20, 2026',
      readTime: '7 min',
      excerpt: 'Discover the beauty and history of traditional Cantonese opera.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    }
  ];

  const recentPosts = posts.slice(0, 3);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Recap':
        return 'bg-[#DE2910] text-white';
      case 'Culture':
        return 'bg-[#D4A843] text-white';
      case 'Announcement':
        return 'bg-[#FF6B6B] text-white';
      default:
        return 'bg-gray-200 text-[#1A1A1A]';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-r from-[#DE2910] to-[#FF6B6B] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl text-white mb-4">HKES Blog</h1>
          <p className="text-white/90">Stories, culture, and updates from our community</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
              <div className="relative">
                <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-96 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs mb-3 ${getCategoryColor(featuredPost.category)}`}>
                    {featuredPost.category}
                  </div>
                  <h2 className="text-4xl mb-3">{featuredPost.title}</h2>
                  <p className="text-white/90 mb-4 max-w-2xl">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4">
                    <img src={featuredPost.authorAvatar} alt={featuredPost.author} className="w-12 h-12 rounded-full border-2 border-white" />
                    <div>
                      <p>{featuredPost.author}</p>
                      <p className="text-sm text-white/80">{featuredPost.date} · {featuredPost.readTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl mb-8">All Posts</h2>
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                      <img src={post.image} alt={post.title} className="w-full h-48 md:h-full object-cover" />
                      <div className="md:col-span-2 p-6">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs mb-3 ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </div>
                        <h3 className="text-2xl mb-3">{post.title}</h3>
                        <p className="text-[#555555] mb-4">{post.excerpt}</p>
                        <div className="flex items-center gap-4">
                          <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full" />
                          <div>
                            <p className="text-sm">{post.author}</p>
                            <p className="text-sm text-[#555555]">{post.date} · {post.readTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="bg-[#FFF8F6] rounded-2xl p-6">
                  <h3 className="mb-4">Search</h3>
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-lg"
                    />
                  </div>
                </div>

                <div className="bg-[#FFF8F6] rounded-2xl p-6">
                  <h3 className="mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-white transition-colors">
                      All Posts
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-white transition-colors">
                      Recaps
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-white transition-colors">
                      Culture
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-white transition-colors">
                      Announcements
                    </button>
                  </div>
                </div>

                <div className="bg-[#FFF8F6] rounded-2xl p-6">
                  <h3 className="mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post.id}>
                        <p className="text-sm mb-1">{post.title}</p>
                        <p className="text-xs text-[#555555]">{post.date}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#DE2910] to-[#FF6B6B] rounded-2xl p-6 text-white">
                  <h3 className="text-white mb-3">Subscribe to Newsletter</h3>
                  <p className="text-sm text-white/90 mb-4">Get updates delivered to your inbox</p>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-4 py-2 rounded-lg mb-3 text-[#1A1A1A]"
                  />
                  <button className="w-full bg-white text-[#DE2910] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
