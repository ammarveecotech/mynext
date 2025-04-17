import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import FormLayout from '@/components/FormLayout';
import { useForm } from '@/context/FormContext';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

export default function PersonalInformation() {
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
  
  // Local form state
  const [formState, setFormState] = useState({
    identificationType: formData.identificationType || 'malaysianIC',
    identificationNumber: formData.identificationNumber || '',
    fullName: formData.fullName || '',
    displayName: formData.displayName || '',
    gender: formData.gender || 'male',
    dateOfBirth: formData.dateOfBirth || '',
    phoneNumber: formData.phoneNumber || '',
    email: formData.email || '',
    nationality: formData.nationality || 'malaysian',
    race: formData.race || '',
    country: formData.country || '',
    state: formData.state || '',
    city: formData.city || '',
    postcode: formData.postcode || '',
    isOKU: formData.isOKU || false,
  });
  
  // Load form data when component mounts
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      setFormState({
        identificationType: formData.identificationType || 'malaysianIC',
        identificationNumber: formData.identificationNumber || '',
        fullName: formData.fullName || '',
        displayName: formData.displayName || '',
        gender: formData.gender || 'male',
        dateOfBirth: formData.dateOfBirth || '',
        phoneNumber: formData.phoneNumber || '',
        email: formData.email || '',
        nationality: formData.nationality || 'malaysian',
        race: formData.race || '',
        country: formData.country || '',
        state: formData.state || '',
        city: formData.city || '',
        postcode: formData.postcode || '',
        isOKU: formData.isOKU || false,
      });
    }
  }, [formData]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle radio button changes
  const handleRadioChange = (name: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validate form
  const validateForm = () => {
    // Required fields
    const requiredFields = [
      'identificationNumber',
      'fullName',
      'gender',
      'dateOfBirth',
      'phoneNumber',
      'email',
      'nationality'
    ];
    
    for (const field of requiredFields) {
      if (!formState[field as keyof typeof formState]) {
        toast({
          title: "Validation Error",
          description: `Please fill in all required fields.`,
          variant: "destructive",
        });
        return false;
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Update the form context with the local state
    updateFormData(formState);
    
    // Save the current step and proceed to the next one
    const success = await saveStep('personal-information');
    
    if (success) {
      router.push('/current-status');
    }
  };
  
  return (
    <FormLayout title="Personal Information">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identification Type */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Identification Type</h2>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="identificationType"
                checked={formState.identificationType === 'malaysianIC'}
                onChange={() => handleRadioChange('identificationType', 'malaysianIC')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Malaysian IC</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="identificationType"
                checked={formState.identificationType === 'passportNumber'}
                onChange={() => handleRadioChange('identificationType', 'passportNumber')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Passport Number</span>
            </label>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Please insert your identification number</p>
            <p className="text-sm text-gray-500 mb-2">Please fill in without the "-" symbol</p>
            <input
              type="text"
              name="identificationNumber"
              value={formState.identificationNumber}
              onChange={handleInputChange}
              placeholder="Enter your identification number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name (as per passport or IC)
            </label>
            <input
              type="text"
              name="fullName"
              value={formState.fullName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Display Name (optional)
            </label>
            <input
              type="text"
              name="displayName"
              value={formState.displayName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Gender</h2>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gender"
                checked={formState.gender === 'male'}
                onChange={() => handleRadioChange('gender', 'male')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Male</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gender"
                checked={formState.gender === 'female'}
                onChange={() => handleRadioChange('gender', 'female')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Female</span>
            </label>
          </div>
        </div>

        {/* Date of Birth & Phone Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formState.dateOfBirth}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formState.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Nationality */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Nationality</h2>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="nationality"
                checked={formState.nationality === 'malaysian'}
                onChange={() => handleRadioChange('nationality', 'malaysian')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Malaysian</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="nationality"
                checked={formState.nationality === 'nonMalaysian'}
                onChange={() => handleRadioChange('nationality', 'nonMalaysian')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Non-Malaysian</span>
            </label>
          </div>
        </div>

        {/* Race */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Race
          </label>
          <select
            name="race"
            value={formState.race}
            onChange={handleSelectChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select Race</option>
            <option value="malay">Malay</option>
            <option value="chinese">Chinese</option>
            <option value="indian">Indian</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Where do you stay? */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Where do you stay?</h2>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              name="country"
              value={formState.country}
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select Country</option>
              <option value="malaysia">Malaysia</option>
              <option value="singapore">Singapore</option>
              <option value="others">Others</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <select
                name="state"
                value={formState.state}
                onChange={handleSelectChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select State</option>
                <option value="johor">Johor</option>
                <option value="kedah">Kedah</option>
                <option value="kelantan">Kelantan</option>
                <option value="melaka">Melaka</option>
                <option value="negeriSembilan">Negeri Sembilan</option>
                <option value="pahang">Pahang</option>
                <option value="perak">Perak</option>
                <option value="perlis">Perlis</option>
                <option value="penang">Penang</option>
                <option value="sabah">Sabah</option>
                <option value="sarawak">Sarawak</option>
                <option value="selangor">Selangor</option>
                <option value="terengganu">Terengganu</option>
                <option value="kualaLumpur">Kuala Lumpur</option>
                <option value="labuan">Labuan</option>
                <option value="putrajaya">Putrajaya</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formState.city}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Postcode
            </label>
            <input
              type="text"
              name="postcode"
              value={formState.postcode}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* OKU Status */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Are you registered with Department of Social Welfare Malaysia as a person with Disabilities (OKU)?</h2>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="isOKU"
                checked={formState.isOKU === true}
                onChange={() => setFormState(prev => ({ ...prev, isOKU: true }))}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="isOKU"
                checked={formState.isOKU === false}
                onChange={() => setFormState(prev => ({ ...prev, isOKU: false }))}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* Form Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? 'Saving...' : 'Next'}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
} 