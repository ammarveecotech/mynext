import type { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

const SignIn: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { error } = router.query;

  // Define error messages
  const errorMessages: Record<string, string> = {
    AccessDenied: "Access denied. Your email must be registered in our system before you can sign in.",
    Default: "An error occurred during sign in. Please try again.",
    Callback: "The URL you tried to access requires authentication.",
    OAuthSignin: "Error starting the sign in process. Please try again.",
    OAuthCallback: "Error completing the sign in process. Please try again.",
    CredentialsSignin: "Invalid credentials. Please check your username and password."
  };

  const errorMessage = error ? (errorMessages[error as string] || errorMessages.Default) : "";

  return (
    <>
      <Head>
        <title>MyNext - Sign In</title>
        <meta name="description" content="Sign in to your MyNext account" />
      </Head>
      <div className="flex min-h-screen">
        {/* Left side - Purple background with welcome message */}
        <div className="hidden md:flex md:w-1/2 bg-purple-600 text-white flex-col justify-center items-center p-12">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">Welcome to MyNext</h1>
            <p className="text-xl">Your dedicated platform for career growth and opportunities</p>
          </div>
        </div>
        
        {/* Right side - Sign in form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-block bg-[#0c1b38] text-white text-xl font-bold py-2 px-4 rounded-md mb-6">
                MyNext
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h1>
              <p className="text-gray-600 mb-4">Access your MyNext account</p>
              
              {/* Error message */}
              {error && (
                <div className="mb-6 p-4 text-red-700 bg-red-100 border border-red-300 rounded">
                  {errorMessage}
                </div>
              )}
              
              <p className="text-sm text-gray-500 mb-6">Sign in to continue</p>
              
              <div className="space-y-4">
                {/* Google sign in button */}
                <button
                  onClick={() => {
                    setLoading(true);
                    signIn('google', { 
                      callbackUrl: '/personal-information'
                    });
                  }}
                  disabled={loading}
                  className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-md py-3 px-4 text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                    />
                  </svg>
                  Continue With Google
                </button>
                
                {/* Apple sign in button */}
                <button
                  onClick={() => {
                    setLoading(true);
                    signIn('apple', { 
                      callbackUrl: '/personal-information'
                    });
                  }}
                  disabled={loading}
                  className="w-full flex items-center justify-center bg-black text-white rounded-md py-3 px-4 text-lg font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
                  </svg>
                  Continue With Apple
                </button>
                
                {/* Test account button - for development purposes */}
                <button
                  onClick={() => {
                    setLoading(true);
                    signIn('credentials', {
                      username: 'user',
                      password: 'password',
                      callbackUrl: '/personal-information',
                      redirect: true
                    });
                  }}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white rounded-md py-3 px-4 text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  {loading ? 'Signing in...' : 'Sign In with Test Account'}
                </button>
              </div>
              
              <p className="mt-8 text-sm text-gray-600">
                Don't have an account? <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn; 