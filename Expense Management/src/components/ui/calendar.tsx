import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { CustomDropdown } from './custom-dropdown';
import './calendar.css';

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Calendar({ value, onChange, className = "" }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Generate years (current year ± 50 years)
  const years = Array.from({ length: 101 }, (_, i) => (currentYear - 50 + i).toString());

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  const handleMonthSelect = (monthName: string) => {
    const monthIndex = months.indexOf(monthName);
    setCurrentDate(new Date(currentYear, monthIndex, 1));
  };

  const handleYearSelect = (yearString: string) => {
    const year = parseInt(yearString);
    setCurrentDate(new Date(year, currentMonth, 1));
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day-empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && 
                     today.getMonth() === currentMonth && 
                     today.getFullYear() === currentYear;
      
      const isSelected = selectedDate &&
                        selectedDate.getDate() === day &&
                        selectedDate.getMonth() === currentMonth &&
                        selectedDate.getFullYear() === currentYear;
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div className={`custom-calendar ${className}`}>
      {/* Calendar Header */}
      <div className="calendar-header">
        {/* Month Dropdown */}
        <CustomDropdown
          options={months}
          value={months[currentMonth]}
          onChange={handleMonthSelect}
          className="calendar-month-dropdown"
        />

        {/* Year Dropdown */}
        <CustomDropdown
          options={years}
          value={currentYear.toString()}
          onChange={handleYearSelect}
          className="calendar-year-dropdown"
        />
      </div>

      {/* Day Names */}
      <div className="calendar-day-names">
        {days.map((day) => (
          <div key={day} className="calendar-day-name">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {generateCalendarDays()}
      </div>


    </div>
  );
}

export default Calendar;