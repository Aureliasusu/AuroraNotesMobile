import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Platform } from 'react-native';
import { colors } from '../../constants/colors';

interface SimpleCodeHighlighterProps {
  code: string;
  language?: string;
  style?: any;
  showLineNumbers?: boolean;
  theme?: 'dark' | 'light';
}

export const SimpleCodeHighlighter: React.FC<SimpleCodeHighlighterProps> = ({
  code,
  language = 'javascript',
  style,
  showLineNumbers = true,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  
  const getLanguageColor = (lang: string) => {
    const languageColors: { [key: string]: string } = {
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
      php: '#777bb4',
      ruby: '#cc342d',
      go: '#00add8',
      rust: '#dea584',
      swift: '#fa7343',
      kotlin: '#7f52ff',
      default: '#6b7280',
    };
    return languageColors[lang.toLowerCase()] || languageColors.default;
  };

  const copyToClipboard = () => {
    // will add clipboard later
  };

  const formatCode = (codeInput: string, lang: string) => {
    const lines = codeInput.split('\n');
    
    return lines.map((line, index) => {
      const lineNumber = showLineNumbers ? String(index + 1).padStart(3, ' ') : '';
      
      // Simple syntax highlighting
      let highlightedLine = line;
      
      if (lang === 'javascript' || lang === 'typescript') {
        highlightedLine = highlightJavaScript(line);
      } else if (lang === 'python') {
        highlightedLine = highlightPython(line);
      } else if (lang === 'html') {
        highlightedLine = highlightHTML(line);
      } else if (lang === 'css') {
        highlightedLine = highlightCSS(line);
      } else if (lang === 'json') {
        highlightedLine = highlightJSON(line);
      }
      
      return { lineNumber, content: highlightedLine, originalLine: line };
    });
  };

  const highlightJavaScript = (line: string) => {
    // basic syntax highlighting
    return line
      .replace(/\b(const|let|var|function|if|else|for|while|return|import|export|class|interface|type|async|await|try|catch|finally|throw|new|this|super|extends|implements|static|public|private|protected|readonly|abstract|enum|namespace|module|declare|interface|type|as|is|in|of|typeof|instanceof|void|never|any|unknown|boolean|number|string|object|array|symbol|bigint)\b/g, 'KEYWORD:$1:KEYWORD')
      .replace(/\b(true|false|null|undefined|NaN|Infinity)\b/g, 'LITERAL:$1:LITERAL')
      .replace(/"([^"]*)"/g, 'STRING:"$1":STRING')
      .replace(/'([^']*)'/g, 'STRING:\'$1\':STRING')
      .replace(/\b(\d+\.?\d*)\b/g, 'NUMBER:$1:NUMBER')
      .replace(/(\/\/.*$)/g, 'COMMENT:$1:COMMENT')
      .replace(/(\/\*[\s\S]*?\*\/)/g, 'COMMENT:$1:COMMENT')
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, 'FUNCTION:$1(FUNCTION')
      .replace(/[+\-*/%=<>!&|^~]/g, 'OPERATOR:$&:OPERATOR');
  };

  const highlightPython = (line: string) => {
    return line
      .replace(/\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|lambda|and|or|not|in|is|None|True|False|pass|break|continue|raise|assert|del|global|nonlocal)\b/g, 'KEYWORD:$1:KEYWORD')
      .replace(/"([^"]*)"/g, 'STRING:"$1":STRING')
      .replace(/'([^']*)'/g, 'STRING:\'$1\':STRING')
      .replace(/\b(\d+\.?\d*)\b/g, 'NUMBER:$1:NUMBER')
      .replace(/(#.*$)/g, 'COMMENT:$1:COMMENT');
  };

  const highlightHTML = (line: string) => {
    return line
      .replace(/<(\/?[a-zA-Z][^>]*)>/g, 'TAG:<$1>:TAG')
      .replace(/(\w+)=/g, 'ATTRIBUTE:$1=ATTRIBUTE')
      .replace(/"([^"]*)"/g, 'STRING:"$1":STRING')
      .replace(/'([^']*)'/g, 'STRING:\'$1\':STRING');
  };

  const highlightCSS = (line: string) => {
    return line
      .replace(/([.#]?[a-zA-Z][\w-]*)\s*{/g, 'SELECTOR:$1{SELECTOR')
      .replace(/([a-zA-Z-]+)\s*:/g, 'PROPERTY:$1:PROPERTY')
      .replace(/"([^"]*)"/g, 'STRING:"$1":STRING')
      .replace(/'([^']*)'/g, 'STRING:\'$1\':STRING')
      .replace(/\b(\d+\.?\d*[a-zA-Z%]*)\b/g, 'VALUE:$1:VALUE')
      .replace(/(\/\*[\s\S]*?\*\/)/g, 'COMMENT:$1:COMMENT');
  };

  const highlightJSON = (line: string) => {
    return line
      .replace(/"([^"]*)"\s*:/g, 'KEY:"$1":KEY')
      .replace(/"([^"]*)"/g, 'STRING:"$1":STRING')
      .replace(/\b(true|false|null)\b/g, 'LITERAL:$1:LITERAL')
      .replace(/\b(\d+\.?\d*)\b/g, 'NUMBER:$1:NUMBER');
  };

  const renderHighlightedText = (text: string) => {
    const parts = text.split(/(KEYWORD:|LITERAL:|STRING:|NUMBER:|COMMENT:|FUNCTION:|OPERATOR:|TAG:|ATTRIBUTE:|SELECTOR:|PROPERTY:|VALUE:|KEY:)/);
    const elements: React.ReactNode[] = [];
    
    for (let i = 0; i < parts.length; i += 2) {
      const content = parts[i];
      const type = parts[i - 1]?.replace(':', '');
      
      if (content) {
        const tokenStyle = getTokenStyle(type);
        elements.push(
          <Text key={i} style={tokenStyle}>
            {content}
          </Text>
        );
      }
    }
    
    return elements;
  };

  const getTokenStyle = (type: string) => {
    const baseStyle = {
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: 14,
    };

    switch (type) {
      case 'KEYWORD':
        return [baseStyle, { color: isDark ? '#569cd6' : '#0066cc', fontWeight: 'bold' as const }];
      case 'LITERAL':
        return [baseStyle, { color: isDark ? '#4fc1ff' : '#005cc5' }];
      case 'STRING':
        return [baseStyle, { color: isDark ? '#ce9178' : '#d73a49' }];
      case 'NUMBER':
        return [baseStyle, { color: isDark ? '#b5cea8' : '#005cc5' }];
      case 'COMMENT':
        return [baseStyle, { color: isDark ? '#6a9955' : '#6a737d', fontStyle: 'italic' as const }];
      case 'FUNCTION':
        return [baseStyle, { color: isDark ? '#dcdcaa' : '#6f42c1' }];
      case 'OPERATOR':
        return [baseStyle, { color: isDark ? '#d4d4d4' : '#d73a49' }];
      case 'TAG':
        return [baseStyle, { color: isDark ? '#569cd6' : '#0066cc', fontWeight: 'bold' as const }];
      case 'ATTRIBUTE':
        return [baseStyle, { color: isDark ? '#9cdcfe' : '#e36209' }];
      case 'SELECTOR':
        return [baseStyle, { color: isDark ? '#dcdcaa' : '#6f42c1' }];
      case 'PROPERTY':
        return [baseStyle, { color: isDark ? '#9cdcfe' : '#e36209' }];
      case 'VALUE':
        return [baseStyle, { color: isDark ? '#b5cea8' : '#005cc5' }];
      case 'KEY':
        return [baseStyle, { color: isDark ? '#9cdcfe' : '#e36209' }];
      default:
        return [baseStyle, { color: isDark ? '#d4d4d4' : '#333333' }];
    }
  };

  const formattedCode = formatCode(code, language);

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight, style]}>
      <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
        <View style={styles.languageContainer}>
          <View 
            style={[
              styles.languageDot, 
              { backgroundColor: getLanguageColor(language) }
            ]} 
          />
          <Text style={[styles.languageText, isDark ? styles.languageTextDark : styles.languageTextLight]}>
            {language.toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.copyButton, isDark ? styles.copyButtonDark : styles.copyButtonLight]}
          onPress={copyToClipboard}
        >
          <Text style={[styles.copyButtonText, isDark ? styles.copyButtonTextDark : styles.copyButtonTextLight]}>
            Copy
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        style={styles.codeContainer}
      >
        <ScrollView showsVerticalScrollIndicator={true}>
          {formattedCode.map((line, index) => (
            <View key={index} style={styles.lineContainer}>
              {showLineNumbers && (
                <Text style={[styles.lineNumber, isDark ? styles.lineNumberDark : styles.lineNumberLight]}>
                  {line.lineNumber}
                </Text>
              )}
              <Text style={[styles.codeText, isDark ? styles.codeTextDark : styles.codeTextLight]}>
                {renderHighlightedText(line.content)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  containerDark: {
    backgroundColor: colors.code.background,
  },
  containerLight: {
    backgroundColor: colors.codeLight.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.code.border,
  },
  headerDark: {
    backgroundColor: colors.code.backgroundSecondary,
  },
  headerLight: {
    backgroundColor: colors.codeLight.backgroundSecondary,
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
    fontSize: 12,
    fontWeight: '600',
  },
  languageTextDark: {
    color: colors.code.text,
  },
  languageTextLight: {
    color: colors.codeLight.textSecondary,
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  copyButtonDark: {
    backgroundColor: colors.code.border,
  },
  copyButtonLight: {
    backgroundColor: colors.codeLight.border,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  copyButtonTextDark: {
    color: colors.code.text,
  },
  copyButtonTextLight: {
    color: colors.codeLight.textSecondary,
  },
  codeContainer: {
    maxHeight: 300,
  },
  lineContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  lineNumber: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    marginRight: 16,
    minWidth: 30,
    textAlign: 'right',
  },
  lineNumberDark: {
    color: colors.code.textSecondary,
  },
  lineNumberLight: {
    color: colors.codeLight.textSecondary,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  codeTextDark: {
    color: colors.code.text,
  },
  codeTextLight: {
    color: colors.codeLight.text,
  },
});
