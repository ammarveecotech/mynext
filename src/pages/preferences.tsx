import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "@/context/FormContext";
import FormLayout from "@/components/FormLayout";
import { Search, X, ChevronDown } from "lucide-react";

// Types for master data
interface MasterDataItem {
  _id: string;
  Id: number;
  Name: string;
  Code?: string;
}

interface MasterDataResponse {
  success: boolean;
  data: MasterDataItem[];
  message?: string;
}

interface PreferenceOption {
  id: number;
  title: string;
}

// Interested Roles - Based on common job roles (hardcoded since no master data)
const roleOptions: PreferenceOption[] = [
  { id: 1, title: "Software Developer" },
  { id: 2, title: "Project Manager" },
  { id: 3, title: "Business Analyst" },
  { id: 4, title: "Data Scientist" },
  { id: 5, title: "Product Manager" },
  { id: 6, title: "UX/UI Designer" },
  { id: 7, title: "Sales Executive" },
  { id: 8, title: "Marketing Specialist" },
  { id: 9, title: "HR Professional" },
  { id: 10, title: "Operations Manager" }
];


export default function Preferences() {
  // 1. All hooks at the top level
  const router = useRouter();
  const { data: session, status } = useSession();
  const { formData, updateFormData, saveStep, isSubmitting } = useForm();
  const { toast } = useToast();

  // 2. All refs
  const sectorDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const stateDropdownRef = useRef<HTMLDivElement>(null);

  // State for master data
  const [masterData, setMasterData] = useState<{
    sectors: PreferenceOption[];
    roles: PreferenceOption[];
    states: PreferenceOption[];
  }>({
    sectors: [],
    roles: roleOptions,
    states: [],
  });

  const [preferences, setPreferences] = useState({
    interestedSectors: [] as string[],
    interestedRoles: [] as string[],
    preferredStates: [] as string[],
  });

  const [searchState, setSearchState] = useState({
    sectorSearch: "",
    roleSearch: "",
    stateSearch: "",
  });

  const [dropdownState, setDropdownState] = useState({
    sectorDropdownOpen: false,
    roleDropdownOpen: false,
    stateDropdownOpen: false,
  });

  // Fetch master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        // Fetch sectors (scope of studies)
        const sectorsRes = await fetch('/api/master-data/study-scopes');
        const sectorsData = await sectorsRes.json();
        
        // Fetch states (for Malaysia)
        const statesRes = await fetch('/api/master-data/states?countryId=131');
        const statesData = await statesRes.json();

        setMasterData(prev => ({
          ...prev,
          sectors: sectorsData.map((item: MasterDataItem) => ({
            id: item.Id,
            title: item.Name
          })),
          states: statesData.map((item: MasterDataItem) => ({
            id: item.Id,
            title: item.Name
          }))
        }));
      } catch (error) {
        console.error('Error fetching master data:', error);
        toast({
          title: "Error",
          description: "Failed to load options. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchMasterData();
  }, [toast]);

  // 4. Authentication effect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router]);

  // 5. Initial data load effect
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const response = await fetch('/api/onboard-form/get-data');
        const data = await response.json();
        
        if (data) {
          setPreferences({
            interestedSectors: data.sector ? data.sector.split(',') : [],
            interestedRoles: data.position ? data.position.split(',') : [],
            preferredStates: data.state ? data.state.split(',') : [],
          });
        }
      } catch (error) {
        console.error('Error loading form data:', error);
        toast({
          title: "Error",
          description: "Failed to load your preferences. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (!formData || Object.keys(formData).length === 0) {
      loadFormData();
    }
  }, [toast, formData]);

  // Update preferences when formData changes
  useEffect(() => {
    if (formData) {
      setPreferences({
        interestedSectors: formData.sector ? formData.sector.split(',') : [],
        interestedRoles: formData.position ? formData.position.split(',') : [],
        preferredStates: formData.state ? formData.state.split(',') : [],
      });
    }
  }, [formData]);

  // 6. Click outside effect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sectorDropdownRef.current && !sectorDropdownRef.current.contains(event.target as Node)) {
        setDropdownState(prev => ({ ...prev, sectorDropdownOpen: false }));
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setDropdownState(prev => ({ ...prev, roleDropdownOpen: false }));
      }
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
        setDropdownState(prev => ({ ...prev, stateDropdownOpen: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Loading check
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

  // Filter options based on search
  const filteredSectors = masterData.sectors.filter(sector => 
    sector.title.toLowerCase().includes(searchState.sectorSearch.toLowerCase()) &&
    !preferences.interestedSectors.includes(sector.id.toString())
  );
  
  const filteredRoles = masterData.roles.filter(role => 
    role.title.toLowerCase().includes(searchState.roleSearch.toLowerCase()) &&
    !preferences.interestedRoles.includes(role.id.toString())
  );
  
  const filteredStates = masterData.states.filter(state => 
    state.title.toLowerCase().includes(searchState.stateSearch.toLowerCase()) &&
    !preferences.preferredStates.includes(state.id.toString())
  );

  // Get label for value
  const getSectorLabel = (id: string) => {
    const numId = parseInt(id);
    return masterData.sectors.find(s => s.id === numId)?.title ?? id;
  };

  const getRoleLabel = (id: string) => {
    const numId = parseInt(id);
    return masterData.roles.find(r => r.id === numId)?.title ?? id;
  };

  const getStateLabel = (id: string) => {
    const numId = parseInt(id);
    return masterData.states.find(s => s.id === numId)?.title ?? id;
  };

  // Handler functions
  const handleSectorSelect = (sector: PreferenceOption) => {
    const sectorId = sector.id.toString();
    if (!preferences.interestedSectors.includes(sectorId)) {
      setPreferences(prev => ({
        ...prev,
        interestedSectors: [...prev.interestedSectors, sectorId]
      }));
    }
    setSearchState(prev => ({ ...prev, sectorSearch: "" }));
  };

  const handleRoleSelect = (role: PreferenceOption) => {
    const roleId = role.id.toString();
    if (!preferences.interestedRoles.includes(roleId) && preferences.interestedRoles.length < 3) {
      setPreferences(prev => ({
        ...prev,
        interestedRoles: [...prev.interestedRoles, roleId]
      }));
    }
    setSearchState(prev => ({ ...prev, roleSearch: "" }));
  };

  const handleStateSelect = (state: PreferenceOption) => {
    const stateId = state.id.toString();
    if (!preferences.preferredStates.includes(stateId) && preferences.preferredStates.length < 3) {
      setPreferences(prev => ({
        ...prev,
        preferredStates: [...prev.preferredStates, stateId]
      }));
    }
    setSearchState(prev => ({ ...prev, stateSearch: "" }));
  };

  const removeSector = (sectorId: string) => {
    setPreferences(prev => ({
      ...prev,
      interestedSectors: prev.interestedSectors.filter(s => s !== sectorId)
    }));
  };

  const removeRole = (roleId: string) => {
    setPreferences(prev => ({
      ...prev,
      interestedRoles: prev.interestedRoles.filter(r => r !== roleId)
    }));
  };

  const removeState = (stateId: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredStates: prev.preferredStates.filter(s => s !== stateId)
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate that at least one option is selected in each category
    if (preferences.interestedSectors.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one sector of interest.",
        variant: "destructive",
      });
      return;
    }

    if (preferences.interestedRoles.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one role of interest.",
        variant: "destructive",
      });
      return;
    }

    if (preferences.preferredStates.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one preferred location.",
        variant: "destructive",
      });
      return;
    }

    // Update the form context with local state
    // Convert arrays to comma-separated strings for database storage
    updateFormData({
      sector: preferences.interestedSectors.join(','),
      position: preferences.interestedRoles.join(','),
      state: preferences.preferredStates.join(','),
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
                onClick={() => setDropdownState(prev => ({ ...prev, sectorDropdownOpen: !prev.sectorDropdownOpen }))}
              >
                <div className="flex items-center flex-1">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search sector"
                    value={searchState.sectorSearch}
                    onChange={(e) => setSearchState(prev => ({ ...prev, sectorSearch: e.target.value }))}
                    className="border-none outline-none w-full focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              
              {dropdownState.sectorDropdownOpen && (
                <div className="absolute z-10 bg-white border rounded-md shadow-md mt-1 w-full max-h-48 overflow-y-auto">
                  {filteredSectors.length > 0 ? (
                    filteredSectors.map((sector) => (
                      <div
                        key={sector.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleSectorSelect(sector);
                          setDropdownState(prev => ({ ...prev, sectorDropdownOpen: false }));
                        }}
                      >
                        {sector.title}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      {searchState.sectorSearch ? "No results found" : "All sectors already selected"}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {preferences.interestedSectors.map((sectorId) => (
                <div
                  key={sectorId}
                  className="flex items-center bg-purple-100 text-purple-700 rounded-lg px-3 py-1.5"
                >
                  <span>{getSectorLabel(sectorId)}</span>
                  <button
                    type="button"
                    onClick={() => removeSector(sectorId)}
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
                onClick={() => setDropdownState(prev => ({ ...prev, roleDropdownOpen: !prev.roleDropdownOpen }))}
              >
                <div className="flex items-center flex-1">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search role"
                    value={searchState.roleSearch}
                    onChange={(e) => setSearchState(prev => ({ ...prev, roleSearch: e.target.value }))}
                    className="border-none outline-none w-full focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                    disabled={preferences.interestedRoles.length >= 3}
                  />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              
              {dropdownState.roleDropdownOpen && preferences.interestedRoles.length < 3 && (
                <div className="absolute z-10 bg-white border rounded-md shadow-md mt-1 w-full max-h-48 overflow-y-auto">
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => (
                      <div
                        key={role.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleRoleSelect(role);
                          setDropdownState(prev => ({ ...prev, roleDropdownOpen: false }));
                        }}
                      >
                        {role.title}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      {searchState.roleSearch ? "No results found" : "No more roles available"}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {preferences.interestedRoles.map((roleId) => (
                <div
                  key={roleId}
                  className="flex items-center bg-purple-100 text-purple-700 rounded-lg px-3 py-1.5"
                >
                  <span>{getRoleLabel(roleId)}</span>
                  <button
                    type="button"
                    onClick={() => removeRole(roleId)}
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
                onClick={() => setDropdownState(prev => ({ ...prev, stateDropdownOpen: !prev.stateDropdownOpen }))}
              >
                <div className="flex items-center flex-1">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search state"
                    value={searchState.stateSearch}
                    onChange={(e) => setSearchState(prev => ({ ...prev, stateSearch: e.target.value }))}
                    className="border-none outline-none w-full focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                    disabled={preferences.preferredStates.length >= 3}
                  />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              
              {dropdownState.stateDropdownOpen && preferences.preferredStates.length < 3 && (
                <div className="absolute z-10 bg-white border rounded-md shadow-md mt-1 w-full max-h-48 overflow-y-auto">
                  {filteredStates.length > 0 ? (
                    filteredStates.map((state) => (
                      <div
                        key={state.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleStateSelect(state);
                          setDropdownState(prev => ({ ...prev, stateDropdownOpen: false }));
                        }}
                      >
                        {state.title}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      {searchState.stateSearch ? "No results found" : "No more states available"}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {preferences.preferredStates.map((stateId) => (
                <div
                  key={stateId}
                  className="flex items-center bg-purple-100 text-purple-700 rounded-lg px-3 py-1.5"
                >
                  <span>{getStateLabel(stateId)}</span>
                  <button
                    type="button"
                    onClick={() => removeState(stateId)}
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