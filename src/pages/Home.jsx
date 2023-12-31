import React, { useState } from 'react'
import '../styles/home.css'
import { Box, Heading, Input, InputGroup, InputLeftElement, VStack, ListItem, List, Image, Text, useMediaQuery } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import VilleCarroussel from '../components/HomePage/VilleCarroussel';
import Entourement from '../assets/images/Entourement.svg';

const villes = require('../assets/data/villes2.json').map((v)=>{return v.city})

function search(input){
  return villes.filter((v)=>{return(v.slice(0, input.length) === input)})
}

export default function Home() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [ville, setVille] = useState('');
  const [suggestions, setSuggestions] = useState([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const navigate = useNavigate();
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
        default:
            // Gérer tout autre cas ici, par exemple:
            console.log(`Key pressed ${e.key} is not handled`);
    }
}

  function handleInput(e){
    e.preventDefault();
    let input = e.target.value;
    if(input.length > 0){
      input = input.charAt(0).toUpperCase() + input.slice(1);
    }
    setVille(input);
    if(input === ''){
      setSuggestions([]);
      setActiveSuggestionIndex(0);
      return;
    }
    setSuggestions([...search(input)]);
  }
  

  return (
    <Box 
      width="95%"
      marginX="auto"
      maxWidth="1200px"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        textAlign="center"
        borderRadius="12px"
        marginTop="20px"
        height="86vh"
        maxHeight="676px"
        background="linear-gradient(white, deepskyblue)"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box width="100%" marginY="2rem">
            <Heading
              as="h1"
              size="2xl"
              color="white"
              m={0}
              textAlign="center" 
              whiteSpace={isLargerThan768 ? "nowrap" : "normal"}
            >
              {isLargerThan768
                ? <>
                    {`Trouve la colocation `}
                    <Box position="relative" display="inline">
                      <Text as="span" position="relative">  idéale</Text>
                      <Image src={Entourement} alt="Description of SVG" position="absolute" top={0} left={0} width="100%" height="100%"/>
                    </Box>
                  </>
                : <>
                    {`Trouve la colocation `}
                    <br />
                    <Box position="relative" display="inline">
                      <Text as="span" position="relative">  idéale</Text>
                      <Image src={Entourement} alt="Description of SVG" position="absolute" top={0} left={0} width="100%" height="100%"/>
                    </Box>
                  </>
              }
            </Heading>
          </Box>
          </Box>

            <Box position="relative" maxWidth="400px" marginBottom="2rem">
                <InputGroup>
                  <InputLeftElement
                    height="50"
                    pointerEvents="none"
                    children={<SearchIcon color="gray" />}
                  />
                  <Input
                    value={ville} 
                    height="50"
                    width={isLargerThan768 ? "500px" : "250px"}
                    type="search"
                    backgroundColor="white"
                    borderColor="white"
                    placeholder="Entrez le nom de la ville..."
                    onKeyDown={handleKeyDown}
                    onChange={handleInput}
                  />
                </InputGroup>
                {suggestions.length > 0 && (
                    <VStack 
                      align="start" 
                      spacing={2} 
                      width="100%" 
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
                            onClick={(e)=>{e.preventDefault();navigate(`/recherche/${s}`)}}
                          >
                            {s}
                          </ListItem>
                        ))}
                      </List>
                    </VStack>
                  )}

        </Box>
      </Box>
      
      <VStack marginY={20} spacing={20}>
            <VilleCarroussel/>
        </VStack>
    </Box>

  )
}
