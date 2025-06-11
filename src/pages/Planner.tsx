import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Sparkles, ChevronRight } from 'lucide-react';
import OccasionSelector from '@/components/planner/OccasionSelector';
import OutingTypeSelector from '@/components/planner/OutingTypeSelector';
import LocalitySelector from '@/components/planner/LocalitySelector';
import TimingSelector from '@/components/planner/TimingSelector';
import PromptInput from '@/components/PromptInput';

// Types
type Occasion = 'romantic' | 'family' | 'friendly' | 'solo' | '';
type OutingType = 'restaurant' | 'outdoors' | 'cafe' | 'nightlife' | 'shopping' | '';
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
    const updatedPlanData = { ...planData, description };
    setPlanData(updatedPlanData);
    // Navigate immediately with the updated data
    navigate('/swipe', { state: updatedPlanData });
  };
  
  const renderStepIndicator = () => (
    <div className="flex justify-center gap-3 mb-8">
      {['occasion', 'type', 'locality', 'timing', 'description'].map((step, index) => (
        <div 
          key={step} 
          className={`h-1.5 rounded-full transition-all duration-500 ${
            currentStep === step 
              ? 'w-8 bg-gradient-to-r from-blitz-primary to-blitz-accent shadow-lg shadow-blitz-primary/30' 
              : index < ['occasion', 'type', 'locality', 'timing', 'description'].indexOf(currentStep) 
                ? 'w-6 bg-blitz-primary/70' 
                : 'w-6 bg-muted'
          }`}
        />
      ))}
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 'occasion':
        return 'What\'s the occasion?';
      case 'type':
        return 'What type of experience?';
      case 'locality':
        return 'How far are you willing to go?';
      case 'timing':
        return 'When are you planning to go?';
      case 'description':
        return 'Describe your ideal experience';
      default:
        return '';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 'occasion':
        return 'Help us understand the vibe you\'re going for';
      case 'type':
        return 'Choose the category that excites you most';
      case 'locality':
        return 'Set your preferred travel distance';
      case 'timing':
        return 'Optional - helps us find places that are open';
      case 'description':
        return 'Optional - tell us more about what you\'re looking for';
      default:
        return '';
    }
  };
  
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
          <div className="animate-fade-in space-y-6">
            <PromptInput 
              onSubmit={handleDescriptionSubmit}
              placeholder="e.g., We're 4 people looking for rooftop vibes under ₹500 per person"
            />
            <div className="text-center">
              <button 
                onClick={() => handleDescriptionSubmit('')}
                className="text-muted-foreground hover:text-blitz-primary text-sm flex items-center justify-center mx-auto transition-colors duration-300 group"
              >
                Skip this step
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Luxury background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-8 w-24 h-24 bg-blitz-primary/5 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-32 right-8 w-32 h-32 bg-blitz-secondary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />
      </div>
      
      <Header showBackButton />
      
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 pb-20 pt-8">
        <div className="w-full max-w-md mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-display mb-2 text-gradient">
              Plan Your Experience
            </h1>
            <p className="text-caption text-muted-foreground">
              Let's create something memorable together
            </p>
          </div>
          
          {renderStepIndicator()}
          
          {/* Step Content Card */}
          <div className="card-hero rounded-3xl p-8 backdrop-blur-xl border border-blitz-primary/10 shadow-2xl">
            {/* Step Header */}
            <div className="text-center mb-8 space-y-2">
              <h2 className="text-headline text-foreground">
                {getStepTitle()}
              </h2>
              <p className="text-caption text-muted-foreground">
                {getStepSubtitle()}
              </p>
            </div>
            
            {/* Step Content */}
            <div className="animate-scale-in">
              {renderCurrentStep()}
            </div>
          </div>

          {/* Progress Summary */}
          {currentStep !== 'occasion' && (
            <div className="mt-6 p-4 card-spotify rounded-2xl animate-slide-up">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your selections:</span>
                <div className="flex items-center space-x-2">
                  {planData.occasion && (
                    <span className="px-2 py-1 bg-blitz-primary/10 text-blitz-primary rounded-full text-xs font-medium">
                      {planData.occasion}
                    </span>
                  )}
                  {planData.outingType && (
                    <span className="px-2 py-1 bg-blitz-secondary/10 text-blitz-secondary rounded-full text-xs font-medium">
                      {planData.outingType}
                    </span>
                  )}
                  {planData.locality && currentStep !== 'locality' && (
                    <span className="px-2 py-1 bg-blitz-accent/10 text-blitz-accent rounded-full text-xs font-medium">
                      {planData.locality}km
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Planner;