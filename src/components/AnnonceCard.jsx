import { Box, Image, Flex, Text, IconButton } from "@chakra-ui/react";
import CustomBadge from './CustomBadge';
import IconBadge from './IconBadge';
import { FaHouseUser, FaRegHeart, FaBed, FaBath } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { LikesContext } from "../context/LikesContext";
import { useContext } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";



export default function AnnonceCard({ data, id }) {
  const { imgUrls, type, loyer, nbPieces } = data;
  const navigate = useNavigate();
  const badgeProperties = [
    { icon: FaBed, text: "5 chambres" },
    { icon: FaHouseUser, text: "300m²" },
  ];

  const [userLikes, setUserLikes] = useContext(LikesContext)

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
      borderWidth="1px"
      bg="white"
      borderRadius="16px"
      overflow="hidden"
      boxShadow="base"
      transition="box-shadow 0.2s"
      _hover={{ boxShadow: "md" }}
      mb={4}
      maxW="300px"
      minH="340px"
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
            <CustomBadge text="SeLoger"/>
            <Text fontSize="lg" color="#172ACE" as='b'>
              {loyer}€
            </Text>
            <Text fontSize="md" fontWeight="semibold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              {type}, loyer de {loyer}€, {nbPieces} pièces
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
  
}
