import React from 'react';
import {
  VStack,
  Heading,
  Text,
  Icon,
  HStack,
  Link,
} from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';

export default function FeatureCard({ icon, title, text }) {
  return (
    <VStack spacing={5} align="stretch" p={5}>
      <Icon as={icon} boxSize={12} bg={"blue"} p={3} borderRadius={'full'} color="white" />
      <Heading as="h3" size="md">{title}</Heading>
      <Text>{text}</Text>
      <Link href="#" color="blue.500" _hover={{ textDecor: 'underline' }}>
        <HStack spacing={1}>
          <Text>Learn More</Text>
          <Icon as={FaArrowRight} />
        </HStack>
      </Link>
    </VStack>
  );
}
