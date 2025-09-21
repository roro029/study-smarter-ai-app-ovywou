
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { useStudyApp } from '../../hooks/useStudyApp';
import FileCard from '../../components/FileCard';
import ContentCard from '../../components/ContentCard';
import CreateSubjectModal from '../../components/CreateSubjectModal';
import FileUploadModal from '../../components/FileUploadModal';
import Icon from '../../components/Icon';
import Button from '../../components/Button';

export default function SubjectScreen() {
  const { id } = useLocalSearchParams();
  const subjectId = Array.isArray(id) ? id[0] : id;

  const {
    subjects,
    addFile,
    deleteFile,
    generateContent,
    getSubjectFiles,
    getSubjectContent,
    getSubfolders,
    createSubject,
  } = useStudyApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

  const subject = subjects.find(s => s.id === subjectId);
  const files = getSubjectFiles(subjectId);
  const content = getSubjectContent(subjectId);
  const subfolders = getSubfolders(subjectId);

  const handleUploadFile = async (fileData: any) => {
    try {
      await addFile({
        ...fileData,
        subjectId,
      });
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to upload file');
    }
  };

  const handleGenerateContent = async (type: 'notes' | 'flashcards' | 'quiz' | 'game') => {
    if (files.length === 0) {
      Alert.alert('No Files', 'Please upload some files first to generate content.');
      return;
    }

    try {
      setGenerating(type);
      await generateContent(subjectId, type);
      console.log(`${type} generated successfully`);
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      Alert.alert('Error', `Failed to generate ${type}`);
    } finally {
      setGenerating(null);
    }
  };

  const handleCreateSubfolder = async (name: string) => {
    try {
      await createSubject(name, subjectId);
      console.log('Subfolder created successfully');
    } catch (error) {
      console.error('Error creating subfolder:', error);
      Alert.alert('Error', 'Failed to create subfolder');
    }
  };

  const handleFileLongPress = (file: any) => {
    Alert.alert(
      'Delete File',
      `Are you sure you want to delete "${file.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteFile(file.id),
        },
      ]
    );
  };

  const handleContentPress = (contentItem: any) => {
    router.push(`/content/${contentItem.id}`);
  };

  const handleChatPress = () => {
    router.push(`/chat/${subjectId}`);
  };

  if (!subject) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.centerContent]}>
          <Text style={commonStyles.text}>Subject not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={[commonStyles.row, { flex: 1 }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Icon name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.headerTitle, { flex: 1, marginLeft: 12 }]} numberOfLines={1}>
            {subject.name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowUploadModal(true)}
          style={styles.headerButton}
        >
          <Icon name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* AI Generation Section */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>AI Study Tools</Text>
          <View style={styles.aiToolsGrid}>
            <Button
              text={generating === 'notes' ? 'Generating...' : 'Generate Notes'}
              onPress={() => handleGenerateContent('notes')}
              style={[styles.aiButton, { backgroundColor: colors.primary + '20' }]}
              textStyle={[styles.aiButtonText, { color: colors.primary }]}
            />
            <Button
              text={generating === 'flashcards' ? 'Generating...' : 'Flashcards'}
              onPress={() => handleGenerateContent('flashcards')}
              style={[styles.aiButton, { backgroundColor: colors.secondary + '20' }]}
              textStyle={[styles.aiButtonText, { color: colors.secondary }]}
            />
            <Button
              text={generating === 'quiz' ? 'Generating...' : 'Quiz'}
              onPress={() => handleGenerateContent('quiz')}
              style={[styles.aiButton, { backgroundColor: colors.accent + '20' }]}
              textStyle={[styles.aiButtonText, { color: colors.accent }]}
            />
            <Button
              text={generating === 'game' ? 'Generating...' : 'Game'}
              onPress={() => handleGenerateContent('game')}
              style={[styles.aiButton, { backgroundColor: colors.warning + '20' }]}
              textStyle={[styles.aiButtonText, { color: colors.warning }]}
            />
          </View>
        </View>

        {/* Generated Content */}
        {content.length > 0 && (
          <View style={commonStyles.section}>
            <Text style={commonStyles.subtitle}>Generated Content</Text>
            {content.map((item) => (
              <ContentCard
                key={item.id}
                content={item}
                onPress={() => handleContentPress(item)}
              />
            ))}
          </View>
        )}

        {/* Files Section */}
        <View style={commonStyles.section}>
          <View style={[commonStyles.row, commonStyles.spaceBetween]}>
            <Text style={commonStyles.subtitle}>Files ({files.length})</Text>
            <TouchableOpacity onPress={() => setShowUploadModal(true)}>
              <Text style={[commonStyles.text, { color: colors.primary }]}>Add Files</Text>
            </TouchableOpacity>
          </View>
          
          {files.length === 0 ? (
            <View style={styles.emptySection}>
              <Icon name="document" size={48} color={colors.textSecondary} />
              <Text style={styles.emptySectionText}>No files uploaded yet</Text>
              <Text style={styles.emptySectionSubtext}>
                Upload study materials to get started
              </Text>
            </View>
          ) : (
            files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onLongPress={() => handleFileLongPress(file)}
              />
            ))
          )}
        </View>

        {/* Subfolders Section */}
        {subfolders.length > 0 && (
          <View style={commonStyles.section}>
            <Text style={commonStyles.subtitle}>Folders</Text>
            {subfolders.map((folder) => (
              <TouchableOpacity
                key={folder.id}
                style={styles.folderItem}
                onPress={() => router.push(`/subject/${folder.id}`)}
              >
                <Icon name="folder" size={24} color={colors.primary} />
                <Text style={styles.folderName}>{folder.name}</Text>
                <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[buttonStyles.fab, styles.chatFab]}
          onPress={handleChatPress}
        >
          <Icon name="chatbubble" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[buttonStyles.fab, styles.folderFab]}
          onPress={() => setShowCreateModal(true)}
        >
          <Icon name="folder" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={buttonStyles.fab}
          onPress={() => setShowUploadModal(true)}
        >
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <CreateSubjectModal
        isVisible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSubject={handleCreateSubfolder}
        parentSubjectName={subject.name}
      />

      <FileUploadModal
        isVisible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadFile={handleUploadFile}
        subjectName={subject.name}
      />
    </SafeAreaView>
  );
}

const styles = {
  backButton: {
    padding: 4,
  },
  headerButton: {
    padding: 8,
  },
  aiToolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  aiButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptySection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptySectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySectionSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  folderName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  chatFab: {
    backgroundColor: colors.secondary,
    marginBottom: 12,
  },
  folderFab: {
    backgroundColor: colors.accent,
    marginBottom: 12,
  },
};
