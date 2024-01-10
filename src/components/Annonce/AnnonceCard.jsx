import {
  Box,
  Image,
  Flex,
  Text,
  IconButton,
  useBreakpointValue,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";import CustomBadge from './CustomBadge';
import IconBadge from '../Annonce/IconBadge';
import { FaHouseUser,  } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { MdEventAvailable } from 'react-icons/md'
import { LikesContext } from "../../context/LikesContext";
import { useContext, forwardRef } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from '../../hooks/useAuthStatus';
import colors from "../../constant/color";

const AnnonceCard = forwardRef(({ data, id, hovered, handleAnnonceHover }, ref) => {
  
  const { imgUrls, type, loyer, nbPieces, surface, userRef, nbOccupants, dispoDate, ville } = data;
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Pour le modal
  const { loggedIn } = useAuthStatus();  console.log(new Date(dispoDate?.seconds*1000))
  const badgeProperties = [
    { icon: MdEventAvailable, text: dispoDate ? new Date(dispoDate.seconds*1000) <= new Date() ? 'Dispo' : (new Date(dispoDate.seconds*1000)).toDateString() : 'Dispo'},
    { icon: FaHouseUser, text: nbOccupants ? nbOccupants : nbPieces + ' colocataires'},
  ];
  const [userLikes, setUserLikes] = useContext(LikesContext) 
  const cardWidth = useBreakpointValue({ base: "170px", md: "240px" });


  function renderCustomBadge(){
    if (userRef === "cartecoloc"){
      return <CustomBadge text="La Carte des Colocs"/>
    }
    return <CustomBadge text="Coloc.fr"/>
  }

  async function handleLike() {
    if (!loggedIn) {
      onOpen(); // Ouvre le modal si l'utilisateur n'est pas connecté
      return;
    }  
    try {
      if(Array.isArray(userLikes)){
      if(userLikes.includes(id)){
      await updateDoc(doc(db, 'Users', auth.currentUser.uid), {likes: arrayRemove(id)})
      setUserLikes(userLikes.filter(like => like !== id))
    }else{
      await updateDoc(doc(db, 'Users', auth.currentUser.uid), {likes: arrayUnion(id)})
      setUserLikes([...userLikes, id])
    }}else{
      await updateDoc(doc(db, 'Users', auth.currentUser.uid), {likes: arrayUnion(id)})
      setUserLikes([...userLikes, id])
    }

    } catch (error) {
      
    }finally{
      console.log(userLikes)
    }
  }

  if(!(userRef === "cartecoloc")){
  return (
    <>
    <Box
      ref={ref}
      bg="white"
      borderRadius="16px"
      overflow="hidden"
      boxShadow="md"
      borderWidth={hovered ? '1px' : '0px'}
      borderColor={hovered ? colors.primary : 'gray.100'}
      onMouseEnter={() => handleAnnonceHover(id)} 
      onMouseLeave={() => handleAnnonceHover(null)}
      transition="box-shadow 0.2s"
      mb={4}
      maxW={cardWidth}
      minH="280px"
    >
      <Flex direction={{ base: "column", md: "column" }} h="310px">
        <Box position="relative" w="100%" onClick={(e)=>{e.preventDefault();navigate(`/listings/${id}`)}}>
          <Image src={imgUrls ? imgUrls[0] : "https://bit.ly/2k1t6"} alt="Appartement" objectFit="cover" w="95%" h="95%" m="2.5%" borderRadius="8px"/>
          <Box onClick={(e)=>{e.stopPropagation();}}>
            <IconButton 
              position="absolute" 
              top={3} 
              right={3}
              icon={userLikes.includes(id) ? <AiFillHeart /> :<AiOutlineHeart /> } 
              isRound 
              onClick={(e)=>{e.preventDefault();handleLike();}}
            />
          </Box>
        </Box>

        <Flex direction="column" padding={2} h="100%">
          <Flex flexDirection="column" justifyContent="space-around" h="100%" onClick={(e)=>{e.preventDefault();navigate(`/listings/${id}`)}}>
 
            {renderCustomBadge()}
        
            <Text fontSize="lg" color={colors.primary} as='b'>
              {loyer}€
            </Text>
            <Text fontSize="md" fontWeight="semibold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              {type} {nbPieces} pièces de {surface} m2
            </Text>
            <Flex>
              {badgeProperties.map((badge, index) => (
                <IconBadge key={index} icon={badge.icon} text={badge.text} marginRight="16px" />
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Connexion Requise</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>Vous devez être connecté pour aimer une annonce. Voulez-vous vous connecter maintenant?</Text>
      </ModalBody>
      <ModalFooter>
        <Button mr={3} onClick={onClose}>Non, merci</Button>
        <Button colorScheme="blue" onClick={console.log('test de co')}>Se Connecter</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  </>
  );}
  function goToCarteColoc(){
    window.open("https://www.lacartedescolocs.fr/logements/"+ville, '_blank');
  }
  return (
    
    <>
    <Box
      ref={ref}
      bg="white"
      borderRadius="16px"
      overflow="hidden"
      boxShadow="md"
      borderWidth={hovered ? '1px' : '0px'}
      borderColor={hovered ? colors.primary : 'gray.100'}
      onMouseEnter={() => handleAnnonceHover(id)} 
      onMouseLeave={() => handleAnnonceHover(null)}
      transition="box-shadow 0.2s"
      mb={4}
      maxW={cardWidth}
      minH="280px"
    >
      <Flex direction={{ base: "column", md: "column" }} h="310px">
        <Box position="relative" w="100%" onClick={(e)=>{e.preventDefault();goToCarteColoc()}}>
          <Image src={imgUrls ? imgUrls[0] : "https://bit.ly/2k1t6"} alt="Appartement" objectFit="cover" objectPosition="center" w="95%" h="95%" m="2.5%" borderRadius="8px"/>
          <Box onClick={(e)=>{e.stopPropagation();}}>
            <IconButton 
              position="absolute" 
              top={3} 
              right={3}
              icon={userLikes.includes(id) ? <AiFillHeart /> :<AiOutlineHeart /> } 
              isRound 
              onClick={(e)=>{e.preventDefault();handleLike();}}
            />
          </Box>

        </Box>

        <Flex direction="column" padding={2} h="100%">
          <Flex flexDirection="column" justifyContent="space-around" h="100%" onClick={(e)=>{e.preventDefault(); goToCarteColoc()}}>
            {renderCustomBadge()}
        
            <Text fontSize="lg" color={colors.primary} as='b'>
              {loyer}€
            </Text>
            <Text fontSize="md" fontWeight="semibold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              {type} {nbPieces} pièces de {surface} m2
            </Text>
            <Flex>
              {badgeProperties.map((badge, index) => (
                <IconBadge key={index} icon={badge.icon} text={badge.text} marginRight="16px" />
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>

    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connexion Requise</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Vous devez être connecté pour aimer une annonce. Voulez-vous vous connecter maintenant?</Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>Non, merci</Button>
            <Button colorScheme="blue" onClick={console.log('test de co')}>Se Connecter</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
  )
  
});

export default AnnonceCard;