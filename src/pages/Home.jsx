import React, { useRef, useState } from 'react';
import { Box, Flex, Heading, Input, InputGroup, InputLeftElement, InputRightElement, VStack, ListItem, List, useMediaQuery, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import VilleCarroussel from '../components/HomePage/VilleCarroussel';
import heroImage from '../assets/images/Hero-Img.png';

const villes = require('../assets/data/villes2.json').map(v => v.city);

function search(input) {
  return villes.filter(v => v.startsWith(input));
}

export default function Home() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [ville, setVille] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const navigate = useNavigate();
  const heroRef = useRef();

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        navigate(`/recherche/${suggestions[activeSuggestionIndex]}`);
        break;
      case 'ArrowUp':
        setActiveSuggestionIndex(Math.max(activeSuggestionIndex - 1, 0));
        break;
      case 'ArrowDown':
        setActiveSuggestionIndex(Math.min(activeSuggestionIndex + 1, suggestions.length - 1));
        break;
      default:
        break;
    }
  };

  const handleInput = (e) => {
    const input = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    setVille(input);
    setSuggestions(input ? search(input) : []);
    setActiveSuggestionIndex(0);
  };

  return (
    <Box>
      <Flex justifyContent={'center'} flexDirection={'column'} alignItems={'center'} height={"100vh"} marginTop={"-148px"} position="relative">
        <Heading as="h1" size="2xl" mb={10}>Une colocation, en 3 clics seulement</Heading>
        <Box maxWidth={isLargerThan768 ? "500px" : "250px"} marginBottom="2rem" width={'400px'}>

        <InputGroup size="lg">
          <Input
            type="search"
            backgroundColor="white"
            borderColor="#0049AC"
            borderRadius="full"
            placeholder="Entrez le nom de votre ville..."
            value={ville}
            onKeyDown={handleKeyDown}
            onChange={handleInput}
          />
          <InputRightElement width="6 rem">
            <Button borderRadius="full" bgColor="#0049AC" m={1} color={'white'} onClick={() => navigate('/Déposer-une-annonce')}>
              Chercher
            </Button>
          </InputRightElement>
        </InputGroup>
      
          {suggestions.length > 0 && (
            <VStack 
              align="start" 
              spacing={2} 
              width="400px" 
              maxHeight="200px" 
              overflowY="auto" 
              boxShadow="md" 
              borderRadius="md" 
              p={2} 
              backgroundColor="white" 
              position="absolute"
              mt={2} 
              zIndex={1}
            >
              <List w="100%">
                {suggestions.map((s, index) => (
                  <ListItem 
                    key={s} 
                    p={2} 
                    bg={index === activeSuggestionIndex ? "gray.200" : "white"} 
                    borderRadius="md" 
                    width="100%"
                    align="start"
                    _hover={{ bg: "gray.200" }}
                    onClick={() => navigate(`/recherche/${s}`)}
                  >
                    {s}
                  </ListItem>
                ))}
              </List>
            </VStack>
          )}
        </Box>
        <Box position={'absolute'} bottom={0} left="50%" transform="translateX(-50%)">
          <img src={heroImage} alt="maison" />
        </Box>
      </Flex>    

      <VilleCarroussel marginY={20} spacing={20} />
    </Box>
  );
}
