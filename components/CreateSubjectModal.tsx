
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Button from './Button';
import SimpleBottomSheet from './BottomSheet';

interface CreateSubjectModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateSubject: (name: string) => void;
  parentSubjectName?: string;
}

const CreateSubjectModal: React.FC<CreateSubjectModalProps> = ({
  isVisible,
  onClose,
  onCreateSubject,
  parentSubjectName,
}) => {
  const [subjectName, setSubjectName] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleCreate = () => {
    if (subjectName.trim()) {
      onCreateSubject(subjectName.trim());
      setSubjectName('');
      onClose();
    } else {
      Alert.alert('Error', 'Please enter a subject name');
    }
  };

  const handleClose = () => {
    setSubjectName('');
    setIsFocused(false);
    onClose();
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={handleClose}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Create New {parentSubjectName ? 'Folder' : 'Subject'}
        </Text>
        
        {parentSubjectName && (
          <Text style={styles.subtitle}>
            in "{parentSubjectName}"
          </Text>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {parentSubjectName ? 'Folder' : 'Subject'} Name
          </Text>
          <TextInput
            style={[
              commonStyles.input,
              styles.input,
              isFocused && commonStyles.inputFocused
            ]}
            value={subjectName}
            onChangeText={setSubjectName}
            placeholder={`Enter ${parentSubjectName ? 'folder' : 'subject'} name`}
            placeholderTextColor={colors.textSecondary}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoFocus
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            text="Cancel"
            onPress={handleClose}
            style={[styles.button, styles.cancelButton]}
            textStyle={styles.cancelButtonText}
          />
          <Button
            text="Create"
            onPress={handleCreate}
            style={[styles.button, styles.createButton]}
            textStyle={styles.createButtonText}
          />
        </View>
      </View>
    </SimpleBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
  },
  cancelButton: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
  },
  createButton: {
    backgroundColor: colors.primary,
  },
  createButtonText: {
    color: 'white',
  },
});

export default CreateSubjectModal;
