
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";

interface UserHeaderProps {
  name: string;
  avatarUrl?: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ name, avatarUrl }) => (
  <div className="flex flex-col items-center mb-4">
    <Avatar className="w-20 h-20 ring-4 ring-blitz-pink mb-2 shadow-md shadow-blitz-pink/40">
      {avatarUrl ? <AvatarImage src={avatarUrl} /> : <AvatarFallback className="bg-blitz-gray text-blitz-pink text-2xl">{name[0]}</AvatarFallback>}
    </Avatar>
    <div className="text-center">
      <h2 className="text-xl font-semibold text-white">{name}</h2>
      <div className="flex items-center justify-center gap-1">
        <span className="text-sm text-blitz-lightgray">
          Welcome back, {name}! Ready for your next adventure?
        </span>
        <Sparkles className="w-5 h-5 text-blitz-stardust animate-sparkle" />
      </div>
    </div>
  </div>
);

export default UserHeader;
