import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import FormLayout from "@/components/FormLayout";
import { useFormData } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, XIcon, UserIcon } from "lucide-react";

export default function ProfilePicture() {
  const router = useRouter();
  const { formData, updateProfilePicture, nextStep, prevStep } = useFormData();
  const [image, setImage] = useState<string | null>(formData.profilePicture.image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfilePicture({ image });
    nextStep();
    router.push("/overview");
  };

  const handleBack = () => {
    prevStep();
    router.push("/preferences");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            {image ? "Next Step" : "Skip"}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
} 