'use client'

import ExperimentPage from "@/components/ExperimentPage";
import GrowthbookContainer from "@/app/components/GrowthbookContainer";

/**
 * This is main page.
 * 
 * It ensures that growthbook in intialized before rendering the experiment page
 */
export default function Home() {  
  return (
    <GrowthbookContainer>
      <ExperimentPage />
    </GrowthbookContainer>
  );
}


