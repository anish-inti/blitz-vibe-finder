import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Crown } from "lucide-react";

interface UserHeaderProps {
  name: string;
  avatarUrl?: string;
  darkMode?: boolean;
}

const UserHeader: React.FC<UserHeaderProps> = ({ name, avatarUrl, darkMode = true }) => (
  <div className="flex flex-col items-center space-y-4">
    <div className="relative">
      <Avatar className="w-24 h-24 ring-4 ring-blitz-primary shadow-xl shadow-blitz-primary/20">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} />
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-blitz-primary to-blitz-accent text-white text-2xl font-bold">
            {name[0]}
          </AvatarFallback>
        )}
      </Avatar>
      
      {/* Status indicator */}
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blitz-secondary to-blitz-primary rounded-full flex items-center justify-center shadow-lg">
        <Crown className="w-3 h-3 text-white" />
      </div>
    </div>
    
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-bold text-foreground">{name}</h2>
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm text-muted-foreground">
          Explorer Level 3
        </span>
        <Sparkles className="w-4 h-4 text-blitz-secondary animate-pulse-glow" />
      </div>
      <p className="text-caption text-muted-foreground max-w-xs">
        Discovering Chennai's hidden gems, one experience at a time
      </p>
    </div>
  </div>
);

export default UserHeader;