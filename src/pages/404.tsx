import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c1b38]">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden p-8 text-center">
        <div className="bg-[#0c1b38] text-white font-bold py-1 px-3 rounded-md w-fit mb-6 mx-auto">
          MyNext
        </div>
        
        <h1 className="text-6xl font-bold mb-4 text-[#0c1b38]">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link href="/" passHref>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
} 