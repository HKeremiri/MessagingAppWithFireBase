import Grid from '@mui/material/Grid2';

export default function Chat({ chat, user, handleSelectChat }) {
 
    // Kullanıcının dışındaki kişiyi bul     
   
    const contact = chat.participants.find(contact => contact.uid !== user.uid);
    console.log("chat", chat);


    const lastMessage = chat.lastMessage 
    ?   chat.lastMessage // Mesajın text alanı varsa
    : 'Mesaj yok İlk mesajı siz gönderin';


    
    return (
        <Grid
            className="chat"
            sx={{
                backgroundColor: 'oldlace',
                cursor: 'pointer',
                padding: 2,
                border: '2px solid gray',
                borderRadius: 1,
                ":hover": { backgroundColor: 'lightblue' },
                marginBottom: 1, 
            }}
        >
            <Grid className="contact-info" onClick={()=> handleSelectChat(chat)}>
                <h3>{contact ? contact.email : 'Kullanıcı bulunamadı'}</h3>
                <p> {lastMessage}</p>
                <p>{lastMessage.time}</p>
            </Grid>
        </Grid>
    );
}
