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
import { IMasterAcademicQualification, IMasterEnglishEquivalentTestType, IMasterScopeOfStudy, IMasterScholarshipType } from '@/models/MasterTables';

// Define the form state interface to match CoreModelOnboardform
interface FormState {
  scholar_status: string; // scholarshipLoan or selfFunded
  curr_qualification: string; // from academic qualifications
  inst_name: string; // institution name (malaysia/abroad)
  university: string;
  campus: string;
  faculty: string;
  study_program: string;
  inst_country: string;
  scope: string; // study scope
  curr_study_year: string;
  grade_status: string;
  grade: string;
  english_tests: string;
  english_score: number;
}

// Helper function to ensure type safety for IDs
const getIdString = (id: number | undefined): string => {
  return id?.toString() || '';
};

export default function CurrentStatus() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { formData, updateFormData, saveStep, isSubmitting } = useForm();
  const { toast } = useToast();
  
  // Add state for master data
  const [academicQualifications, setAcademicQualifications] = useState<IMasterAcademicQualification[]>([]);
  const [englishTests, setEnglishTests] = useState<IMasterEnglishEquivalentTestType[]>([]);
  const [studyScopes, setStudyScopes] = useState<IMasterScopeOfStudy[]>([]);
  const [scholarshipTypes, setScholarshipTypes] = useState<IMasterScholarshipType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setLoading(true);
        
        // Fetch academic qualifications
        const qualResponse = await fetch('/api/master-data/academic-qualifications');
        if (!qualResponse.ok) throw new Error('Failed to fetch academic qualifications');
        const qualData = await qualResponse.json();
        setAcademicQualifications(qualData);

        // Fetch English tests
        const testResponse = await fetch('/api/master-data/english-tests');
        if (!testResponse.ok) throw new Error('Failed to fetch English tests');
        const testData = await testResponse.json();
        setEnglishTests(testData);

        // Fetch study scopes
        const scopeResponse = await fetch('/api/master-data/study-scopes');
        if (!scopeResponse.ok) throw new Error('Failed to fetch study scopes');
        const scopeData = await scopeResponse.json();
        setStudyScopes(scopeData);

        // Fetch scholarship types
        const scholarshipResponse = await fetch('/api/master-data/scholarship-types');
        if (!scholarshipResponse.ok) throw new Error('Failed to fetch scholarship types');
        const scholarshipData = await scholarshipResponse.json();
        setScholarshipTypes(scholarshipData);
      } catch (error) {
        console.error('Error fetching master data:', error);
        toast({
          title: "Error",
          description: "Failed to load form data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();
  }, [toast]);

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
  const [formState, setFormState] = useState<Partial<FormState>>({
    scholar_status: formData?.scholarshipType === 'scholarshipLoan' ? 'scholarshipLoan' : 'selfFunded',
    curr_qualification: formData?.academicQualification || '',
    inst_name: formData?.institutionType === 'malaysiaOrExchange' ? 'Malaysia/Exchange Program' : 'Abroad',
    scope: formData?.studyScope || '',
    curr_study_year: formData?.currentYear || '',
    grade_status: formData?.gradeType || 'cgpa',
    grade: formData?.gradeValue || '',
    english_tests: formData?.englishTest || '',
    english_score: 0,
  });
  
  // Load form data when component mounts
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      setFormState({
        scholar_status: formData.scholarshipType === 'scholarshipLoan' ? 'scholarshipLoan' : 'selfFunded',
        curr_qualification: formData.academicQualification || '',
        inst_name: formData.institutionType === 'malaysiaOrExchange' ? 'Malaysia/Exchange Program' : 'Abroad',
        scope: formData.studyScope || '',
        curr_study_year: formData.currentYear || '',
        grade_status: formData.gradeType || 'cgpa',
        grade: formData.gradeValue || '',
        english_tests: formData.englishTest || '',
        english_score: 0,
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
    if (!formState.scholar_status) {
      toast({
        title: "Validation Error",
        description: "Please select your scholarship type.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formState.curr_qualification) {
      toast({
        title: "Validation Error",
        description: "Please enter your academic qualification.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formState.inst_name) {
      toast({
        title: "Validation Error",
        description: "Please select your institution type.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formState.scope) {
      toast({
        title: "Validation Error",
        description: "Please enter your study scope.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formState.curr_study_year) {
      toast({
        title: "Validation Error",
        description: "Please enter your current year.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formState.grade_status) {
      toast({
        title: "Validation Error",
        description: "Please select your grade type.",
        variant: "destructive",
      });
      return false;
    }
    
    if (formState.grade_status !== 'noGrade' && !formState.grade) {
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
    
    // Convert form state to match FormContext format
    const contextData = {
      scholarshipType: formState.scholar_status === 'scholarshipLoan' ? 'scholarshipLoan' as const : 'selfFunded' as const,
      academicQualification: formState.curr_qualification,
      institutionType: formState.inst_name === 'Malaysia/Exchange Program' ? 'malaysiaOrExchange' as const : 'abroad' as const,
      studyScope: formState.scope,
      currentYear: formState.curr_study_year,
      gradeType: formState.grade_status as 'cgpa' | 'grade' | 'others' | 'noGrade',
      gradeValue: formState.grade,
      englishTest: formState.english_tests as 'muet' | 'cefr' | 'toefl' | 'ielts' | 'none' | 'other',
    };
    
    // Update the form context with the converted data
    updateFormData(contextData);
    
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
            <div className="space-y-3">
              <Label className="text-base font-medium">Scholarship Type</Label>
              <RadioGroup 
                value={formState.scholar_status} 
                onValueChange={(value) => setFormState(prev => ({ ...prev, scholar_status: value }))}
                className="flex flex-wrap gap-4"
              >
                {scholarshipTypes.map((type) => (
                  <div key={type.Id?.toString()} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={type.Id?.toString() || ''} 
                      id={`scholarship-${type.Id}`} 
                    />
                    <Label 
                      htmlFor={`scholarship-${type.Id}`} 
                      className="font-normal"
                    >
                      {type.Title}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
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
                  value={formState.curr_qualification} 
                  onValueChange={(value) => setFormState(prev => ({ ...prev, curr_qualification: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicQualifications.map((qual) => (
                      <SelectItem 
                        key={getIdString(qual.Id)}
                        value={getIdString(qual.Id)}
                      >
                        {qual.Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Institution Type */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Institution Type</Label>
                <RadioGroup 
                  value={formState.inst_name || 'Malaysia/Exchange Program'} 
                  onValueChange={(value) => handleRadioChange('inst_name', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Malaysia/Exchange Program" id="malaysia-exchange" />
                    <Label htmlFor="malaysia-exchange" className="font-normal">Malaysia/Exchange Program</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Abroad" id="abroad" />
                    <Label htmlFor="abroad" className="font-normal">Abroad</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Study Scope */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Study Scope</Label>
                <Select 
                  value={formState.scope} 
                  onValueChange={(value) => setFormState(prev => ({ ...prev, scope: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your study scope" />
                  </SelectTrigger>
                  <SelectContent>
                    {studyScopes.map((scope) => (
                      <SelectItem 
                        key={scope._id || scope.Id.toString()}
                        value={scope.Id.toString()}
                      >
                        {scope.Name}
                      </SelectItem>
                    ))}
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
                  <Label className="text-base font-medium">Current Year</Label>
                  <Input
                    type="number"
                    name="curr_study_year"
                    value={formState.curr_study_year}
                    onChange={handleInputChange}
                    min="1"
                    max="6"
                    placeholder="Enter your current year of study (1-6)"
                    className="w-full"
                    required
                  />
                </div>
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
                  value={formState.grade_status || 'cgpa'} 
                  onValueChange={(value) => handleRadioChange('grade_status', value)}
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

                {formState.grade_status !== 'noGrade' && (
                  <div className="pt-2 space-y-2">
                    <Label className="text-sm text-gray-600">Grade Value</Label>
                    <Input
                      type="text"
                      name="grade"
                      value={formState.grade}
                      onChange={handleInputChange}
                      placeholder={formState.grade_status === 'cgpa' ? "e.g. 3.5" : "e.g. A-"}
                      className="max-w-xs"
                    />
                  </div>
                )}
              </div>
              
              {/* English Test */}
              <div className="space-y-3">
                <Label className="text-base font-medium">What's the english equivalency test you've taken?</Label>
                <div className="flex items-center mb-2">
                  <Languages className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-500">Select your English proficiency test</span>
                </div>
                <RadioGroup 
                  value={formState.english_tests || 'none'} 
                  onValueChange={(value) => handleRadioChange('english_tests', value)}
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