import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Check, Home, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Success() {
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

  return (
    <>
      <Head>
        <title>Registration Complete - MyNext</title>
        <meta name="description" content="Your registration is complete!" />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0c1b38] to-[#203a6a] text-white p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center text-gray-800">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-3">Registration Complete!</h1>
          
          <p className="text-gray-600 mb-6">
            Congratulations, {session?.user?.name || "user"}! Your profile has been successfully created and you're all set to explore MyNext.
          </p>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
            
            <ul className="space-y-3 text-left mb-8">
              <li className="flex items-start">
                <span className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </span>
                <span>Explore available opportunities that match your preferences</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </span>
                <span>Complete your full profile to enhance your visibility</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </span>
                <span>Connect with professionals in your field of interest</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
            
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <p className="mt-8 text-sm text-gray-300">
          Need help? Contact our support team at support@mynext.com
        </p>
      </main>
    </>
  );
} 