
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the types for our form data
interface PersonalInfoData {
  identificationType: "malaysianIC" | "passportNumber";
  identificationNumber: string;
  fullName: string;
  displayName: string;
  gender: "male" | "female";
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  nationality: "malaysian" | "nonMalaysian";
  race: string;
  country: string;
  state: string;
  city: string;
  postcode: string;
  isOKU: boolean;
}

interface CurrentStatusData {
  scholarshipType: "scholarship" | "selfFunded";
  academicQualification: string;
  institutionType: "malaysia" | "abroad";
  scopeOfStudy: string;
  enrollmentDate: string;
  graduationDate: string;
  currentYear: string;
  gradeType: "cgpa" | "grade" | "others" | "none";
  grade: string;
  englishTest: "muet" | "cefr" | "toefl" | "ielts" | "other" | "none";
}

interface PreferencesData {
  sectors: string[];
  roles: string[];
  states: string[];
}

interface ProfilePictureData {
  image: string | null;
}

interface FormData {
  personalInfo: PersonalInfoData;
  currentStatus: CurrentStatusData;
  preferences: PreferencesData;
  profilePicture: ProfilePictureData;
  currentStep: number;
  isCompleted: boolean;
}

// Default values for our form
const defaultFormData: FormData = {
  personalInfo: {
    identificationType: "malaysianIC",
    identificationNumber: "",
    fullName: "",
    displayName: "",
    gender: "male",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    nationality: "malaysian",
    race: "",
    country: "",
    state: "",
    city: "",
    postcode: "",
    isOKU: false,
  },
  currentStatus: {
    scholarshipType: "scholarship",
    academicQualification: "",
    institutionType: "malaysia",
    scopeOfStudy: "",
    enrollmentDate: "",
    graduationDate: "",
    currentYear: "",
    gradeType: "cgpa",
    grade: "",
    englishTest: "muet",
  },
  preferences: {
    sectors: [],
    roles: [],
    states: [],
  },
  profilePicture: {
    image: null,
  },
  currentStep: 0,
  isCompleted: false,
};

// Create the context
type FormContextType = {
  formData: FormData;
  updatePersonalInfo: (data: Partial<PersonalInfoData>) => void;
  updateCurrentStatus: (data: Partial<CurrentStatusData>) => void;
  updatePreferences: (data: Partial<PreferencesData>) => void;
  updateProfilePicture: (data: ProfilePictureData) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  completeForm: () => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const updatePersonalInfo = (data: Partial<PersonalInfoData>) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...data },
    }));
  };

  const updateCurrentStatus = (data: Partial<CurrentStatusData>) => {
    setFormData((prev) => ({
      ...prev,
      currentStatus: { ...prev.currentStatus, ...data },
    }));
  };

  const updatePreferences = (data: Partial<PreferencesData>) => {
    setFormData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...data },
    }));
  };

  const updateProfilePicture = (data: ProfilePictureData) => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: data,
    }));
  };

  const nextStep = () => {
    setFormData((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 4),
    }));
  };

  const prevStep = () => {
    setFormData((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  };

  const goToStep = (step: number) => {
    setFormData((prev) => ({
      ...prev,
      currentStep: Math.min(Math.max(step, 0), 4),
    }));
  };

  const completeForm = () => {
    setFormData((prev) => ({
      ...prev,
      isCompleted: true,
    }));
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updatePersonalInfo,
        updateCurrentStatus,
        updatePreferences,
        updateProfilePicture,
        nextStep,
        prevStep,
        goToStep,
        completeForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormData() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormData must be used within a FormProvider");
  }
  return context;
}
