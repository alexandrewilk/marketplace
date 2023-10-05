import React, { useState, useEffect } from 'react';
import { Box, Text, Heading, Flex, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import MyColoc from '../assets/images/MyColoc.webp';
import Recherche from '../assets/images/Recherche.jpg';
import Trouver from '../assets/images/Trouver.jpg';

const MotionBox = motion(Box);

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
          <Heading as='h3' size='lg' >Trouve la colocation de tes rêves</Heading>
          <Text >Lorsque vous utilisez le composant Image de Chakra UI sans spécifier explicitement les dimensions (width et height), l'image tente de s'adapter à son conteneur tout en conservant son ratio d'aspect. Cela signifie que si vous modifiez la width, la height sera ajustée automatiquement pour maintenir le ratio d'aspect, et vice-versa.</Text>
        </MotionBox>
        <Image src={Recherche} alt="maison" boxSize="500px" objectFit="cover" objectPosition="center center"/>
      </Flex>
    
      <Flex my={8} alignItems={"center"} ref={inViewRef}>
        <Image src={Trouver } alt="maison" boxSize="500px" objectFit="cover" objectPosition="center center"/>
        <MotionBox 
          flex={1} 
          marginLeft={'200px'}
          initial={{ opacity: 0, y: 50 }}
          animate={animateProps}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Heading as='h3' size='lg'>Rejoins ta colocation</Heading>
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
          <Heading as='h3' size='lg' >Installe MyColoc</Heading>
          <Text >Lorsque vous utilisez le composant Image de Chakra UI sans spécifier explicitement les dimensions (width et height), l'image tente de s'adapter à son conteneur tout en conservant son ratio d'aspect. Cela signifie que si vous modifiez la width, la height sera ajustée automatiquement pour maintenir le ratio d'aspect, et vice-versa.</Text>
        </MotionBox>
        <Image src={MyColoc} alt="maison" boxSize="500px" objectFit="contain" objectPosition="center center"/>
      </Flex>
    </Box>
  );
}
