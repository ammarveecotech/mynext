import React, { useEffect } from "react";
import { useRouter } from "next/router";
import FormLayout from "@/components/FormLayout";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Check, Pencil, UserIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from 'next-auth/react';

export default function Overview() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { formData, saveStep, isSubmitting } = useForm();
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

  const handleBack = () => router.push("/profile-picture");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save the final step and complete the form
    const success = await saveStep('overview');
    if (success) {
      toast({
        title: "Registration completed!",
        description: "Your profile has been successfully submitted.",
      });
      
      // Redirect to the home page after a short delay
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
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
            {formData?.profilePicture ? (
              <img
                src={formData.profilePicture}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="h-10 w-10 text-gray-400" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{formData?.fullName}</h2>
            <p className="text-gray-500">{formData?.email}</p>
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
              <p>{formData?.identificationType === "malaysianIC" ? "Malaysian IC" : "Passport"}: {formData?.identificationNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Gender</p>
              <p>{formData?.gender === "male" ? "Male" : "Female"}</p>
            </div>
            <div>
              <p className="text-gray-500">Date of Birth</p>
              <p>{formatDate(formData?.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone Number</p>
              <p>{formData?.phoneNumber || "Not provided"}</p>
            </div>
            <div>
              <p className="text-gray-500">Nationality</p>
              <p>{formData?.nationality === "malaysian" ? "Malaysian" : "Non-Malaysian"}</p>
            </div>
            <div>
              <p className="text-gray-500">Race</p>
              <p>{formData?.race || "Not specified"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-500">Address</p>
              <p>
                {[
                  formData?.city,
                  formData?.state,
                  formData?.postcode,
                  formData?.country
                ].filter(Boolean).join(", ")}
              </p>
            </div>
            <div>
              <p className="text-gray-500">OKU Status</p>
              <p>{formData?.isOKU ? "Yes" : "No"}</p>
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
              <p>{formData?.scholarshipType === "scholarshipLoan" ? "Scholarship/Loan" : "Self-Funded"}</p>
            </div>
            <div>
              <p className="text-gray-500">Academic Qualification</p>
              <p>{formData?.academicQualification || "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-500">Institution Type</p>
              <p>{formData?.institutionType === "malaysiaOrExchange" ? "Malaysia/Exchange" : "Abroad"}</p>
            </div>
            <div>
              <p className="text-gray-500">Study Scope</p>
              <p>{formData?.studyScope || "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-500">Enrollment Date</p>
              <p>{formatDate(formData?.enrollmentDate)}</p>
            </div>
            <div>
              <p className="text-gray-500">Expected Graduation Date</p>
              <p>{formatDate(formData?.expectedGraduationDate)}</p>
            </div>
            <div>
              <p className="text-gray-500">Current Year</p>
              <p>{formData?.currentYear || "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-500">Grade</p>
              <p>
                {formData?.gradeType !== "noGrade"
                  ? `${formData?.gradeType?.toUpperCase()}: ${formData?.gradeValue}`
                  : "Not applicable"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">English Test</p>
              <p>{formData?.englishTest !== "none" 
                ? formData?.englishTest?.toUpperCase() 
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
                {(formData?.interestedSectors && formData?.interestedSectors.length > 0) ? (
                  formData?.interestedSectors?.map((sector: string) => (
                    <Badge key={sector} variant="secondary">
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
                {(formData?.interestedRoles && formData?.interestedRoles.length > 0) ? (
                  formData?.interestedRoles?.map((role: string) => (
                    <Badge key={role} variant="secondary">
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
                {(formData?.preferredStates && formData?.preferredStates.length > 0) ? (
                  formData?.preferredStates?.map((state: string) => (
                    <Badge key={state} variant="secondary">
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
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Check className="mr-2 h-4 w-4" /> {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
} 