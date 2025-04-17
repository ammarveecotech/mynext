import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { toast as sonnerToast } from "sonner";

export const ToastDemo = () => {
  const { toast } = useToast();

  const showShadcnToast = () => {
    toast({
      title: "Success",
      description: "Your action was completed successfully",
      variant: "default",
    });
  };

  const showSonnerToast = () => {
    sonnerToast("Success", {
      description: "Your action was completed successfully",
    });
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <h2 className="text-lg font-semibold">Toast Notifications</h2>
      <div className="flex space-x-4">
        <Button onClick={showShadcnToast} variant="default">
          Show Shadcn Toast
        </Button>
        <Button onClick={showSonnerToast} variant="outline">
          Show Sonner Toast
        </Button>
      </div>
    </div>
  );
};

export default ToastDemo; 