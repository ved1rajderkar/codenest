import React, { useState, useEffect } from 'react';
import './App.css';
import MainEditor from './components/MainEditor';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const defaultCode: { [key: string]: string } = {
  javascript: `// Welcome to Codenest AI Code Generator
// Ask me to generate any JavaScript code

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
  python: `# Welcome to Codenest AI Code Generator
# Ask me to generate any Python code

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`,
  typescript: `// Welcome to Codenest AI Code Generator
// Ask me to generate any TypeScript code

function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
};

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [code, setCode] = useState(defaultCode.javascript);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Update code when language changes
  useEffect(() => {
    setCode(defaultCode[selectedLanguage] || defaultCode.javascript);
  }, [selectedLanguage]);

  const handleMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="app">
      <Header onMenuClick={handleMenuClick} />
      {mobileMenuOpen && isMobile && (
        <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className="app-content">
        <Sidebar 
          collapsed={sidebarCollapsed}
          mobileOpen={mobileMenuOpen}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          selectedLanguage={selectedLanguage}
          onLanguageSelect={handleLanguageSelect}
        />
        <MainEditor 
          language={selectedLanguage}
          sidebarCollapsed={sidebarCollapsed}
          code={code}
          setCode={setCode}
        />
      </div>
    </div>
  );
}

export default App;
