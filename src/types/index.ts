export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyList {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyItem {
  id: string;
  title: string;
  notes: string | null;
  url: string | null;
  completed: boolean;
  position: number;
  studyListId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyListWithItemCount extends StudyList {
  _count: {
    items: number;
  };
}
