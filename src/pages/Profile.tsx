
import React from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { User, Settings, MapPin, Clock, Bell } from 'lucide-react';
import GlowButton from '@/components/GlowButton';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-blitz-black">
      <div className="cosmic-bg absolute inset-0 z-0"></div>
      
      <Header />
      
      <main className="flex-1 flex flex-col px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blitz-darkgray border border-blitz-pink flex items-center justify-center mb-4 neon-glow">
              <User className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-white neon-text mb-1">Profile</h1>
            <p className="text-gray-300 mb-6">Manage your account</p>
            
            <div className="w-full mt-6">
              <div className="glassmorphism rounded-xl shadow-lg shadow-blitz-pink/10 divide-y divide-blitz-pink/10 overflow-hidden border border-blitz-pink/20">
                <div className="p-4 flex items-center hover:bg-blitz-pink/5 transition-colors">
                  <MapPin className="w-5 h-5 text-blitz-pink mr-3" />
                  <span className="text-white">Your Locations</span>
                </div>
                
                <div className="p-4 flex items-center hover:bg-blitz-pink/5 transition-colors">
                  <Clock className="w-5 h-5 text-blitz-blue mr-3" />
                  <span className="text-white">History</span>
                </div>
                
                <div className="p-4 flex items-center hover:bg-blitz-pink/5 transition-colors">
                  <Bell className="w-5 h-5 text-blitz-neonred mr-3" />
                  <span className="text-white">Notifications</span>
                </div>
                
                <div className="p-4 flex items-center hover:bg-blitz-pink/5 transition-colors">
                  <Settings className="w-5 h-5 text-gray-300 mr-3" />
                  <span className="text-white">Settings</span>
                </div>
              </div>
              
              <div className="mt-8">
                <GlowButton className="w-full" variant="outline" color="red">
                  Sign Out
                </GlowButton>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
