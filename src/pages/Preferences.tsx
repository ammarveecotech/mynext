import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FormLayout from "@/components/FormLayout";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from 'next-auth/react';

export default function Preferences() {
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
  
  // Initialize state with data from form context
  const [interestedSectors, setInterestedSectors] = useState(formData?.interestedSectors || []);
  const [interestedRoles, setInterestedRoles] = useState(formData?.interestedRoles || []);
  const [preferredStates, setPreferredStates] = useState(formData?.preferredStates || []);
  
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
      preferredStates
    });
    
    // Save and proceed to next step
    const success = await saveStep('preferences');
    if (success) {
      router.push("/profile-picture");
    }
  };

  const handleBack = () => {
    router.push("/current-status");
  };

  const toggleSector = (sector: string) => {
    setInterestedSectors((current: string[]) => 
      current.includes(sector) 
        ? current.filter((s: string) => s !== sector) 
        : [...current, sector]
    );
  };

  const toggleRole = (role: string) => {
    setInterestedRoles((current: string[]) => 
      current.includes(role) 
        ? current.filter((r: string) => r !== role) 
        : [...current, role]
    );
  };

  const toggleState = (state: string) => {
    setPreferredStates((current: string[]) => 
      current.includes(state) 
        ? current.filter((s: string) => s !== state) 
        : [...current, state]
    );
  };

  // Sectors data
  const sectors = [
    "Technology",
    "Education",
    "Healthcare",
    "Finance & Banking",
    "Manufacturing",
    "Oil & Gas",
    "Construction",
    "Retail",
    "Government",
    "Telecommunications",
    "Hospitality",
    "Logistics & Transportation",
  ];

  // Roles data
  const roles = [
    "Software Development",
    "Data Analytics",
    "Project Management",
    "Marketing",
    "Sales",
    "Customer Service",
    "Human Resources",
    "Finance & Accounting",
    "Research & Development",
    "Design",
    "Operations",
    "Consulting",
  ];

  // Malaysian states
  const states = [
    "Johor",
    "Kedah",
    "Kelantan",
    "Melaka",
    "Negeri Sembilan",
    "Pahang",
    "Perak",
    "Perlis",
    "Pulau Pinang",
    "Sabah",
    "Sarawak",
    "Selangor",
    "Terengganu",
    "Kuala Lumpur",
    "Labuan",
    "Putrajaya",
  ];

  return (
    <FormLayout
      title="Preferences"
      description="Tell us about your career preferences to help us match you with the right opportunities."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sectors */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Sectors of Interest</h3>
          <p className="text-sm text-gray-500">Select the sectors you are interested in working in.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sectors.map((sector) => (
              <div key={sector} className="flex items-center space-x-2">
                <Checkbox
                  id={`sector-${sector}`}
                  checked={interestedSectors.includes(sector)}
                  onCheckedChange={() => toggleSector(sector)}
                />
                <Label
                  htmlFor={`sector-${sector}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {sector}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Roles of Interest</h3>
          <p className="text-sm text-gray-500">Select the roles you are interested in.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {roles.map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role}`}
                  checked={interestedRoles.includes(role)}
                  onCheckedChange={() => toggleRole(role)}
                />
                <Label
                  htmlFor={`role-${role}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {role}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* States */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preferred Locations</h3>
          <p className="text-sm text-gray-500">Select the states you are willing to work in.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {states.map((state) => (
              <div key={state} className="flex items-center space-x-2">
                <Checkbox
                  id={`state-${state}`}
                  checked={preferredStates.includes(state)}
                  onCheckedChange={() => toggleState(state)}
                />
                <Label
                  htmlFor={`state-${state}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {state}
                </Label>
              </div>
            ))}
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
            {isSubmitting ? 'Saving...' : 'Next'}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
} 