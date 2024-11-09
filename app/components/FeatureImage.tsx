import React from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { FeatureResult } from '@growthbook/growthbook';

interface ExperimentImageProps {
  isOn: boolean,
  value: boolean
}

/**
 * This component renders the image depending on the value of the feature flag.
 * 
 * If the feature can't be loaded, it returns a skeleton with a hovering effect. 
 * @requires feature.value is a boolean
 */
const FeatureImage: React.FC<ExperimentImageProps> = ({
  isOn,
  value
}) => {
  let featureImage = <Skeleton className="h-60 w-full lg:h-[540px] rounded-xl" />;
  if (isOn) {
    if (value) {
      featureImage = <Image 
        src="/mountains.webp" 
        alt="Picture A" 
        width={1960}
        height={1080}
        priority
        className="object-cover w-full rounded-xl"
      />
    } else {
      featureImage =  <Image 
        src="/sunset.webp" 
        alt="Picture B" 
        width={1960}
        height={1080}
        priority
        className="object-cover w-full rounded-xl"
      />
    }
  } 

  return featureImage;
};

export default FeatureImage;