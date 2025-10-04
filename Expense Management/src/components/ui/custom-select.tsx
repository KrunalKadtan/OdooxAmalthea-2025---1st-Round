import React from 'react';
import { CustomDropdown } from './custom-dropdown';

interface CustomSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

interface CustomSelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface CustomSelectContentProps {
  children: React.ReactNode;
}

interface CustomSelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface CustomSelectValueProps {
  placeholder?: string;
}

// Extract options from children
const extractOptions = (children: React.ReactNode): string[] => {
  const options: string[] = [];
  
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === CustomSelectContent) {
      React.Children.forEach(child.props.children, (item) => {
        if (React.isValidElement(item) && item.type === CustomSelectItem) {
          options.push(item.props.value);
        }
      });
    }
  });
  
  return options;
};

// Extract display text for options
const extractDisplayText = (children: React.ReactNode): Record<string, string> => {
  const displayMap: Record<string, string> = {};
  
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === CustomSelectContent) {
      React.Children.forEach(child.props.children, (item) => {
        if (React.isValidElement(item) && item.type === CustomSelectItem) {
          displayMap[item.props.value] = typeof item.props.children === 'string' 
            ? item.props.children 
            : item.props.value;
        }
      });
    }
  });
  
  return displayMap;
};

export function CustomSelect({ value, onValueChange, children, placeholder, className, required }: CustomSelectProps) {
  const options = extractOptions(children);
  const displayMap = extractDisplayText(children);
  
  // Convert options to display format
  const displayOptions = options.map(option => displayMap[option] || option);
  const currentDisplayValue = value ? (displayMap[value] || value) : (placeholder || 'Select...');
  
  const handleChange = (displayValue: string) => {
    // Find the actual value from display value
    const actualValue = Object.keys(displayMap).find(key => displayMap[key] === displayValue) || displayValue;
    onValueChange(actualValue);
  };

  return (
    <div className={className}>
      <CustomDropdown
        options={displayOptions}
        value={value ? (displayMap[value] || value) : (placeholder || 'Select...')}
        onChange={handleChange}
      />
    </div>
  );
}

export function CustomSelectTrigger({ children, className }: CustomSelectTriggerProps) {
  // This is just for API compatibility - the actual trigger is handled by CustomDropdown
  return null;
}

export function CustomSelectContent({ children }: CustomSelectContentProps) {
  // This is just for API compatibility - the content is handled by CustomDropdown
  return null;
}

export function CustomSelectItem({ value, children }: CustomSelectItemProps) {
  // This is just for API compatibility - items are handled by CustomDropdown
  return null;
}

export function CustomSelectValue({ placeholder }: CustomSelectValueProps) {
  // This is just for API compatibility - value display is handled by CustomDropdown
  return null;
}

// Export all components
export {
  CustomSelect as Select,
  CustomSelectTrigger as SelectTrigger,
  CustomSelectContent as SelectContent,
  CustomSelectItem as SelectItem,
  CustomSelectValue as SelectValue
};