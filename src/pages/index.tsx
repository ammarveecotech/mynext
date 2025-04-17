import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/signin');
  }, [router]);

  return (
    <>
      <Head>
        <title>MyNext - Sign In</title>
        <meta name="description" content="MyNext - Your dedicated platform for career growth" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-[#0c1b38]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-white">Redirecting...</h1>
          <p className="text-gray-300">Please wait while we redirect you to sign in.</p>
        </div>
      </div>
    </>
  );
};

export default Home; 