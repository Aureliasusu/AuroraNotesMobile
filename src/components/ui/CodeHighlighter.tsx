import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';

interface CodeHighlighterProps {
  code: string;
  language?: string;
  style?: any;
}

export const CodeHighlighter: React.FC<CodeHighlighterProps> = ({
  code,
  language = 'javascript',
  style,
}) => {
  const getLanguageColor = (lang: string) => {
    const colors: { [key: string]: string } = {
      javascript: '#f7df1e',
      typescript: '#3178c6',
      python: '#3776ab',
      java: '#ed8b00',
      cpp: '#00599c',
      c: '#a8b9cc',
      html: '#e34f26',
      css: '#1572b6',
      json: '#000000',
      sql: '#336791',
      bash: '#4eaa25',
      default: '#6b7280',
    };
    return colors[lang.toLowerCase()] || colors.default;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.languageContainer}>
          <View 
            style={[
              styles.languageDot, 
              { backgroundColor: getLanguageColor(language) }
            ]} 
          />
          <Text style={styles.languageText}>{language.toUpperCase()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.copyButton}
          onPress={() => {
            // Copy to clipboard functionality would go here
            console.log('Copy code to clipboard');
          }}
        >
          <Text style={styles.copyButtonText}>Copy</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        style={styles.codeContainer}
      >
        <Text style={styles.codeText}>
          {code}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  languageText: {
    color: '#d4d4d4',
    fontSize: 12,
    fontWeight: '600',
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#404040',
    borderRadius: 4,
  },
  copyButtonText: {
    color: '#d4d4d4',
    fontSize: 12,
    fontWeight: '500',
  },
  codeContainer: {
    maxHeight: 300,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    lineHeight: 20,
    color: '#d4d4d4',
    padding: 16,
    backgroundColor: '#1e1e1e',
  },
});