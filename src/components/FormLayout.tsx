import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { 
  User, Briefcase, Heart, Camera, FileText,
  Settings, LogOut
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

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link
      href={href}
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
  const router = useRouter();
  const { data: session } = useSession();
  const currentPath = router.pathname;

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
            href="/personal-information"
            active={currentPath === "/personal-information"}
          />
          <SidebarItem
            icon={Briefcase}
            label="Current Status"
            href="/current-status"
            active={currentPath === "/current-status"}
          />
          <SidebarItem
            icon={Heart}
            label="Preferences"
            href="/preferences"
            active={currentPath === "/preferences"}
          />
          <SidebarItem
            icon={Camera}
            label="Profile Picture"
            href="/profile-picture"
            active={currentPath === "/profile-picture"}
          />
          <SidebarItem
            icon={FileText}
            label="Overview"
            href="/overview"
            active={currentPath === "/overview"}
          />
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-white">
        {/* Header with avatar */}
        <header className="border-b px-12 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          
          {/* User avatar and dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src={session?.user?.image || ""} alt={username} />
                <AvatarFallback className="bg-[#0c1b38] text-white">
                  {getInitials(username)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        
        <main className="max-w-4xl mx-auto py-8 px-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FormLayout;
