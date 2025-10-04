import React from 'react';
import { CustomDropdown } from './custom-dropdown';

interface CustomSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
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

// Extract trigger className from children
const extractTriggerClassName = (children: React.ReactNode): string => {
  let triggerClassName = '';
  
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === CustomSelectTrigger) {
      triggerClassName = child.props.className || '';
    }
  });
  
  return triggerClassName;
};

// Extract placeholder from SelectValue
const extractPlaceholder = (children: React.ReactNode): string => {
  let placeholder = '';
  
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === CustomSelectTrigger) {
      React.Children.forEach(child.props.children, (triggerChild) => {
        if (React.isValidElement(triggerChild) && triggerChild.type === CustomSelectValue) {
          placeholder = triggerChild.props.placeholder || '';
        }
      });
    }
  });
  
  return placeholder;
};

export function CustomSelect({ value, onValueChange, children, placeholder, className, required, disabled }: CustomSelectProps) {
  const options = extractOptions(children);
  const displayMap = extractDisplayText(children);
  const triggerClassName = extractTriggerClassName(children);
  const extractedPlaceholder = extractPlaceholder(children) || placeholder;
  
  // Convert options to display format
  const displayOptions = options.map(option => displayMap[option] || option);
  
  // Determine what to display in the dropdown button
  let currentDisplayValue: string;
  if (value && displayMap[value]) {
    currentDisplayValue = displayMap[value];
  } else if (value && value !== 'all' && value !== '') {
    currentDisplayValue = value;
  } else if (value === 'all') {
    currentDisplayValue = displayMap['all'] || 'All';
  } else {
    currentDisplayValue = extractedPlaceholder || 'Select...';
  }
  
  const handleChange = (displayValue: string) => {
    // Find the actual value from display value
    const actualValue = Object.keys(displayMap).find(key => displayMap[key] === displayValue) || displayValue;
    onValueChange(actualValue);
  };

  return (
    <div className={className}>
      <CustomDropdown
        options={displayOptions}
        value={currentDisplayValue}
        onChange={handleChange}
        disabled={disabled}
        className={triggerClassName}
      />
    </div>
  );
}

export function CustomSelectTrigger({ children, className }: CustomSelectTriggerProps) {
  // This is just for API compatibility - the actual trigger is handled by CustomDropdown
  // We store the className for the parent Select component to use
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