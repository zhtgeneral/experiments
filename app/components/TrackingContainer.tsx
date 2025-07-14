'use client'

import growthbook from "@/app/lib/growthbook";
import Tracker from "@/app/src/Tracker";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { useEffect } from "react";

interface TrackingContainerProps {
  children?: React.ReactNode
}

/**
 * This component ensures growthbook is initialized 
 * and that tracking is enabled before rendering any child components.
 * 
 * It sets the id for growthbook which randomly puts the user in an experiment.
 * 
 * Then it allows children components to access growthbook.
 */
function TrackingContainer({
  children
}: TrackingContainerProps) {  
  useEffect(() => {
    growthbook.setAttributes({
      id: Math.random()
    })
    growthbook.init({
      streaming: true
    })
    Tracker.enableTracking();
  }, [])
  return (
    <GrowthBookProvider growthbook={growthbook}>
      {children}
    </GrowthBookProvider>
  )
}
export default TrackingContainer;