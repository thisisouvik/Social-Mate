export interface Story {
  id: string;
  user: string;
  avatar: string;
  hasStory: boolean;
  isOwn?: boolean;
}

export interface Post {
  id: string;
  user: { id: string; name: string; avatar: string; time: string };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface Comment {
  id: string;
  user: { name: string; avatar: string; time: string };
  content: string;
  likes: number;
  hearts: number;
  replies: Comment[];
  image?: string;
}

export const MOCK_STORIES: Story[] = [
  { id: '0', user: 'Share Story', avatar: '', hasStory: false, isOwn: true },
  { id: '1', user: 'Jone', avatar: 'https://i.pravatar.cc/100?img=11', hasStory: true },
  { id: '2', user: 'Smith', avatar: 'https://i.pravatar.cc/100?img=12', hasStory: true },
  { id: '3', user: 'Kriston', avatar: 'https://i.pravatar.cc/100?img=13', hasStory: true },
  { id: '4', user: 'Ryan', avatar: 'https://i.pravatar.cc/100?img=14', hasStory: true },
  { id: '5', user: 'Alice', avatar: 'https://i.pravatar.cc/100?img=15', hasStory: true },
];

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    user: { id: '2', name: 'Kriston Watshon', avatar: 'https://i.pravatar.cc/100?img=33', time: '08:39 am' },
    content: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Fringilla Natoque Id Aenean.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    likes: 1964, comments: 135, isLiked: false, isBookmarked: false,
  },
  {
    id: '2',
    user: { id: '3', name: 'Alice Cooper', avatar: 'https://i.pravatar.cc/100?img=24', time: '09:15 am' },
    content: 'What a beautiful day! Sharing this amazing view from my morning walk. 🌅',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    likes: 842, comments: 67, isLiked: true, isBookmarked: false,
  },
  {
    id: '3',
    user: { id: '4', name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/100?img=68', time: '10:02 am' },
    content: 'Just launched my new portfolio! It took months of hard work. Check it out and give some feedback! 🚀',
    likes: 3219, comments: 284, isLiked: false, isBookmarked: true,
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    user: { name: 'Kriston Watshon', avatar: 'https://i.pravatar.cc/100?img=33', time: '08:39 am' },
    content: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Fringilla Natoque Id Aenean.',
    likes: 22, hearts: 8,
    replies: [
      {
        id: '1-1',
        user: { name: 'Kriston Watshon', avatar: 'https://i.pravatar.cc/100?img=44', time: '08:39 am' },
        content: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Fringilla Natoque Id Aenean.',
        likes: 2, hearts: 0, replies: [],
      },
    ],
  },
  {
    id: '2',
    user: { name: 'Kriston Watshon', avatar: 'https://i.pravatar.cc/100?img=44', time: '08:39 am' },
    content: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Fringilla Natoque Id Aenean.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    likes: 5, hearts: 2, replies: [],
  },
  {
    id: '3',
    user: { name: 'Sarah Miller', avatar: 'https://i.pravatar.cc/100?img=25', time: '09:12 am' },
    content: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Fringilla Natoque Id Aenean.',
    likes: 12, hearts: 4, replies: [],
  },
];

export const MOCK_FRIENDS = [
  { id: '1', name: 'Sophia Chen', avatar: 'https://i.pravatar.cc/100?img=5', mutualFriends: 12, location: 'New York, USA' },
  { id: '2', name: 'James Wilson', avatar: 'https://i.pravatar.cc/100?img=67', mutualFriends: 8, location: 'London, UK' },
  { id: '3', name: 'Priya Patel', avatar: 'https://i.pravatar.cc/100?img=10', mutualFriends: 5, location: 'Mumbai, India' },
  { id: '4', name: 'Carlos Rodriguez', avatar: 'https://i.pravatar.cc/100?img=56', mutualFriends: 3, location: 'Madrid, Spain' },
  { id: '5', name: 'Emma Thompson', avatar: 'https://i.pravatar.cc/100?img=23', mutualFriends: 15, location: 'Sydney, AU' },
  { id: '6', name: 'Ahmed Hassan', avatar: 'https://i.pravatar.cc/100?img=70', mutualFriends: 2, location: 'Cairo, Egypt' },
];

export const MOCK_GROUPS = [
  { id: '1', name: 'UI/UX Designers', cover: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=200&q=80', members: 45200, isJoined: true, category: 'Design' },
  { id: '2', name: 'React Native Devs', cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=80', members: 32100, isJoined: false, category: 'Technology' },
  { id: '3', name: 'Photography Club', cover: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=200&q=80', members: 18900, isJoined: true, category: 'Hobby' },
  { id: '4', name: 'Digital Marketing', cover: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=200&q=80', members: 28000, isJoined: false, category: 'Business' },
  { id: '5', name: 'Travel Enthusiasts', cover: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&q=80', members: 61000, isJoined: false, category: 'Lifestyle' },
];

export const MOCK_JOBS = [
  { id: '1', title: 'Senior UI/UX Designer', company: 'TechCorp Inc.', location: 'Remote', salary: '$80k–$120k', type: 'Full-time', logo: 'https://i.pravatar.cc/80?img=62', postedAt: '2 hours ago', isBookmarked: false },
  { id: '2', title: 'React Native Developer', company: 'StartupHub', location: 'New York, USA', salary: '$90k–$140k', type: 'Full-time', logo: 'https://i.pravatar.cc/80?img=63', postedAt: '5 hours ago', isBookmarked: true },
  { id: '3', title: 'Product Manager', company: 'Innovation Labs', location: 'San Francisco', salary: '$100k–$160k', type: 'Full-time', logo: 'https://i.pravatar.cc/80?img=64', postedAt: '1 day ago', isBookmarked: false },
  { id: '4', title: 'Frontend Engineer', company: 'WebFlow Agency', location: 'Remote', salary: '$70k–$100k', type: 'Contract', logo: 'https://i.pravatar.cc/80?img=65', postedAt: '2 days ago', isBookmarked: false },
];

export const LIKE_AVATARS = [
  'https://i.pravatar.cc/40?img=1',
  'https://i.pravatar.cc/40?img=2',
  'https://i.pravatar.cc/40?img=3',
  'https://i.pravatar.cc/40?img=4',
  'https://i.pravatar.cc/40?img=5',
  'https://i.pravatar.cc/40?img=6',
];
