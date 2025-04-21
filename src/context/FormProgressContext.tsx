import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { FormData } from '@/hooks/useFormData';

// Define field groups for each step
const PERSONAL_INFO_FIELDS = [
  'id_type',
  'id_number',
  'display_name',
  'gender',
  'dob',
  'mob_number',
  'nationality',
  'curr_country'
];

const CURRENT_STATUS_FIELDS = [
  'scholar_status',
  'curr_qualification',
  'inst_name',
  'scope',
  'curr_study_year',
  'grade_status'
];

const PREFERENCES_FIELDS = [
  'interestedSectors',
  'interestedRoles',
  'preferredStates'
];

const PROFILE_PICTURE_FIELDS = [
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
  updateProgress: (formData: FormData) => void;
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
  }, []);

  const calculateFieldProgress = (formData: FormData, fields: string[]): number => {
    if (!formData) return 0;
    
    const filledFields = fields.filter(field => {
      const value = formData[field as keyof FormData];
      return value !== undefined && value !== null && value !== '';
    });
    
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const updateProgress = (formData: FormData) => {
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
        const value = formData[field as keyof FormData];
        return value !== undefined && value !== null && value !== '';
      }).length +
      CURRENT_STATUS_FIELDS.filter(field => {
        const value = formData[field as keyof FormData];
        return value !== undefined && value !== null && value !== '';
      }).length +
      PREFERENCES_FIELDS.filter(field => {
        const value = formData[field as keyof FormData];
        return value !== undefined && value !== null && value !== '';
      }).length +
      PROFILE_PICTURE_FIELDS.filter(field => {
        const value = formData[field as keyof FormData];
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