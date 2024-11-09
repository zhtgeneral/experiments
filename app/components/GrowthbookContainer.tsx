'use client'

import enableTracking from "@/hooks/handleSessionLength";
import growthbook from "@/lib/growthbook";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { useEffect, useState } from "react";
import ExperimentPage from "./ExperimentPage";

interface GrowthbookContainerProps {
  children?: React.ReactNode
}

/**
 * This component ensures growthbook is initialized 
 * and that tracking is enabled before rendering any child components.
 * 
 * Then it allows children components to access growthbook
 */
const GrowthbookContainer: React.FC<GrowthbookContainerProps> = ({
  children
}) => {
  const [isGrowthbookLoaded, setIsGrowthbookLoaded] = useState(false);
  useEffect(() => {    
    growthbook.init({
      streaming: true
    }).then(() => {
      growthbook.setAttributes({
        id: "asdjfhgasdkjhg"
      })    
      enableTracking();
      setIsGrowthbookLoaded(true);
      console.log("is gb on: " + growthbook.ready);
      console.log("is feature on: " + JSON.stringify(growthbook.evalFeature("test-name-a"), null, 2));
    })
  }, [])

  if (!isGrowthbookLoaded) {
    return null;
  }
  return (
    <GrowthBookProvider growthbook={growthbook}>
      {children}
    </GrowthBookProvider>
  )
}
export default GrowthbookContainer;