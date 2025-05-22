
import React, { useCallback, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Upload, X, Camera } from "lucide-react";

interface ImageUploaderProps {
  images: File[];
  onChange: (images: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange }) => {
  const { darkMode } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onChange([...images, ...newFiles]);
    }
  }, [images, onChange]);
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        file => file.type.startsWith("image/")
      );
      onChange([...images, ...newFiles]);
    }
  }, [images, onChange]);
  
  return (
    <div className="space-y-3">
      {/* Preview Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((file, index) => (
            <div key={index} className="relative h-24 rounded-lg overflow-hidden">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black/50 rounded-full p-1 hover:bg-black/70"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center
          transition-colors cursor-pointer
          ${isDragging ? 'border-blitz-pink bg-blitz-pink/5' : ''}
          ${darkMode 
            ? 'border-gray-700 hover:border-gray-500' 
            : 'border-gray-300 hover:border-gray-400'}
        `}
      >
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center">
          <div className={`p-3 rounded-full mb-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <Camera className="h-6 w-6 text-blitz-pink" />
          </div>
          <p className="text-sm font-medium mb-1">Drag photos here or click to upload</p>
          <p className="text-xs text-blitz-lightgray">Upload up to 5 photos</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
