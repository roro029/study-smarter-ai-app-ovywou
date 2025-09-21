
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StudyFile } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface FileCardProps {
  file: StudyFile;
  onPress?: () => void;
  onLongPress?: () => void;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  onPress,
  onLongPress,
}) => {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'document-text';
      case 'pptx':
        return 'easel';
      case 'video':
        return 'videocam';
      case 'audio':
      case 'recording':
        return 'musical-notes';
      case 'image':
        return 'image';
      default:
        return 'document';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <TouchableOpacity
      style={[commonStyles.fileCard, styles.card]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon
          name={getFileIcon(file.type)}
          size={24}
          color={colors.primary}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {file.name}
        </Text>
        <Text style={styles.subtitle}>
          {file.type.toUpperCase()} • {formatFileSize(file.size)}
        </Text>
        <Text style={styles.date}>
          {file.createdAt.toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.06)',
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});

export default FileCard;
