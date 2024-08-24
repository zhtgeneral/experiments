'use client'

import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";

interface GrowthBookContainerProps {
  children: React.ReactNode; 
  growthbook: GrowthBook
}

const GrowthBookContainer: React.FC<GrowthBookContainerProps> = ({
  children,
  growthbook
}) => {
  return (
    <GrowthBookProvider growthbook={growthbook}>
      {children}
    </GrowthBookProvider>
  )
}
export default GrowthBookContainer