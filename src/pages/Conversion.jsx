import React from 'react'
import { VStack } from '@chakra-ui/react';
import PricingTable from '../components/PricingTable'
import FeaturesList from '../components/FeaturesList';
import FAQConversion from '../components/FAQConversion';

export default function Conversion() {
  return (
    <VStack maxW={'1200px'} marginX={'auto'} marginY={20} spacing={10} align='stretch'>
    <PricingTable/>
    <FeaturesList/>      
    <FAQConversion/>
  </VStack>
  )
}
