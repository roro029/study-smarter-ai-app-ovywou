
export interface Subject {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  isFolder: boolean;
}

export interface StudyFile {
  id: string;
  name: string;
  type: 'pdf' | 'pptx' | 'video' | 'audio' | 'recording' | 'image' | 'document';
  uri: string;
  size: number;
  subjectId: string;
  createdAt: Date;
  mimeType?: string;
}

export interface GeneratedContent {
  id: string;
  subjectId: string;
  type: 'notes' | 'flashcards' | 'quiz' | 'game';
  title: string;
  content: any;
  createdAt: Date;
  sourceFiles: string[]; // File IDs that were used to generate this content
}

export interface ChatMessage {
  id: string;
  subjectId: string;
  message: string;
  response: string;
  timestamp: Date;
}

export interface FlashCard {
  id: string;
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface StudyNotes {
  id: string;
  title: string;
  content: string;
  sections: {
    title: string;
    content: string;
  }[];
}
