import React, { useEffect, useState } from 'react';
import { Box, Flex, VStack, Text, Input, Button } from '@chakra-ui/react';
import { doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Dots } from 'react-activity';

export default function Messaging() {
  const [chatsWithData, setChatsWithData] = useState([]) //data de tout ceux av qui il chat
  const [selectedChat, setSelectedChat] = useState('') //uuid du mec avec qui chat selectionné
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
          userData.data().chatsWith.forEach(async (uid)=>{
            let chatterData = await getDoc(doc(db, 'Users', uid))
            if(!(chatsWithData.includes({id: chatterData.id, data: chatterData.data()}))){
            setChatsWithData([... chatsWithData, {id: chatterData.id, data: chatterData.data()}])}
          })
      }

    }catch(err){
      alert(err.message)
    }finally{setLoading(false)}
    }
    getChatsWith();
  }, [])

  useEffect(()=>{
    let docId = selectedChat < auth.currentUser.uid ? selectedChat+'&'+auth.currentUser.uid : auth.currentUser.uid+'&'+selectedChat;
    const subscriber = onSnapshot(doc(db, 'Chats', docId), snap=>{setSnap(snap)})
    return () => {subscriber()}
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
        <Box key = {user.id} bg="gray.100" p={2} borderRadius="md" _hover={{ bg: "blue.500", color: "white" }} onClick={(e)=>{e.preventDefault();setSelectedChat(user.id)}}>
        Conversation avec {user.data.name}
        </Box>
      )})
    )
  }

  function renderMessages(){
    if(selectedChat == ''){return (<div>Clique sur ta gauche pour selectionner un chat</div>)}
    
    const messages = chatData ? chatData.data.texts.map((t)=> t.message) : []
 
    return(
      <>
      {messages.map((t)=>{return( <Text bg="gray.100" p={2} borderRadius="md" key = {t}>{t}</Text>)})}
      <Flex mt={4} align="center">
          <Input placeholder="Écrivez votre message..." onChange={(e)=>setNewMessage(e.target.value)} value={newMessage}/>
          {loadingSend ? <Dots/> : <Button ml={2} colorScheme="blue" onClick={(e)=>{e.preventDefault();handleSendNewMessage()}}>Envoyer</Button>}
        </Flex>
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
        {/* <Flex mt={4} align="center">
          <Input placeholder="Écrivez votre message..." />
          <Button ml={2} colorScheme="blue">Envoyer</Button>
        </Flex> */}
      </Flex>
    </Flex>
  );
}
