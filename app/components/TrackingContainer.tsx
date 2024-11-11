'use client'

import enableTracking from "@/hooks/handleSessionLength";
import growthbook from "@/lib/growthbook";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { useEffect, useState } from "react";

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
const TrackingContainer: React.FC<TrackingContainerProps> = ({
  children
}) => {  
  useEffect(() => {
    growthbook.setAttributes({
      id: Math.random()
    })
    growthbook.init({
      streaming: true
    })
    enableTracking();
  })
  return (
    <GrowthBookProvider growthbook={growthbook}>
      {children}
    </GrowthBookProvider>
  )
}
export default TrackingContainer;