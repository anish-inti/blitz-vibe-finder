
import React, { useState } from 'react';
import { Clock } from 'lucide-react';

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
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-6 text-center text-white neon-text">
        When are you planning to go? <span className="text-sm">(Optional)</span>
      </h2>
      
      <div className="flex flex-col items-center">
        <div className="w-full mb-6 flex items-center justify-center">
          <Clock className="text-blitz-pink mr-2 w-6 h-6" />
          <span className="text-white font-medium">Select Date & Time</span>
        </div>
        
        <div className="w-full space-y-4">
          <div className="w-full">
            <label className="block text-sm text-gray-300 mb-1">Date</label>
            <input
              type="date"
              min={formatDate(today)}
              value={formatDate(date)}
              onChange={handleDateChange}
              className="w-full bg-black/50 border-2 border-blitz-pink/50 rounded-lg p-3 text-white focus:outline-none focus:border-blitz-pink focus:ring-1 focus:ring-blitz-pink/50"
            />
          </div>
          
          <div className="w-full">
            <label className="block text-sm text-gray-300 mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="w-full bg-black/50 border-2 border-blitz-pink/50 rounded-lg p-3 text-white focus:outline-none focus:border-blitz-pink focus:ring-1 focus:ring-blitz-pink/50"
            />
          </div>
        </div>
        
        <div className="mt-8 flex space-x-4">
          <button 
            onClick={() => onSet(new Date())}
            className="px-5 py-2 border border-blitz-pink/50 text-blitz-pink rounded-full hover:bg-blitz-pink/10 transition-all"
          >
            Skip
          </button>
          
          <button 
            onClick={handleSubmit}
            className="px-8 py-3 bg-blitz-pink text-white rounded-full shadow-lg shadow-blitz-pink/30 hover:shadow-blitz-pink/50 transition-all hover:scale-105"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimingSelector;
