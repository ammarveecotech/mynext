import React from "react";
import { useRouter } from "next/router";
import FormLayout from "@/components/FormLayout";
import { useFormData } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Preferences() {
  const router = useRouter();
  const { formData, updatePreferences, nextStep, prevStep } = useFormData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
    router.push("/profile-picture");
  };

  const handleBack = () => {
    prevStep();
    router.push("/current-status");
  };

  const toggleSector = (sector: string) => {
    const currentSectors = [...formData.preferences.sectors];
    if (currentSectors.includes(sector)) {
      updatePreferences({
        sectors: currentSectors.filter((s) => s !== sector),
      });
    } else {
      updatePreferences({
        sectors: [...currentSectors, sector],
      });
    }
  };

  const toggleRole = (role: string) => {
    const currentRoles = [...formData.preferences.roles];
    if (currentRoles.includes(role)) {
      updatePreferences({
        roles: currentRoles.filter((r) => r !== role),
      });
    } else {
      updatePreferences({
        roles: [...currentRoles, role],
      });
    }
  };

  const toggleState = (state: string) => {
    const currentStates = [...formData.preferences.states];
    if (currentStates.includes(state)) {
      updatePreferences({
        states: currentStates.filter((s) => s !== state),
      });
    } else {
      updatePreferences({
        states: [...currentStates, state],
      });
    }
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
                  checked={formData.preferences.sectors.includes(sector)}
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
                  checked={formData.preferences.roles.includes(role)}
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
                  checked={formData.preferences.states.includes(state)}
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

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            Next Step
          </Button>
        </div>
      </form>
    </FormLayout>
  );
} 