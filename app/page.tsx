'use client'

import ExperimentPage from "@/app/components/ExperimentPage";
import TrackingContainer from "@/app/components/TrackingContainer";

/**
 * This is main page.
 * 
 * It ensures that tracking is intialized before rendering the experiment page
 */
export default function Home() {  
  console.log('ENV VAR NEXT_PUBLIC_DATABASE_URL: ', process.env.DATABASE_URL);
  console.log('ENV VAR NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY: ', process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY);
  return (
    <TrackingContainer>
      <ExperimentPage />
    </TrackingContainer>
  );
}


