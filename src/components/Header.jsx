import { ReactNode, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { Text, Box, Flex, Avatar, Link, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useDisclosure, useColorModeValue, Stack, useColorMode, Center, Image, Input } from '@chakra-ui/react';
import { InputGroup, InputLeftElement, Icon } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import NoPP from '../assets/images/NoPP.webp';
import { useAuthStatus } from '../hooks/useAuthStatus';

export default function Nav() {
  const [isLargerThan] = useMediaQuery("(min-width: 650px)");
  const {loggedId, loading} = useAuthStatus();
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchValue, setSearchValue] = useState('');
  const [pageState, setPageState] = useState('Se connecter');
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setPageState(user ? 'Profile' : 'Se connecter');
    });
  }, [auth]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

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
    <Box bg={'white.100'} px={12} borderBottomWidth={1} borderBottomColor={'gray.100'} paddingX={isLargerThan ? "50px" : "20px"} >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'} maxWidth="1400px">
        <Box>
          <Image
          src='https://coloc.fr/wp-content/uploads/2023/01/Coloc.fr_-1.png'
          alt='Coloc.fr'
          objectFit="contain" 
          boxSize={"100px"}
          onClick={(e)=>{e.preventDefault();navigate('/')}}
          />        
        </Box>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={7}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={pageState === 'Profile' ? 'https://avatars.dicebear.com/api/male/username.svg' : 'https://avatars.dicebear.com/api/female/username.svg'}
                />
              </MenuButton>
              <MenuList alignItems={'center'}>
              <Center mt={2} mb={2}>
                  <Avatar 
                  size={'lg'}                   
                  src={pageState === 'Profile' ? 'https://avatars.dicebear.com/api/male/username.svg' : 'https://avatars.dicebear.com/api/female/username.svg'}
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
                    <MenuItem onClick={() => navigate('/MesLikes')}>Mes likes</MenuItem>
                    <MenuItem 
                      className={`cursor-pointer ${routeMatchPath('/Settings') ? 'active' : ''}`} 
                      onClick={() => navigate("/Settings")}
                    >
                      Paramètres
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
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
