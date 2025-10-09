import React from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

interface AdvancedCodeHighlighterProps {
  code: string;
  language?: string;
  style?: any;
  showLineNumbers?: boolean;
  theme?: 'dark' | 'light';
}

export const AdvancedCodeHighlighter: React.FC<AdvancedCodeHighlighterProps> = ({
  code,
  language = 'javascript',
  style,
  showLineNumbers = true,
  theme = 'dark',
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
      php: '#777bb4',
      ruby: '#cc342d',
      go: '#00add8',
      rust: '#dea584',
      swift: '#fa7343',
      kotlin: '#7f52ff',
      default: '#6b7280',
    };
    return colors[lang.toLowerCase()] || colors.default;
  };

  const copyToClipboard = () => {
    // clipboard not implemented yet
    Alert.alert('Copied', 'Code copied to clipboard');
  };

  const getHTML = () => {
    const isDark = theme === 'dark';
    const bgColor = isDark ? '#1e1e1e' : '#ffffff';
    const textColor = isDark ? '#d4d4d4' : '#333333';
    const borderColor = isDark ? '#404040' : '#e5e7eb';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: ${Platform.OS === 'ios' ? 'Menlo' : 'monospace'}, monospace;
            background-color: ${bgColor};
            color: ${textColor};
            padding: 16px;
            line-height: 1.5;
            font-size: 14px;
          }
          .code-container {
            background-color: ${bgColor};
            border: 1px solid ${borderColor};
            border-radius: 8px;
            overflow: hidden;
          }
          .code-header {
            background-color: ${isDark ? '#2d2d2d' : '#f8f9fa'};
            padding: 8px 12px;
            border-bottom: 1px solid ${borderColor};
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .language-info {
            display: flex;
            align-items: center;
          }
          .language-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 6px;
            background-color: ${getLanguageColor(language)};
          }
          .language-text {
            font-size: 12px;
            font-weight: 600;
            color: ${isDark ? '#d4d4d4' : '#6b7280'};
          }
          .copy-btn {
            background-color: ${isDark ? '#404040' : '#e5e7eb'};
            color: ${isDark ? '#d4d4d4' : '#374151'};
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
          }
          .code-content {
            padding: 16px;
            overflow-x: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .line-numbers {
            display: inline-block;
            margin-right: 16px;
            color: ${isDark ? '#6b7280' : '#9ca3af'};
            user-select: none;
          }
          .code-line {
            display: block;
            min-height: 1.5em;
          }
          .keyword { color: ${isDark ? '#569cd6' : '#0066cc'}; font-weight: bold; }
          .string { color: ${isDark ? '#ce9178' : '#d73a49'}; }
          .number { color: ${isDark ? '#b5cea8' : '#005cc5'}; }
          .comment { color: ${isDark ? '#6a9955' : '#6a737d'}; font-style: italic; }
          .function { color: ${isDark ? '#dcdcaa' : '#6f42c1'}; }
          .variable { color: ${isDark ? '#9cdcfe' : '#e36209'}; }
          .operator { color: ${isDark ? '#d4d4d4' : '#d73a49'}; }
        </style>
      </head>
      <body>
        <div class="code-container">
          <div class="code-header">
            <div class="language-info">
              <div class="language-dot"></div>
              <span class="language-text">${language.toUpperCase()}</span>
            </div>
            <button class="copy-btn" onclick="copyCode()">Copy</button>
          </div>
          <div class="code-content">
            ${formatCodeWithSyntaxHighlighting(code, language, showLineNumbers)}
          </div>
        </div>
        <script>
          function copyCode() {
            const code = \`${code.replace(/`/g, '\\`')}\`;
            if (navigator.clipboard) {
              navigator.clipboard.writeText(code);
            } else {
              // Fallback for older browsers
              const textArea = document.createElement('textarea');
              textArea.value = code;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);
            }
            alert('Code copied to clipboard!');
          }
        </script>
      </body>
      </html>
    `;
  };

  const formatCodeWithSyntaxHighlighting = (codeText: string, language: string, showNumbers: boolean) => {
    const lines = codeText.split('\n');
    
    return lines.map((line, index) => {
      const lineNumber = showNumbers ? `<span class="line-numbers">${String(index + 1).padStart(2, ' ')}</span>` : '';
      
      // Simple syntax highlighting based on language
      let highlightedLine = line;
      
      if (language === 'javascript' || language === 'typescript') {
        highlightedLine = highlightJavaScript(line);
      } else if (language === 'python') {
        highlightedLine = highlightPython(line);
      } else if (language === 'html') {
        highlightedLine = highlightHTML(line);
      } else if (language === 'css') {
        highlightedLine = highlightCSS(line);
      } else if (language === 'json') {
        highlightedLine = highlightJSON(line);
      }
      
      return `<div class="code-line">${lineNumber}${highlightedLine}</div>`;
    }).join('');
  };

  const highlightJavaScript = (line: string) => {
    return line
      .replace(/\b(const|let|var|function|if|else|for|while|return|import|export|class|interface|type|async|await|try|catch|finally|throw|new|this|super|extends|implements|static|public|private|protected|readonly|abstract|enum|namespace|module|declare|interface|type|as|is|in|of|typeof|instanceof|void|never|any|unknown|boolean|number|string|object|array|symbol|bigint)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(true|false|null|undefined|NaN|Infinity)\b/g, '<span class="variable">$1</span>')
      .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
      .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
      .replace(/(\/\/.*$)/g, '<span class="comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>')
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="function">$1</span>(')
      .replace(/[+\-*/%=<>!&|^~]/g, '<span class="operator">$&</span>');
  };

  const highlightPython = (line: string) => {
    return line
      .replace(/\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|lambda|and|or|not|in|is|None|True|False|pass|break|continue|raise|assert|del|global|nonlocal)\b/g, '<span class="keyword">$1</span>')
      .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
      .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
      .replace(/(#.*$)/g, '<span class="comment">$1</span>');
  };

  const highlightHTML = (line: string) => {
    return line
      .replace(/<(\/?[a-zA-Z][^>]*)>/g, '<span class="keyword">&lt;$1&gt;</span>')
      .replace(/(\w+)=/g, '<span class="function">$1</span>=')
      .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
      .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>');
  };

  const highlightCSS = (line: string) => {
    return line
      .replace(/([.#]?[a-zA-Z][\w-]*)\s*{/g, '<span class="function">$1</span> {')
      .replace(/([a-zA-Z-]+)\s*:/g, '<span class="function">$1</span>:')
      .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
      .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
      .replace(/\b(\d+\.?\d*[a-zA-Z%]*)\b/g, '<span class="number">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
  };

  const highlightJSON = (line: string) => {
    return line
      .replace(/"([^"]*)"\s*:/g, '<span class="function">"$1"</span>:')
      .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="variable">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ html: getHTML() }}
        style={styles.webview}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={true}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'copy') {
            copyToClipboard();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  webview: {
    flex: 1,
  },
});
