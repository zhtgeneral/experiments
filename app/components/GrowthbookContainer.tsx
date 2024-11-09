'use client'

import enableTracking from "@/hooks/handleSessionLength";
import growthbook from "@/lib/growthbook";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { useEffect, useState } from "react";

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
    growthbook.setAttributes({
      id: "qweriouy"
    })
    growthbook.init({
      streaming: true,
    }).then(() => {
      enableTracking();
      setIsGrowthbookLoaded(true);
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