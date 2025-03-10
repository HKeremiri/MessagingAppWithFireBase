import { updateDoc } from 'firebase/firestore';
import React from 'react';
import Grid from '@mui/material/Grid2';
import {db} from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
const handleClickContact = (contact, user, handleSelectChat) => {
    if (!contact?.uid) {
        console.error("Contact UID is missing:", contact);
        return;
    }
    startChat(user.uid, contact.uid, handleSelectChat);
};


const startChat = async (user1Id, user2Id, handleSelectChat) => {
    try {
        const chatsRef = collection(db, "chats");

        const q = query(
            chatsRef,
            where("participantsids", "array-contains-any", [user1Id, user2Id])
        );
        const querySnapshot = await getDocs(q);

        const existingChat = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .find(chat =>
                chat.participantsids.includes(user1Id) &&
                chat.participantsids.includes(user2Id)
            );

        if (existingChat) {
            console.log("Mevcut sohbet bulundu:", existingChat.id);
           
                handleSelectChat(existingChat); // Burada çağırın
         
            return existingChat;
        }

        const user1Snap = await getDoc(doc(db, "users", user1Id));
        const user2Snap = await getDoc(doc(db, "users", user2Id));

        if (!user1Snap.exists() || !user2Snap.exists()) {
            console.error("Kullanıcı bulunamadı.");
            return null;
        }

        const user1 = user1Snap.data();
        const user2 = user2Snap.data();

        const newChatRef = await addDoc(chatsRef, {
            participantsids: [user1Id, user2Id],
            participants: [
                { uid: user1Id, email: user1.email },
                { uid: user2Id, email: user2.email }
            ],
            lastMessage: "",
            updatedAt: Date.now(),
        });

        const newChat = {
            id: newChatRef.id,
            participantsids: [user1Id, user2Id]
        };

        console.log("Yeni sohbet oluşturuldu:", newChatRef.id);
        if (typeof handleSelectChat === 'function') {
            handleSelectChat(newChat); // Burada çağırın
        }

        return newChat;

    } catch (error) {
        console.error("Sohbet başlatılırken hata oluştu:", error);
    }
};




// Contact component
const Contact = ({ contact,user,handleSelectChat }) => (
    <Grid className="contact"  sx={{backgroundColor:'oldlace', cursor:'pointer', padding:2,border:'2px solid gray', borderRadius:1, ":hover": {backgroundColor:'lightblue'}, }}>
        <Grid className="contact-info"  onClick={() => handleClickContact(contact,user,handleSelectChat)}>
            <h3>{contact.email}</h3>          
        </Grid>   
    </Grid>
);

// Main Contacts component
export default function Contacts({contacts, user, handleSelectChat}) {
    return (
       <Grid container spacing={2} xs={12} sm={12} md={12} lg={12}
       maxHeight={'max-content'}
       justifyContent={'center'} bgcolor={'#f2f2f2'}>  
       <Grid xs={12} sm={12} md={12} lg={12} width={'100%'} bgcolor={'gray'}>
        <h1 style={{ textAlign: 'center', margin :4, }} >Contacts</h1>
        </Grid>      
            <Grid xs={12} sm={6} md={4} lg={5} sx={{overflowY:'scroll',maxHeight:'485px',width:'100%' }} >
                <Grid >               
                    {contacts.map((contact) => (
                        <Contact key={contact.uid} contact={contact}  user={user}  
                        handleSelectChat={handleSelectChat} />
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
 
}


