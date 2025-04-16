
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "@/components/FormLayout";
import { useFormData } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

const ProfilePicture = () => {
  const navigate = useNavigate();
  const { formData, updateProfilePicture, nextStep, prevStep } = useFormData();
  const [image, setImage] = useState<string | null>(formData.profilePicture.image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfilePicture({ image });
    nextStep();
    navigate("/overview");
  };

  return (
    <FormLayout 
      title="Upload Profile Picture" 
      greeting="LOOKING GOOD!" 
      description="Let's make your profile even more personal. Add a profile picture to make your profile more engaging and recognizable to potential employers."
    >
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col items-center space-y-8">
          {/* Avatar */}
          <div className="relative group">
            <Avatar className="h-40 w-40 border-2 border-gray-200">
              {image ? (
                <AvatarImage src={image} alt="Profile" />
              ) : (
                <AvatarFallback className="bg-gray-100 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-16 h-16"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </AvatarFallback>
              )}
            </Avatar>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
            
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            type="button" 
            variant="outline"
            className="flex items-center space-x-2 text-indigo-600"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
          </Button>
          
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Your profile picture will be visible in your CV when you apply for internships via the MyNext portal so make sure:
            </p>
            <ol className="text-left text-gray-600 space-y-1">
              <li>1. It is a picture of yourself</li>
              <li>2. It is clear and bright</li>
            </ol>
            <p className="text-gray-600">
              You can change your profile picture at any time in the settings.
            </p>
          </div>
          
          {/* Navigation Buttons */}
          <div className="w-full pt-6 flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                prevStep();
                navigate("/preferences");
              }}
            >
              Back
            </Button>
            <div className="space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  updateProfilePicture({ image });
                  nextStep();
                  navigate("/overview");
                }}
              >
                Skip
              </Button>
              <Button onClick={handleSubmit}>Next</Button>
            </div>
          </div>
        </div>
      </div>
    </FormLayout>
  );
};

export default ProfilePicture;
