import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/personal-information');
  }, [router]);

  return (
    <>
      <Head>
        <title>Signup Form - Redirecting</title>
        <meta name="description" content="Multi-step signup form" />
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
          <p className="text-gray-500">Please wait while we redirect you to the form.</p>
        </div>
      </div>
    </>
  );
};

export default Home; 