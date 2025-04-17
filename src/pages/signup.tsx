import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const SignUp: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Sign Up - MyNext</title>
        <meta name="description" content="Create your MyNext account" />
      </Head>
      <div className="min-h-screen flex bg-[#8e44ad]">
        {/* Left section with image/background */}
        <div className="w-3/5 relative hidden md:block">
          <div className="absolute inset-0 bg-[#8e44ad] bg-opacity-70 z-10"></div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-white text-center">
              <h1 className="text-5xl font-bold mb-4">Join MyNext Today</h1>
              <p className="text-xl">Your dedicated platform for career growth and opportunities</p>
            </div>
          </div>
          {/* Background image could be added here */}
        </div>

        {/* Right section with sign up form */}
        <div className="w-full md:w-2/5 bg-white flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-[#0c1b38] text-white font-bold py-2 px-4 rounded-md text-2xl">
                  MyNext
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
              <p className="text-gray-600 mt-2">Create your MyNext account</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="col-span-2">
                    <div className="flex justify-center">
                      <div className="px-4 py-2 text-center">
                        <span className="text-sm font-medium text-gray-500">Choose your role to get started</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <button className="w-full border border-gray-300 rounded-md p-3 flex flex-col items-center justify-center hover:bg-gray-50 transition">
                      <div className="bg-blue-100 p-2 rounded-md mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                          <path d="m18 16 4-4-4-4" />
                          <path d="m6 8-4 4 4 4" />
                          <path d="m14.5 4-5 16" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">University</span>
                    </button>
                  </div>
                  
                  <div className="col-span-1">
                    <button className="w-full border border-gray-300 rounded-md p-3 flex flex-col items-center justify-center hover:bg-gray-50 transition">
                      <div className="bg-blue-100 p-2 rounded-md mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                          <path d="M20 7h-9" />
                          <path d="M14 7V3h6v4" />
                          <path d="M5 7H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-4" />
                          <path d="M18 11V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3" />
                          <path d="M10 7V4" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Company</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Sign up with</span>
                </div>
              </div>

              {/* Authentication buttons */}
              <button
                onClick={() => {}}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-50 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="#4285F4"
                    d="M12.168 6.272L14.925 3h.343v6.468H12.28v-.312c0-.13.033-.264.1-.402.064-.138.157-.26.28-.365l.21-.187c.347-.304.52-.74.52-1.174a1.801 1.801 0 0 0-.286-.985 2.035 2.035 0 0 0-.764-.7 2.23 2.23 0 0 0-1.067-.251 2.242 2.242 0 0 0-1.026.233c-.3.156-.56.38-.765.673a1.762 1.762 0 0 0-.285.984c0 .438.177.855.5 1.184l.205.187a1.55 1.55 0 0 1 .29.365.93.93 0 0 1 .101.401v.354l-2.867.022v-6.49h.33l2.726 3.137V6.24l.005.033z"
                  />
                  <path
                    fill="#34A853"
                    d="M5.835 14.192v-4.26h4.26v4.26h-4.26z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.835 8.768v-4.26h4.26v4.26h-4.26z"
                  />
                  <path
                    fill="#EA4335"
                    d="M5.835 19.784v-4.26h4.26v4.26h-4.26z"
                  />
                  <path
                    fill="#4285F4"
                    d="M14.228 8.768v4.261h-4.26V8.768h4.26z"
                  />
                  <path
                    fill="#34A853"
                    d="M14.228 19.784v-4.26h4.26v4.26h-4.26z"
                  />
                  <path
                    fill="#EA4335"
                    d="M14.228 4.508h4.26v4.26h-4.26z"
                  />
                </svg>
                Continue With Google
              </button>

              <button
                onClick={() => {}}
                className="w-full flex items-center justify-center gap-2 bg-[#000000] text-white px-4 py-3 rounded-md hover:bg-gray-800 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 7c-3 0-4 3-4 5.5 0 3 2 7.5 4 7.5 1.088 0 1.709-.744 3-2 1.292 1.256 1.913 2 3 2 2 0 4-4.5 4-7.5C19 10 18 7 15 7c-1.087 0-1.708.744-3 2-1.292-1.256-1.913-2-3-2z"></path>
                  <path d="M9 7V3h6v4"></path>
                </svg>
                Continue With Apple
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/signin" className="text-[#0c1b38] font-medium hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp; 