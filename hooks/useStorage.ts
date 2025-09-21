
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subject, StudyFile, GeneratedContent, ChatMessage } from '../types';

const STORAGE_KEYS = {
  SUBJECTS: 'study_app_subjects',
  FILES: 'study_app_files',
  GENERATED_CONTENT: 'study_app_generated_content',
  CHAT_HISTORY: 'study_app_chat_history',
};

export const useStorage = () => {
  const saveSubjects = async (subjects: Subject[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
      console.log('Subjects saved successfully');
    } catch (error) {
      console.error('Error saving subjects:', error);
    }
  };

  const loadSubjects = async (): Promise<Subject[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (data) {
        const subjects = JSON.parse(data);
        return subjects.map((subject: any) => ({
          ...subject,
          createdAt: new Date(subject.createdAt),
          updatedAt: new Date(subject.updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading subjects:', error);
      return [];
    }
  };

  const saveFiles = async (files: StudyFile[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
      console.log('Files saved successfully');
    } catch (error) {
      console.error('Error saving files:', error);
    }
  };

  const loadFiles = async (): Promise<StudyFile[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FILES);
      if (data) {
        const files = JSON.parse(data);
        return files.map((file: any) => ({
          ...file,
          createdAt: new Date(file.createdAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading files:', error);
      return [];
    }
  };

  const saveGeneratedContent = async (content: GeneratedContent[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GENERATED_CONTENT, JSON.stringify(content));
      console.log('Generated content saved successfully');
    } catch (error) {
      console.error('Error saving generated content:', error);
    }
  };

  const loadGeneratedContent = async (): Promise<GeneratedContent[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.GENERATED_CONTENT);
      if (data) {
        const content = JSON.parse(data);
        return content.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading generated content:', error);
      return [];
    }
  };

  const saveChatHistory = async (history: ChatMessage[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history));
      console.log('Chat history saved successfully');
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const loadChatHistory = async (): Promise<ChatMessage[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (data) {
        const history = JSON.parse(data);
        return history.map((message: any) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return {
    saveSubjects,
    loadSubjects,
    saveFiles,
    loadFiles,
    saveGeneratedContent,
    loadGeneratedContent,
    saveChatHistory,
    loadChatHistory,
    clearAllData,
  };
};
