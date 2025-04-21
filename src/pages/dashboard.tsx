import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { User, Briefcase, Heart, Bell, Settings, LogOut, Search } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router]);

  // Don't render the page until we confirm authentication
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

  // Mock data for dashboard
  const profileCompletionPercentage = 75;
  const recommendedOpportunities = [
    { id: 1, title: "Software Engineering Internship", company: "TechCorp", location: "Kuala Lumpur", match: 95 },
    { id: 2, title: "UX Designer", company: "Creative Solutions", location: "Selangor", match: 88 },
    { id: 3, title: "Data Analyst", company: "Data Insights", location: "Penang", match: 82 },
  ];

  return (
    <>
      <Head>
        <title>Dashboard - MyNext</title>
        <meta name="description" content="Your personal MyNext dashboard" />
      </Head>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-[#0c1b38] text-white hidden md:block">
          <div className="p-4 flex items-center justify-center border-b border-blue-900">
            <div className="text-xl font-bold">MyNext</div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
                {session?.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt="Profile" 
                    className="w-full h-full rounded-full" 
                  />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {session?.user?.email || "user@example.com"}
                </p>
              </div>
            </div>
            
            <nav className="mt-6 space-y-1">
              <Button variant="ghost" className="w-full justify-start text-white bg-blue-900/50">
                <User className="h-5 w-5 mr-3" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-900/50">
                <Briefcase className="h-5 w-5 mr-3" />
                Opportunities
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-900/50">
                <Heart className="h-5 w-5 mr-3" />
                Saved Jobs
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-900/50">
                <Bell className="h-5 w-5 mr-3" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-900/50">
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Button>
              
              <Separator className="my-4 bg-blue-900" />
              
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-900/50">
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="relative max-w-xs w-full hidden md:block">
              <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search opportunities..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
          </header>
          
          {/* Main dashboard */}
          <main className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Welcome card */}
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Welcome back, {session?.user?.name?.split(' ')[0] || "User"}!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">Your profile is almost complete. Finish setting up to maximize your opportunities.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profile completion</span>
                      <span className="font-medium">{profileCompletionPercentage}%</span>
                    </div>
                    <Progress value={profileCompletionPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Stats card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Profile views</span>
                    <span className="font-medium text-lg">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Applications</span>
                    <span className="font-medium text-lg">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Saved jobs</span>
                    <span className="font-medium text-lg">7</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recommended opportunities */}
            <Card className="mb-8">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Recommended Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{opportunity.title}</h3>
                          <p className="text-gray-500">{opportunity.company}</p>
                          <p className="text-gray-500 text-sm">{opportunity.location}</p>
                        </div>
                        <div className="bg-green-100 text-green-800 font-medium text-xs px-2 py-1 rounded-full">
                          {opportunity.match}% Match
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-3">
                        <Button variant="outline" size="sm">Save</Button>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">View Details</Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">View All Opportunities</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Upcoming activities */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Upcoming Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>No upcoming activities at the moment.</p>
                  <p>Check back later for interview invitations and events.</p>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
} 