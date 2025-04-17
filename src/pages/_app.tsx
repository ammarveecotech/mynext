import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FormProvider } from "@/context/FormContext";
import { SessionProvider } from "next-auth/react";
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

const queryClient = new QueryClient();

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <FormProvider>
            <Component {...pageProps} />
          </FormProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
} 