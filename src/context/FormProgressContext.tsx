import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ICoreModelOnboardform } from '@/models/CoreTables';

// Define field groups for each step
const PERSONAL_INFO_FIELDS: (keyof ICoreModelOnboardform)[] = [
  'id_type',
  'id_number',
  'display_name',
  'gender',
  'dob',
  'mob_number',
  'nationality',
  'curr_country',
  'state',
  'city',
  'postalcode',
  'disability_status'
];

const CURRENT_STATUS_FIELDS: (keyof ICoreModelOnboardform)[] = [
  'scholar_status',
  'curr_qualification',
  'insti_name',
  'scope',
  'curr_study_year',
  'grade_status',
  'grade',
  'english_tests'
];

const PREFERENCES_FIELDS: (keyof ICoreModelOnboardform)[] = [
  'sector',
  'role',
  'state'
];

const PROFILE_PICTURE_FIELDS: (keyof ICoreModelOnboardform)[] = [
  'profile_picture'
];

// Calculate progress for each step and overall
interface FormProgress {
  personalInfoProgress: number;
  currentStatusProgress: number;
  preferencesProgress: number;
  profilePictureProgress: number;
  overallProgress: number;
  stepsCompleted: ('personal-information' | 'current-status' | 'preferences' | 'profile-picture')[];
}

// Create context
interface FormProgressContextType {
  progress: FormProgress;
  updateProgress: (formData: ICoreModelOnboardform) => void;
}

const FormProgressContext = createContext<FormProgressContextType | undefined>(undefined);

export const FormProgressProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [progress, setProgress] = useState<FormProgress>({
    personalInfoProgress: 0,
    currentStatusProgress: 0,
    preferencesProgress: 0,
    profilePictureProgress: 0,
    overallProgress: 0,
    stepsCompleted: []
  });

  // Add a check for client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Add event listener for form data updates
    const handleFormDataUpdate = (event: CustomEvent<ICoreModelOnboardform>) => {
      if (event.detail) {
        updateProgress(event.detail);
      }
    };
    
    window.addEventListener('formDataUpdated', handleFormDataUpdate as EventListener);
    
    return () => {
      window.removeEventListener('formDataUpdated', handleFormDataUpdate as EventListener);
    };
  }, []);

  const calculateFieldProgress = (formData: ICoreModelOnboardform, fields: string[]): number => {
    if (!formData) return 0;
    
    const filledFields = fields.filter(field => {
      const value = formData[field as keyof ICoreModelOnboardform];
      
      // Handle arrays
      if (Array.isArray(value)) {
        if (field === 'interestedSectors') return value.length > 0;
        if (field === 'interestedRoles') return value.length === 3;
        if (field === 'preferredStates') return value.length === 3;
        return value.length > 0;
      }
      
      // Handle optional fields
      if (field === 'profilePicture') {
        return true; // Profile picture is optional
      }
      
      if (field === 'grade' && formData.grade_status === 'noGrade') {
        return true; // Grade is optional if grade_status is noGrade
      }
      
      if (field === 'english_tests') {
        return value !== undefined && value !== null && value !== '';
      }
      
      // Handle fields that are dependent on other fields
      if (field === 'state' && !formData.curr_country) {
        return true; // State is optional if no country is selected
      }
      
      if (field === 'city' && !formData.state) {
        return true; // City is optional if no state is selected
      }
      
      // Handle regular fields
      return value !== undefined && value !== null && value !== '';
    });
    
    const progress = (filledFields.length / fields.length) * 100;
    return Math.round(progress);
  };

  const updateProgress = (formData: ICoreModelOnboardform) => {
    // Skip on server-side rendering
    if (typeof window === 'undefined' || !isClient) {
      console.log("FormProgressContext - Not updating progress on server side");
      return;
    }

    if (!formData) return;
    
    console.log("FormProgressContext - Updating progress with form data");
    
    const personalInfoProgress = calculateFieldProgress(formData, PERSONAL_INFO_FIELDS);
    const currentStatusProgress = calculateFieldProgress(formData, CURRENT_STATUS_FIELDS);
    const preferencesProgress = calculateFieldProgress(formData, PREFERENCES_FIELDS);
    const profilePictureProgress = calculateFieldProgress(formData, PROFILE_PICTURE_FIELDS);
    
    // Calculate overall progress (weighted average)
    const totalFields = 
      PERSONAL_INFO_FIELDS.length + 
      CURRENT_STATUS_FIELDS.length + 
      PREFERENCES_FIELDS.length + 
      PROFILE_PICTURE_FIELDS.length;
    
    // Count filled fields across all sections
    const filledFieldsCount = 
      PERSONAL_INFO_FIELDS.filter(field => {
        const value = formData[field as keyof ICoreModelOnboardform];
        return value !== undefined && value !== null && value !== '';
      }).length +
      CURRENT_STATUS_FIELDS.filter(field => {
        const value = formData[field as keyof ICoreModelOnboardform];
        return value !== undefined && value !== null && value !== '';
      }).length +
      PREFERENCES_FIELDS.filter(field => {
        const value = formData[field as keyof ICoreModelOnboardform];
        return value !== undefined && value !== null && value !== '';
      }).length +
      PROFILE_PICTURE_FIELDS.filter(field => {
        const value = formData[field as keyof ICoreModelOnboardform];
        return value !== undefined && value !== null && value !== '';
      }).length;
    
    const overallProgress = Math.round((filledFieldsCount / totalFields) * 100);
    
    // Determine completed steps (80% or more completion considered as completed)
    const stepsCompleted: ('personal-information' | 'current-status' | 'preferences' | 'profile-picture')[] = [];
    
    if (personalInfoProgress >= 80) stepsCompleted.push('personal-information');
    if (currentStatusProgress >= 80) stepsCompleted.push('current-status');
    if (preferencesProgress >= 80) stepsCompleted.push('preferences');
    if (profilePictureProgress >= 80) stepsCompleted.push('profile-picture');
    
    setProgress({
      personalInfoProgress,
      currentStatusProgress,
      preferencesProgress,
      profilePictureProgress,
      overallProgress,
      stepsCompleted
    });
  };

  return (
    <FormProgressContext.Provider value={{ progress, updateProgress }}>
      {children}
    </FormProgressContext.Provider>
  );
};

export const useFormProgress = () => {
  const context = useContext(FormProgressContext);
  if (context === undefined) {
    throw new Error('useFormProgress must be used within a FormProgressProvider');
  }
  return context;
}; 