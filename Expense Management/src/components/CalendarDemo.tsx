import React, { useState } from 'react';
import { Calendar } from './ui/calendar';
import { DatePicker } from './ui/date-picker';
import { CustomDropdown } from './ui/custom-dropdown';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/custom-select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function CalendarDemo() {
  const [selectedDate1, setSelectedDate1] = useState<Date | undefined>(new Date());
  const [selectedDate2, setSelectedDate2] = useState<Date | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [selectedCategory, setSelectedCategory] = useState('');

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const categories = ['Travel', 'Meals', 'Supplies', 'Equipment', 'Software', 'Training'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Custom Calendar Components
          </h1>
          <p className="text-lg text-muted-foreground">
            Beautiful calendar components inspired by modern design
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Standalone Calendar */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                Standalone Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                value={selectedDate1}
                onChange={setSelectedDate1}
              />
            </CardContent>
          </Card>

          {/* Date Picker */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                Date Picker Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select a date:
                </label>
                <DatePicker
                  value={selectedDate2}
                  onChange={setSelectedDate2}
                  placeholder="Choose your date"
                />
              </div>
              
              {selectedDate2 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Selected Date: {selectedDate2.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom Dropdowns */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                Custom Dropdowns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Month Dropdown:
                </label>
                <CustomDropdown
                  options={months}
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category Select:
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(selectedMonth || selectedCategory) && (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Selected Month: {selectedMonth}
                  </p>
                  {selectedCategory && (
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Selected Category: {selectedCategory}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="font-semibold mb-2">Modern Design</h3>
                <p className="text-sm text-muted-foreground">
                  Clean, modern interface with smooth animations
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold mb-2">Responsive</h3>
                <p className="text-sm text-muted-foreground">
                  Works perfectly on desktop, tablet, and mobile
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold mb-2">Fast & Smooth</h3>
                <p className="text-sm text-muted-foreground">
                  Optimized performance with smooth transitions
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold mb-2">Consistent</h3>
                <p className="text-sm text-muted-foreground">
                  All dropdowns follow the same design language
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}