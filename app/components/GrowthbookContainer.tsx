'use client'

import handleTrackSessionLength from "@/hooks/handleSessionLength";
import growthbook from "@/lib/growthbook";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { useEffect, useState } from "react";

interface GrowthbookContainerProps {
  children?: React.ReactNode
}

/**
 * This component ensures growthbook init and tracking session length is handled
 * before rendering any child components
 * @requires growthbook needs to be 
 */
const GrowthbookContainer: React.FC<GrowthbookContainerProps> = ({
  children
}) => {
  const [isGrowthbookLoaded, setIsGrowthbookLoaded] = useState(false);
  useEffect(() => {
    handleTrackSessionLength().then(() => {
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
export default GrowthbookContainer