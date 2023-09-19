import React, { useState, useEffect } from 'react';
import { Box, Text, Heading, Flex, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

const MotionBox = motion(Box);
const MotionImage = motion(Image);

export default function HowItWorks() {
  const [inViewRef, inView] = useInView({
    triggerOnce: true, // Trigger just once
  });

  const [animateProps, setAnimateProps] = useState({ opacity: 0, y: 50 });

  useEffect(() => {
    if (inView) {
      setAnimateProps({ opacity: 1, y: 0 });
    }
  }, [inView]);

  return (
    <Box maxWidth="1400px" margin="auto" width="100%">
      <Flex my={8} alignItems={"center"} ref={inViewRef}>
        <MotionBox 
          flex={1} 
          marginRight={'200px'}
          initial={{ opacity: 0, y: 50 }}
          animate={animateProps}
          transition={{ duration: 1, delay: 0 }}
        >
          <Heading as='h3' size='lg' >Texte de la première ligne</Heading>
          <Text >Lorsque vous utilisez le composant Image de Chakra UI sans spécifier explicitement les dimensions (width et height), l'image tente de s'adapter à son conteneur tout en conservant son ratio d'aspect. Cela signifie que si vous modifiez la width, la height sera ajustée automatiquement pour maintenir le ratio d'aspect, et vice-versa.</Text>
        </MotionBox>
        <MotionImage boxSize="500px" src="https://via.placeholder.com/150" alt="Image 1" 
          initial={{ opacity: 0, y: 50 }}
          animate={animateProps}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </Flex>
    
      <Flex my={8} alignItems={"center"} ref={inViewRef}>
        <MotionImage boxSize="500px" src="https://via.placeholder.com/150" alt="Image 1" 
          initial={{ opacity: 0, y: 50 }}
          animate={animateProps}
          transition={{ duration: 1, delay: 0.4 }}/>
        <MotionBox 
          flex={1} 
          marginLeft={'200px'}
          initial={{ opacity: 0, y: 50 }}
          animate={animateProps}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Heading as='h3' size='lg' >Texte de la première ligne</Heading>
          <Text >Lorsque vous utilisez le composant Image de Chakra UI sans spécifier explicitement les dimensions (width et height), l'image tente de s'adapter à son conteneur tout en conservant son ratio d'aspect. Cela signifie que si vous modifiez la width, la height sera ajustée automatiquement pour maintenir le ratio d'aspect, et vice-versa.</Text>
        </MotionBox>
      </Flex>
      
      <Flex my={8} alignItems={"center"} ref={inViewRef}>
        <MotionBox 
            flex={1} 
            marginRight={'200px'}
            initial={{ opacity: 0, y: 50 }}
            animate={animateProps}
            transition={{ duration: 1, delay: 0.8 }}
          >
          <Heading as='h3' size='lg' >Texte de la première ligne</Heading>
          <Text >Lorsque vous utilisez le composant Image de Chakra UI sans spécifier explicitement les dimensions (width et height), l'image tente de s'adapter à son conteneur tout en conservant son ratio d'aspect. Cela signifie que si vous modifiez la width, la height sera ajustée automatiquement pour maintenir le ratio d'aspect, et vice-versa.</Text>
        </MotionBox>
        <MotionImage boxSize="500px" src="https://via.placeholder.com/150" alt="Image 1" 
          initial={{ opacity: 0, y: 50 }}
          animate={animateProps}
          transition={{ duration: 1, delay: 1 }}/>
      </Flex>
    </Box>
  );
}
