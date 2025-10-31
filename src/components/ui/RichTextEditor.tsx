import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../../constants/colors';

interface RichTextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: any;
}

interface ToolbarButtonProps {
  onPress: () => void;
  icon: string;
  isActive?: boolean;
  title: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  onPress, 
  icon, 
  isActive = false, 
}) => (
  <TouchableOpacity
    style={[styles.toolbarButton, isActive && styles.activeButton]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.toolbarButtonText, isActive && styles.activeButtonText]}>
      {icon}
    </Text>
  </TouchableOpacity>
);

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChangeText,
  placeholder = 'Start writing...',
  style,
}) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  const insertText = (text: string) => {
    const newText = value + text;
    onChangeText(newText);
  };

  const toggleBold = () => {
    if (isBold) {
      insertText('**');
    } else {
      insertText('**');
    }
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    if (isItalic) {
      insertText('*');
    } else {
      insertText('*');
    }
    setIsItalic(!isItalic);
  };

  const toggleCode = () => {
    if (isCode) {
      insertText('`');
    } else {
      insertText('`');
    }
    setIsCode(!isCode);
  };

  const insertCodeBlock = () => {
    const codeBlock = '\n```\n// Enter your code here\n```\n';
    insertText(codeBlock);
  };

  const insertList = () => {
    const listItem = '\n- ';
    insertText(listItem);
  };

  const insertHeader = (level: number) => {
    const header = '\n' + '#'.repeat(level) + ' ';
    insertText(header);
  };

  const insertLink = () => {
    Alert.prompt(
      'Insert Link',
      'Enter URL:',
      (url) => {
        if (url) {
          const link = `[Link Text](${url})`;
          insertText(link);
        }
      }
    );
  };

  const insertImage = () => {
    Alert.prompt(
      'Insert Image',
      'Enter image URL:',
      (url) => {
        if (url) {
          const image = `![Image Description](${url})`;
          insertText(image);
        }
      }
    );
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.toolbar}
        contentContainerStyle={styles.toolbarContent}
      >
        <ToolbarButton
          onPress={toggleBold}
          icon="B"
          isActive={isBold}
          title="Bold"
        />
        <ToolbarButton
          onPress={toggleItalic}
          icon="I"
          isActive={isItalic}
          title="Italic"
        />
        <ToolbarButton
          onPress={toggleCode}
          icon="</>"
          isActive={isCode}
          title="Inline Code"
        />
        <ToolbarButton
          onPress={insertCodeBlock}
          icon="{}"
          title="Code Block"
        />
        <ToolbarButton
          onPress={insertList}
          icon="•"
          title="List"
        />
        <ToolbarButton
          onPress={() => insertHeader(1)}
          icon="H1"
          title="Header 1"
        />
        <ToolbarButton
          onPress={() => insertHeader(2)}
          icon="H2"
          title="Header 2"
        />
        <ToolbarButton
          onPress={insertLink}
          icon="🔗"
          title="Link"
        />
        <ToolbarButton
          onPress={insertImage}
          icon="🖼️"
          title="Image"
        />
      </ScrollView>
      
      <TextInput
        ref={textInputRef}
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline
        textAlignVertical="top"
        scrollEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    backgroundColor: colors.background.primary,
  },
  toolbar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.gray[50],
  },
  toolbarContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  toolbarButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 2,
    borderRadius: 6,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: 'colors.gray[300]',
  },
  activeButton: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  toolbarButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  activeButtonText: {
    color: colors.background.primary,
  },
  textInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.primary,
    minHeight: 200,
  },
});