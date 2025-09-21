
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GeneratedContent } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface ContentCardProps {
  content: GeneratedContent;
  onPress: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onPress,
}) => {
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'notes':
        return 'document-text';
      case 'flashcards':
        return 'layers';
      case 'quiz':
        return 'help-circle';
      case 'game':
        return 'game-controller';
      default:
        return 'document';
    }
  };

  const getContentColor = (type: string) => {
    switch (type) {
      case 'notes':
        return colors.primary;
      case 'flashcards':
        return colors.secondary;
      case 'quiz':
        return colors.accent;
      case 'game':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[commonStyles.card, styles.card]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getContentColor(content.type) + '20' }]}>
          <Icon
            name={getContentIcon(content.type)}
            size={24}
            color={getContentColor(content.type)}
          />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {content.title}
          </Text>
          <Text style={styles.type}>
            {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
          </Text>
        </View>

        <View style={styles.arrow}>
          <Icon
            name="chevron-forward"
            size={16}
            color={colors.textSecondary}
          />
        </View>
      </View>
      
      <Text style={styles.date}>
        Generated {content.createdAt.toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  type: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  arrow: {
    marginLeft: 8,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default ContentCard;
