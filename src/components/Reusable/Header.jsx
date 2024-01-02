import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Text, Box, Icon, Flex, Avatar, Button, Menu, MenuButton, MenuList, VStack, List, ListItem, MenuItem, MenuDivider, Stack, useColorMode, Center, Image, Input, InputLeftElement, InputGroup, Heading } from '@chakra-ui/react';
import { useMediaQuery } from "@chakra-ui/react";
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { SearchIcon } from '@chakra-ui/icons';
import { RxHamburgerMenu } from "react-icons/rx";
import { Link as RouterLink } from 'react-router-dom';

const villes = require('../../assets/data/villes2.json').map((v)=>{return v.city})

function search(input){
  return villes.filter((v)=>{return(v.slice(0, input.length) === input)})
}

export default function Nav() {
  const [ville, setVille] = useState('');
  const [suggestions, setSuggestions] = useState([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [isLargerThan] = useMediaQuery("(min-width: 650px)");
  const {loggedId, loading} = useAuthStatus();
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  const [searchValue, setSearchValue] = useState('');
  const [pageState, setPageState] = useState('Se connecter');
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setPageState(user ? 'Profile' : 'Se connecter');
    });
  }, [auth]);

  function handleKeyDown(e){ 
    switch(e.key) {
      case 'Enter': // naviguer quand l'utilisateur presse entré
        navigate(`/recherche/${suggestions[activeSuggestionIndex]}`);
        setSuggestions([]); //reset des suggestions apres entrer
        setVille(''); //reset de l'input apres entrer
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
    const inputValue = e.target.value;
    const capitalizedInputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
    setVille(capitalizedInputValue);
  
    if(inputValue==''){
      setSuggestions([]);
      setActiveSuggestionIndex(0);
      return;
    }
  
    setSuggestions([...search(capitalizedInputValue)]);
  }
  

  const routeMatchPath = (route) => {
    return route === location.pathname;
  };

  const handleLogout = (e) => {
    e.preventDefault();
    if(pageState === 'Profile') {
        auth.signOut();
        navigate('/');
    } else {
        navigate('/sign-in');
    }
  };

  return (
    <Box bg={'white.100'} px={12} paddingX={isLargerThan ? "50px" : "20px"}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'} maxWidth="1200px" margin="auto">
        <Box>
          <Image
          src='https://coloc.fr/wp-content/uploads/2023/01/Coloc.fr_-1.png'
          alt='Coloc.fr'
          objectFit="contain" 
          boxSize={"100px"}
          onClick={(e)=>{e.preventDefault();navigate('/')}}
          />        
        </Box>

      {isLargerThan750 && location.pathname !== '/' && (
        <Box position="relative" width="40%">
        <InputGroup>
          <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray" />}
            />
          <Input
            value={ville}
            type="search"
            borderColor="gray"
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
              zIndex={1001}
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
                    onClick={(e)=>{e.preventDefault(); navigate(`/recherche/${s}`); setVille(''); setSuggestions([])}}
                  >
                    {s}
                  </ListItem>
                ))}
              </List>
            </VStack>
          )}
          </Box>
          )}

    <Flex justifyContent="flex-end" alignItems="center">
      <Heading size={'sm'} color={'grey'} mr={4}> <RouterLink to='/Déposer-une-annonce'>Déposer une annonce</RouterLink></Heading>
        <Flex borderWidth="1px" borderColor="gray.3OO" borderRadius={100} alignItems="center" p={2} boxShadow="md" _hover={{ boxShadow: 'lg' }}>
          <Menu>
            <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
              <Flex alignItems={'center'}>
                <Icon as={RxHamburgerMenu} w={4} h={4} mr={2} />
                <Avatar size={'xs'} src={pageState === 'Profile' ? 'https://avatars.dicebear.com/api/male/username.svg' : '/assets/NoPP.webp'} />
              </Flex>
            </MenuButton>

            <MenuList zIndex={1000} alignItems={'center'} mt={2}>
              <Center mt={2} mb={2}>
                <Avatar 
                  size={'lg'}                   
                  src={pageState === 'Profile' ? 'https://avatars.dicebear.com/api/male/username.svg' : '/assets/NoPP.webp'}
                />
              </Center>
              {pageState === 'Profile' && (
                <Center mt={2} mb={2}>
                  <Text>{auth.currentUser ? auth.currentUser.displayName : ''}</Text>
                </Center>
              )}
              <MenuDivider />
              {pageState === 'Profile' ? (
                <>
                  <MenuItem onClick={() => navigate('/Déposer-une-annonce')}>Déposer une annonce</MenuItem>
                  <MenuItem 
                    className={`cursor-pointer ${routeMatchPath('/Settings') ? 'active' : ''}`} 
                    onClick={() => navigate("/Settings")}
                  >
                    Mon compte
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={() => navigate('/sign-in')}>Se connecter</MenuItem>
                  <MenuItem onClick={() => navigate('/sign-up')}>S'inscrire</MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
