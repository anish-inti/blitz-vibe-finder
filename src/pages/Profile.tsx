
import React from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { User, Settings, MapPin, Clock, Bell } from 'lucide-react';
import GlowButton from '@/components/GlowButton';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="blitz-gradient absolute inset-0 z-0 opacity-10"></div>
      
      <Header />
      
      <main className="flex-1 flex flex-col px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blitz-purple/20 flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-blitz-purple" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            <p className="text-gray-500 mb-6">Manage your account</p>
            
            <div className="w-full mt-4">
              <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100 overflow-hidden">
                <div className="p-4 flex items-center">
                  <MapPin className="w-5 h-5 text-blitz-pink mr-3" />
                  <span>Your Locations</span>
                </div>
                
                <div className="p-4 flex items-center">
                  <Clock className="w-5 h-5 text-blitz-blue mr-3" />
                  <span>History</span>
                </div>
                
                <div className="p-4 flex items-center">
                  <Bell className="w-5 h-5 text-blitz-purple mr-3" />
                  <span>Notifications</span>
                </div>
                
                <div className="p-4 flex items-center">
                  <Settings className="w-5 h-5 text-gray-500 mr-3" />
                  <span>Settings</span>
                </div>
              </div>
              
              <div className="mt-8">
                <GlowButton className="w-full" variant="outline">
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
