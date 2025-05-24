
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, MapPin, Clock, Tag, PlusCircle, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import GlowButton from "@/components/GlowButton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card } from "@/components/ui/card";
import TagSelector from "@/components/AddYours/TagSelector";
import ImageUploader from "@/components/AddYours/ImageUploader";
import VenueTypeSelector from "@/components/AddYours/VenueTypeSelector";
import TimeSelector from "@/components/AddYours/TimeSelector";

type FormValues = {
  name: string;
  address: string;
  type: string;
  description: string;
  openingHours: string;
  closingHours: string;
  budget: "budget" | "mid-range" | "premium";
  tags: string[];
  images: File[];
};

const AddYours: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      address: "",
      type: "",
      description: "",
      openingHours: "09:00",
      closingHours: "22:00",
      budget: "mid-range",
      tags: [],
      images: [],
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    // Here you would normally send the data to your backend
    
    // Show success dialog
    setShowSuccessDialog(true);
    
    // After 2 seconds, navigate back
    setTimeout(() => {
      setShowSuccessDialog(false);
      navigate(-1);
    }, 2000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-blitz-black text-white" : "bg-white text-black"} transition-colors duration-300`}>
      <div className="cosmic-bg absolute inset-0 z-0 pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-lg bg-opacity-70 border-b border-gray-800/10 px-4 py-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-full hover:bg-gray-800/10"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-medium">Add Yours</h1>
          <button 
            onClick={form.handleSubmit(onSubmit)}
            className="p-2 rounded-full hover:bg-gray-800/10"
          >
            <Upload size={20} />
          </button>
        </div>
      </header>

      <main className="px-4 pb-32 pt-6 max-w-md mx-auto z-10 relative animate-fade-in">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Venue Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Venue Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Café Daydream" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Address</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        placeholder="Enter location address" 
                        className="pl-9" 
                        {...field} 
                      />
                    </FormControl>
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-blitz-lightgray" />
                  </div>
                </FormItem>
              )}
            />

            {/* Venue Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Venue Type</FormLabel>
                  <FormControl>
                    <VenueTypeSelector
                      selectedType={field.value}
                      onSelectType={(type) => field.onChange(type)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Budget Selection */}
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Budget</FormLabel>
                  <FormControl>
                    <ToggleGroup 
                      type="single" 
                      value={field.value} 
                      onValueChange={(value: string) => {
                        if (value) field.onChange(value);
                      }}
                      className="justify-start"
                    >
                      <ToggleGroupItem value="budget" className="data-[state=on]:bg-blitz-pink data-[state=on]:text-white">
                        Budget
                      </ToggleGroupItem>
                      <ToggleGroupItem value="mid-range" className="data-[state=on]:bg-blitz-pink data-[state=on]:text-white">
                        Mid-range
                      </ToggleGroupItem>
                      <ToggleGroupItem value="premium" className="data-[state=on]:bg-blitz-pink data-[state=on]:text-white">
                        Premium
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Opening Hours */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="openingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Opens At</FormLabel>
                    <FormControl>
                      <TimeSelector
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="closingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Closes At</FormLabel>
                    <FormControl>
                      <TimeSelector
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Tags</FormLabel>
                  <FormControl>
                    <TagSelector
                      selectedTags={field.value}
                      onTagsChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us what makes this place special..." 
                      className="min-h-[100px] resize-none"
                      maxLength={300}
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-right text-blitz-lightgray">
                    {field.value.length}/300
                  </div>
                </FormItem>
              )}
            />

            {/* Image Uploader */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Upload Photos</FormLabel>
                  <FormControl>
                    <ImageUploader
                      images={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="fixed bottom-8 left-0 right-0 flex justify-center z-20">
              <GlowButton 
                type="submit" 
                className="px-10 py-2.5 rounded-full font-medium"
                showSparkle
                onClick={form.handleSubmit(onSubmit)}
              >
                Submit Spot
              </GlowButton>
            </div>
          </form>
        </Form>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-center">Spot Added Successfully!</DialogTitle>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-blitz-pink/20 p-4 rounded-full mb-4">
              <PlusCircle className="h-12 w-12 text-blitz-pink" />
            </div>
            <p className="text-center">
              Thank you for contributing to Blitz! You've earned 50 Blitz Points.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddYours;
