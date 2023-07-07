import React, { useEffect, useState } from 'react';
import { Box, Flex, VStack, Text, Input, Button } from '@chakra-ui/react';
import { doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Dots } from 'react-activity';

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
    if(selectedChat){
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
   
    return(
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

      <Flex direction="column" justifyContent="flex-start" w="80%" overflowY="auto">
        <Flex direction="column" h="100%">
          <VStack align="stretch" spacing={4} flex="1" overflowY="auto">
            {renderMessages()}
          </VStack>
          {renderMessageInput()}
        </Flex>
      </Flex>
    </Flex>
  );
}
