import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Play, Copy, Download, MoreHorizontal, Send, Sparkles, MessageCircle } from 'lucide-react';
import APIService from '../services/apiService';
import './MainEditor.css';

interface MainEditorProps {
  language: string;
  sidebarCollapsed: boolean;
  code: string;
  setCode: (code: string) => void;
}

const languageMap: { [key: string]: { id: number; editor: string } } = {
  javascript: { id: 93, editor: 'javascript' },
  typescript: { id: 74, editor: 'typescript' },
  python: { id: 71, editor: 'python' },
  java: { id: 62, editor: 'java' },
  cpp: { id: 54, editor: 'cpp' },
  go: { id: 60, editor: 'go' },
  rust: { id: 73, editor: 'rust' },
  php: { id: 68, editor: 'php' },
};

const defaultCode: { [key: string]: string } = {
  javascript: `// Welcome to CodeNest Online Compiler
// Start coding or ask for AI assistance

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
  python: `# Welcome to CodeNest Online Compiler
# Start coding or ask for AI assistance

name = input("What is your name? ")
print(f"Hello, {name}!")`,
  typescript: `// Welcome to CodeNest Online Compiler
// Start coding or ask for AI assistance

function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
};

const MainEditor: React.FC<MainEditorProps> = ({ language, sidebarCollapsed, code, setCode }) => {
  // Using code and setCode from props instead of local state
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [stdin, setStdin] = useState('');
  const outputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setOutput([]);

    let processedStdin = stdin;
    if (language === 'python') {
      processedStdin = stdin.replace(/,/g, '.');
    }

    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: {
        base64_encoded: 'true',
        fields: ''
      },
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': '6ffa919effmshd6ed0125ba64926p1106bajsne21b57b2e322',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      data: {
        language_id: languageMap[language]?.id,
        source_code: btoa(code),
        stdin: btoa(processedStdin),
      }
    };

    try {
      const response = await axios.request(options);
      const token = response.data.token;
      checkStatus(token);
    } catch (error: any) {
      setOutput(prev => [...prev, error.message]);
      setIsRunning(false);
    }
  };

  const checkStatus = async (token: string) => {
    const options = {
      method: 'GET',
      url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      params: {
        base64_encoded: 'true',
        fields: ''
      },
      headers: {
        'X-RapidAPI-Key': '6ffa919effmshd6ed0125ba64926p1106bajsne21b57b2e322',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const statusId = response.data.status.id;

      if (statusId === 1 || statusId === 2) { // In Queue or Processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      }

      setIsRunning(false);
      let newOutput = '';
      if (response.data.stdout) {
        newOutput = atob(response.data.stdout);
      } else if (response.data.stderr) {
        newOutput = atob(response.data.stderr);
      } else if (response.data.compile_output) {
        newOutput = atob(response.data.compile_output);
      } else {
        newOutput = 'Execution finished with no output.';
      }
      setOutput(prev => [...prev, newOutput]);
    } catch (error: any) {
      setOutput(prev => [...prev, error.message]);
      setIsRunning(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const result = await APIService.generateCode({
        prompt,
        language,
        context: code
      });

      if (result.code) {
        const generatedCode = `// Generated for: "${prompt}"\n${result.code}`;
        setCode(generatedCode + '\n\n' + code);
      }
    } catch (error: any) {
      console.error('Error generating code:', error);
      setCode(`// Error generating code: ${error.message}\n\n${code}`);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleGenerate();
    }
  };

  return (
    <div className={`main-editor ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="editor-header">
        <div className="file-tabs">
          <div className="file-tab active">
            <span>main.{languageMap[language]?.editor || 'js'}</span>
          </div>
        </div>
        <div className="editor-actions">
          <button className="action-btn">
            <Copy size={16} />
          </button>
          <button className="action-btn">
            <Download size={16} />
          </button>
          <button className="action-btn" onClick={handleRunCode} disabled={isRunning}>
            {isRunning ? <div className="spinner"></div> : <Play size={16} />}
          </button>
          <button className="action-btn">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="prompt-section">
        <div className="prompt-container">
          <Sparkles className="prompt-icon" size={18} />
          <input
            type="text"
            placeholder="Describe what code you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className="prompt-input"
            disabled={isGenerating}
          />
          <button 
            className={`generate-btn ${isGenerating ? 'generating' : ''}`}
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <div className="spinner"></div>
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>

      <div className="editor-container">
        <Editor
          height={output.length > 0 || isRunning ? "calc(100vh - 380px)" : "calc(100vh - 180px)"}
          language={languageMap[language]?.editor || 'javascript'}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
          }}
        />
      </div>
      {(output.length > 0 || isRunning) && (
        <div className="io-container">
          <div className="stdin-container">
            <div className="stdin-header">
                <h4>Input</h4>
            </div>
            <textarea
                className="stdin-content"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter input here..."
            />
          </div>
          <div className="output-container">
            <div className="output-header">
              <h4>Output</h4>
              <button onClick={() => setOutput([])}>Clear</button>
            </div>
            <textarea
              ref={outputRef}
              className="output-content"
              value={output.join('\n')}
              readOnly
              placeholder="Output will appear here..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainEditor;
