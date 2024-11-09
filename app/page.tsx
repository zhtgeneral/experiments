'use client'

import ExperimentPage from "@/app/components/ExperimentPage";
import GrowthbookContainer from "@/app/components/GrowthbookContainer";

/**
 * This is main page.
 * 
 * It ensures that growthbook is intialized before rendering the experiment page
 */
export default function Home() {  
  return (
    <GrowthbookContainer>
      <ExperimentPage />
    </GrowthbookContainer>
  );
}


