import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSession } from 'next-auth/react';

const Home: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (session) {
      router.push('/personal-information');
    } else {
      router.push('/signin');
    }
  }, [session, status, router]);

  return (
    <>
      <Head>
        <title>MyNext - Loading</title>
        <meta name="description" content="MyNext - Your dedicated platform for career growth" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-[#0c1b38]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-white">Loading...</h1>
          <p className="text-gray-300">Please wait while we redirect you.</p>
        </div>
      </div>
    </>
  );
};

export default Home; 