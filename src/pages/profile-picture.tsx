import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import FormLayout from "@/components/FormLayout";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, XIcon, UserIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from 'next-auth/react';

export default function ProfilePicture() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { formData, updateFormData, saveStep, isSubmitting } = useForm();
  const { toast } = useToast();
  
  // Initialize state with null first
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update image when formData is available
  useEffect(() => {
    if (formData?.profile_picture) {
      console.log("Setting profile picture from form data");
      setImage(formData.profile_picture);
    }
  }, [formData]);
  
  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Update form data with profile picture
    updateFormData({ profile_picture: image ?? undefined });
    
    // Save and proceed to next step
    const success = await saveStep('profile-picture');
    if (success) {
      router.push("/overview");
    }
  };

  const handleBack = () => {
    router.push("/preferences");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        console.log("Setting new profile picture from file");
        setImage(result);
        // Also update form data immediately
        updateFormData({ profile_picture: result });
      }
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
    <FormLayout title="Upload Profile Picture">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-full">
        <div className="flex flex-col space-y-6">
          <div className="flex items-start">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
              {image ? (
                <div className="relative w-full h-full">
                  <img
                    src={image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <UserIcon className="h-16 w-16 text-gray-400" />
              )}
            </div>
            
            <div className="ml-6 space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                className="flex items-center gap-2 text-purple-600 border-purple-600 hover:bg-purple-50"
              >
                <ImageIcon className="h-4 w-4" />
                Upload Photo
              </Button>

              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              
              <p className="text-gray-500 text-sm max-w-lg">
                Your profile picture will be visible in your CV when you apply for internships via the MyNext portal so make sure:
              </p>
              
              <ol className="text-gray-600 text-sm space-y-1 list-decimal list-inside">
                <li>It is a picture of yourself</li>
                <li>It is clear and bright</li>
              </ol>
              
              <p className="text-gray-500 text-sm">
                You can change your profile picture at any time in the settings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-8">
          <Button
            type="button"
            onClick={handleBack}
            variant="ghost"
            className="text-gray-500"
          >
            Back
          </Button>
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="link"
              onClick={() => router.push("/overview")}
              className="text-gray-500"
            >
              Skip
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6"
            >
              {isSubmitting ? 'Saving...' : 'Next'}
            </Button>
          </div>
        </div>
      </form>
    </FormLayout>
  );
} 