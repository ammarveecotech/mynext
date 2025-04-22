import { createContext, useContext, useState, ReactNode, useEffect, FC } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { ICoreModelOnboardform } from '@/models/CoreTables';
interface FormContextProps {
  formData: ICoreModelOnboardform;
  updateFormData: (data: Partial<ICoreModelOnboardform>) => void;
  resetForm: () => void;
  saveStep: (step: string) => Promise<boolean>;
  isSubmitting: boolean;
  completedSteps: string[];
}

// Create the form context
const FormContext = createContext<FormContextProps | undefined>(undefined);

// Provider component
export const FormProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<ICoreModelOnboardform>({} as ICoreModelOnboardform);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Load saved form data from localStorage on initial render
  useEffect(() => {
    const savedFormData = localStorage.getItem('formData');
    const savedCompletedSteps = localStorage.getItem('completedSteps');
    
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
    
    if (savedCompletedSteps) {
      try {
        setCompletedSteps(JSON.parse(savedCompletedSteps));
      } catch (error) {
        console.error('Error parsing saved completed steps:', error);
      }
    }
  }, []);

  // Save to localStorage whenever formData or completedSteps changes
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);
  
  useEffect(() => {
    localStorage.setItem('completedSteps', JSON.stringify(completedSteps));
  }, [completedSteps]);

  // Update form data
  const updateFormData = (data: Partial<ICoreModelOnboardform>) => {
    const newFormData = {
      ...formData,
      ...data
    };
    setFormData(newFormData as ICoreModelOnboardform);
    
    // Update progress whenever form data changes
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('formDataUpdated', { detail: newFormData });
      window.dispatchEvent(event);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({} as ICoreModelOnboardform);
    setCompletedSteps([]);
    localStorage.removeItem('formData');
    localStorage.removeItem('completedSteps');
  };

  // Save step data and navigate to next step if requested
  const saveStep = async (step: string): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // Mark step as completed if not already
      if (!completedSteps.includes(step)) {
        setCompletedSteps(prev => [...prev, step]);
      }
      
      // Determine if this is the final step
      const isFinalStep = step === 'overview';
      
      if (isFinalStep) {
        // Prepare data for API submission
        const formDataToSubmit = {
          ...formData
        };
        
        // Convert dates to proper format
        if (formData.dob) {
          formDataToSubmit.dob = new Date(formData.dob).toISOString();
        }
        if (formData.entry_time) {
          formDataToSubmit.entry_time = new Date(formData.entry_time).toISOString();
        }
        
        // Submit to API
        const response = await fetch('/api/submit-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formDataToSubmit)
        });
        
        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
        
        // Show success message
        toast({
          title: "Success!",
          description: "Your information has been submitted successfully.",
          variant: "default",
        });
        
        // Reset form after submission
        resetForm();
      }
      
      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error('Error saving step:', error);
      
      toast({
        title: "Error",
        description: "There was a problem saving your information. Please try again.",
        variant: "destructive",
      });
      
      setIsSubmitting(false);
      return false;
    }
  };

  return (
    <FormContext.Provider value={{ 
      formData, 
      updateFormData, 
      resetForm, 
      saveStep,
      isSubmitting,
      completedSteps
    }}>
      {children}
    </FormContext.Provider>
  );
};

// Hook to use the form context
export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
