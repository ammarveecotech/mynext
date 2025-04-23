import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import FormLayout from "@/components/FormLayout";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from 'next-auth/react';

export default function ProfilePicture() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { formData, updateFormData, saveStep, isSubmitting } = useForm();
  const { toast } = useToast();
  
  // Always use default avatar
  const defaultAvatar = 'avatar/default.jpg';
  const [image] = useState<string>(defaultAvatar);
  
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
    
    // Update form data with default avatar
    updateFormData({ profile_picture: defaultAvatar });
    
    // Save and proceed to next step
    const success = await saveStep('profile-picture');
    if (success) {
      router.push("/overview");
    }
  };

  const handleBack = () => {
    router.push("/preferences");
  };

  return (
    <FormLayout title="Profile Picture">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-full">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-300">
              <div className="relative w-full h-full">
                <img
                  src={image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            
            <div className="ml-6 space-y-4">
              <div>
                <h3 className="text-lg font-medium">Profile Picture</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Using default profile picture
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
} 