import React from 'react';
import { ChevronLeft, ChevronRight, Code2, MessageSquare, Search, Clock, Bookmark } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen?: boolean;
  onToggleCollapse: () => void;
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
}

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'cpp', name: 'C++', icon: '⚡' },
  { id: 'go', name: 'Go', icon: '🔵' },
  { id: 'rust', name: 'Rust', icon: '🦀' },
  { id: 'php', name: 'PHP', icon: '🐘' },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  mobileOpen = false,
  onToggleCollapse, 
  selectedLanguage, 
  onLanguageSelect
}) => {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <button className="collapse-btn" onClick={onToggleCollapse}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        {!collapsed && <span className="sidebar-title">Menu</span>}
      </div>
      
      <div className="sidebar-content">
        <div className="sidebar-section">
          <div className="sidebar-item active">
            <Code2 size={18} />
            {!collapsed && <span>Code Generation</span>}
          </div>
          <div className="sidebar-item">
            <MessageSquare size={18} />
            {!collapsed && <span>Chat</span>}
          </div>
          <div className="sidebar-item">
            <Search size={18} />
            {!collapsed && <span>Search</span>}
          </div>
          <div className="sidebar-item">
            <Bookmark size={18} />
            {!collapsed && <span>Saved</span>}
          </div>
        </div>
        
        {!collapsed && (
          <div className="sidebar-section">
            <div className="section-title">Languages</div>
            <div className="languages-list">
              {languages.map((lang) => (
                <div 
                  key={lang.id}
                  className={`language-item ${selectedLanguage === lang.id ? 'active' : ''}`}
                  onClick={() => onLanguageSelect(lang.id)}
                >
                  <span className="language-icon">{lang.icon}</span>
                  <span className="language-name">{lang.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;