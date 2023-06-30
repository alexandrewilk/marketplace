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
    { icon: FaBath, text: "2 salle de bain" }
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
      height={{ base: "auto", md: "200px" }}
      transition="box-shadow 0.2s"
      _hover={{ boxShadow: "md" }}
      mb={4}
    >
    <Flex direction={{ base: "column", md: "row" }} h="100%">
      <Box w={{ base: "100%", md: "35%" }} onClick={(e)=>{e.preventDefault();navigate(`/listings/${id}`)}}>
        <Image src={imgUrls ? imgUrls[0] : "https://bit.ly/2k1H1t6"} alt="Appartement" objectFit="cover" w="100%" h="100%" />
      </Box>
      <Flex width={{ base: "100%", md: "65%" }} flexDirection="column" justifyContent="space-between" gap={5} padding={4} h="100%">
        <Flex justifyContent="flex-end" >
          <IconButton icon={userLikes.includes(id) ? <AiFillHeart /> :<AiOutlineHeart /> } isRound onClick={(e)=>{e.preventDefault();handleLike();}}/>
        </Flex>
          <Flex flexDirection="column" justifyContent="space-between" h="100%" onClick={(e)=>{e.preventDefault();navigate(`/listings/${id}`)}}>
            <Text fontSize="xl" fontWeight="semibold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              {type}, loyer de {loyer}€, {nbPieces} pièces
            </Text>
            <Flex>
              {badgeProperties.map((badge, index) => (
                <IconBadge key={index} icon={badge.icon} text={badge.text} marginRight="4px" />
              ))}
            </Flex>
            <Flex justifyContent="space-between" alignItems="flex-end">
              <CustomBadge text="SeLoger" />
              <Text fontSize="xl" color="#172ACE" as='b'>
                {loyer}€/mois
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
