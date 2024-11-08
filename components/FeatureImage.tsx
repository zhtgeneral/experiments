import React from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { FeatureResult } from '@growthbook/growthbook';

interface ExperimentImageProps {
  feature: FeatureResult
}

const FeatureImage: React.FC<ExperimentImageProps> = ({
  feature
}) => {
  let featureImage = <Skeleton className="h-60 w-full lg:h-[540px] rounded-xl" />;
  if (feature.on) {
    if (feature.value) {
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