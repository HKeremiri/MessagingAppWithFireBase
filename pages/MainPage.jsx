import { Message } from "@mui/icons-material";
import CenteredContainer from "../components/CenteredContainer"
import Contacts from "../components/Contacts"
import { Box, Container, Paper } from "@mui/material"
import { useEffect, useState } from "react"
import MessageList from "../components/MessageList";
import { auth } from "../firebase.js";
import ChatDetails from "../components/ChatDetails.jsx";
import FormDialog from "../components/FormDialog.jsx";
import Logout from "../components/Logout.jsx";
import { collection, getDoc, query, where,doc ,getDocs } from "firebase/firestore";
import {db} from '../firebase.js'
import { use } from "react";



export default function MainPage({setIsAuth}) {
    const [contacts, setContacts] = useState([]);
    const [chats, setChats] = useState([]); // Kullanıcının dahil olduğu tüm sohbetler
    const [selectedChat, setSelectedChat] = useState(null); // Seçilen sohbetin ID'si  
    const [user, setUser] = useState(null);
    const [chatDetails, setChatDetails] = useState(false);
 
    const [isupdate, setIsUpdate] = useState(false);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {           
                setUser(user);
              
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                setContacts(userDoc.data().contacts);
              
                // Firestore'dan kullanıcının dahil olduğu sohbetleri al
                const chatQuery = query(collection(db, "chats"), where("participantsids", "array-contains", user.uid));
                const chatDocs = await getDocs(chatQuery);
                
                console.log("Kullanıcının dahil olduğu sohbetler:", chatDocs.docs.map(doc => doc.data()));
             


                const userChats = chatDocs.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                    console.log("Kullanıcının dahil olduğu sohbetler:", userChats);
                setChats(userChats);
            } else {
                console.log("Kullanıcı giriş yapmamış.");
                setContacts([]);
                setChats([]);
                setMessages([]);
                setSelectedChat(null);
            }
        });
    
        return () => unsubscribe();
    }, [isupdate]);
    

    function handleSelectChat(chat){
      setSelectedChat(chat);
      setChatDetails(true);
    }
    function handleUnselectChat(){
      setSelectedChat(null);
      setChatDetails(false);
    }

    return (        
        <Box 
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'aqua',
        }}
      >
     <Container 
  maxWidth="md" 
  component={Paper}
  sx={{
    position: 'relative', // Konumlandırma için gerekli
    padding: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 2,
    margin: { sm: 2 },
    border: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    minHeight: '600px',
    maxHeight: '600px',
  }}
>
  <Contacts contacts={contacts} user={user}  handleSelectChat={handleSelectChat}/>
  <div style={{ width: '100%', position: 'relative' }}>
    {chatDetails ? (
      <ChatDetails  selectedChat={selectedChat} db={db} user={user} handleUnselectChat={handleUnselectChat}  />
    ) : (
   <>
  
        <MessageList chats={chats} user={user} handleSelectChat={handleSelectChat} />
   
   <div style={{
      position: 'absolute',
      bottom: 10,
      right: 10
    }}>
      <FormDialog setIsUpdate={setIsUpdate} />
    </div> </>
  )}
    
   
   
  </div>
</Container>
<Logout setIsAuth={setIsAuth}></Logout>
      </Box>
      
    )
}
