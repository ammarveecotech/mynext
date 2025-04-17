import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function TestAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return <div>Redirecting to login...</div>
  }

  return (
    <div>
      <h1>Authentication Test Page</h1>
      <p>You are authenticated!</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
} 