import { Box, Image, Flex, Text, IconButton } from "@chakra-ui/react";
import CustomBadge from './CustomBadge';
import IconBadge from './IconBadge';
import { FaHouseUser, FaRegHeart, FaBed, FaBath,  } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { MdEventAvailable } from 'react-icons/md'
import { LikesContext } from "../context/LikesContext";
import { useContext, forwardRef } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";


const AnnonceCard = forwardRef(({ data, id, hovered, handleAnnonceHover }, ref) => {
  const { imgUrls, type, loyer, nbPieces, surface, userRef } = data;
  const navigate = useNavigate();
  const badgeProperties = [
    { icon: MdEventAvailable, text: "13 Juil" },
    { icon: FaHouseUser, text: "3 pers." },
  ];

  const [userLikes, setUserLikes] = useContext(LikesContext)
  function renderCustomBadge(){
    if (userRef == "cartecoloc"){
      return <CustomBadge text="La Carte des Colocs"/>
    }
    return <CustomBadge text="Coloc.fr"/>
  }

  async function handleLike(){  
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

  return (
    <Box
      ref={ref}
      borderWidth="1px"
      bg="white"
      borderRadius="16px"
      overflow="hidden"
      boxShadow="md"
      borderWidth={hovered ? '1px' : '0px'}
      borderColor={hovered ? '#172ACE' : 'gray.100'}
      onMouseEnter={() => handleAnnonceHover(id)} 
      onMouseLeave={() => handleAnnonceHover(null)}
      transition="box-shadow 0.2s"
      mb={4}
      maxW="240px"
      minH="280px"
    >
      <Flex direction={{ base: "column", md: "column" }} h="100%">
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
        
            <Text fontSize="lg" color="#172ACE" as='b'>
              {loyer}€
            </Text>
            <Text fontSize="md" fontWeight="semibold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              {type} {nbPieces} de {surface} m2
            </Text>
            <Flex>
              {badgeProperties.map((badge, index) => (
                <IconBadge key={index} icon={badge.icon} text={badge.text} marginRight="4px" />
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
  
});

export default AnnonceCard;