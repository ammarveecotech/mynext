import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "@/context/FormContext";
import FormLayout from "@/components/FormLayout";
import { Search, X, ChevronDown } from "lucide-react";

export default function Preferences() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { formData, updateFormData, saveStep, isSubmitting } = useForm();
  const { toast } = useToast();

  // Refs for dropdown containers
  const sectorDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const stateDropdownRef = useRef<HTMLDivElement>(null);

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

  // Search inputs
  const [sectorSearch, setSectorSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");

  // Dropdown state
  const [sectorDropdownOpen, setSectorDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);

  // Handle clicks outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sectorDropdownRef.current && !sectorDropdownRef.current.contains(event.target as Node)) {
        setSectorDropdownOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
        setStateDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleSectorSelect = (sector: string) => {
    if (!interestedSectors.includes(sector)) {
      setInterestedSectors([...interestedSectors, sector]);
    }
    setSectorSearch("");
  };

  const handleRoleSelect = (role: string) => {
    if (!interestedRoles.includes(role) && interestedRoles.length < 3) {
      setInterestedRoles([...interestedRoles, role]);
    }
    setRoleSearch("");
  };

  const handleStateSelect = (state: string) => {
    if (!preferredStates.includes(state) && preferredStates.length < 3) {
      setPreferredStates([...preferredStates, state]);
    }
    setStateSearch("");
  };

  const removeSector = (sector: string) => {
    setInterestedSectors(interestedSectors.filter(s => s !== sector));
  };

  const removeRole = (role: string) => {
    setInterestedRoles(interestedRoles.filter(r => r !== role));
  };

  const removeState = (state: string) => {
    setPreferredStates(preferredStates.filter(s => s !== state));
  };

  // Filter options based on search
  const filteredSectors = sectorOptions.filter(sector => 
    sector.label.toLowerCase().includes(sectorSearch.toLowerCase()) &&
    !interestedSectors.includes(sector.value)
  );
  
  const filteredRoles = roleOptions.filter(role => 
    role.label.toLowerCase().includes(roleSearch.toLowerCase()) &&
    !interestedRoles.includes(role.value)
  );
  
  const filteredStates = stateOptions.filter(state => 
    state.label.toLowerCase().includes(stateSearch.toLowerCase()) &&
    !preferredStates.includes(state.value)
  );

  // Get label for value
  const getSectorLabel = (value: string) => {
    return sectorOptions.find(s => s.value === value)?.label || value;
  };

  const getRoleLabel = (value: string) => {
    return roleOptions.find(r => r.value === value)?.label || value;
  };

  const getStateLabel = (value: string) => {
    return stateOptions.find(s => s.value === value)?.label || value;
  };

  return (
    <FormLayout title="Preferences">
      <form onSubmit={handleSubmit} className="space-y-12 max-w-full">
        <div className="space-y-8">
          {/* Interested Sectors */}
          <div className="space-y-4">
            <p className="text-base font-medium">
              Please choose your <span className="text-purple-600">interested sectors</span>.
            </p>
            <div className="relative" ref={sectorDropdownRef}>
              <div 
                className="flex items-center justify-between border rounded-md cursor-pointer px-3 py-2"
                onClick={() => setSectorDropdownOpen(!sectorDropdownOpen)}
              >
                <div className="flex items-center flex-1">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search sector"
                    value={sectorSearch}
                    onChange={(e) => setSectorSearch(e.target.value)}
                    className="border-none outline-none w-full focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              
              {sectorDropdownOpen && (
                <div className="absolute z-10 bg-white border rounded-md shadow-md mt-1 w-full max-h-48 overflow-y-auto">
                  {filteredSectors.length > 0 ? (
                    filteredSectors.map((sector) => (
                      <div
                        key={sector.value}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleSectorSelect(sector.value);
                          setSectorDropdownOpen(false);
                        }}
                      >
                        {sector.label}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      {sectorSearch ? "No results found" : "All sectors already selected"}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {interestedSectors.map((sector) => (
                <div
                  key={sector}
                  className="flex items-center bg-purple-100 text-purple-700 rounded-lg px-3 py-1.5"
                >
                  <span>{getSectorLabel(sector)}</span>
                  <button
                    type="button"
                    onClick={() => removeSector(sector)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Interested Roles */}
          <div className="space-y-4">
            <p className="text-base font-medium">
              Please choose <span className="text-purple-600">3 of your interested roles</span>.
            </p>
            <div className="relative" ref={roleDropdownRef}>
              <div 
                className="flex items-center justify-between border rounded-md cursor-pointer px-3 py-2"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              >
                <div className="flex items-center flex-1">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search role"
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    className="border-none outline-none w-full focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                    disabled={interestedRoles.length >= 3}
                  />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              
              {roleDropdownOpen && interestedRoles.length < 3 && (
                <div className="absolute z-10 bg-white border rounded-md shadow-md mt-1 w-full max-h-48 overflow-y-auto">
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => (
                      <div
                        key={role.value}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleRoleSelect(role.value);
                          setRoleDropdownOpen(false);
                        }}
                      >
                        {role.label}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      {roleSearch ? "No results found" : "No more roles available"}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {interestedRoles.map((role) => (
                <div
                  key={role}
                  className="flex items-center bg-purple-100 text-purple-700 rounded-lg px-3 py-1.5"
                >
                  <span>{getRoleLabel(role)}</span>
                  <button
                    type="button"
                    onClick={() => removeRole(role)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred States */}
          <div className="space-y-4">
            <p className="text-base font-medium">
              Please choose <span className="text-purple-600">3 of your preferred states</span>.
            </p>
            <div className="relative" ref={stateDropdownRef}>
              <div 
                className="flex items-center justify-between border rounded-md cursor-pointer px-3 py-2"
                onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
              >
                <div className="flex items-center flex-1">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search state"
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    className="border-none outline-none w-full focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                    disabled={preferredStates.length >= 3}
                  />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              
              {stateDropdownOpen && preferredStates.length < 3 && (
                <div className="absolute z-10 bg-white border rounded-md shadow-md mt-1 w-full max-h-48 overflow-y-auto">
                  {filteredStates.length > 0 ? (
                    filteredStates.map((state) => (
                      <div
                        key={state.value}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleStateSelect(state.value);
                          setStateDropdownOpen(false);
                        }}
                      >
                        {state.label}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      {stateSearch ? "No results found" : "No more states available"}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {preferredStates.map((state) => (
                <div
                  key={state}
                  className="flex items-center bg-purple-100 text-purple-700 rounded-lg px-3 py-1.5"
                >
                  <span>{getStateLabel(state)}</span>
                  <button
                    type="button"
                    onClick={() => removeState(state)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
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
