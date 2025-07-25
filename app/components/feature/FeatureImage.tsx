import React from 'react';
import Image from 'next/image';
import { Skeleton } from '@/app/components/ui/skeleton';

interface FeatureImageProps {
  isOn: boolean,
  value: boolean
}

/**
 * This component renders the image depending on the value of the feature flag.
 * 
 * If the feature can't be loaded, it returns a skeleton with a hovering effect. 
 */
function FeatureImage({
  isOn,
  value
}: FeatureImageProps) {
  if (!isOn) {
    return <Skeleton className="h-60 w-full lg:h-[540px] rounded-xl" />;
  }
  return value
    ? <Image 
        src="/mountain_lake.jpeg" 
        alt="Picture A" 
        width={3000}
        height={2000}
        priority
        className="object-cover w-full rounded-lg lg:rounded-xl"
      />
    : <Image 
        src="/underwater_city.jpeg" 
        alt="Picture B" 
        width={3000}
        height={2000}
        priority
        className="object-cover w-full rounded-lg lg:rounded-xl"
      />
};

export default FeatureImage;