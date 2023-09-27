import React from 'react'
import { Box, Text } from '@chakra-ui/react';

export default function FAQItemConversion({ question, answer }) {
  return (
    <Box p={5}>
      <Text fontWeight="bold" mb={2}>{question}</Text>
      <Text>{answer}</Text>
    </Box>
  );
}