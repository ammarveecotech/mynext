
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "@/components/FormLayout";
import { useFormData } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

// Define data
const sectors = [
  "Healthcare & Pharmaceuticals",
  "Education & Research",
  "Technology",
  "Finance",
  "Manufacturing",
  "Retail",
  "Energy",
  "Transportation"
];

const roles = [
  "Doctor/Physician",
  "Researcher",
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "Business Analyst",
  "Marketing Manager"
];

const states = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Penang",
  "Perak",
  "Perlis",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "Kuala Lumpur",
  "Labuan",
  "Putrajaya"
];

const Preferences = () => {
  const navigate = useNavigate();
  const { formData, updatePreferences, nextStep, prevStep } = useFormData();
  
  const [sectorSearch, setSectorSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");

  const [selectedSectors, setSelectedSectors] = useState<string[]>(formData.preferences.sectors || []);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(formData.preferences.roles || []);
  const [selectedStates, setSelectedStates] = useState<string[]>(formData.preferences.states || []);

  const filteredSectors = sectors.filter(sector => 
    sector.toLowerCase().includes(sectorSearch.toLowerCase())
  );

  const filteredRoles = roles.filter(role => 
    role.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const filteredStates = states.filter(state => 
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const toggleSector = (sector: string) => {
    setSelectedSectors(prev => 
      prev.includes(sector)
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(prev => prev.filter(r => r !== role));
    } else {
      if (selectedRoles.length < 3) {
        setSelectedRoles(prev => [...prev, role]);
      }
    }
  };

  const toggleState = (state: string) => {
    if (selectedStates.includes(state)) {
      setSelectedStates(prev => prev.filter(s => s !== state));
    } else {
      if (selectedStates.length < 3) {
        setSelectedStates(prev => [...prev, state]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      sectors: selectedSectors,
      roles: selectedRoles,
      states: selectedStates
    });
    nextStep();
    navigate("/profile-picture");
  };

  return (
    <FormLayout 
      title="Preferences" 
      greeting="GREAT JOB!" 
      description="Now, let's personalize your experience even further. Tell us about your preferences so we can tailor opportunities that suit your goals."
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Sectors */}
        <div className="space-y-4">
          <div>
            <Label className="text-base">Please choose your <span className="text-indigo-600">interested sectors</span>.</Label>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sector"
              value={sectorSearch}
              onChange={(e) => setSectorSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filteredSectors.map((sector) => (
              <Button
                key={sector}
                type="button"
                variant={selectedSectors.includes(sector) ? "default" : "outline"}
                onClick={() => toggleSector(sector)}
                className="rounded-full h-auto py-1.5"
              >
                {sector}
              </Button>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div className="space-y-4">
          <div>
            <Label className="text-base">Please choose 3 of your <span className="text-indigo-600">interested roles</span>.</Label>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search role"
              value={roleSearch}
              onChange={(e) => setRoleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filteredRoles.map((role) => (
              <Button
                key={role}
                type="button"
                variant={selectedRoles.includes(role) ? "default" : "outline"}
                onClick={() => toggleRole(role)}
                disabled={!selectedRoles.includes(role) && selectedRoles.length >= 3}
                className="rounded-full h-auto py-1.5"
              >
                {role}
              </Button>
            ))}
          </div>
        </div>

        {/* States */}
        <div className="space-y-4">
          <div>
            <Label className="text-base">Please choose 3 of your <span className="text-indigo-600">preferred states</span>.</Label>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search state"
              value={stateSearch}
              onChange={(e) => setStateSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filteredStates.map((state) => (
              <Button
                key={state}
                type="button"
                variant={selectedStates.includes(state) ? "default" : "outline"}
                onClick={() => toggleState(state)}
                disabled={!selectedStates.includes(state) && selectedStates.length >= 3}
                className="rounded-full h-auto py-1.5"
              >
                {state}
              </Button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-4 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              prevStep();
              navigate("/current-status");
            }}
          >
            Back
          </Button>
          <div className="space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                updatePreferences({
                  sectors: selectedSectors,
                  roles: selectedRoles,
                  states: selectedStates
                });
                nextStep();
                navigate("/profile-picture");
              }}
            >
              Skip
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </div>
      </form>
    </FormLayout>
  );
};

export default Preferences;
