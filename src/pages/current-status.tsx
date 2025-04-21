import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FormLayout from '@/components/FormLayout';
import { useForm } from '@/context/FormContext';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { BookOpen, GraduationCap, Calendar, Award, Languages } from 'lucide-react';

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
      router.replace('/signin');
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
    <FormLayout title="Current Status" currentStep={2}>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-1">Tell us about your education</h2>
        <p className="text-sm text-gray-500">Please provide details about your current academic status.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Scholarship Information Section */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Award className="h-5 w-5 text-[#6366f1] mr-2" />
              <h3 className="text-md font-medium">Scholarship Information</h3>
            </div>
            <Separator className="mb-6" />
            
            {/* Scholarship Type */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Scholarship Type</Label>
                <RadioGroup 
                  value={formState.scholarshipType || 'scholarshipLoan'} 
                  onValueChange={(value) => handleRadioChange('scholarshipType', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scholarshipLoan" id="scholarship-loan" />
                    <Label htmlFor="scholarship-loan" className="font-normal">Scholarship/Loan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="selfFunded" id="self-funded" />
                    <Label htmlFor="self-funded" className="font-normal">Self-Funded</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Academic Information Section */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-5 w-5 text-[#6366f1] mr-2" />
              <h3 className="text-md font-medium">Academic Information</h3>
            </div>
            <Separator className="mb-6" />
            
            <div className="space-y-6">
              {/* Academic Qualification */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Academic Qualification</Label>
                <Select 
                  value={formState.academicQualification} 
                  onValueChange={(value) => setFormState(prev => ({ ...prev, academicQualification: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Institution Type */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Institution Type</Label>
                <RadioGroup 
                  value={formState.institutionType || 'malaysiaOrExchange'} 
                  onValueChange={(value) => handleRadioChange('institutionType', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="malaysiaOrExchange" id="malaysia-exchange" />
                    <Label htmlFor="malaysia-exchange" className="font-normal">Malaysia/Exchange Program</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="abroad" id="abroad" />
                    <Label htmlFor="abroad" className="font-normal">Abroad</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Study Scope */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Study Scope</Label>
                <Select 
                  value={formState.studyScope} 
                  onValueChange={(value) => setFormState(prev => ({ ...prev, studyScope: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your study scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="law">Law</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Timeline Section */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 text-[#6366f1] mr-2" />
              <h3 className="text-md font-medium">Timeline</h3>
            </div>
            <Separator className="mb-6" />
            
            <div className="space-y-6">
              {/* Enrollment & Graduation Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Enrollment Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      name="enrollmentDate"
                      value={formState.enrollmentDate}
                      onChange={handleDateChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Expected Graduation Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      name="expectedGraduationDate"
                      value={formState.expectedGraduationDate}
                      onChange={handleDateChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Current Year */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Current Year</Label>
                <Select 
                  value={formState.currentYear} 
                  onValueChange={(value) => setFormState(prev => ({ ...prev, currentYear: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your current year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                    <SelectItem value="5">Year 5</SelectItem>
                    <SelectItem value="6">Year 6</SelectItem>
                    <SelectItem value="7">Year 7</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Performance Section */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="h-5 w-5 text-[#6366f1] mr-2" />
              <h3 className="text-md font-medium">Academic Performance</h3>
            </div>
            <Separator className="mb-6" />
            
            <div className="space-y-6">
              {/* Grade Type */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Grade Type</Label>
                <RadioGroup 
                  value={formState.gradeType || 'cgpa'} 
                  onValueChange={(value) => handleRadioChange('gradeType', value)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cgpa" id="grade-cgpa" />
                    <Label htmlFor="grade-cgpa" className="font-normal">CGPA</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="grade" id="grade-letter" />
                    <Label htmlFor="grade-letter" className="font-normal">Grade (A, B, C)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="others" id="grade-others" />
                    <Label htmlFor="grade-others" className="font-normal">Others</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="noGrade" id="grade-none" />
                    <Label htmlFor="grade-none" className="font-normal">No grade yet</Label>
                  </div>
                </RadioGroup>

                {formState.gradeType !== 'noGrade' && (
                  <div className="pt-2 space-y-2">
                    <Label className="text-sm text-gray-600">Grade Value</Label>
                    <Input
                      type="text"
                      name="gradeValue"
                      value={formState.gradeValue}
                      onChange={handleInputChange}
                      placeholder={formState.gradeType === 'cgpa' ? "e.g. 3.5" : "e.g. A-"}
                      className="max-w-xs"
                    />
                  </div>
                )}
              </div>
              
              {/* English Test */}
              <div className="space-y-3">
                <Label className="text-base font-medium">English Test</Label>
                <div className="flex items-center mb-2">
                  <Languages className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-500">Select your English proficiency test</span>
                </div>
                <RadioGroup 
                  value={formState.englishTest || 'none'} 
                  onValueChange={(value) => handleRadioChange('englishTest', value)}
                  className="grid grid-cols-2 md:grid-cols-3 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="muet" id="english-muet" />
                    <Label htmlFor="english-muet" className="font-normal">MUET</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cefr" id="english-cefr" />
                    <Label htmlFor="english-cefr" className="font-normal">CEFR</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="toefl" id="english-toefl" />
                    <Label htmlFor="english-toefl" className="font-normal">TOEFL</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ielts" id="english-ielts" />
                    <Label htmlFor="english-ielts" className="font-normal">IELTS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="english-none" />
                    <Label htmlFor="english-none" className="font-normal">None</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="english-other" />
                    <Label htmlFor="english-other" className="font-normal">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.push('/personal-information')}
            className="px-6"
          >
            Back
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-[#6366f1] hover:bg-[#4f46e5] px-8"
          >
            {isSubmitting ? 'Saving...' : 'Next'}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
} 