
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  User, Briefcase, Heart, Camera, FileText
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active: boolean;
}

const SidebarItem = ({ icon: Icon, label, to, active }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-3 py-3 px-4 rounded-md transition-colors",
        active
          ? "bg-[#0d1f42] text-white"
          : "hover:bg-[#0d1f42]/70 text-gray-200"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

interface FormLayoutProps {
  children: React.ReactNode;
  title: string;
  greeting?: string;
  description?: string;
}

const FormLayout = ({ children, title, greeting, description }: FormLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Get username from local storage or set default
  const username = "bedump tan";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-[#0c1b38] text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 mb-4">
          <div className="bg-white text-[#0c1b38] font-bold py-1 px-3 rounded-md w-fit">
            MyNext
          </div>
        </div>

        {/* User greeting */}
        <div className="px-4 py-6">
          {greeting ? (
            <>
              <h2 className="text-2xl font-bold">{greeting}</h2>
              <p className="mt-2 text-sm text-gray-300">
                {description}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Hi, {username}</h2>
              <p className="mt-2 text-sm text-gray-300">
                Let's keep building your profile together. We would like to hear more about you! Share some of your details before we get started.
              </p>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1">
          <SidebarItem
            icon={User}
            label="Personal Information"
            to="/personal-information"
            active={currentPath === "/personal-information"}
          />
          <SidebarItem
            icon={Briefcase}
            label="Current Status"
            to="/current-status"
            active={currentPath === "/current-status"}
          />
          <SidebarItem
            icon={Heart}
            label="Preferences"
            to="/preferences"
            active={currentPath === "/preferences"}
          />
          <SidebarItem
            icon={Camera}
            label="Profile Picture"
            to="/profile-picture"
            active={currentPath === "/profile-picture"}
          />
          <SidebarItem
            icon={FileText}
            label="Overview"
            to="/overview"
            active={currentPath === "/overview"}
          />
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-white">
        <main className="max-w-4xl mx-auto py-8 px-12">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default FormLayout;
