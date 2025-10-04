import React from 'react';
import { SettingsProvider } from './SettingsContext';
import Settings from './Settings';
import { Button } from './ui/button';

// Example of how to integrate the settings system
export default function SettingsExample() {
  const [showSettings, setShowSettings] = React.useState(false);

  if (showSettings) {
    return (
      <SettingsProvider>
        <Settings onBack={() => setShowSettings(false)} />
      </SettingsProvider>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Settings Integration Example</h1>
      <p className="text-muted-foreground mb-6">
        Click the button below to open the role-based settings page.
      </p>
      <Button onClick={() => setShowSettings(true)}>
        Open Settings
      </Button>
    </div>
  );
}