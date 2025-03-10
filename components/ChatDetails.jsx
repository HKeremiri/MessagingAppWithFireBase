import { useCollectionData } from 'react-firebase-hooks/firestore';
import {collection, addDoc, doc, updateDoc, query, orderBy} from "firebase/firestore";
import Message from "./Message";
import Grid from '@mui/material/Grid2';
import React, { useState } from "react";
import {Button, TextField, IconButton} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

export default function ChatDetails({ selectedChat, db, user, handleUnselectChat }) {
  const messagesRef = collection(doc(db, "chats", selectedChat?.id), "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));
  const [messages] = useCollectionData(q, { idField: 'id' });


  const [sendedMessage, setSendedMessage] = useState('');

  const handleSendMessage = async () => {
    if (!sendedMessage.trim()) return;
    try {
      await addDoc(messagesRef, {
        text: sendedMessage,
        senderId: user.uid,
        createdAt: Date.now(),
      });
      
      const chatRef = doc(db, "chats", selectedChat.id);
      await updateDoc(chatRef, {
        lastMessage: sendedMessage,
        updatedAt: Date.now(),
      });
      
      setSendedMessage('');
    } catch (error) {
      console.error("Mesaj gönderilirken hata oluştu:", error);
    }
  };

    return (
        <Grid container spacing={2} xs={12} sm={12} md={12} lg={12}
        maxHeight={'max-content'}     
        justifyContent={'center'} bgcolor={'#f2f2f2'}>  
        <Grid xs={12} sm={12} md={12} lg={12} width={'100%'} bgcolor={'gray'}>
         <h1 style={{ textAlign: 'center', margin :4, }} >Chat Details</h1>
         </Grid>      
             <Grid xs={12} sm={6} md={4} lg={5}  display={'flex'} flexDirection={'column-reverse'} sx={{overflowY:'scroll',height:'485px',width:'100%'  }} >
          
          <Grid  sx={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:2}} >
        
      <TextField id="outlined-basic" label="Mesajınız" variant="outlined"  value={sendedMessage}
            onChange={(e) => setSendedMessage(e.target.value)} sx={{fontSize:25,width:'89%'}} />
              
                <Button variant="contained" color="primary" sx={{fontSize:20,width:'10%',padding:2}} onClick={handleSendMessage} ><SendIcon></SendIcon></Button>
            </Grid>
            <Grid >                                  
                 {messages?.map((message) => (
    <Message key={message.createdAt} message={message} user={user} />))}
<IconButton 
 onClick={handleUnselectChat}
  sx={{ position: 'absolute', top: 0, right: 0 }}
>
  <CloseIcon sx={{ fontSize: 40 }} />
</IconButton>
                 </Grid>
           
             </Grid>
         </Grid>
    )
}