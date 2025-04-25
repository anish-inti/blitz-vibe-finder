
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";

interface UserHeaderProps {
  name: string;
  avatarUrl?: string;
  darkMode?: boolean;
}

const UserHeader: React.FC<UserHeaderProps> = ({ name, avatarUrl, darkMode = true }) => (
  <div className="flex flex-col items-center mb-4">
    <Avatar className={`w-20 h-20 ring-4 ${darkMode ? "ring-blitz-pink" : "ring-blitz-purple"} mb-2 shadow-md ${darkMode ? "shadow-blitz-pink/40" : "shadow-blitz-purple/40"}`}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} />
      ) : (
        <AvatarFallback className={`${darkMode ? "bg-blitz-gray text-blitz-pink" : "bg-white text-blitz-purple"} text-2xl`}>
          {name[0]}
        </AvatarFallback>
      )}
    </Avatar>
    <div className="text-center">
      <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-blitz-black"}`}>{name}</h2>
      <div className="flex items-center justify-center gap-1">
        <span className={`text-sm ${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"}`}>
          Welcome back, {name}! Ready for your next adventure?
        </span>
        <Sparkles className={`w-5 h-5 ${darkMode ? "text-blitz-stardust" : "text-blitz-purple"} animate-sparkle`} />
      </div>
    </div>
  </div>
);

export default UserHeader;
