import React from 'react';
import { Search, Settings, User, Menu } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={18} />
        </button>
        <div className="logo">
          <span className="logo-text">Codenest</span>
          <span className="logo-subtitle">AI</span>
        </div>
      </div>
      
      <div className="header-center">
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Ask Codenest anything..."
            className="search-input"
          />
        </div>
      </div>
      
      <div className="header-right">
        <button className="header-btn">
          <Settings size={18} />
        </button>
        <button className="header-btn">
          <User size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;