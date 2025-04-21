import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { User, Calendar, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import FormLayout from '@/components/FormLayout';
import { useFormData, type FormData } from "@/hooks/useFormData";
import React from 'react';

interface MasterDataItem {
  _id: string;
  Id: number;
  Name: string;
  StateId?: number;
  StateCode?: string;
  StateName?: string;
  CountryId?: number;
  CountryCode?: string;
  CountryName?: string;
  Iso2?: string;
  Iso3?: string;
  NumericCode?: string;
  PhoneCode?: string;
  Capital?: string;
  Currency?: string;
  Region?: string;
  Subregion?: string;
}

export default function PersonalInformation() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { formData, fetchFormData, saveFormData } = useFormData();
  const { toast } = useToast();
  
  // Master data states
  const [countries, setCountries] = useState<MasterDataItem[]>([]);
  const [states, setStates] = useState<MasterDataItem[]>([]);
  const [cities, setCities] = useState<MasterDataItem[]>([]);
  
  // Local form state
  const [formState, setFormState] = useState<FormData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch master data from MongoDB
  const fetchMasterData = async () => {
    try {
      // Fetch countries
      const countriesResponse = await fetch('/api/master-data/countries');
      const countriesData = await countriesResponse.json();
      setCountries(countriesData);

      // If there's a selected country, fetch its states
      if (formState.curr_country) {
        const statesResponse = await fetch(`/api/master-data/states?countryId=${formState.curr_country}`);
        const statesData = await statesResponse.json();
        setStates(statesData);

        // If there's a selected state, fetch its cities
        if (formState.state) {
          const citiesResponse = await fetch(`/api/master-data/cities?stateId=${formState.state}`);
          const citiesData = await citiesResponse.json();
          setCities(citiesData);
        }
      }
    } catch (error) {
      console.error('Error fetching master data:', error);
      toast({
        title: "Error",
        description: "Failed to load location data. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Check authentication and load data
  useEffect(() => {
    let isActive = true;

    const initialize = async () => {
      if (status === 'unauthenticated') {
        router.push('/signin');
        return;
      }

      if (status === 'authenticated') {
        try {
          setLoading(true);
          setError(null);
          console.log("PersonalInfo - Fetching form data");
          const data = await fetchFormData();
          
          if (isActive) {
            console.log("PersonalInfo - Setting form data");
            setFormState(data || {});
            await fetchMasterData(); // Fetch master data after form data is loaded
            setLoading(false);
          }
        } catch (error) {
          console.error('Error loading form data:', error);
          if (isActive) {
            setError('Failed to load your information. Please try again.');
            setLoading(false);
            toast({
              title: "Error",
              description: "Failed to load your information. Please try again.",
              variant: "destructive"
            });
          }
        }
      }
    };

    initialize();

    return () => {
      isActive = false;
    };
  }, [status, router, fetchFormData, toast]);

  // Handle select changes with data fetching
  const handleSelectChange = async (value: string, name: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }));
    
    try {
      // Handle dependent dropdowns
      if (name === 'curr_country') {
        // When country changes, fetch states for that country
        const statesResponse = await fetch(`/api/master-data/states?countryId=${value}`);
        const statesData = await statesResponse.json();
        setStates(statesData);
        setCities([]); // Reset cities when country changes
        
        // Reset state and city in form
        setFormState((prev) => ({
          ...prev,
          curr_country: value,
          state: '',
          city: ''
        }));
      } else if (name === 'state') {
        // When state changes, fetch cities for that state
        const citiesResponse = await fetch(`/api/master-data/cities?stateId=${value}`);
        const citiesData = await citiesResponse.json();
        setCities(citiesData);
        
        // Reset city in form
        setFormState((prev) => ({
          ...prev,
          state: value,
          city: ''
        }));
      }
    } catch (error) {
      console.error('Error fetching dependent data:', error);
      toast({
        title: "Error",
        description: "Failed to load location data. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle radio button changes
  const handleRadioChange = (name: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validate form
  const validateForm = () => {
    // Required fields
    const requiredFields = [
      'id_number',
      'display_name',
      'gender',
      'dob',
      'mob_number',
      'nationality'
    ];
    
    for (const field of requiredFields) {
      if (!formState[field as keyof FormData]) {
        toast({
          title: "Validation Error",
          description: `Please fill in all required fields.`,
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await saveFormData(formState);
      router.push('/preferences');
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: 'Error',
        description: 'Failed to save form. Please try again.',
        variant: "destructive"
      });
    }
  };

  // Don't render the form until we confirm authentication
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1b38]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1b38]">
        <div className="text-white text-xl">
          {error}
          <Button
            onClick={() => window.location.reload()}
            className="ml-4 bg-white text-[#0c1b38]"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <FormLayout title="Personal Information" currentStep={1}>
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
        {/* Personal Information */}
        <div className="mb-6">
          <SectionHeading>Personal Information</SectionHeading>
          <div className="grid grid-cols-2 gap-6 mt-4">
            {/* Personal Details Section */}
            <div className="p-4">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-[#6366f1] mr-2" />
                <h3 className="text-md font-medium">Personal Details</h3>
              </div>
              <Separator className="mb-6" />

              <div className="space-y-6">
                {/* Identification Type */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Identification Type</Label>
                  <RadioGroup
                    value={formState.id_type?.toString() || ''}
                    onValueChange={(value) => handleRadioChange('id_type', value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="id-type-ic" />
                      <Label htmlFor="id-type-ic" className="font-normal">Malaysian IC</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="id-type-passport" />
                      <Label htmlFor="id-type-passport" className="font-normal">Passport</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* ID Number */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    {formState.id_type === 1 ? 'IC Number' : 'Passport Number'}
                  </Label>
                  <Input
                    type="text"
                    name="id_number"
                    value={formState.id_number || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your identification number"
                    className="max-w-xs"
                    required
                  />
                </div>

                {/* Name Fields */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Full Name (as per passport or IC)</Label>
                  <Input
                    type="text"
                    name="display_name"
                    value={formState.display_name || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Gender */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Gender</Label>
                  <RadioGroup
                    value={formState.gender || ''}
                    onValueChange={(value) => handleRadioChange('gender', value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="gender-male" />
                      <Label htmlFor="gender-male" className="font-normal">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="F" id="gender-female" />
                      <Label htmlFor="gender-female" className="font-normal">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Date of Birth */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      type="date"
                      name="dob"
                      value={typeof formState.dob === 'string' ? formState.dob : formState.dob instanceof Date ? formState.dob.toISOString().split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="p-4">
              <div className="flex items-center mb-4">
                <Phone className="h-5 w-5 text-[#6366f1] mr-2" />
                <h3 className="text-md font-medium">Contact Information</h3>
              </div>
              <Separator className="mb-6" />

              <div className="space-y-6">
                {/* Phone Number */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="tel"
                      name="mob_number"
                      value={formState.mob_number || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Nationality */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Nationality</Label>
                  <Select
                    value={formState.nationality?.toString() || ''}
                    onValueChange={(value) => handleRadioChange('nationality', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Malaysian</SelectItem>
                      <SelectItem value="2">Singaporean</SelectItem>
                      <SelectItem value="3">Indonesian</SelectItem>
                      <SelectItem value="4">Thai</SelectItem>
                      <SelectItem value="5">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Current Country</Label>
                  <Select
                    value={formState.curr_country?.toString() || ''}
                    onValueChange={(value) => handleSelectChange(value, 'curr_country')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue defaultValue="" placeholder="Select your current country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country._id} value={country.Id.toString()}>
                          {country.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">State</Label>
                  <Select
                    value={formState.state?.toString() || ''}
                    onValueChange={(value) => handleSelectChange(value, 'state')}
                    disabled={!formState.curr_country}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue defaultValue="" placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state._id} value={state.Id.toString()}>
                          {state.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">City</Label>
                  <Select
                    value={formState.city?.toString() || ''}
                    onValueChange={(value) => handleSelectChange(value, 'city')}
                    disabled={!formState.state}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue defaultValue="" placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city._id} value={city.Id.toString()}>
                          {city.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Postal Code */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Postal Code</Label>
                  <Input
                    type="text"
                    name="postalcode"
                    value={formState.postalcode || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your postal code"
                    className="max-w-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-6">
          <SectionHeading>Additional Information</SectionHeading>
          <div className="p-4 mt-4">
            <div className="space-y-6">
              {/* OKU Status */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Are you registered with Department of Social Welfare Malaysia as a person with Disabilities (OKU)?</Label>
                <RadioGroup
                  value={formState.disability_status?.toString() || '0'}
                  onValueChange={(value) => setFormState(prev => ({ ...prev, disability_status: parseInt(value) }))}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="disability-yes" />
                    <Label htmlFor="disability-yes" className="font-normal">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="disability-no" />
                    <Label htmlFor="disability-no" className="font-normal">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            className="px-8"
            onClick={() => router.push('/signin')}
            type="button"
          >
            Back
          </Button>
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              className="px-8"
              onClick={() => router.push('/preferences')}
              type="button"
            >
              Skip
            </Button>
            <Button
              type="submit"
              className="px-8 bg-[#6366f1] hover:bg-[#5355d1]"
            >
              Next
            </Button>
          </div>
        </div>
      </form>
    </FormLayout>
  );
}
