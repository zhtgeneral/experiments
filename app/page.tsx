'use client'

import ExperimentPage from "@/components/Experiment";
import growthbook from "@/lib/growthbook";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import HandleTrackSessionLength from "@/hooks/handleSessionLength";

/**
 * This is main page.
 * It handles tracking session length and renders the images depending on the experiments.
 */
export default function Home() {
  HandleTrackSessionLength() ;
  
  return (
    <GrowthBookProvider growthbook={growthbook}>
      <ExperimentPage />
    </GrowthBookProvider>
  );
}


