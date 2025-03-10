import React from 'react';
import Grid from '@mui/material/Grid2';

import Chat from './Chat';


export default function MessageList({chats,user, handleSelectChat}) {    

    return (
       <Grid container spacing={2} xs={12} sm={12} md={12} lg={12}
       maxHeight={'max-content'}      
       justifyContent={'center'} bgcolor={'#f2f2f2'}>  
       <Grid xs={12} sm={12} md={12} lg={12} width={'100%'} bgcolor={'gray'}>
        <h1 style={{ textAlign: 'center', margin :4, }} >Message List</h1>
        </Grid>      
            <Grid xs={12} sm={6} md={4} lg={5} sx={{overflowY:'scroll',maxHeight:'485px',width:'100%'}} >
                <Grid >   
                                
                    {chats.map((chat) => (
                        <Chat key={chat.id} chat={chat} user={user} handleSelectChat={handleSelectChat} />
                    ))}
                </Grid>
         
            
            </Grid>
        </Grid>
    );
 
}


