import React, { useEffect, useState } from 'react';
import { Box, Flex, VStack, Text, Input, Center, Image, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, useDisclosure, useMediaQuery, IconButton, Heading } from '@chakra-ui/react';
import { doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Dots } from 'react-activity';
import { useNavigate } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import No_Conversation from '../assets/images/No_Conversation.png';


//j'ai caché de la data dans l'id du doc ahah ! maintenant il faut parser tout ça lol
function parseDocId(id){
  const uuid1 = id.split('AND=')[0]
  const uuid2 = id.split('AND=')[1].split('REF=')[0]
  const listingId = id.split('AND=')[1].split('REF=')[1]
  return {uuid1, uuid2, listingId}
}



export default function Messaging() {
  const [chatsWithData, setChatsWithData] = useState([]) //data de tout ceux av qui il chat
  const [selectedChat, setSelectedChat] = useState(null) //{userid: uuiddugarsavecquiilchat, chatid: iddudocdechat}
  const [chatData, setChatData] = useState(null) //donnée du chat av le mec selectionné
  const [loading, setLoading] = useState(false)
  const [snap, setSnap] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [loadingSend, setLoadingSend] = useState(false)
  const [listing, setListing] = useState(null) //data du listing sélectionné
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLessThan999] = useMediaQuery("(max-width: 999px)");
  const [isMoreThan1000] = useMediaQuery("(min-width: 1000px)");
  const btnRef = React.useRef()

  const navigate = useNavigate()
  useEffect(()=>{
    async function getChatsWith(){
      try{
      setLoading(true)
      const userData = await getDoc(doc(db, 'Users', auth.currentUser.uid))
      if('chatsWith' in userData.data()){ //ici on recupère la data des users avec qui on chat
          let chatsWith = userData.data().chatsWith
          var chatsWithDataSetter = []
          for(var i=0;i<chatsWith.length;i++){
            const {uuid1, uuid2, listingId} = parseDocId(chatsWith[i])
            let uidEtranger = uuid1 == auth.currentUser.uid ? uuid2 : uuid1
            let chatterData = await getDoc(doc(db, 'Users', uidEtranger))
            if(!(chatsWithDataSetter.includes({id: chatterData.id, data: chatterData.data()}))){
            chatsWithDataSetter.push({id: chatterData.id, data: chatterData.data(), chatId: chatsWith[i]})}
          
            //Ca permet d'ouvrir la page messagerie avec la denier conv active 
            if(i === 0) {
              setSelectedChat({userId: chatterData.id, chatId:chatsWith[i]})
            }}
            setChatsWithData(chatsWithDataSetter)
          
      }

    }catch(err){
      alert(err.message)
    }finally{setLoading(false)}
    }
    getChatsWith();
  }, [])

  useEffect(()=>{
    async function getListingData(){
      let docId = selectedChat.chatId
      const {uuid1, uuid2, listingId} = parseDocId(docId)
      try {
        const data = await getDoc(doc(db, 'Listings', listingId))
        setListing({id: data.id, data: data.data()})
        console.log({id: data.id, data: data.data()})
      } catch (error) {
        alert(error.message)
      }
    }
    if(selectedChat){
      getListingData();
      let docId = selectedChat.chatId
      const subscriber = onSnapshot(doc(db, 'Chats', docId), snap=>{setSnap(snap)})
      return () => {subscriber()}}
  }, [selectedChat])

  useEffect(()=>{
    if(snap){
      if(snap.exists()){
        setChatData({id: snap.id, data: snap.data()})
      }
    }
  }, [snap])
  function renderConversationBox(){
    if(loading){return <Dots/>}
    if(chatsWithData.length == 0){return <div>PAS DE CONV</div>}
   
    return(
      chatsWithData.map((user)=>{return(
        <Box key = {user.id} bg={selectedChat.userId == user.id ? "blue.500" :"gray.100"} p={2} borderRadius="md" _hover={{ bg: "blue.500", color: "white" }} onClick={(e)=>{e.preventDefault();setSelectedChat({userId: user.id, chatId:user.chatId })}}>
        Conversation avec {user.data.name}
        </Box>
      )})
    )
  }
  function renderMessageInput() {
    return (
      <Box position="sticky" bottom="0" p={4} bgColor={"gray.100"}>
        <Flex align="center">
          <Input placeholder="Écrivez votre message..." onChange={(e)=>setNewMessage(e.target.value)} value={newMessage} borderColor={"blue"}/>
          {loadingSend ? <Dots/> : <Button ml={2} colorScheme="blue" onClick={(e)=>{e.preventDefault();handleSendNewMessage()}}>Envoyer</Button>}
        </Flex>
      </Box>
    )
  }

  function renderMessages(){
    if(selectedChat == ''){return (<div>Clique sur ta gauche pour selectionner un chat</div>)}
      
    const messages = chatData ? chatData.data.texts : []
    if(!listing){return}
    return(
      <>
      <div onClick={(e)=>{e.preventDefault();navigate(`/listings/${listing.id}`)}}>
      <Box position="sticky" top="0" display="flex" alignItems="center" borderWidth={1} borderColor="gray.200" borderRadius={6} boxShadow='base' marginX={4} marginBottom={2} p={4}>
        <Box width="250px" height="150px">
          <Image
            borderRadius="12px"
            boxSize="100%"
            src={listing.data.imgUrls[0]}
            alt="Image de l'annonce"
          />
        </Box>
        <VStack align="start" spacing={1} ml={4}>
          <Text color="black" fontWeight="bold">{listing.data.type} de {listing.data.surface}m2 à {listing.data.ville}</Text> 
          <Text color="black">Loyer: {listing.data.loyer}€</Text>
          <Text color="black">{listing.data.desc}</Text>
        </VStack>
    </Box>
    </div>
      <VStack spacing={1} align="stretch">
        {messages.map((t, index) => {
          const alignSelf = t.from === auth.currentUser.uid ? 'flex-end' : 'flex-start';
          const bgColor = t.from === auth.currentUser.uid ? 'blue' : 'gray.200';
          const textColor = t.from === auth.currentUser.uid ? 'white' : 'black';
          return (
            <Flex justify={alignSelf} key={index} paddingX={4}>
              <Text 
                bg={bgColor} 
                p={2} 
                borderRadius="md" 
                minW="min-content"
                maxW="400px"
                display="inline-block"
                color={textColor}
              >
                {t.message}
              </Text>
            </Flex>
          )
        })}      
      </VStack>
      </>
    )
  }  
  
  async function handleSendNewMessage(){
    let texts = chatData.data.texts
    texts.push({message: newMessage, from: auth.currentUser.uid, timestamp: Date.now()})
    try {
      setLoadingSend(true)
      await updateDoc(doc(db, 'Chats', chatData.id), {texts: texts})
      setNewMessage('')
    } catch (error) {
      alert(error.message)
    }finally{
      setLoadingSend(false)
    }
  }

  return (
    <>
      {isLessThan999 && (
        <Box>
          <Flex alignItems="flex-end" mb={4}>
            <IconButton
              aria-label="Menu"
              icon={<HamburgerIcon />}
              size="md"
              variant="outline"
              onClick={onOpen}
            />
            <Heading as='h4' size='md' ml={2}>Messagerie</Heading>
          </Flex>

          <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Conversations</DrawerHeader>

              <DrawerBody>
                {renderConversationBox()}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>
      )}

      {chatsWithData.length === 0 ? (
        <Flex
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
           <Flex justifyContent="center" mt={12}>
            <Center flexDirection="column" mt="80px">
                <img src={No_Conversation} alt="maison"/>
                <Text fontSize="xl" fontWeight="bold" marginBottom="1rem" marginTop="12px">Tu n'as aucune conversation</Text>
            </Center>
          </Flex>
        </Flex>
      ) : (
        <Flex h={isLessThan999 ? "calc(100vh - 124px)" : "calc(100vh - 64px)"} overflow="hidden">
          {isMoreThan1000 && (
            <Box
              w="20%"
              borderRightWidth={1}
              borderRightColor="gray.300"
              overflowY="auto"
            >
              <VStack align="stretch" spacing={4} p={4}>
                {renderConversationBox()}
              </VStack>
            </Box>
          )}

          <Flex direction="column" justifyContent="flex-start" w="100%" overflowY="auto">
            <Flex direction="column" h="100%">
              <VStack align="stretch" spacing={4} flex="1" overflowY="auto">
                {renderMessages()}
              </VStack>
              {renderMessageInput()}
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );

}
