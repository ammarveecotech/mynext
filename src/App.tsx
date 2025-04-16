import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FormProvider } from "@/context/FormContext";
import Index from "./pages/Index";
import PersonalInformation from "./pages/PersonalInformation";
import CurrentStatus from "./pages/CurrentStatus";
import Preferences from "./pages/Preferences";
import ProfilePicture from "./pages/ProfilePicture";
import Overview from "./pages/Overview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FormProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/personal-information" element={<PersonalInformation />} />
            <Route path="/current-status" element={<CurrentStatus />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/profile-picture" element={<ProfilePicture />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FormProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
