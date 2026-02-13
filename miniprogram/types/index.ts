export interface Pet {
  _id?: string;
  name: string;
  species?: string;
  breed?: string;
  birthday?: string;
}

export interface PostDraft {
  petId: string;
  content: string;
  tags: string[];
  imageFileIds: string[];
}

export interface Reminder {
  _id?: string;
  petId: string;
  title: string;
  type: 'birthday' | 'vaccine' | 'deworming' | 'cleaning' | 'custom';
  nextDueAt: string;
}
