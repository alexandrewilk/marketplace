import React, { useEffect, useState } from 'react';
import { Box, Flex, VStack, Text, Input, Button } from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Dots } from 'react-activity';

export default function Messaging() {
  const [chatsWithData, setChatsWithData] = useState([])
  const [selectedChat, setSelectedChat] = useState('')
  const [chatData, setChatData] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(()=>{
    async function getChatsWith(){
      try{
      setLoading(true)
      const userData = await getDoc(doc(db, 'Users', auth.currentUser.uid))
      if('chatsWith' in userData.data()){ //ici on recupère la data des users avec qui on chat
          userData.data().chatsWith.forEach(async (uid)=>{
            let chatterData = await getDoc(doc(db, 'Users', uid))
            if(!(chatsWithData.includes({id: chatterData.id, data: chatterData.data()}))){
            setChatsWithData([... chatsWithData, {id: chatterData.id, data: chatterData.data()}])}
          })
          userData.data().chatsWith.forEach(async (uid)=>{ //& ici le doc du chat en question
            let docId = uid < auth.currentUser.uid ? uid+'&'+auth.currentUser.uid : auth.currentUser.uid+'&'+uid;
            let chat = await getDoc(doc(db, 'Chats', docId))
            if(!(chatData.includes({id: chat.id, data: chat.data()}))){
            setChatData([... chatData, {id: chat.id, data: chat.data()}])}
          })
      }

    }catch(err){
      alert(err.message)
    }finally{setLoading(false)}
    }
    getChatsWith();
  }, [])

  function renderConversationBox(){
    if(loading){return <Dots/>}
    if(chatsWithData.length == 0){return <div>PAS DE CONV</div>}
    
    return(
      chatsWithData.map((user)=>{return(
        <Box key = {user.id} bg="gray.100" p={2} borderRadius="md" _hover={{ bg: "blue.500", color: "white" }} onClick={(e)=>{e.preventDefault();setSelectedChat(user.id)}}>
        Conversation avec {user.data.name}
        </Box>
      )})
    )
  }

  function renderMessages(){
    if(selectedChat == ''){return <div>Clique sur ta gauche pour selectionner un chat</div>}
    let docId = selectedChat < auth.currentUser.uid ? selectedChat+'&'+auth.currentUser.uid : auth.currentUser.uid+'&'+selectedChat;
    const messages = chatData.filter(doc=>doc.id == docId)
   
    return(
      messages[0].data.Texts.map((t)=>{return( <Text bg="gray.100" p={2} borderRadius="md">{t}</Text>)})
    )
  }
  

  return (
    <Flex h="calc(100vh - 64px)" overflow="hidden">
      
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


      <Flex direction="column" justifyContent="space-between" w="80%" p={4} overflowY="auto">
        <VStack align="stretch" spacing={4} flex="1" overflowY="auto">
          {/* <Text bg="gray.100" p={2} borderRadius="md">Message 1</Text>
          <Text bg="gray.100" p={2} borderRadius="md">Message 2</Text>
          <Text bg="gray.100" p={2} borderRadius="md">Message 3</Text> */}
          {renderMessages()}
        </VStack>

        {/* Zone de saisie de message */}
        <Flex mt={4} align="center">
          <Input placeholder="Écrivez votre message..." />
          <Button ml={2} colorScheme="blue">Envoyer</Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
