
import React, { useState } from "react";
import { X, Tag as TagIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const SUGGESTED_TAGS = [
  "Date Spot", "Peaceful", "Budget-friendly", "Group Outing", "Aesthetic", 
  "Nightlife", "Pet-friendly", "Family-friendly", "Work-friendly", "Instagram-worthy"
];

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagsChange }) => {
  const { darkMode } = useTheme();
  const [customTag, setCustomTag] = useState("");

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTag.trim()) {
      e.preventDefault();
      addTag(customTag.trim());
      setCustomTag("");
    }
  };

  return (
    <div className="space-y-3">
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <div 
            key={tag}
            className={`
              inline-flex items-center px-3 py-1 rounded-full text-sm
              ${darkMode 
                ? 'bg-blitz.card border border-gray-700 text-white' 
                : 'bg-gray-100 text-gray-800'}
            `}
          >
            <span>{tag}</span>
            <button 
              onClick={() => removeTag(tag)}
              className="ml-1.5 hover:text-blitz-pink"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Custom Tag Input */}
      <div className={`
        relative flex items-center rounded-md border 
        ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-300 bg-white'}
      `}>
        <TagIcon className="absolute left-2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a custom tag..."
          className={`
            flex-1 bg-transparent border-none pl-8 pr-3 py-2 text-sm focus:outline-none
            ${darkMode ? 'text-white placeholder:text-gray-400' : 'text-black placeholder:text-gray-500'}
          `}
        />
      </div>

      {/* Suggested Tags */}
      <div className="mt-2">
        <p className="text-xs text-gray-500 mb-2">Suggested tags:</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TAGS.filter(tag => !selectedTags.includes(tag)).slice(0, 6).map(tag => (
            <button
              key={tag}
              onClick={() => addTag(tag)}
              className={`
                text-xs px-3 py-1 rounded-full transition-colors
                ${darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagSelector;
