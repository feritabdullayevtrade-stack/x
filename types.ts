
export interface FlashCard {
  id: string;
  turkish: string;
  german: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export enum AppCategory {
  DAILY = 'Günlük Hayat',
  TRAVEL = 'Seyahat',
  FOOD = 'Yemek & Mutfak',
  SHOPPING = 'Alışveriş',
  WORK = 'İş Dünyası',
  EMERGENCY = 'Acil Durumlar'
}

export interface AppState {
  cards: FlashCard[];
  currentIndex: number;
  loading: boolean;
  category: AppCategory;
  error: string | null;
}
