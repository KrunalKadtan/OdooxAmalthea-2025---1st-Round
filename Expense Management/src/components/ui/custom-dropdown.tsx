import React, { useState, useRef, useEffect } from 'react';
import './custom-dropdown.css';

interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function CustomDropdown({ options, value, onChange, className = "", disabled = false }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const index = options.findIndex(option => option === value);
    setSelectedIndex(index >= 0 ? index : -1);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && listRef.current && selectedIndex >= 0) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [isOpen, selectedIndex]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option: string, index: number) => {
    if (option && option !== value) {
      onChange(option);
      setSelectedIndex(index);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (isOpen && selectedIndex >= 0) {
        handleSelect(options[selectedIndex], selectedIndex);
      } else {
        handleToggle();
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const nextIndex = selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
        setSelectedIndex(nextIndex);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;
        setSelectedIndex(prevIndex);
      }
    }
  };

  return (
    <div ref={dropdownRef} className={`custom-dropdown ${className}`}>
      <button
        type="button"
        className={`selected-option ${disabled ? 'disabled' : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className="flex-1 text-left">{value}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <ul 
        ref={listRef}
        className={`options-list ${isOpen ? 'show' : ''}`}
        role="listbox"
        tabIndex={-1}
      >
        {options.map((option, index) => (
          <li
            key={option}
            className={`option-item ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => handleSelect(option, index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect(option, index);
              }
            }}
            role="option"
            aria-selected={index === selectedIndex}
            tabIndex={0}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomDropdown;