
export interface RecentUpdate {
  id: number;
  author: string;
  type: 'Update' | 'Prayer';
  title: string;
  time: string;
  avatar: string;
  image?: string;
}

export interface WorkerFeed {
  id: string;
  name: string;
  updates: string[];
}

export const RECENT_UPDATES: RecentUpdate[] = [
  { 
    id: 1, 
    author: "The Miller Family", 
    type: "Update", 
    title: "The well is finished! 💧", 
    time: "2h ago", 
    avatar: "M", 
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80" 
  },
  { 
    id: 2, 
    author: "Dr. Sarah Smith", 
    type: "Prayer", 
    title: "Urgent request for supplies", 
    time: "1d ago", 
    avatar: "S",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  { 
    id: 3, 
    author: "Clean Water Initiative", 
    type: "Update", 
    title: "Q3 Impact Report Released", 
    time: "3d ago", 
    avatar: "C",
    image: "https://images.unsplash.com/photo-1538300342682-cf57afb97285?fit=crop&w=256&h=256&q=80"
  },
];

export const WORKER_FEEDS: Record<string, WorkerFeed> = {
  "miller": {
    id: "w1",
    name: "The Miller Family",
    updates: [
      "We just finished the community well in Northern Thailand! 500 families now have clean water.",
      "Distributed school supplies to 50 kids in the village school this morning."
    ]
  },
  "smith": {
    id: "w2",
    name: "Dr. Sarah Smith",
    updates: [
      "The mobile clinic reached the remote valley. We treated 120 patients for malaria this week.",
      "Supply shipment arrived safely through customs."
    ]
  },
  "rossi": {
    id: "w5",
    name: "Elena & Marco Rossi",
    updates: [
      "Served 3,000 warm meals at the refugee center this month.",
      "New heating units installed before winter."
    ]
  }
};
