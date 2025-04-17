import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import FormLayout from "@/components/FormLayout";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, XIcon, UserIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from 'next-auth/react';

export default function ProfilePicture() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { formData, updateFormData, saveStep, isSubmitting } = useForm();
  const { toast } = useToast();
  
  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/landing');
    }
  }, [status, router]);

  // Don't render the form until we confirm authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1b38]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  if (status === 'unauthenticated') {
    return null;
  }
  
  // Initialize state with profile picture from form data
  const [image, setImage] = useState<string | null>(formData?.profilePicture || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update form data with profile picture
    updateFormData({ profilePicture: image || undefined });
    
    // Save and proceed to next step
    const success = await saveStep('profile-picture');
    if (success) {
      router.push("/overview");
    }
  };

  const handleBack = () => {
    router.push("/preferences");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image under 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <FormLayout
      title="Profile Picture"
      description="Upload a profile picture to complete your profile."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Upload a profile picture</h3>
          <p className="text-sm text-gray-500">
            This will be displayed on your profile. You can skip this step if you prefer.
          </p>

          <div className="flex items-center justify-center">
            <div className="h-40 w-40 rounded-full relative overflow-hidden bg-gray-100 flex items-center justify-center">
              {image ? (
                <>
                  <img
                    src={image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-2"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <UserIcon className="h-16 w-16 text-gray-400" />
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              className="flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Select Image
            </Button>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            onClick={handleBack}
            variant="outline"
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (image ? 'Next' : 'Skip')}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
} 