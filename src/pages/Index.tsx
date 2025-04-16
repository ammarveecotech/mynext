import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormData } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { formData, goToStep } = useFormData();

  const handleStartRegistration = () => {
    navigate("/personal-information");
  };

  const handleContinueRegistration = () => {
    const currentStep = formData.currentStep;
    const routes = [
      "/personal-information",
      "/current-status",
      "/preferences",
      "/profile-picture",
      "/overview"
    ];
    
    navigate(routes[currentStep]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c1b38]">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="bg-[#0c1b38] text-white font-bold py-1 px-3 rounded-md w-fit mb-6">
            MyNext
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Welcome to MyNext</h1>
          <p className="text-gray-600 mb-6">
            A dedicated platform designed to help you evaluate and enhance your skills, 
            acquire new competencies, and explore career opportunities.
          </p>
          
          {formData.currentStep > 0 && !formData.isCompleted ? (
            <div className="space-y-4">
              <p className="text-sm font-medium">
                You have an unfinished registration. Would you like to continue where you left off?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleContinueRegistration}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  Continue Registration <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleStartRegistration}
                  className="flex-1"
                >
                  Start Over
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={handleStartRegistration}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Start Registration <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            By continuing, you agree to MyNext's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
