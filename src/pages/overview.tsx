import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useFormData } from "@/hooks/useFormData";
import FormLayout from "@/components/FormLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check, User as UserIcon } from "lucide-react";
import { ICoreModelOnboardform } from '@/models/CoreTables';

export default function Overview() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { formData } = useFormData();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router]);

  // Don't render the form until we confirm authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1b38]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const handleBack = () => {
    router.push("/preferences");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!session?.user?.id) {
        throw new Error('User ID is required');
      }

      if (!formData?.display_name || !formData?.id_number) {
        throw new Error('Personal information is incomplete');
      }

      // Convert form data to match the database schema
      const now = new Date().toISOString();
      const submissionData: Partial<ICoreModelOnboardform> = {
        // Required timestamps
        entry_time: now,
        update_time: now,
        created_at: now,
        updated_at: now,

        // Personal Information
        id_type: formData?.id_type,
        id_number: formData?.id_number,
        display_name: formData?.display_name,
        gender: formData?.gender,
        dob: formData?.dob ? new Date(formData.dob).toISOString() : undefined,
        mob_code: formData?.mob_code,
        mob_number: formData?.mob_number,
        nationality: typeof formData?.nationality === 'string' ? parseInt(formData.nationality) : formData?.nationality,
        race: formData?.race,
        curr_country: formData?.curr_country?.toString(),
        state: formData?.state?.toString(),
        city: formData?.city?.toString(),
        postalcode: formData?.postalcode,
        disability_status: formData?.disability_status,
        disability_code: formData?.disability_code,
        talent_status: formData?.talent_status?.toString(),
        
        // Profile Picture (default value allowed here)
        profile_picture: formData?.profile_picture ?? 'avatar/default.jpg',
        
        // Current Status
        scholar_status: formData?.scholar_status,
        scholar_data: formData?.scholar_data,
        curr_qualification: formData?.curr_qualification,
        insti_name: formData?.insti_name,
        university: formData?.university,
        campus: formData?.campus,
        faculty: formData?.faculty,
        study_program: formData?.study_program,
        insti_country: formData?.insti_country,
        scope: formData?.scope,
        curr_study_year: formData?.curr_study_year,
        grade_status: formData?.grade_status,
        grade: formData?.grade,
        english_tests: formData?.english_tests,
        english_score: formData?.english_score,
        
        // Preferences (default to 1 as they reference other tables)
        high_qualification: '1',
        insti_country_status: 1,
        insti_location_status: 1,
        curr_tc_program: 1,
        
        // Additional required fields
        is_active: 1,
        is_ios_registeration: 0,
        is_registered_employee: 0,
        is_invisible: 'N',
        profile_views: 0,
        is_assessment_done: 0,
        is_career_explorer_done: 0,
        is_employability_done: 0,
        is_english_proficiency_done: 0,
        is_future_of_work_done: 0,
        is_personality_and_motivation_done: 0,
        is_work_interests_done: 0,
        is_work_values_done: 0,
        is_learning_styles_done: false,
        
        // User ID (already validated above)
        user_id: session.user.id,
        
        // Step tracking
        step: 4, // Final step
      };

      // Submit to API
      const response = await fetch("/api/onboard-form/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        router.push("/success");
      } else {
        const errorData = await response.json();
        console.error("Failed to submit form:", errorData);
        throw new Error(errorData.message ?? 'Failed to submit form');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to submit form',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormLayout title="Profile Overview">
      <form onSubmit={handleSubmit} className="space-y-12 max-w-full">
        {/* Personal Information */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-xl font-medium">Personal Information</h2>
            <Button
              variant="link"
              className="text-red-500 hover:text-red-600 text-sm font-normal p-0"
              onClick={() => router.push("/personal-information")}
              type="button"
            >
              Edit
            </Button>
          </div>

          <div className="flex items-start mb-8">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-purple-200">
              {formData?.profile_picture ? (
                <img 
                  src={formData.profile_picture} 
                  alt={formData?.display_name ?? "Profile"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-12 h-12 text-purple-400" />
              )}
            </div>
            
            <div className="ml-6 space-y-2">
              <h3 className="text-lg font-medium">{formData?.display_name || '-'}</h3>
              <p className="text-gray-500">{session?.user?.email || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-6">
            <div>
              <p className="text-sm text-gray-500">Identification (Malaysian IC)</p>
              <p className="text-purple-600">{formData?.id_number || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Full Name (as per passport or IC)</p>
              <p className="text-purple-600">{formData?.display_name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="text-purple-600">{formData?.gender === 'M' ? 'Male' : formData?.gender === 'F' ? 'Female' : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="text-purple-600">{formData?.dob ? new Date(formData.dob).toLocaleDateString() : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-purple-600">{`${formData?.mob_code ?? "+60"}${formData?.mob_number ?? "0129888044"}`}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-purple-600">{session?.user?.email ?? "bedummy777@gmail.com"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="text-purple-600">
                {formData?.nationality 
                  ? (formData.nationality.toString() === '1' ? 'Malaysian' : formData.nationality) 
                  : "Malaysian"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Race</p>
              <p className="text-purple-600">{formData?.race ?? "Malay"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Where do you stay?</p>
              <p className="text-purple-600">
                {formData?.curr_country 
                  ? (formData.curr_country.toString() === '1' ? 'Malaysia' : formData.curr_country)
                  : "Malaysia"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">State</p>
              <p className="text-purple-600">
                {formData?.state 
                  ? (formData.state.toString() === '1' 
                      ? 'Selangor' 
                      : formData.state.toString() === '2' 
                        ? 'Kuala Lumpur' 
                        : formData.state)
                  : "Johor"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">City</p>
              <p className="text-purple-600">
                {formData?.city 
                  ? (formData.city.toString() === '1'
                      ? 'Shah Alam'
                      : formData.city.toString() === '2'
                        ? 'Petaling Jaya'
                        : formData.city)
                  : "Bandar Maharani"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Postcode</p>
              <p className="text-purple-600">{formData?.postalcode ?? "79800"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">OKU</p>
              <p className="text-purple-600">{formData?.disability_status ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Display Name</p>
              <p className="text-purple-600">{formData?.display_name ?? "-"}</p>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-xl font-medium">Current Status Detail</h2>
            <Button
              variant="link"
              className="text-red-500 hover:text-red-600 text-sm font-normal p-0"
              onClick={() => router.push("/current-status")}
              type="button"
            >
              Edit
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500">What's your scholarship type?</p>
              <p className="text-purple-600">{formData?.scholar_status ?? "MARA (Scholarship)"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">What's your current academic qualification?</p>
              <p className="text-purple-600">{formData?.curr_qualification ?? "-"}</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-gray-700"
            onClick={handleBack}
            type="button"
          >
            Back
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            disabled={isSubmitting}
          >
            <Check className="mr-2 h-4 w-4" /> {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
}