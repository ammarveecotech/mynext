import React from "react";
import { useRouter } from "next/router";
import FormLayout from "@/components/FormLayout";
import { useFormData } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Check, Pencil, UserIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Overview() {
  const router = useRouter();
  const { formData, prevStep, completeForm } = useFormData();
  const { toast } = useToast();

  const handleBack = () => {
    prevStep();
    router.push("/profile-picture");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would submit the form data to your backend here
    // For this example, we'll just show a success toast and complete the form
    completeForm();
    
    toast({
      title: "Registration completed!",
      description: "Your profile has been successfully submitted.",
    });
    
    // Redirect to the home page after a short delay
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "dd MMMM yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <FormLayout
      title="Overview"
      description="Review your information before submitting."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Summary */}
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {formData.profilePicture.image ? (
              <img
                src={formData.profilePicture.image}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="h-10 w-10 text-gray-400" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{formData.personalInfo.fullName}</h2>
            <p className="text-gray-500">{formData.personalInfo.email}</p>
          </div>
        </div>

        <Separator />

        {/* Personal Information */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <Button 
                onClick={() => router.push("/personal-information")}
                className="flex items-center gap-1"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Identification</p>
              <p>{formData.personalInfo.identificationType === "malaysianIC" ? "Malaysian IC" : "Passport"}: {formData.personalInfo.identificationNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Gender</p>
              <p>{formData.personalInfo.gender === "male" ? "Male" : "Female"}</p>
            </div>
            <div>
              <p className="text-gray-500">Date of Birth</p>
              <p>{formatDate(formData.personalInfo.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone Number</p>
              <p>{formData.personalInfo.phoneNumber || "Not provided"}</p>
            </div>
            <div>
              <p className="text-gray-500">Nationality</p>
              <p>{formData.personalInfo.nationality === "malaysian" ? "Malaysian" : "Non-Malaysian"}</p>
            </div>
            <div>
              <p className="text-gray-500">Race</p>
              <p>{formData.personalInfo.race || "Not specified"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-500">Address</p>
              <p>
                {[
                  formData.personalInfo.city,
                  formData.personalInfo.state,
                  formData.personalInfo.postcode,
                  formData.personalInfo.country
                ].filter(Boolean).join(", ")}
              </p>
            </div>
            <div>
              <p className="text-gray-500">OKU Status</p>
              <p>{formData.personalInfo.isOKU ? "Yes" : "No"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Academic Status</CardTitle>
              <Button 
                onClick={() => router.push("/current-status")}
                className="flex items-center gap-1"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Scholarship Type</p>
              <p>{formData.currentStatus.scholarshipType === "scholarship" ? "Scholarship" : "Self-Funded"}</p>
            </div>
            <div>
              <p className="text-gray-500">Academic Qualification</p>
              <p>{formData.currentStatus.academicQualification || "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-500">Institution Type</p>
              <p>{formData.currentStatus.institutionType === "malaysia" ? "Malaysia" : "Abroad"}</p>
            </div>
            <div>
              <p className="text-gray-500">Scope of Study</p>
              <p>{formData.currentStatus.scopeOfStudy || "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-500">Enrollment Date</p>
              <p>{formatDate(formData.currentStatus.enrollmentDate)}</p>
            </div>
            <div>
              <p className="text-gray-500">Graduation Date</p>
              <p>{formatDate(formData.currentStatus.graduationDate)}</p>
            </div>
            <div>
              <p className="text-gray-500">Current Year</p>
              <p>{formData.currentStatus.currentYear || "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-500">Grade</p>
              <p>
                {formData.currentStatus.gradeType !== "none"
                  ? `${formData.currentStatus.gradeType.toUpperCase()}: ${formData.currentStatus.grade}`
                  : "Not applicable"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">English Test</p>
              <p>{formData.currentStatus.englishTest !== "none" 
                ? formData.currentStatus.englishTest.toUpperCase() 
                : "None"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Career Preferences</CardTitle>
              <Button 
                onClick={() => router.push("/preferences")}
                className="flex items-center gap-1"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-gray-500 mb-2">Sectors of Interest</p>
              <div className="flex flex-wrap gap-2">
                {formData.preferences.sectors.length > 0 ? (
                  formData.preferences.sectors.map((sector) => (
                    <Badge key={sector} className="bg-gray-100 text-gray-800">
                      {sector}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No sectors selected</p>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-gray-500 mb-2">Roles of Interest</p>
              <div className="flex flex-wrap gap-2">
                {formData.preferences.roles.length > 0 ? (
                  formData.preferences.roles.map((role) => (
                    <Badge key={role} className="bg-gray-100 text-gray-800">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No roles selected</p>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-gray-500 mb-2">Preferred Locations</p>
              <div className="flex flex-wrap gap-2">
                {formData.preferences.states.length > 0 ? (
                  formData.preferences.states.map((state) => (
                    <Badge key={state} className="bg-gray-100 text-gray-800">
                      {state}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No locations selected</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            <Check className="mr-2 h-4 w-4" /> Submit Application
          </Button>
        </div>
      </form>
    </FormLayout>
  );
} 