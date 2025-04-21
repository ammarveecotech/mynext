import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { 
  User, Briefcase, Heart, Camera, FileText,
  Settings, LogOut, ChevronRight
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useFormProgress } from "@/context/FormProgressContext";
import { useFormData } from "@/hooks/useFormData";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active: boolean;
  completed?: boolean;
  step: number;
  progressPercentage?: number;
}

const SidebarItem = ({ icon: Icon, label, href, active, completed, step, progressPercentage = 0 }: SidebarItemProps) => {
  // Create icon elements based on the icon type
  const getStepIcon = () => {
    switch(step) {
      case 1: return <User className="h-4 w-4" />;
      case 2: return <Briefcase className="h-4 w-4" />;
      case 3: return <Heart className="h-4 w-4" />;
      case 4: return <Camera className="h-4 w-4" />;
      case 5: return <FileText className="h-4 w-4" />;
      default: return <Icon className="h-4 w-4" />;
    }
  };

  // Determine if the step should be highlighted based on progress
  const isHighlighted = progressPercentage >= 80 || completed;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center space-x-3 py-3 px-4 rounded-md transition-colors relative",
        active
          ? "bg-[#6366f1] text-white"
          : isHighlighted 
            ? "text-white hover:bg-[#1c2c4e]" 
            : "text-gray-400 hover:bg-[#1c2c4e]"
      )}
    >
      <div className={cn(
        "flex items-center justify-center h-8 w-8 rounded-full",
        active 
          ? "bg-white text-[#6366f1]" 
          : isHighlighted 
            ? "bg-[#6366f1] text-white" 
            : "bg-gray-200 text-gray-400"
      )}>
        {getStepIcon()}
      </div>
      <span className="font-medium">{label}</span>
      {!active && <ChevronRight className="h-4 w-4 ml-auto" />}
    </Link>
  );
};

interface FormLayoutProps {
  children: React.ReactNode;
  title: string;
  greeting?: string;
  description?: string;
  currentStep?: number;
}

