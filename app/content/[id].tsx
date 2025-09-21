
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useStudyApp } from '../../hooks/useStudyApp';
import Icon from '../../components/Icon';
import Button from '../../components/Button';

export default function ContentScreen() {
  const { id } = useLocalSearchParams();
  const contentId = Array.isArray(id) ? id[0] : id;

  const { generatedContent } = useStudyApp();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const content = generatedContent.find(c => c.id === contentId);

  if (!content) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.centerContent]}>
          <Text style={commonStyles.text}>Content not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderNotes = () => (
    <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.contentTitle}>{content.content.title}</Text>
      <Text style={styles.contentText}>{content.content.content}</Text>
      
      {content.content.sections?.map((section: any, index: number) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionContent}>{section.content}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderFlashcards = () => {
    const cards = content.content;
    const currentCard = cards[currentCardIndex];

    return (
      <View style={styles.flashcardContainer}>
        <View style={styles.flashcardHeader}>
          <Text style={styles.cardCounter}>
            {currentCardIndex + 1} of {cards.length}
          </Text>
        </View>

        <View style={styles.flashcard}>
          <TouchableOpacity
            style={styles.cardContent}
            onPress={() => setShowAnswer(!showAnswer)}
          >
            <Text style={styles.cardLabel}>
              {showAnswer ? 'Answer' : 'Question'}
            </Text>
            <Text style={styles.cardText}>
              {showAnswer ? currentCard.answer : currentCard.question}
            </Text>
            <Text style={styles.tapHint}>
              Tap to {showAnswer ? 'see question' : 'reveal answer'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.flashcardControls}>
          <Button
            text="Previous"
            onPress={() => {
              setCurrentCardIndex(Math.max(0, currentCardIndex - 1));
              setShowAnswer(false);
            }}
            style={[styles.controlButton, { opacity: currentCardIndex === 0 ? 0.5 : 1 }]}
            textStyle={styles.controlButtonText}
          />
          <Button
            text="Next"
            onPress={() => {
              setCurrentCardIndex(Math.min(cards.length - 1, currentCardIndex + 1));
              setShowAnswer(false);
            }}
            style={[styles.controlButton, { opacity: currentCardIndex === cards.length - 1 ? 0.5 : 1 }]}
            textStyle={styles.controlButtonText}
          />
        </View>
      </View>
    );
  };

  const renderQuiz = () => {
    const quiz = content.content;
    
    if (showResults) {
      const correctAnswers = quiz.questions.filter((q: any, index: number) => 
        quizAnswers[q.id] === q.correctAnswer
      ).length;
      const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);

      return (
        <View style={styles.quizResultsContainer}>
          <View style={styles.resultsHeader}>
            <Icon name="trophy" size={48} color={colors.accent} />
            <Text style={styles.resultsTitle}>Quiz Complete!</Text>
            <Text style={styles.resultsScore}>
              {correctAnswers} out of {quiz.questions.length} correct
            </Text>
            <Text style={styles.resultsPercentage}>{percentage}%</Text>
          </View>

          <ScrollView style={styles.resultsDetails} showsVerticalScrollIndicator={false}>
            {quiz.questions.map((question: any, index: number) => {
              const userAnswer = quizAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <View key={question.id} style={styles.resultItem}>
                  <Text style={styles.resultQuestion}>
                    {index + 1}. {question.question}
                  </Text>
                  <Text style={[
                    styles.resultAnswer,
                    { color: isCorrect ? colors.success : colors.error }
                  ]}>
                    Your answer: {question.options[userAnswer]} {isCorrect ? '✓' : '✗'}
                  </Text>
                  {!isCorrect && (
                    <Text style={[styles.resultAnswer, { color: colors.success }]}>
                      Correct answer: {question.options[question.correctAnswer]}
                    </Text>
                  )}
                  {question.explanation && (
                    <Text style={styles.resultExplanation}>{question.explanation}</Text>
                  )}
                </View>
              );
            })}
          </ScrollView>

          <Button
            text="Retake Quiz"
            onPress={() => {
              setQuizAnswers({});
              setShowResults(false);
            }}
            style={styles.retakeButton}
            textStyle={styles.retakeButtonText}
          />
        </View>
      );
    }

    return (
      <ScrollView style={styles.quizContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.quizTitle}>{quiz.title}</Text>
        
        {quiz.questions.map((question: any, index: number) => (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {index + 1}. {question.question}
            </Text>
            
            {question.options.map((option: string, optionIndex: number) => (
              <TouchableOpacity
                key={optionIndex}
                style={[
                  styles.optionButton,
                  quizAnswers[question.id] === optionIndex && styles.selectedOption
                ]}
                onPress={() => setQuizAnswers(prev => ({
                  ...prev,
                  [question.id]: optionIndex
                }))}
              >
                <Text style={[
                  styles.optionText,
                  quizAnswers[question.id] === optionIndex && styles.selectedOptionText
                ]}>
                  {String.fromCharCode(65 + optionIndex)}. {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <Button
          text="Submit Quiz"
          onPress={() => setShowResults(true)}
          style={[
            styles.submitButton,
            { opacity: Object.keys(quizAnswers).length === quiz.questions.length ? 1 : 0.5 }
          ]}
          textStyle={styles.submitButtonText}
        />
      </ScrollView>
    );
  };

  const renderGame = () => (
    <View style={styles.gameContainer}>
      <Text style={styles.gameTitle}>{content.content.title}</Text>
      <Text style={styles.gameDescription}>
        This is a {content.content.type} game based on your study materials.
      </Text>
      
      {content.content.pairs?.map((pair: any, index: number) => (
        <View key={index} style={styles.gamePair}>
          <View style={styles.gameCard}>
            <Text style={styles.gameCardText}>{pair.term}</Text>
          </View>
          <Icon name="arrow-forward" size={20} color={colors.textSecondary} />
          <View style={styles.gameCard}>
            <Text style={styles.gameCardText}>{pair.definition}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (content.type) {
      case 'notes':
        return renderNotes();
      case 'flashcards':
        return renderFlashcards();
      case 'quiz':
        return renderQuiz();
      case 'game':
        return renderGame();
      default:
        return <Text>Unknown content type</Text>;
    }
  };

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
            {content.title}
          </Text>
        </View>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = {
  backButton: {
    padding: 4,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  flashcardContainer: {
    flex: 1,
    padding: 20,
  },
  flashcardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardCounter: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  flashcard: {
    flex: 1,
    marginBottom: 20,
  },
  cardContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  cardLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  cardText: {
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 24,
  },
  tapHint: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  flashcardControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  controlButton: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
  },
  controlButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  quizContainer: {
    flex: 1,
    padding: 20,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  optionButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    marginTop: 24,
    marginBottom: 40,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  quizResultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  resultsScore: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  resultsPercentage: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.accent,
  },
  resultsDetails: {
    flex: 1,
    marginBottom: 20,
  },
  resultItem: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  resultAnswer: {
    fontSize: 14,
    marginBottom: 4,
  },
  resultExplanation: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
  },
  retakeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
  },
  retakeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  gameContainer: {
    flex: 1,
    padding: 20,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  gameDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  gamePair: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  gameCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gameCardText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
};
