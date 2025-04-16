
import React from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "@/components/FormLayout";
import { useFormData } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, Briefcase, Heart, Check, ChevronRight 
} from "lucide-react";

const Overview = () => {
  const navigate = useNavigate();
  const { formData, completeForm } = useFormData();

  return (
    <FormLayout 
      title="Registration Complete!" 
      greeting="CONGRATULATIONS!" 
      description="You've successfully completed your profile setup. Here's a summary of your information."
    >
      <div className="space-y-6">
        {/* Profile Picture and Name */}
        <div className="flex flex-col items-center space-y-4 mb-8">
          <Avatar className="h-24 w-24 border-2 border-gray-200">
            {formData.profilePicture.image ? (
              <AvatarImage src={formData.profilePicture.image} alt="Profile" />
            ) : (
              <AvatarFallback className="bg-gray-100 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </AvatarFallback>
            )}
          </Avatar>
          <h2 className="text-2xl font-bold">
            {formData.personalInfo.displayName || formData.personalInfo.fullName || "User"}
          </h2>
        </div>

        {/* Personal Information Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <User className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/personal-information")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p>{formData.personalInfo.fullName || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p>{formData.personalInfo.gender === "male" ? "Male" : "Female"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nationality</p>
              <p>{formData.personalInfo.nationality === "malaysian" ? "Malaysian" : "Non-Malaysian"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{formData.personalInfo.email || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p>{formData.personalInfo.phoneNumber || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p>
                {[
                  formData.personalInfo.city, 
                  formData.personalInfo.state,
                  formData.personalInfo.country
                ].filter(Boolean).join(", ") || "Not provided"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Status Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Current Status
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/current-status")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
            <div>
              <p className="text-sm text-gray-500">Academic Qualification</p>
              <p>{formData.currentStatus.academicQualification || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Institution Type</p>
              <p>
                {formData.currentStatus.institutionType === "malaysia" 
                  ? "Studying in Malaysia" 
                  : "Studying abroad"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Scope of Study</p>
              <p>{formData.currentStatus.scopeOfStudy || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Study Year</p>
              <p>Year {formData.currentStatus.currentYear || "Not provided"}</p>
            </div>
            {formData.currentStatus.gradeType !== "none" && (
              <div>
                <p className="text-sm text-gray-500">
                  {formData.currentStatus.gradeType === "cgpa" 
                    ? "CGPA" 
                    : formData.currentStatus.gradeType === "grade" 
                      ? "Grade" 
                      : "Other"}
                </p>
                <p>{formData.currentStatus.grade || "Not provided"}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Heart className="mr-2 h-5 w-5" />
              Preferences
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/preferences")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {formData.preferences.sectors.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Interested Sectors</p>
                <div className="flex flex-wrap gap-2">
                  {formData.preferences.sectors.map((sector) => (
                    <div key={sector} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                      {sector}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {formData.preferences.roles.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Interested Roles</p>
                <div className="flex flex-wrap gap-2">
                  {formData.preferences.roles.map((role) => (
                    <div key={role} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {formData.preferences.states.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Preferred States</p>
                <div className="flex flex-wrap gap-2">
                  {formData.preferences.states.map((state) => (
                    <div key={state} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                      {state}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.preferences.sectors.length === 0 && 
             formData.preferences.roles.length === 0 && 
             formData.preferences.states.length === 0 && (
              <p className="text-gray-500">No preferences provided</p>
            )}
          </CardContent>
        </Card>

        {/* Complete button */}
        <div className="pt-8 flex justify-center">
          <Button
            onClick={() => {
              completeForm();
              navigate("/");
            }}
            className="w-full md:w-auto"
          >
            <Check className="mr-2 h-4 w-4" /> Complete Registration
          </Button>
        </div>
      </div>
    </FormLayout>
  );
};

export default Overview;
