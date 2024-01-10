import React, { useRef, useState } from 'react';
import { Box, Flex, Heading, Input, InputGroup, InputLeftElement, InputRightElement, VStack, ListItem, List, useMediaQuery, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import VilleCarroussel from '../components/HomePage/VilleCarroussel';
import heroImage from '../assets/images/Hero-Img.png';

const villes = require('../assets/data/villes2.json').map(v => v.city);

function search(input){
  return villes.filter((v)=>{return(v.slice(0, input.length) == input)})
}

export default function Home() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [ville, setVille] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  function handleKeyDown(e){ 
    switch(e.key) {
      case 'Enter': // naviguer quand l'utilisateur presse entré
        navigate(`/recherche/${suggestions[activeSuggestionIndex]}`);
        break;
      case 'ArrowUp': // sélectionner la suggestion précédente
        if (activeSuggestionIndex > 0) {
          setActiveSuggestionIndex(activeSuggestionIndex - 1);
        }
        break;
      case 'ArrowDown': // sélectionner la suggestion suivante
        if (activeSuggestionIndex < suggestions.length - 1) {
          setActiveSuggestionIndex(activeSuggestionIndex + 1);
        }
        break;
    }
  }
  function handleInput(e){
    e.preventDefault();
    let input = e.target.value;
    if(input.length > 0){
      input = input.charAt(0).toUpperCase() + input.slice(1);
    }
    setVille(input);
    if(input == ''){
      setSuggestions([]);
      setActiveSuggestionIndex(0);
      return;
    }
    setSuggestions([...search(input)]);
  }
  

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
