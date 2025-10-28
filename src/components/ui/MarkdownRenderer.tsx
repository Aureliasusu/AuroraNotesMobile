import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { CodeHighlighter } from './CodeHighlighter';
import { colors } from '../../constants/colors';

interface MarkdownRendererProps {
  content: string;
  style?: any;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  style,
}) => {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let codeBlock = '';
    let inCodeBlock = false;
    let codeLanguage = '';

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <CodeHighlighter
              key={`code-${index}`}
              code={codeBlock.trim()}
              language={codeLanguage}
            />
          );
          codeBlock = '';
          inCodeBlock = false;
          codeLanguage = '';
        } else {
          // Start code block
          codeLanguage = line.replace('```', '').trim() || 'text';
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlock += line + '\n';
        return;
      }

      // Handle headers
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)?.[0].length || 1;
        const headerText = line.replace(/^#+\s*/, '');
        elements.push(
          <Text key={`header-${index}`} style={[styles.header, styles[`h${level}` as keyof typeof styles]]}>
            {headerText}
          </Text>
        );
        return;
      }

      // Handle lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const listText = line.replace(/^[-*]\s*/, '');
        elements.push(
          <View key={`list-${index}`} style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listText}>{listText}</Text>
          </View>
        );
        return;
      }

      // Handle bold and italic
      let processedLine = line;
      const parts: React.ReactNode[] = [];
      let partIndex = 0;

      // Process bold text
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, (_match, boldText) => {
        const key = `bold-${index}-${partIndex++}`;
        parts.push(
          <Text key={key} style={styles.bold}>
            {boldText}
          </Text>
        );
        return `__BOLD_${parts.length - 1}__`;
      });

      // Process italic text
      processedLine = processedLine.replace(/\*(.*?)\*/g, (_match, italicText) => {
        const key = `italic-${index}-${partIndex++}`;
        parts.push(
          <Text key={key} style={styles.italic}>
            {italicText}
          </Text>
        );
        return `__ITALIC_${parts.length - 1}__`;
      });

      // Process inline code
      processedLine = processedLine.replace(/`(.*?)`/g, (_match, inlineCode) => {
        const key = `code-${index}-${partIndex++}`;
        parts.push(
          <Text key={key} style={styles.inlineCode}>
            {inlineCode}
          </Text>
        );
        return `__CODE_${parts.length - 1}__`;
      });

      // Process links
      processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, linkLabel, _url) => {
        const key = `link-${index}-${partIndex++}`;
        parts.push(
          <Text key={key} style={styles.link}>
            {linkLabel}
          </Text>
        );
        return `__LINK_${parts.length - 1}__`;
      });

      // Split by placeholders and create final text
      const finalParts = processedLine.split(/(__\w+_\d+__)/).map((part) => {
        if (part.match(/__\w+_\d+__/)) {
          const matchIndex = parseInt(part.match(/\d+/)?.[0] || '0', 10);
          return parts[matchIndex] || part;
        }
        return part;
      });

      if (line.trim()) {
        elements.push(
          <Text key={`text-${index}`} style={styles.paragraph}>
            {finalParts}
          </Text>
        );
      } else {
        elements.push(<View key={`space-${index}`} style={styles.paragraphSpacing} />);
      }
    });

    return elements;
  };

  return (
    <ScrollView style={[styles.container, style]}>
      {parseMarkdown(content)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontWeight: 'bold',
    marginVertical: 8,
    color: 'colors.text.primary',
  },
  h1: {
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  h2: {
    fontSize: 20,
    marginTop: 12,
    marginBottom: 6,
  },
  h3: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 4,
  },
  h4: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  h5: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 2,
  },
  h6: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: 'colors.text.secondary',
    marginBottom: 8,
  },
  paragraphSpacing: {
    height: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: 'colors.text.primary',
  },
  italic: {
    fontStyle: 'italic',
    color: 'colors.text.primary',
  },
  inlineCode: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    backgroundColor: 'colors.gray[100]',
    color: 'colors.error[500]',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  link: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: 8,
  },
  listBullet: {
    fontSize: 16,
    color: 'colors.text.tertiary',
    marginRight: 8,
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: 'colors.text.secondary',
  },
});