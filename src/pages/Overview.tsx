import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useFormData } from "@/hooks/useFormData";
import FormLayout from "@/components/FormLayout";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, User as UserIcon } from "lucide-react";
import { format } from "date-fns";

export default function Overview() {
  const router = useRouter();
  const { data: session } = useSession();
  const { formData } = useFormData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/signin");
    }
  }, [session, router]);

  const handleBack = () => {
    router.push("/preferences");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit the form data
      const response = await fetch("/api/onboard-form/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
        }),
      });

      if (response.ok) {
        router.push("/success");
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <FormLayout
      title="Profile Overview"
      description="Review your information before submitting."
    >
      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Profile Overview</h1>
          </div>

          <Separator />

          {/* Personal Information */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Personal Information</h2>
              <Button
                variant="link"
                className="text-purple-600 hover:text-purple-700"
                onClick={() => router.push("/personal-information")}
              >
                Edit
              </Button>
            </div>

            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Identification (Malaysian IC)</p>
                <p className="text-purple-600">{formData?.identificationNumber || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Display Name</p>
                <p className="text-purple-600">{formData?.displayName || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Full Name (as per passport or IC)</p>
                <p className="text-purple-600">{formData?.fullName || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                <p className="text-purple-600">{formData?.dateOfBirth || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Gender</p>
                <p className="text-purple-600">{formData?.gender || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-purple-600">{formData?.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                <p className="text-purple-600">{formData?.phoneNumber || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Race</p>
                <p className="text-purple-600">{formData?.race || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Nationality</p>
                <p className="text-purple-600">{formData?.nationality || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">State</p>
                <p className="text-purple-600">{formData?.state || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Where do you stay?</p>
                <p className="text-purple-600">{formData?.country || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Postcode</p>
                <p className="text-purple-600">{formData?.postcode || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">City</p>
                <p className="text-purple-600">{formData?.city || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">OKU</p>
                <p className="text-purple-600">{formData?.isOKU ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Current Status Detail</h2>
              <Button
                variant="link"
                className="text-purple-600 hover:text-purple-700"
                onClick={() => router.push("/current-status")}
              >
                Edit
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">What's your scholarship type?</p>
                <p className="text-purple-600">{formData?.scholarshipType || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">What's your current academic qualification?</p>
                <p className="text-purple-600">{formData?.academicQualification || "-"}</p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              className="text-gray-500 hover:text-gray-700"
              onClick={handleBack}
              type="button"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              disabled={isSubmitting}
            >
              <Check className="mr-2 h-4 w-4" /> {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </div>
      </form>
    </FormLayout>
  );
}