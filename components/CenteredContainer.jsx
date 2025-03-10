import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

export default function CenteredContainer({children}) {
  return (
    <Box 
      sx={{
        height: '100vh',               // Ekranın tamamını kaplar
        display: 'flex',               // Flexbox kullanarak hizalama yapar
        justifyContent: 'center',      // Yatayda ortalar
        alignItems: 'center',          // Dikeyde ortalar
        backgroundColor: 'aqua',       // Arka plan rengi
      }}
    >
      <Container 
        maxWidth="sm" 
      
        component={Paper}              // Container'ı Paper bileşeniyle çerçeveye alır             
        sx={{
          padding: 4,                       // İç boşluk
          textAlign: 'center',         // Metni ortalar
          borderRadius: 2,        
          margin :{sm:2}              // Container'ı tamamen kaplar
        }}
      >
     {children}
      </Container>
    </Box>
  );
}
