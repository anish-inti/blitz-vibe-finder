import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, MapPin, Clock, Tag, PlusCircle, X, Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import GlowButton from "@/components/GlowButton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import TagSelector from "@/components/AddYours/TagSelector";
import ImageUploader from "@/components/AddYours/ImageUploader";
import VenueTypeSelector from "@/components/AddYours/VenueTypeSelector";
import TimeSelector from "@/components/AddYours/TimeSelector";
import Header from "@/components/Header";

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
    setShowSuccessDialog(true);
    
    setTimeout(() => {
      setShowSuccessDialog(false);
      navigate(-1);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Luxury background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-blitz-primary/3 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-blitz-secondary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <Header showBackButton title="Add Your Spot" />

      <main className="relative px-6 pb-32 pt-8 max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blitz-primary to-blitz-accent text-white shadow-lg">
            <PlusCircle className="w-8 h-8" />
          </div>
          
          <div>
            <h1 className="text-display mb-2 text-gradient">
              Share Your Discovery
            </h1>
            <p className="text-caption text-muted-foreground">
              Help others discover amazing places
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Venue Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="animate-slide-up">
                  <FormLabel className="text-base font-semibold">Venue Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="E.g., Café Daydream" 
                      className="rounded-xl border-border focus:ring-2 focus:ring-blitz-primary focus:border-transparent"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <FormLabel className="text-base font-semibold">Address</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        placeholder="Enter location address" 
                        className="pl-10 rounded-xl border-border focus:ring-2 focus:ring-blitz-primary focus:border-transparent" 
                        {...field} 
                      />
                    </FormControl>
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormItem>
              )}
            />

            {/* Venue Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <FormLabel className="text-base font-semibold">Venue Type</FormLabel>
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
                <FormItem className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <FormLabel className="text-base font-semibold">Budget Category</FormLabel>
                  <FormControl>
                    <ToggleGroup 
                      type="single" 
                      value={field.value} 
                      onValueChange={(value: string) => {
                        if (value) field.onChange(value);
                      }}
                      className="justify-start grid grid-cols-3 gap-2"
                    >
                      <ToggleGroupItem 
                        value="budget" 
                        className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-green-500 data-[state=on]:to-emerald-500 data-[state=on]:text-white rounded-xl"
                      >
                        Budget
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="mid-range" 
                        className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-blitz-primary data-[state=on]:to-blitz-accent data-[state=on]:text-white rounded-xl"
                      >
                        Mid-range
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="premium" 
                        className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-yellow-500 data-[state=on]:to-orange-500 data-[state=on]:text-white rounded-xl"
                      >
                        Premium
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Opening Hours */}
            <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <FormField
                control={form.control}
                name="openingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Opens At</FormLabel>
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
                    <FormLabel className="text-base font-semibold">Closes At</FormLabel>
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
                <FormItem className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
                  <FormLabel className="text-base font-semibold">Tags</FormLabel>
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
                <FormItem className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
                  <FormLabel className="text-base font-semibold">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us what makes this place special..." 
                      className="min-h-[100px] resize-none rounded-xl border-border focus:ring-2 focus:ring-blitz-primary focus:border-transparent"
                      maxLength={300}
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-right text-muted-foreground">
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
                <FormItem className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
                  <FormLabel className="text-base font-semibold">Upload Photos</FormLabel>
                  <FormControl>
                    <ImageUploader
                      images={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>

        {/* Submit Button */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-20 px-6">
          <GlowButton 
            type="submit" 
            className="w-full max-w-md px-10 py-4 rounded-2xl font-bold text-lg"
            showSparkle
            onClick={form.handleSubmit(onSubmit)}
          >
            Submit Your Spot
          </GlowButton>
        </div>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="card-hero border-blitz-primary/20">
          <DialogTitle className="text-center text-headline">Spot Added Successfully!</DialogTitle>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blitz-primary to-blitz-accent text-white mb-4 animate-bounce-in">
              <PlusCircle className="h-8 w-8" />
            </div>
            <p className="text-center text-muted-foreground">
              Thank you for contributing to Blitz! You've earned 50 Blitz Points.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddYours;