
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Subject } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface SubjectCardProps {
  subject: Subject;
  onPress: () => void;
  onLongPress?: () => void;
  fileCount?: number;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onPress,
  onLongPress,
  fileCount = 0,
}) => {
  return (
    <TouchableOpacity
      style={[commonStyles.folderCard, styles.card]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon
          name="folder"
          size={32}
          color={colors.primary}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {subject.name}
        </Text>
        <Text style={styles.subtitle}>
          {fileCount} {fileCount === 1 ? 'file' : 'files'}
        </Text>
        <Text style={styles.date}>
          Created {subject.createdAt.toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.arrow}>
        <Icon
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  arrow: {
    marginLeft: 8,
  },
});

export default SubjectCard;
