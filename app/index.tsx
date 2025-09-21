
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useStudyApp } from '../hooks/useStudyApp';
import SubjectCard from '../components/SubjectCard';
import CreateSubjectModal from '../components/CreateSubjectModal';
import Icon from '../components/Icon';
import Button from '../components/Button';

export default function HomeScreen() {
  const {
    subjects,
    loading,
    createSubject,
    deleteSubject,
    getRootSubjects,
    getSubjectFiles,
  } = useStudyApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const rootSubjects = getRootSubjects();

  const handleCreateSubject = async (name: string) => {
    try {
      await createSubject(name);
      console.log('Subject created successfully');
    } catch (error) {
      console.error('Error creating subject:', error);
      Alert.alert('Error', 'Failed to create subject');
    }
  };

  const handleSubjectPress = (subjectId: string) => {
    router.push(`/subject/${subjectId}`);
  };

  const handleSubjectLongPress = (subject: any) => {
    Alert.alert(
      'Delete Subject',
      `Are you sure you want to delete "${subject.name}"? This will also delete all files and generated content.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSubject(subject.id),
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.centerContent]}>
          <Text style={commonStyles.text}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Study App</Text>
        <TouchableOpacity
          onPress={() => setShowCreateModal(true)}
          style={styles.headerButton}
        >
          <Icon name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {rootSubjects.length === 0 ? (
          <View style={commonStyles.emptyState}>
            <Icon name="folder-open" size={64} color={colors.textSecondary} />
            <Text style={commonStyles.emptyStateText}>No subjects yet</Text>
            <Text style={commonStyles.emptyStateSubtext}>
              Create your first subject to start organizing your study materials
            </Text>
            <Button
              text="Create Subject"
              onPress={() => setShowCreateModal(true)}
              style={[buttonStyles.primary, styles.createButton]}
              textStyle={styles.createButtonText}
            />
          </View>
        ) : (
          <View style={styles.subjectsContainer}>
            {rootSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                fileCount={getSubjectFiles(subject.id).length}
                onPress={() => handleSubjectPress(subject.id)}
                onLongPress={() => handleSubjectLongPress(subject)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={buttonStyles.fab}
        onPress={() => setShowCreateModal(true)}
      >
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>

      <CreateSubjectModal
        isVisible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSubject={handleCreateSubject}
      />
    </SafeAreaView>
  );
}

const styles = {
  headerButton: {
    padding: 8,
  },
  subjectsContainer: {
    paddingBottom: 100,
  },
  createButton: {
    marginTop: 24,
    paddingHorizontal: 32,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
  },
};
