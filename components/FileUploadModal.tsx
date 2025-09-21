
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { colors, commonStyles } from '../styles/commonStyles';
import Button from './Button';
import SimpleBottomSheet from './BottomSheet';
import Icon from './Icon';

interface FileUploadModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUploadFile: (file: any) => void;
  subjectName: string;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isVisible,
  onClose,
  onUploadFile,
  subjectName,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleDocumentPick = async () => {
    try {
      setUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log('File selected:', file);
        
        // Determine file type based on mimeType or name
        let fileType = 'document';
        if (file.mimeType) {
          if (file.mimeType.includes('pdf')) fileType = 'pdf';
          else if (file.mimeType.includes('presentation') || file.name?.endsWith('.pptx')) fileType = 'pptx';
          else if (file.mimeType.includes('video')) fileType = 'video';
          else if (file.mimeType.includes('audio')) fileType = 'audio';
          else if (file.mimeType.includes('image')) fileType = 'image';
        }

        const fileData = {
          name: file.name || 'Unknown File',
          type: fileType,
          uri: file.uri,
          size: file.size || 0,
          mimeType: file.mimeType,
        };

        onUploadFile(fileData);
        onClose();
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select file');
    } finally {
      setUploading(false);
    }
  };

  const uploadOptions = [
    {
      title: 'Documents & PDFs',
      subtitle: 'Upload study materials, textbooks, papers',
      icon: 'document-text',
      color: colors.primary,
      action: handleDocumentPick,
    },
    {
      title: 'Presentations',
      subtitle: 'PowerPoint, Keynote, Google Slides',
      icon: 'easel',
      color: colors.secondary,
      action: handleDocumentPick,
    },
    {
      title: 'Videos',
      subtitle: 'Lecture recordings, educational videos',
      icon: 'videocam',
      color: colors.accent,
      action: handleDocumentPick,
    },
    {
      title: 'Audio Files',
      subtitle: 'Voice recordings, podcasts, lectures',
      icon: 'musical-notes',
      color: colors.warning,
      action: handleDocumentPick,
    },
    {
      title: 'Images',
      subtitle: 'Screenshots, diagrams, photos',
      icon: 'image',
      color: colors.success,
      action: handleDocumentPick,
    },
  ];

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Upload Files</Text>
        <Text style={styles.subtitle}>to "{subjectName}"</Text>

        <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
          {uploadOptions.map((option, index) => (
            <Button
              key={index}
              text=""
              onPress={option.action}
              style={[styles.optionButton]}
            >
              <View style={styles.optionContent}>
                <View style={[styles.optionIcon, { backgroundColor: option.color + '20' }]}>
                  <Icon name={option.icon} size={24} color={option.color} />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </Button>
          ))}
        </ScrollView>

        <View style={styles.noteContainer}>
          <Icon name="information-circle" size={16} color={colors.textSecondary} />
          <Text style={styles.noteText}>
            Files will be processed by AI to generate study materials
          </Text>
        </View>

        <Button
          text="Cancel"
          onPress={onClose}
          style={styles.cancelButton}
          textStyle={styles.cancelButtonText}
        />
      </View>
    </SimpleBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    maxHeight: 400,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.06)',
    elevation: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  noteText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
  },
  cancelButtonText: {
    color: colors.text,
  },
});

export default FileUploadModal;
