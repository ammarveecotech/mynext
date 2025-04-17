import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const Landing: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Get error message from URL query parameter
  const error = router.query.error as string;

  return (
    <>
      <Head>
        <title>MyNext - Welcome</title>
        <meta name="description" content="MyNext - Your dedicated platform for career growth" />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c1b38] p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to MyNext
            </h1>
            <p className="text-gray-600 mb-6">
              Your dedicated platform for career growth
            </p>
            
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error === 'AccessDenied' 
                  ? 'Access denied. Your email must be registered in our system before you can sign in.' 
                  : 'An error occurred during sign in. Please try again.'}
              </div>
            )}
            
            <div className="space-y-4">
              {/* Test credentials button */}
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
                Sign in with Google
              </button>
            </div>
            
            <p className="mt-6 text-sm text-gray-500">
              Note: Only registered users can sign in with Google
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing; 