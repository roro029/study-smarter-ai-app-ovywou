
import { useState, useEffect } from 'react';
import { Subject, StudyFile, GeneratedContent, ChatMessage } from '../types';
import { useStorage } from './useStorage';
import uuid from 'react-native-uuid';

export const useStudyApp = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [files, setFiles] = useState<StudyFile[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const storage = useStorage();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [loadedSubjects, loadedFiles, loadedContent, loadedChat] = await Promise.all([
        storage.loadSubjects(),
        storage.loadFiles(),
        storage.loadGeneratedContent(),
        storage.loadChatHistory(),
      ]);

      setSubjects(loadedSubjects);
      setFiles(loadedFiles);
      setGeneratedContent(loadedContent);
      setChatHistory(loadedChat);
      console.log('All data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async (name: string, parentId?: string) => {
    const newSubject: Subject = {
      id: uuid.v4() as string,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId,
      isFolder: true,
    };

    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    await storage.saveSubjects(updatedSubjects);
    console.log('Subject created:', newSubject.name);
    return newSubject;
  };

  const deleteSubject = async (subjectId: string) => {
    // Delete all files in this subject
    const subjectFiles = files.filter(file => file.subjectId === subjectId);
    const updatedFiles = files.filter(file => file.subjectId !== subjectId);
    
    // Delete all generated content for this subject
    const updatedContent = generatedContent.filter(content => content.subjectId !== subjectId);
    
    // Delete all chat history for this subject
    const updatedChat = chatHistory.filter(chat => chat.subjectId !== subjectId);
    
    // Delete the subject and any subfolders
    const updatedSubjects = subjects.filter(subject => 
      subject.id !== subjectId && subject.parentId !== subjectId
    );

    setSubjects(updatedSubjects);
    setFiles(updatedFiles);
    setGeneratedContent(updatedContent);
    setChatHistory(updatedChat);

    await Promise.all([
      storage.saveSubjects(updatedSubjects),
      storage.saveFiles(updatedFiles),
      storage.saveGeneratedContent(updatedContent),
      storage.saveChatHistory(updatedChat),
    ]);

    console.log('Subject deleted:', subjectId);
  };

  const addFile = async (file: Omit<StudyFile, 'id' | 'createdAt'>) => {
    const newFile: StudyFile = {
      ...file,
      id: uuid.v4() as string,
      createdAt: new Date(),
    };

    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    await storage.saveFiles(updatedFiles);
    console.log('File added:', newFile.name);
    return newFile;
  };

  const deleteFile = async (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    await storage.saveFiles(updatedFiles);
    console.log('File deleted:', fileId);
  };

  const generateContent = async (subjectId: string, type: 'notes' | 'flashcards' | 'quiz' | 'game') => {
    const subjectFiles = files.filter(file => file.subjectId === subjectId);
    
    if (subjectFiles.length === 0) {
      console.log('No files found for content generation');
      return null;
    }

    // Simulate AI content generation
    let content: any;
    let title: string;

    switch (type) {
      case 'notes':
        title = 'Study Notes';
        content = {
          title: 'Generated Study Notes',
          content: 'These are AI-generated study notes based on your uploaded files.',
          sections: [
            {
              title: 'Key Concepts',
              content: 'Important concepts extracted from your study materials.'
            },
            {
              title: 'Summary',
              content: 'A comprehensive summary of the main topics covered.'
            }
          ]
        };
        break;
      case 'flashcards':
        title = 'Flashcards';
        content = [
          { id: '1', question: 'What is the main topic?', answer: 'Based on your uploaded content' },
          { id: '2', question: 'Key concept 1?', answer: 'Important information from your files' },
          { id: '3', question: 'Key concept 2?', answer: 'Additional insights from your materials' }
        ];
        break;
      case 'quiz':
        title = 'Practice Quiz';
        content = {
          title: 'Practice Quiz',
          questions: [
            {
              id: '1',
              question: 'What is the main concept discussed in your materials?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 0,
              explanation: 'This is based on the content from your uploaded files.'
            }
          ]
        };
        break;
      case 'game':
        title = 'Study Game';
        content = {
          type: 'matching',
          title: 'Match the Concepts',
          pairs: [
            { term: 'Concept 1', definition: 'Definition from your materials' },
            { term: 'Concept 2', definition: 'Another definition from your files' }
          ]
        };
        break;
    }

    const newContent: GeneratedContent = {
      id: uuid.v4() as string,
      subjectId,
      type,
      title,
      content,
      createdAt: new Date(),
      sourceFiles: subjectFiles.map(file => file.id),
    };

    const updatedContent = [...generatedContent, newContent];
    setGeneratedContent(updatedContent);
    await storage.saveGeneratedContent(updatedContent);
    console.log('Content generated:', type);
    return newContent;
  };

  const addChatMessage = async (subjectId: string, message: string) => {
    // Simulate AI response
    const response = `This is an AI response to your question: "${message}". Based on your study materials, here's what I can tell you...`;

    const newMessage: ChatMessage = {
      id: uuid.v4() as string,
      subjectId,
      message,
      response,
      timestamp: new Date(),
    };

    const updatedChat = [...chatHistory, newMessage];
    setChatHistory(updatedChat);
    await storage.saveChatHistory(updatedChat);
    console.log('Chat message added');
    return newMessage;
  };

  const getSubjectFiles = (subjectId: string) => {
    return files.filter(file => file.subjectId === subjectId);
  };

  const getSubjectContent = (subjectId: string) => {
    return generatedContent.filter(content => content.subjectId === subjectId);
  };

  const getSubjectChat = (subjectId: string) => {
    return chatHistory.filter(chat => chat.subjectId === subjectId);
  };

  const getSubfolders = (parentId?: string) => {
    return subjects.filter(subject => subject.parentId === parentId);
  };

  const getRootSubjects = () => {
    return subjects.filter(subject => !subject.parentId);
  };

  return {
    subjects,
    files,
    generatedContent,
    chatHistory,
    loading,
    createSubject,
    deleteSubject,
    addFile,
    deleteFile,
    generateContent,
    addChatMessage,
    getSubjectFiles,
    getSubjectContent,
    getSubjectChat,
    getSubfolders,
    getRootSubjects,
    loadAllData,
  };
};
