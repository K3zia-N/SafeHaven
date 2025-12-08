import type { CommunityPost } from './types';

export const mockPosts: CommunityPost[] = [
  {
    id: 1,
    author: 'AnonymousCat',
    title: "It gets better, I promise.",
    content: "Just wanted to share a moment of hope. I left my abusive situation a year ago today. It was the hardest thing I've ever done, but life is so much more peaceful now. For anyone struggling, please know there is light on the other side. You are stronger than you think.",
    timestamp: "2 days ago",
    replies: 12,
  },
  {
    id: 2,
    author: 'AnonymousSun',
    title: "How did you deal with friends who didn't understand?",
    content: "I'm having a hard time with my social circle. Some friends just don't get why I can't 'just leave' or why I'm so affected by emotional abuse. It feels isolating. Any advice on how to handle this?",
    timestamp: "1 day ago",
    replies: 8,
  },
  {
    id: 3,
    author: 'AnonymousSparrow',
    title: "Small victory: I set a boundary today!",
    content: "It was terrifying, but I finally said 'no' to a demand that made me uncomfortable. They didn't take it well, but I stood my ground. Feeling shaky but proud. It's a small step, but it feels huge.",
    timestamp: "18 hours ago",
    replies: 23,
  },
  {
    id: 4,
    author: 'AnonymousRiver',
    title: "Question about finding a therapist who specializes in trauma",
    content: "I'm looking for a therapist but want to make sure they are experienced with trauma and GBV. Has anyone had good experiences with specific types of therapy (like EMDR) or have tips for finding the right person?",
    timestamp: "5 hours ago",
    replies: 5,
  }
];
