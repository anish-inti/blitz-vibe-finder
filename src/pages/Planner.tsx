
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Sparkles, Clock, MapPin, ChevronRight } from 'lucide-react';
import OccasionSelector from '@/components/planner/OccasionSelector';
import OutingTypeSelector from '@/components/planner/OutingTypeSelector';
import LocalitySelector from '@/components/planner/LocalitySelector';
import TimingSelector from '@/components/planner/TimingSelector';
import PromptInput from '@/components/PromptInput';

// Types
type Occasion = 'romantic' | 'family' | 'friendly' | 'solo' | '';
type OutingType = 'restaurant' | 'movie' | 'outdoors' | 'cafe' | 'nightlife' | '';
type PlannerStep = 'occasion' | 'type' | 'locality' | 'timing' | 'description';

const Planner: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<PlannerStep>('occasion');
  const [planData, setPlanData] = useState({
    occasion: '' as Occasion,
    outingType: '' as OutingType,
    locality: 5, // Default 5km
    timing: new Date(),
    description: ''
  });
  
  const goToNextStep = () => {
    switch (currentStep) {
      case 'occasion':
        setCurrentStep('type');
        break;
      case 'type':
        setCurrentStep('locality');
        break;
      case 'locality':
        setCurrentStep('timing');
        break;
      case 'timing':
        setCurrentStep('description');
        break;
      case 'description':
        // Navigate to the swipe deck with our parameters
        navigate('/swipe', { state: planData });
        break;
    }
  };
  
  const handleOccasionSelect = (occasion: Occasion) => {
    setPlanData(prev => ({ ...prev, occasion }));
    goToNextStep();
  };
  
  const handleOutingTypeSelect = (outingType: OutingType) => {
    setPlanData(prev => ({ ...prev, outingType }));
    goToNextStep();
  };
  
  const handleLocalitySet = (locality: number) => {
    setPlanData(prev => ({ ...prev, locality }));
    goToNextStep();
  };
  
  const handleTimingSet = (timing: Date) => {
    setPlanData(prev => ({ ...prev, timing }));
    goToNextStep();
  };
  
  const handleDescriptionSubmit = (description: string) => {
    setPlanData(prev => ({ ...prev, description }));
    goToNextStep();
  };
  
  const renderStepIndicator = () => (
    <div className="flex justify-center gap-2 mb-8">
      {['occasion', 'type', 'locality', 'timing', 'description'].map((step, index) => (
        <div 
          key={step} 
          className={`h-2 rounded-full transition-all duration-300 ${
            currentStep === step 
              ? 'w-8 bg-blitz-neonred neon-red-glow' 
              : index < ['occasion', 'type', 'locality', 'timing', 'description'].indexOf(currentStep) 
                ? 'w-6 bg-blitz-pink/70' 
                : 'w-6 bg-gray-700'
          }`}
        />
      ))}
    </div>
  );
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'occasion':
        return <OccasionSelector onSelect={handleOccasionSelect} />;
      case 'type':
        return <OutingTypeSelector onSelect={handleOutingTypeSelect} />;
      case 'locality':
        return <LocalitySelector onSet={handleLocalitySet} initialValue={planData.locality} />;
      case 'timing':
        return <TimingSelector onSet={handleTimingSet} initialValue={planData.timing} />;
      case 'description':
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-6 text-center text-white neon-text">
              Describe your ideal experience <span className="text-sm">(Optional)</span>
            </h2>
            <PromptInput onSubmit={handleDescriptionSubmit} />
            <button 
              onClick={() => handleDescriptionSubmit('')}
              className="mt-4 text-blitz-pink/70 hover:text-blitz-pink text-sm flex items-center justify-center mx-auto"
            >
              Skip <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col relative bg-blitz-black">
      <div className="cosmic-bg absolute inset-0 z-0"></div>
      
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-4">
          <h1 className="text-2xl font-bold mb-2 text-center text-white neon-text relative">
            Plan Your Blitz
            <Sparkles className="absolute -right-6 top-1 w-4 h-4 text-blitz-stardust animate-pulse-glow" />
          </h1>
          
          {renderStepIndicator()}
          
          <div className="glassmorphism rounded-2xl p-6 border border-blitz-pink/20 backdrop-blur-lg">
            {renderCurrentStep()}
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Planner;
