
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useStudyApp } from '../../hooks/useStudyApp';
import Icon from '../../components/Icon';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const subjectId = Array.isArray(id) ? id[0] : id;

  const { subjects, addChatMessage, getSubjectChat } = useStudyApp();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const subject = subjects.find(s => s.id === subjectId);
  const chatHistory = getSubjectChat(subjectId);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chatHistory.length]);

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    const userMessage = message.trim();
    setMessage('');
    setSending(true);

    try {
      await addChatMessage(subjectId, userMessage);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
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
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={commonStyles.headerTitle} numberOfLines={1}>
              AI Assistant
            </Text>
            <Text style={styles.subjectName} numberOfLines={1}>
              {subject.name}
            </Text>
          </View>
        </View>
        <View style={styles.statusIndicator}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {chatHistory.length === 0 ? (
            <View style={styles.welcomeContainer}>
              <View style={styles.aiAvatar}>
                <Icon name="sparkles" size={32} color={colors.primary} />
              </View>
              <Text style={styles.welcomeTitle}>AI Study Assistant</Text>
              <Text style={styles.welcomeText}>
                Ask me anything about your study materials in "{subject.name}". 
                I can help explain concepts, create summaries, or answer questions based on your uploaded files.
              </Text>
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Try asking:</Text>
                {[
                  "Summarize the main concepts",
                  "Create a study plan",
                  "Explain this topic in simple terms",
                  "What are the key points to remember?"
                ].map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionButton}
                    onPress={() => setMessage(suggestion)}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            chatHistory.map((chat) => (
              <View key={chat.id} style={styles.messageGroup}>
                {/* User Message */}
                <View style={styles.userMessageContainer}>
                  <View style={styles.userMessage}>
                    <Text style={styles.userMessageText}>{chat.message}</Text>
                  </View>
                </View>

                {/* AI Response */}
                <View style={styles.aiMessageContainer}>
                  <View style={styles.aiAvatar}>
                    <Icon name="sparkles" size={16} color={colors.primary} />
                  </View>
                  <View style={styles.aiMessage}>
                    <Text style={styles.aiMessageText}>{chat.response}</Text>
                    <Text style={styles.messageTime}>
                      {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}

          {sending && (
            <View style={styles.aiMessageContainer}>
              <View style={styles.aiAvatar}>
                <Icon name="sparkles" size={16} color={colors.primary} />
              </View>
              <View style={styles.aiMessage}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Ask me anything about your study materials..."
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: message.trim() && !sending ? 1 : 0.5 }
              ]}
              onPress={handleSendMessage}
              disabled={!message.trim() || sending}
            >
              <Icon name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  backButton: {
    padding: 4,
  },
  subjectName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  aiAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  suggestionsContainer: {
    width: '100%',
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  suggestionButton: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.primary,
  },
  messageGroup: {
    marginBottom: 24,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  userMessage: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    maxWidth: '80%',
  },
  userMessageText: {
    fontSize: 16,
    color: 'white',
  },
  aiMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aiMessage: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    maxWidth: '80%',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiMessageText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textSecondary,
    marginRight: 4,
  },
  inputContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
};
