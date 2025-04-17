import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import ToastDemo from '@/components/ToastDemo';

const Landing: NextPage = () => {
  return (
    <>
      <Head>
        <title>MyNext - Career Platform</title>
        <meta name="description" content="MyNext - Your dedicated platform for career growth" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-[#0c1b38] to-[#8e44ad]">
        {/* Hero section */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-16">
            <div className="bg-white text-[#0c1b38] font-bold py-2 px-4 rounded-md text-2xl">
              MyNext
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/signin" 
                className="text-white hover:text-gray-200 transition"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="bg-white text-[#0c1b38] px-4 py-2 rounded-md hover:bg-gray-100 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:space-x-12">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Build Your Future Career with MyNext
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                A dedicated platform designed to help you evaluate and enhance your skills, 
                acquire new competencies, and explore career opportunities.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/signup" 
                  className="bg-white text-[#0c1b38] font-bold px-8 py-3 rounded-md text-center hover:bg-gray-100 transition"
                >
                  Get Started
                </Link>
                <Link 
                  href="/signin" 
                  className="border border-white text-white px-8 py-3 rounded-md text-center hover:bg-white/10 transition"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm border border-white/20 w-full max-w-md">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Join MyNext Today</h2>
                  <p className="text-gray-200 mt-2">Create your account in seconds</p>
                </div>
                
                <div className="space-y-4">
                  <Link 
                    href="/signup" 
                    className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-md hover:bg-gray-50 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path
                        fill="#4285F4"
                        d="M12.168 6.272L14.925 3h.343v6.468H12.28v-.312c0-.13.033-.264.1-.402.064-.138.157-.26.28-.365l.21-.187c.347-.304.52-.74.52-1.174a1.801 1.801 0 0 0-.286-.985 2.035 2.035 0 0 0-.764-.7 2.23 2.23 0 0 0-1.067-.251 2.242 2.242 0 0 0-1.026.233c-.3.156-.56.38-.765.673a1.762 1.762 0 0 0-.285.984c0 .438.177.855.5 1.184l.205.187a1.55 1.55 0 0 1 .29.365.93.93 0 0 1 .101.401v.354l-2.867.022v-6.49h.33l2.726 3.137V6.24l.005.033z"
                      />
                      <path fill="#34A853" d="M5.835 14.192v-4.26h4.26v4.26h-4.26z" />
                      <path fill="#FBBC05" d="M5.835 8.768v-4.26h4.26v4.26h-4.26z" />
                      <path fill="#EA4335" d="M5.835 19.784v-4.26h4.26v4.26h-4.26z" />
                    </svg>
                    Continue With Google
                  </Link>
                  
                  <Link 
                    href="/signup" 
                    className="w-full flex items-center justify-center gap-2 bg-[#000000] text-white px-4 py-3 rounded-md hover:bg-gray-800 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 7c-3 0-4 3-4 5.5 0 3 2 7.5 4 7.5 1.088 0 1.709-.744 3-2 1.292 1.256 1.913 2 3 2 2 0 4-4.5 4-7.5C19 10 18 7 15 7c-1.087 0-1.708.744-3 2-1.292-1.256-1.913-2-3-2z"></path>
                      <path d="M9 7V3h6v4"></path>
                    </svg>
                    Continue With Apple
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Toast Demo */}
          <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <ToastDemo />
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing; 