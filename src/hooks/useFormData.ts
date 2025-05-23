import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { ICoreModelOnboardform } from "@/models/CoreTables";
import { IMasterBase } from "@/models/MasterTables";

export const useFormData = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ICoreModelOnboardform>>({});

  // Fetch the user's form data
  const fetchFormData = useCallback(async () => {
    console.log("useFormData - fetchFormData called");
    try {
      setLoading(true);

      const userId = session?.user?.id;
      console.log("useFormData - userId:", userId);
      if (!userId) {
        console.log("No user ID available");
        return { user_id: "" };
      }

      // Create a controller to abort the fetch if it takes too long
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        console.log(`useFormData - Fetching from /api/onboard-form/get-data?userId=${userId}`);
        const response = await fetch(
          `/api/onboard-form/get-data?userId=${userId}`,
          {
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);
        console.log("useFormData - API response status:", response.status);

        // If we get a 404, it means the user doesn't have form data yet
        if (response.status === 404) {
          console.log("No form data found for user, initializing empty data");
          const emptyData: Partial<ICoreModelOnboardform> = { user_id: userId };
          setFormData(emptyData);
          return emptyData;
        }

        // For any other non-200 response, log it but still return empty data
        if (!response.ok) {
          console.log(`API returned status ${response.status}`);
          const emptyData: Partial<ICoreModelOnboardform> = { user_id: userId };
          setFormData(emptyData);
          return emptyData;
        }

        const result = await response.json();
        console.log("useFormData - API response parsed:", result.success);

        if (result.success && result.data) {
          console.log("Successfully fetched form data");
          setFormData(result.data);
          return result.data;
        } else {
          console.log("API returned success:false or no data");
          const emptyData: Partial<ICoreModelOnboardform> = { user_id: userId };
          setFormData(emptyData);
          return emptyData;
        }
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          console.log("Fetch request timed out");
        } else {
          console.error("Fetch error:", fetchError);
        }
        const emptyData: Partial<ICoreModelOnboardform> = { user_id: userId };
        setFormData(emptyData);
        return emptyData;
      }
    } catch (error) {
      console.error("Unexpected error in fetchFormData:", error);
      const emptyData: Partial<ICoreModelOnboardform> = { user_id: session?.user?.id ?? "" };
      setFormData(emptyData);
      return emptyData;
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // Save form data
  const saveFormData = async (data: Partial<ICoreModelOnboardform>, nextPage?: string) => {
    try {
      setLoading(true);

      // Ensure user_id is set
      const userId = session?.user?.id;
      if (!userId) {
        toast.error("User not authenticated");
        return false;
      }

      // Merge with existing form data
      const updatedData = {
        ...formData,
        ...data,
        user_id: userId,
      };

      const response = await fetch("/api/onboard-form/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (result.success) {
        setFormData(result.data);
        toast.success("Form data saved successfully");

        // Navigate to next page if provided
        if (nextPage) {
          router.push(nextPage);
        }

        return true;
      } else {
        toast.error(result.message ?? "Failed to save form data");
        return false;
      }
    } catch (error) {
      console.error("Error saving form data:", error);
      toast.error("Failed to save form data");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update the current step
  const updateStep = async (step: number) => {
    try {
      setLoading(true);

      const userId = session?.user?.id;
      if (!userId) {
        toast.error("User not authenticated");
        return false;
      }

      const response = await fetch("/api/onboard-form/update-step", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, step }),
      });

      const result = await response.json();

      if (result.success) {
        setFormData((prev) => ({ ...prev, step }));
        return true;
      } else {
        toast.error(result.message ?? "Failed to update step");
        return false;
      }
    } catch (error) {
      console.error("Error updating step:", error);
      toast.error("Failed to update step");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch master data for dropdowns
  const fetchMasterData = async (
    table: string,
    parentId?: string,
    parentField?: string
  ): Promise<IMasterBase[]> => {
    try {
      let url = `/api/master-data/${table}`;

      // Add parent parameters for dependent dropdowns if provided
      if (parentId && parentField) {
        url += `?parentId=${parentId}&parentField=${parentField}`;
      }

      // Create a controller to abort the fetch if it takes too long
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle non-200 responses
        if (!response.ok) {
          console.log(
            `Master data API for ${table} returned status ${response.status}`
          );
          return [];
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          return result.data;
        } else {
          console.error(`Error fetching ${table} data:`, result.message);
          return [];
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === "AbortError") {
          console.log(`Fetch request for ${table} timed out`);
        } else {
          console.error(`Fetch error for ${table}:`, fetchError);
        }
        return [];
      }
    } catch (error) {
      console.error(`Unexpected error fetching ${table} data:`, error);
      return [];
    }
  };

  return {
    formData,
    loading,
    fetchFormData,
    saveFormData,
    updateStep,
    fetchMasterData,
  };
};
