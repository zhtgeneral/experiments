'use client'

import ExperimentPage from "@/app/components/ExperimentPage";
import TrackingContainer from "@/app/components/TrackingContainer";

/**
 * This is main page.
 * 
 * It ensures that tracking is intialized before rendering the experiment page
 */
export default function Home() {  
  return (
    <TrackingContainer>
      <ExperimentPage />
    </TrackingContainer>
  );
}