const FormLayout = ({ children, title, greeting, description, currentStep = 1 }: FormLayoutProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const currentPath = router.pathname;
  const { progress, updateProgress } = useFormProgress();
  const { formData, fetchFormData } = useFormData();
  
  // Track if component is mounted (client-side only)
  const [isMounted, setIsMounted] = useState(false);
  const dataLoadedRef = React.useRef(false);
  const loadingDataRef = React.useRef(false);
  
  // Function to load form data only once
  const loadFormDataOnce = React.useCallback(async () => {
    // If already loading or loaded, don't load again
    if (loadingDataRef.current || dataLoadedRef.current) {
      return;
    }
    
    loadingDataRef.current = true;
    console.log("FormLayout - Fetching form data (once)");
    
    try {
      const data = await fetchFormData();
      console.log("FormLayout - Form data fetched:", !!data);
      
      if (data) {
        console.log("FormLayout - Updating progress with form data");
        updateProgress(data);
      }
      
      // Mark as loaded so we don't try again
      dataLoadedRef.current = true;
    } catch (error) {
      console.error("FormLayout - Error loading form data:", error);
    } finally {
      loadingDataRef.current = false;
    }
  }, [fetchFormData, updateProgress]);
  
  // This effect runs only once on client-side
  useEffect(() => {
    console.log("FormLayout - Setting isMounted to true");
    setIsMounted(true);
  }, []);
  
  // Load data only once when component is mounted
  useEffect(() => {
    // Skip server-side execution
    if (typeof window === 'undefined') {
      console.log("FormLayout - Running on server, skipping fetch");
      return;
    }
    
    if (isMounted) {
      console.log("FormLayout - Component mounted, loading data once");
      loadFormDataOnce();
    }
  }, [isMounted, loadFormDataOnce]);

  // Get username from session or set default
  const username = session?.user?.name || "user";
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/signin' });
  };

  // Calculate progress percentages for each step and overall
  const { 
    personalInfoProgress, 
    currentStatusProgress, 
    preferencesProgress, 
    profilePictureProgress, 
    overallProgress, 
    stepsCompleted 
  } = progress;
  
  // Determine which steps are completed based on form progress
  const isStepCompleted = (step: number) => {
    if (step < currentStep) {
      return true;
    }
    
    // Otherwise check field completion
    switch(step) {
      case 1: return stepsCompleted.includes('personal-information');
      case 2: return stepsCompleted.includes('current-status');
      case 3: return stepsCompleted.includes('preferences');
      case 4: return stepsCompleted.includes('profile-picture');
      default: return false;
    }
  };

  // Get progress percentage for a specific step
  const getStepProgress = (step: number): number => {
    switch(step) {
      case 1: return personalInfoProgress;
      case 2: return currentStatusProgress;
      case 3: return preferencesProgress;
      case 4: return profilePictureProgress;
      default: return 0;
    }
  };

  // Custom greetings for different pages - with consistent height (3 lines)
  const getGreeting = () => {
    if (currentPath === "/profile-picture") {
      return "LOOKING GOOD!";
    } else if (currentPath === "/preferences") {
      return "GREAT JOB!";
    } else if (currentPath === "/overview") {
      return "FINAL STEP!";
    } else {
      return greeting || "Hi, bedump tan";
    }
  };

  // Custom descriptions for different pages - with consistent height (3 lines)
  const getDescription = () => {
    return (
      <div className="h-24 flex items-center">
        <p className="line-clamp-3">
          {currentPath === "/profile-picture" ? 
            "Let's make your profile even more personal. Upload a clear photo to help others recognize you easily." : 
          currentPath === "/preferences" ? 
            "Now, let's personalize your experience even further. Tell us more about your interests and preferences." : 
          currentPath === "/overview" ? 
            "You're almost there-just one more step to complete your profile. Take a moment to review your profile information." : 
          description || "Let's keep building your profile together. Fill in your details to help us personalize your experience."}
        </p>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-[#0c1b38] text-white flex flex-col relative overflow-hidden">
        {/* Background cityscape image at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <img 
            src="/cityscape.png" 
            alt="City skyline" 
            className="w-full h-auto opacity-30"
            onError={(e) => e.currentTarget.style.display = 'none'} 
          />
        </div>
        {/* Logo */}
        <div className="p-6 mb-2">
          <div className="text-white font-bold py-2 text-xl">
            MyNext
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-white">Profile Completion</span>
            <span className="text-white font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2 bg-gray-700" indicatorClassName="bg-[#6366f1]" />
        </div>

        {/* User greeting */}
        <div className="px-6 py-4 z-10 relative">
          <h2 className="text-xl font-bold text-white">{getGreeting()}</h2>
          {getDescription()}
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1 px-4 space-y-1 z-10 relative">
          <SidebarItem
            icon={User}
            label="Personal Information"
            href="/personal-information"
            active={currentPath === "/personal-information"}
            completed={isStepCompleted(1)}
            step={1}
            progressPercentage={getStepProgress(1)}
          />
          <SidebarItem
            icon={Briefcase}
            label="Current Status"
            href="/current-status"
            active={currentPath === "/current-status"}
            completed={isStepCompleted(2)}
            step={2}
            progressPercentage={getStepProgress(2)}
          />
          <SidebarItem
            icon={Heart}
            label="Preferences"
            href="/preferences"
            active={currentPath === "/preferences"}
            completed={isStepCompleted(3)}
            step={3}
            progressPercentage={getStepProgress(3)}
          />
          <SidebarItem
            icon={Camera}
            label="Profile Picture"
            href="/profile-picture"
            active={currentPath === "/profile-picture"}
            completed={isStepCompleted(4)}
            step={4}
            progressPercentage={getStepProgress(4)}
          />
          <SidebarItem
            icon={FileText}
            label="Overview"
            href="/overview"
            active={currentPath === "/overview"}
            completed={isStepCompleted(5)}
            step={5}
          />
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-white">
        {/* Header with avatar */}
        <header className="bg-white px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            {(currentPath !== "/personal-information") && (
              <Link href={
                currentPath === "/preferences" ? "/current-status" : 
                currentPath === "/profile-picture" ? "/preferences" :
                currentPath === "/overview" ? "/profile-picture" : "/"
              } className="text-gray-500 mr-4">
                &lt; Back
              </Link>
            )}
          </div>
          
          {/* User avatar and dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 mr-2">{username}</span>
                <Avatar className="h-9 w-9 cursor-pointer border-2 border-[#6366f1]">
                  <AvatarImage src={session?.user?.image || ""} alt={username} />
                  <AvatarFallback className="bg-[#6366f1] text-white">
                    {getInitials(username)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        
        {/* Main content */}
        <div className="max-w-5xl mx-auto py-8 px-8 bg-white">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormLayout;
