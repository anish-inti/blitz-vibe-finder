import React, { useState } from 'react';
import { Clock, Calendar } from 'lucide-react';

interface TimingSelectorProps {
  onSet: (timing: Date) => void;
  initialValue: Date;
}

const TimingSelector: React.FC<TimingSelectorProps> = ({ onSet, initialValue }) => {
  const [date, setDate] = useState<Date>(initialValue);
  const [time, setTime] = useState<string>('19:00');
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setDate(newDate);
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };
  
  const handleSubmit = () => {
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes);
    onSet(dateTime);
  };
  
  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blitz-secondary to-blitz-primary text-white shadow-lg">
          <Clock className="w-8 h-8" />
        </div>
        
        <div>
          <div className="text-lg font-semibold text-foreground mb-1">
            When would you like to go?
          </div>
          <div className="text-sm text-muted-foreground">
            This helps us find places that are open
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                min={formatDate(today)}
                value={formatDate(date)}
                onChange={handleDateChange}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blitz-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="time"
                value={time}
                onChange={handleTimeChange}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blitz-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => onSet(new Date())}
            className="flex-1 py-3 px-4 border border-border text-muted-foreground rounded-xl hover:bg-muted/50 transition-all font-medium"
          >
            Skip
          </button>
          
          <button 
            onClick={handleSubmit}
            className="flex-1 btn-primary rounded-xl py-3 font-bold interactive-glow"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimingSelector;