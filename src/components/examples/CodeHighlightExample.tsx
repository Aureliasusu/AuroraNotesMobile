import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  AdvancedCodeHighlighter, 
  SimpleCodeHighlighter, 
  RichTextEditor 
} from '../ui';

export const CodeHighlightExample: React.FC = () => {
  const [markdownContent, setMarkdownContent] = useState(`# Code Highlighting Example

Here's some JavaScript code:

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
console.log(doubled);
\`\`\`

And here's some Python:

\`\`\`python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
\`\`\`

And some HTML:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .highlight { color: #ff6b6b; }
    </style>
</head>
<body>
    <h1>Welcome to my page!</h1>
    <p class="highlight">This is highlighted text.</p>
</body>
</html>
\`\`\``);

  const [selectedHighlighter, setSelectedHighlighter] = useState<'simple' | 'advanced'>('simple');

  const codeExamples = {
    javascript: `function greetUser(name, age) {
  const message = \`Hello \${name}, you are \${age} years old!\`;
  console.log(message);
  return message;
}

greetUser("Alice", 25);`,
    
    python: `def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n - 1) + calculate_fibonacci(n - 2)

for i in range(10):
    print(f"F({i}) = {calculate_fibonacci(i)}")`,
    
    html: `<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <style>
        body {
            font-family: Arial;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome</h1>
        <p>Sample page</p>
    </div>
</body>
</html>`,
    
    css: `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background: #667eea;
  border-radius: 8px;
  padding: 20px;
  color: white;
}

.card:hover {
  transform: translateY(-2px);
}`,
    
    json: `{
  "name": "AuroraNotes",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "react-native": "^0.72.0"
  },
  "scripts": {
    "start": "react-native start"
  }
}`
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Code Highlighting Examples</Text>
      
      <View style={styles.selector}>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            selectedHighlighter === 'simple' && styles.activeSelector
          ]}
          onPress={() => setSelectedHighlighter('simple')}
        >
          <Text style={[
            styles.selectorText,
            selectedHighlighter === 'simple' && styles.activeSelectorText
          ]}>
            Simple Highlighter
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            selectedHighlighter === 'advanced' && styles.activeSelector
          ]}
          onPress={() => setSelectedHighlighter('advanced')}
        >
          <Text style={[
            styles.selectorText,
            selectedHighlighter === 'advanced' && styles.activeSelectorText
          ]}>
            Advanced Highlighter
        </Text>
        </TouchableOpacity>
      </View>

      {Object.entries(codeExamples).map(([language, code]) => (
        <View key={language} style={styles.exampleContainer}>
          <Text style={styles.languageTitle}>{language.toUpperCase()}</Text>
          {selectedHighlighter === 'simple' ? (
            <SimpleCodeHighlighter
              code={code}
              language={language}
              showLineNumbers={true}
              theme="dark"
            />
          ) : (
            <AdvancedCodeHighlighter
              code={code}
              language={language}
              showLineNumbers={true}
              theme="dark"
            />
          )}
        </View>
      ))}

      <View style={styles.editorContainer}>
        <Text style={styles.editorTitle}>Rich Text Editor with Markdown</Text>
        <RichTextEditor
          value={markdownContent}
          onChangeText={setMarkdownContent}
          placeholder="Write your markdown content here..."
          style={styles.editor}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  selector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeSelector: {
    backgroundColor: '#3b82f6',
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeSelectorText: {
    color: '#fff',
  },
  exampleContainer: {
    marginBottom: 24,
  },
  languageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  editorContainer: {
    marginTop: 20,
  },
  editorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  editor: {
    height: 200,
  },
});
