import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "@/context/FormContext";
import FormLayout from "@/components/FormLayout";
import { SectionHeading } from "@/components/ui/section-heading";
import { MultiSelect } from "@/components/ui/multi-select";
import { Card, CardContent } from "@/components/ui/card";

export default function Preferences() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { formData, updateFormData, saveStep, isSubmitting } = useForm();
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router]);

  // Initialize state with data from form context
  const [interestedSectors, setInterestedSectors] = useState<string[]>(
    formData?.interestedSectors || []
  );
  const [interestedRoles, setInterestedRoles] = useState<string[]>(
    formData?.interestedRoles || []
  );
  const [preferredStates, setPreferredStates] = useState<string[]>(
    formData?.preferredStates || []
  );

  // Don't render the form until we confirm authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1b38]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  // Available options
  const sectorOptions = [
    { value: "healthcare", label: "Healthcare & Pharmaceuticals" },
    { value: "education", label: "Education & Research" },
    { value: "tech", label: "Technology & IT" },
    { value: "finance", label: "Finance & Banking" },
    { value: "manufacturing", label: "Manufacturing & Engineering" },
  ];

  const roleOptions = [
    { value: "doctor", label: "Doctor (Physician)" },
    { value: "researcher", label: "Researcher" },
    { value: "engineer", label: "Engineer" },
    { value: "developer", label: "Software Developer" },
    { value: "analyst", label: "Business Analyst" },
  ];

  const stateOptions = [
    { value: "kelantan", label: "Kelantan" },
    { value: "selangor", label: "Selangor" },
    { value: "kl", label: "Kuala Lumpur" },
    { value: "penang", label: "Penang" },
    { value: "johor", label: "Johor" },
  ];

  // Update state when form data changes
  useEffect(() => {
    if (formData) {
      setInterestedSectors(formData.interestedSectors || []);
      setInterestedRoles(formData.interestedRoles || []);
      setPreferredStates(formData.preferredStates || []);
    }
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one option is selected in each category
    if (interestedSectors.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one sector of interest.",
        variant: "destructive",
      });
      return;
    }

    if (interestedRoles.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one role of interest.",
        variant: "destructive",
      });
      return;
    }

    if (preferredStates.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one preferred location.",
        variant: "destructive",
      });
      return;
    }

    // Update the form context with local state
    updateFormData({
      interestedSectors,
      interestedRoles,
      preferredStates,
    });

    // Save and proceed to next step
    const success = await saveStep("preferences");
    if (success) {
      router.push("/profile-picture");
    }
  };

  const handleBack = () => {
    router.push("/current-status");
  };

  const handleSectorClick = (sector: string) => {
    setInterestedSectors((current) =>
      current.includes(sector)
        ? current.filter((s) => s !== sector)
        : [...current, sector]
    );
  };

  const handleRoleClick = (role: string) => {
    // Limit to 3 roles max
    setInterestedRoles((current) => {
      if (current.includes(role)) {
        return current.filter((r) => r !== role);
      } else if (current.length < 3) {
        return [...current, role];
      }
      return current;
    });
  };

  const handleStateClick = (state: string) => {
    // Limit to 3 states max
    setPreferredStates((current) => {
      if (current.includes(state)) {
        return current.filter((s) => s !== state);
      } else if (current.length < 3) {
        return [...current, state];
      }
      return current;
    });
  };

  return (
    <FormLayout title="Preferences">
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="space-y-8">
          {/* Interested Sectors */}
          <div className="space-y-4">
            <p className="text-base font-medium">
              Please choose your <span className="text-purple-600">interested sectors</span>.
            </p>
            <div className="flex flex-wrap gap-3">
              {sectorOptions.map((sector) => (
                <button
                  type="button"
                  key={sector.value}
                  onClick={() => handleSectorClick(sector.value)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    interestedSectors.includes(sector.value)
                      ? "bg-purple-100 text-purple-700 border border-purple-300"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {sector.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interested Roles */}
          <div className="space-y-4">
            <p className="text-base font-medium">
              Please choose <span className="text-purple-600">3 of your interested roles</span>.
            </p>
            <div className="flex flex-wrap gap-3">
              {roleOptions.map((role) => (
                <button
                  type="button"
                  key={role.value}
                  onClick={() => handleRoleClick(role.value)}
                  disabled={!interestedRoles.includes(role.value) && interestedRoles.length >= 3}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    interestedRoles.includes(role.value)
                      ? "bg-purple-100 text-purple-700 border border-purple-300"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred States */}
          <div className="space-y-4">
            <p className="text-base font-medium">
              Please choose <span className="text-purple-600">3 of your preferred states</span>.
            </p>
            <div className="flex flex-wrap gap-3">
              {stateOptions.map((state) => (
                <button
                  type="button"
                  key={state.value}
                  onClick={() => handleStateClick(state.value)}
                  disabled={!preferredStates.includes(state.value) && preferredStates.length >= 3}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    preferredStates.includes(state.value)
                      ? "bg-purple-100 text-purple-700 border border-purple-300"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {state.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            className="px-8 text-gray-500 hover:text-gray-700"
            onClick={handleBack}
            type="button"
            variant="ghost"
          >
            Back
          </Button>
          <div className="flex space-x-4">
            <Button
              variant="link"
              className="text-gray-500"
              onClick={() => router.push("/profile-picture")}
              type="button"
            >
              Skip
            </Button>
            <Button
              type="submit"
              className="px-12 bg-gray-200 hover:bg-gray-300 text-gray-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Next"}
            </Button>
          </div>
        </div>
      </form>
    </FormLayout>
  );
}
