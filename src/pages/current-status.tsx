import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import FormLayout from '@/components/FormLayout';
import { useForm } from '@/context/FormContext';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

// Define the form state interface
interface CurrentStatusFormState {
  scholarshipType?: 'scholarshipLoan' | 'selfFunded';
  academicQualification?: string;
  institutionType?: 'malaysiaOrExchange' | 'abroad';
  studyScope?: string;
  enrollmentDate?: string;
  expectedGraduationDate?: string;
  currentYear?: string;
  gradeType?: 'cgpa' | 'grade' | 'others' | 'noGrade';
  gradeValue?: string;
  englishTest?: 'muet' | 'cefr' | 'toefl' | 'ielts' | 'none' | 'other';
  [key: string]: string | undefined;
}

export default function CurrentStatus() {
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
  
  // Local form state with default values
  const [formState, setFormState] = useState<CurrentStatusFormState>({
    scholarshipType: formData?.scholarshipType || 'scholarshipLoan',
    academicQualification: formData?.academicQualification || '',
    institutionType: formData?.institutionType || 'malaysiaOrExchange',
    studyScope: formData?.studyScope || '',
    enrollmentDate: formData?.enrollmentDate || '',
    expectedGraduationDate: formData?.expectedGraduationDate || '',
    currentYear: formData?.currentYear || '',
    gradeType: formData?.gradeType || 'cgpa',
    gradeValue: formData?.gradeValue || '',
    englishTest: formData?.englishTest || 'none',
  });
  
  // Load form data when component mounts
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      setFormState({
        scholarshipType: formData.scholarshipType || 'scholarshipLoan',
        academicQualification: formData.academicQualification || '',
        institutionType: formData.institutionType || 'malaysiaOrExchange',
        studyScope: formData.studyScope || '',
        enrollmentDate: formData.enrollmentDate || '',
        expectedGraduationDate: formData.expectedGraduationDate || '',
        currentYear: formData.currentYear || '',
        gradeType: formData.gradeType || 'cgpa',
        gradeValue: formData.gradeValue || '',
        englishTest: formData.englishTest || 'none',
      });
    }
  }, [formData]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
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
  
  // Handle date changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validate form based on current status
  const validateForm = () => {
    if (!formState.scholarshipType) {
      toast({
        title: "Validation Error",
        description: "Please select your scholarship type.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formState.academicQualification) {
      toast({
        title: "Validation Error",
        description: "Please enter your academic qualification.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formState.institutionType) {
      toast({
        title: "Validation Error",
        description: "Please select your institution type.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formState.studyScope) {
      toast({
        title: "Validation Error",
        description: "Please enter your study scope.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formState.enrollmentDate || !formState.expectedGraduationDate) {
      toast({
        title: "Validation Error",
        description: "Please enter both enrollment and expected graduation dates.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formState.gradeType) {
      toast({
        title: "Validation Error",
        description: "Please select your grade type.",
        variant: "destructive",
      });
      return false;
    }
    
    if (formState.gradeType !== 'noGrade' && !formState.gradeValue) {
      toast({
        title: "Validation Error",
        description: "Please enter your grade value.",
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
    const success = await saveStep('current-status');
    
    if (success) {
      router.push('/preferences');
    }
  };
  
  // Handle back button
  const handleBack = () => {
    router.push('/personal-information');
  };
  
  return (
    <FormLayout title="Current Status">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Scholarship Type */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">What is your scholarship type?</h2>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="scholarshipType"
                checked={formState.scholarshipType === 'scholarshipLoan'}
                onChange={() => handleRadioChange('scholarshipType', 'scholarshipLoan')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Scholarship/Loan</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="scholarshipType"
                checked={formState.scholarshipType === 'selfFunded'}
                onChange={() => handleRadioChange('scholarshipType', 'selfFunded')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Self-Funded</span>
            </label>
          </div>
        </div>
        
        {/* Academic Qualification */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Academic Qualification
          </label>
          <input
            type="text"
            name="academicQualification"
            value={formState.academicQualification}
            onChange={handleInputChange}
            placeholder="Enter your academic qualification"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        {/* Institution Type */}
        <div className="space-y-2">
          <h3 className="text-md font-medium">Institution Type</h3>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="institutionType"
                checked={formState.institutionType === 'malaysiaOrExchange'}
                onChange={() => handleRadioChange('institutionType', 'malaysiaOrExchange')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Malaysia or Exchange Program</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="institutionType"
                checked={formState.institutionType === 'abroad'}
                onChange={() => handleRadioChange('institutionType', 'abroad')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Abroad</span>
            </label>
          </div>
        </div>
        
        {/* Study Scope */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Study Scope
          </label>
          <input
            type="text"
            name="studyScope"
            value={formState.studyScope}
            onChange={handleInputChange}
            placeholder="Enter your field of study"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        {/* Enrollment Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Enrollment Date
          </label>
          <input
            type="date"
            name="enrollmentDate"
            value={formState.enrollmentDate}
            onChange={handleDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        {/* Expected Graduation Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Expected Graduation Date
          </label>
          <input
            type="date"
            name="expectedGraduationDate"
            value={formState.expectedGraduationDate}
            onChange={handleDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        {/* Current Year */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Current Year
          </label>
          <select
            name="currentYear"
            value={formState.currentYear}
            onChange={handleSelectChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select Current Year</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
            <option value="5+">Year 5+</option>
          </select>
        </div>
        
        {/* Grade Type */}
        <div className="space-y-2">
          <h3 className="text-md font-medium">Grade Type</h3>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gradeType"
                checked={formState.gradeType === 'cgpa'}
                onChange={() => handleRadioChange('gradeType', 'cgpa')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>CGPA</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gradeType"
                checked={formState.gradeType === 'grade'}
                onChange={() => handleRadioChange('gradeType', 'grade')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Grade (A, B, etc.)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gradeType"
                checked={formState.gradeType === 'others'}
                onChange={() => handleRadioChange('gradeType', 'others')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Others</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gradeType"
                checked={formState.gradeType === 'noGrade'}
                onChange={() => handleRadioChange('gradeType', 'noGrade')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>No Grade Yet</span>
            </label>
          </div>
        </div>
        
        {/* Grade Value (conditional) */}
        {formState.gradeType !== 'noGrade' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Grade Value
            </label>
            <input
              type="text"
              name="gradeValue"
              value={formState.gradeValue}
              onChange={handleInputChange}
              placeholder={formState.gradeType === 'cgpa' ? "e.g. 3.75" : "e.g. A"}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        )}
        
        {/* English Test */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            English Proficiency Test
          </label>
          <select
            name="englishTest"
            value={formState.englishTest}
            onChange={handleSelectChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="muet">MUET</option>
            <option value="cefr">CEFR</option>
            <option value="toefl">TOEFL</option>
            <option value="ielts">IELTS</option>
            <option value="other">Other</option>
            <option value="none">None</option>
          </select>
        </div>
        
        {/* Navigation Buttons */}
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