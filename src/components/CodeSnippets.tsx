import React, { useState } from 'react';
import { Copy, Heart, ThumbsUp, Eye } from 'lucide-react';
import './CodeSnippets.css';

interface CodeSnippet {
  id: number;
  title: string;
  description: string;
  language: string;
  code: string;
  likes: number;
  views: number;
  tags: string[];
}

const sampleSnippets: CodeSnippet[] = [
  {
    id: 1,
    title: "React useState Hook Example",
    description: "Basic state management in React functional components",
    language: "javascript",
    code: `const [count, setCount] = useState(0);

const increment = () => {
  setCount(count + 1);
};

return (
  <div>
    <p>Count: {count}</p>
    <button onClick={increment}>+</button>
  </div>
);`,
    likes: 124,
    views: 2300,
    tags: ["react", "hooks", "state"]
  },
  {
    id: 2,
    title: "Python List Comprehension",
    description: "Filter and transform lists in a single line",
    language: "python",
    code: `# Filter even numbers and square them
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squared_evens = [x**2 for x in numbers if x % 2 == 0]

print(squared_evens)  # [4, 16, 36, 64, 100]`,
    likes: 89,
    views: 1520,
    tags: ["python", "list-comprehension", "filter"]
  },
  {
    id: 3,
    title: "JavaScript Async/Await",
    description: "Modern asynchronous programming with promises",
    language: "javascript",
    code: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Usage
const user = await fetchUserData(123);`,
    likes: 203,
    views: 3800,
    tags: ["javascript", "async", "promises", "api"]
  }
];

interface CodeSnippetsProps {
  onSelectSnippet: (code: string) => void;
}

const CodeSnippets: React.FC<CodeSnippetsProps> = ({ onSelectSnippet }) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  
  const allTags = ['all', ...Array.from(new Set(sampleSnippets.flatMap(s => s.tags)))];
  
  const filteredSnippets = selectedTag === 'all' 
    ? sampleSnippets 
    : sampleSnippets.filter(s => s.tags.includes(selectedTag));

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // In a real app, you'd show a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="code-snippets">
      <div className="snippets-header">
        <h3>Popular Code Snippets</h3>
        <div className="tag-filters">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag-filter ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      
      <div className="snippets-list">
        {filteredSnippets.map(snippet => (
          <div key={snippet.id} className="snippet-card">
            <div className="snippet-header">
              <div className="snippet-title">{snippet.title}</div>
              <div className="snippet-language">{snippet.language}</div>
            </div>
            
            <div className="snippet-description">
              {snippet.description}
            </div>
            
            <div className="snippet-code">
              <pre><code>{snippet.code}</code></pre>
            </div>
            
            <div className="snippet-tags">
              {snippet.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
            
            <div className="snippet-actions">
              <div className="snippet-stats">
                <span className="stat">
                  <ThumbsUp size={14} />
                  {snippet.likes}
                </span>
                <span className="stat">
                  <Eye size={14} />
                  {snippet.views}
                </span>
              </div>
              
              <div className="action-buttons">
                <button 
                  className="action-btn"
                  onClick={() => handleCopyCode(snippet.code)}
                  title="Copy code"
                >
                  <Copy size={14} />
                </button>
                <button 
                  className="action-btn"
                  onClick={() => onSelectSnippet(snippet.code)}
                  title="Use this code"
                >
                  Use
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeSnippets;